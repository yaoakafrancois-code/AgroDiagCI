package ci.aka.lecturecni

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.tech.IsoDep
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import net.sf.scuba.smartcards.CardService
import org.bouncycastle.jce.provider.BouncyCastleProvider
import org.jmrtd.AccessKeySpec
import org.jmrtd.BACKey
import org.jmrtd.PACEKeySpec
import org.jmrtd.PassportService
import org.jmrtd.lds.CardAccessFile
import org.jmrtd.lds.PACEInfo
import org.jmrtd.lds.icao.DG1File
import java.io.ByteArrayInputStream
import java.security.Security

class MainActivity : Activity(), NfcAdapter.ReaderCallback {

    private var nfcAdapter: NfcAdapter? = null
    private lateinit var editCan: EditText
    private lateinit var editDocNum: EditText
    private lateinit var editBirth: EditText
    private lateinit var editExpiry: EditText
    private lateinit var txtStatus: TextView
    private lateinit var txtParents: TextView
    private lateinit var txtResult: TextView
    private lateinit var btnShare: Button

    @Volatile private var reading = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Fournisseur cryptographique complet (nécessaire pour PACE / BAC)
        try {
            Security.removeProvider("BC")
            Security.insertProviderAt(BouncyCastleProvider(), 1)
        } catch (e: Exception) { }

        editCan = findViewById(R.id.editCan)
        editDocNum = findViewById(R.id.editDocNum)
        editBirth = findViewById(R.id.editBirth)
        editExpiry = findViewById(R.id.editExpiry)
        txtStatus = findViewById(R.id.txtStatus)
        txtParents = findViewById(R.id.txtParents)
        txtResult = findViewById(R.id.txtResult)
        btnShare = findViewById(R.id.btnShare)

        val prefs = getSharedPreferences("cni", Context.MODE_PRIVATE)
        editCan.setText(prefs.getString("can", ""))
        editDocNum.setText(prefs.getString("doc", ""))
        editBirth.setText(prefs.getString("birth", ""))
        editExpiry.setText(prefs.getString("expiry", ""))

        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        if (nfcAdapter == null) {
            txtStatus.text = "Ce téléphone n'a pas le NFC. La lecture de la puce est impossible avec ce téléphone."
        }

        findViewById<Button>(R.id.btnReady).setOnClickListener {
            prefs.edit()
                .putString("can", editCan.text.toString().trim())
                .putString("doc", editDocNum.text.toString().trim())
                .putString("birth", editBirth.text.toString().trim())
                .putString("expiry", editExpiry.text.toString().trim())
                .apply()
            val adapter = nfcAdapter
            txtStatus.text = when {
                adapter == null -> "Ce téléphone n'a pas le NFC."
                !adapter.isEnabled -> "Le NFC est désactivé. Activez-le dans les Paramètres du téléphone, puis revenez ici."
                else -> "C'est prêt. Posez le dos du téléphone à plat sur la carte et ne bougez plus."
            }
        }

        btnShare.setOnClickListener {
            val text = txtParents.text.toString() + "\n\n" + txtResult.text.toString()
            val send = Intent(Intent.ACTION_SEND)
            send.type = "text/plain"
            send.putExtra(Intent.EXTRA_TEXT, text)
            startActivity(Intent.createChooser(send, "Partager le résultat"))
        }
    }

    override fun onResume() {
        super.onResume()
        nfcAdapter?.enableReaderMode(
            this, this,
            NfcAdapter.FLAG_READER_NFC_A or NfcAdapter.FLAG_READER_NFC_B or
                NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK,
            null
        )
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableReaderMode(this)
    }

    // Appelé automatiquement quand une carte est détectée
    override fun onTagDiscovered(tag: Tag) {
        if (reading) return
        val isoDep = IsoDep.get(tag) ?: return
        reading = true
        runOnUiThread {
            txtStatus.text = "Lecture en cours… ne bougez pas la carte (10 à 30 secondes)."
            txtParents.visibility = View.GONE
            txtResult.text = ""
            btnShare.visibility = View.GONE
        }
        val prefs = getSharedPreferences("cni", Context.MODE_PRIVATE)
        val can = prefs.getString("can", "") ?: ""
        val doc = prefs.getString("doc", "") ?: ""
        val birth = prefs.getString("birth", "") ?: ""
        val expiry = prefs.getString("expiry", "") ?: ""

        var report: String
        var ok = false
        try {
            report = readCard(isoDep, can, doc, birth, expiry)
            ok = true
        } catch (e: Exception) {
            report = "ERREUR : " + (e.message ?: e.javaClass.simpleName) +
                "\n\nVérifiez le code ou les informations saisies, puis réessayez. " +
                "Gardez la carte immobile pendant toute la lecture."
        } finally {
            try { isoDep.close() } catch (e: Exception) { }
            reading = false
        }

        val parents = findParents(report)
        runOnUiThread {
            txtStatus.text = if (ok) "Lecture terminée." else "La lecture a échoué."
            if (ok) {
                txtParents.visibility = View.VISIBLE
                txtParents.text = parents
            }
            txtResult.text = report
            btnShare.visibility = View.VISIBLE
        }
    }

    private fun readCard(isoDep: IsoDep, can: String, doc: String, birth: String, expiry: String): String {
        val sb = StringBuilder()
        isoDep.timeout = 15000

        val cardService = CardService.getInstance(isoDep)
        cardService.open()
        val service = PassportService(
            cardService,
            PassportService.NORMAL_MAX_TRANCEIVE_LENGTH,
            PassportService.DEFAULT_MAX_BLOCKSIZE,
            false, false
        )
        service.open()

        val bacKey: BACKey? =
            if (doc.isNotEmpty() && birth.isNotEmpty() && expiry.isNotEmpty())
                BACKey(doc.uppercase(), toYYMMDD(birth), toYYMMDD(expiry))
            else null
        val paceKey: AccessKeySpec? =
            if (can.length == 6) PACEKeySpec.createCANKey(can) else bacKey

        if (paceKey == null) {
            throw Exception("Aucune information saisie. Remplissez le code CAN ou les 3 champs du dos de la carte.")
        }

        // 1) Essai de la connexion moderne (PACE)
        var paceOk = false
        try {
            val cardAccess = CardAccessFile(
                service.getInputStream(PassportService.EF_CARD_ACCESS)
            )
            for (info in cardAccess.securityInfos) {
                if (paceOk) break
                if (info is PACEInfo) {
                    try {
                        service.doPACE(
                            paceKey, info.objectIdentifier,
                            PACEInfo.toParameterSpec(info.parameterId), null
                        )
                        paceOk = true
                        sb.append("Connexion sécurisée (PACE) : OK\n")
                    } catch (e: Exception) {
                        sb.append("Connexion PACE refusée : ${e.message}\n")
                    }
                }
            }
        } catch (e: Exception) {
            sb.append("Pas de connexion PACE disponible.\n")
        }

        service.sendSelectApplet(paceOk)

        // 2) Sinon, connexion classique (BAC)
        if (!paceOk) {
            if (bacKey == null) {
                throw Exception("Le code CAN n'a pas fonctionné. Essayez la méthode 2 (informations du dos de la carte).")
            }
            service.getInputStream(PassportService.EF_COM).read()
            service.doBAC(bacKey)
            sb.append("Connexion sécurisée (BAC) : OK\n")
        }

        sb.append("\n")

        // 3) Lecture de tous les groupes de données accessibles
        //    (DG2 = photo, DG3/DG4 = empreintes : non lus)
        for (n in 1..16) {
            if (n == 2 || n == 3 || n == 4) continue
            val fid = (0x0100 + n).toShort()
            val bytes: ByteArray
            try {
                bytes = service.getInputStream(fid).readBytes()
            } catch (e: Exception) {
                continue // groupe absent ou protégé
            }
            sb.append("===== Groupe DG$n (${bytes.size} octets) =====\n")
            if (n == 1) {
                try {
                    val mrz = DG1File(ByteArrayInputStream(bytes)).mrzInfo
                    sb.append("Nom : ${clean(mrz.primaryIdentifier)}\n")
                    sb.append("Prénoms : ${clean(mrz.secondaryIdentifier)}\n")
                    sb.append("N° document : ${mrz.documentNumber}\n")
                    sb.append("Naissance (AAMMJJ) : ${mrz.dateOfBirth}\n")
                    sb.append("Sexe : ${mrz.gender}\n")
                    sb.append("Nationalité : ${mrz.nationality}\n")
                    sb.append("Expiration (AAMMJJ) : ${mrz.dateOfExpiry}\n")
                } catch (e: Exception) {
                    sb.append("(lecture MRZ impossible : ${e.message})\n")
                }
            }
            try {
                dumpTlv(bytes, 0, bytes.size, 0, sb)
            } catch (e: Exception) {
                sb.append("Texte trouvé : ").append(textRuns(bytes)).append("\n")
            }
            sb.append("\n")
        }
        return sb.toString()
    }

    // ---------- Outils ----------

    /** JJMMAAAA -> AAMMJJ (format exigé par la puce). Accepte aussi JJMMAA. */
    private fun toYYMMDD(input: String): String {
        val d = input.filter { it.isDigit() }
        return when (d.length) {
            8 -> d.substring(6, 8) + d.substring(2, 4) + d.substring(0, 2)
            6 -> d.substring(4, 6) + d.substring(2, 4) + d.substring(0, 2)
            else -> throw Exception("Date mal saisie : « $input ». Utilisez le format JJMMAAAA.")
        }
    }

    private fun clean(s: String?): String =
        (s ?: "").replace("<", " ").replace(Regex(" +"), " ").trim()

    private val tagNames = mapOf(
        "5F0E" to "Nom complet",
        "5F0F" to "Autres noms",
        "5F10" to "Numéro personnel",
        "5F2B" to "Date de naissance",
        "5F11" to "Lieu de naissance",
        "5F42" to "Adresse",
        "5F12" to "Téléphone",
        "5F13" to "Profession",
        "5F14" to "Titre",
        "5F15" to "Résumé personnel",
        "5F16" to "Preuve de nationalité",
        "5F17" to "Autres documents",
        "5F18" to "Garde / tutelle",
        "5F19" to "Autorité de délivrance",
        "5F26" to "Date de délivrance",
        "5F1A" to "Autres personnes",
        "5F1B" to "Mentions / observations",
        "5F1C" to "Exigences fiscales",
        "5F55" to "Date de personnalisation",
        "5F56" to "N° système de personnalisation",
        "5F1F" to "MRZ"
    )

    /** Lit la structure TLV et affiche chaque champ lisible. */
    private fun dumpTlv(b: ByteArray, start: Int, end: Int, depth: Int, sb: StringBuilder) {
        var i = start
        while (i < end) {
            // Étiquette (tag)
            val first = b[i].toInt() and 0xFF
            if (first == 0x00 || first == 0xFF) { i++; continue }
            val tagSb = StringBuilder(String.format("%02X", first))
            i++
            if ((first and 0x1F) == 0x1F) {
                while (i < end) {
                    val t = b[i].toInt() and 0xFF
                    tagSb.append(String.format("%02X", t))
                    i++
                    if ((t and 0x80) == 0) break
                }
            }
            // Longueur
            if (i >= end) break
            var len = b[i].toInt() and 0xFF
            i++
            if (len >= 0x80) {
                val nb = len and 0x7F
                if (nb == 0 || nb > 3 || i + nb > end) throw Exception("TLV invalide")
                len = 0
                repeat(nb) {
                    len = (len shl 8) or (b[i].toInt() and 0xFF)
                    i++
                }
            }
            if (len < 0 || i + len > end) throw Exception("TLV invalide")
            val tag = tagSb.toString()
            val constructed = (first and 0x20) != 0
            if (constructed) {
                dumpTlv(b, i, i + len, depth + 1, sb)
            } else if (tag != "5C") { // 5C = simple liste des étiquettes
                val value = b.copyOfRange(i, i + len)
                val label = tagNames[tag] ?: "Champ $tag"
                sb.append(label).append(" : ").append(valueToText(value)).append("\n")
            }
            i += len
        }
    }

    private fun valueToText(v: ByteArray): String {
        if (v.isEmpty()) return "(vide)"
        val s = String(v, Charsets.UTF_8)
        val printable = s.count { it.isLetterOrDigit() || it in " <-'/.,:()&" }
        return if (!s.contains('\uFFFD') && printable >= s.length * 0.8) {
            clean(s)
        } else if (v.size <= 16) {
            "[hex] " + v.joinToString("") { String.format("%02X", it) }
        } else {
            "(données binaires, ${v.size} octets)"
        }
    }

    private fun textRuns(b: ByteArray): String {
        val s = String(b, Charsets.ISO_8859_1)
        return Regex("[A-Za-z0-9À-ÿ <'\\-/.,]{3,}").findAll(s).joinToString(" | ") { clean(it.value) }
    }

    private fun findParents(report: String): String {
        val keys = listOf("PERE", "PÈRE", "MERE", "MÈRE", "FATHER", "MOTHER", "PARENT", "FILIATION")
        val lines = report.lines().filter { line ->
            val up = line.uppercase()
            keys.any { up.contains(it) } || up.startsWith("AUTRES PERSONNES") || up.startsWith("GARDE")
        }
        return if (lines.isEmpty())
            "Noms des parents : NON TROUVÉS dans la partie lisible de la puce.\n" +
                "Appuyez sur « Partager le résultat » et envoyez-le pour analyse."
        else
            "Informations possibles sur les parents :\n" + lines.joinToString("\n")
    }
}
