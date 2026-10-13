# Publier AgroDiag CI sur le Play Store

Ce dossier contient l'application Android complète. Elle reprend l'outil AgroDiag CI et fonctionne hors connexion. Les étapes ci-dessous la transforment en fichier installable, puis la publient sur Google Play. Vous n'avez rien à installer sur votre ordinateur : la compilation se fait gratuitement sur GitHub.

Durée totale : environ 1 heure de travail, plus 14 jours de test obligatoire (étape 6) et quelques jours de validation par Google.

---

## Étape 1 – Créer un compte GitHub et y déposer le projet (15 min)

1. Créez un compte gratuit sur https://github.com.
2. Cliquez sur **New repository**. Nom : `AgroDiagCI`. Choisissez **Public** (nécessaire pour héberger gratuitement la politique de confidentialité), puis **Create repository**.
3. Sur la page du dépôt, cliquez sur **uploading an existing file**. Glissez **tout le contenu** du dossier `AgroDiagCI`, y compris le dossier caché `.github`, puis cliquez sur **Commit changes**.
   - Si le dossier `.github` n'apparaît pas dans votre explorateur, affichez les fichiers cachés (Windows : Affichage > Éléments masqués).
   - Ne déposez **jamais** le dossier `cle_signature` sur GitHub.
   - Si le dossier `.github` ne part pas : dans le dépôt, cliquez sur **Add file > Create new file**, tapez comme nom `.github/workflows/build.yml`, collez le contenu du fichier `workflow_a_copier_build.yml` fourni à côté de ce guide, puis **Commit changes**.

## Étape 2 – Ajouter la clé de signature dans GitHub (5 min)

Dans le dépôt : **Settings > Secrets and variables > Actions > New repository secret**. Créez les 4 secrets indiqués dans `cle_signature/A_GARDER_SECRET.txt` :

| Nom du secret | Valeur |
|---|---|
| `AGRODIAG_KEYSTORE_BASE64` | tout le contenu de `upload.jks.base64.txt` |
| `AGRODIAG_KEYSTORE_PASSWORD` | le mot de passe indiqué |
| `AGRODIAG_KEY_ALIAS` | `agrodiag` |
| `AGRODIAG_KEY_PASSWORD` | le mot de passe indiqué |

Gardez le dossier `cle_signature` en lieu sûr (clé USB + copie privée). Toutes les mises à jour de l'application devront être signées avec cette clé.

## Étape 3 – Mettre en ligne la politique de confidentialité (2 min)

Google l'exige. Dans le dépôt : **Settings > Pages**. Source : **Deploy from a branch**, branche `main`, dossier `/docs`, puis **Save**. Après une minute, la page est en ligne à l'adresse :
`https://VOTRE-NOM-GITHUB.github.io/AgroDiagCI/`

## Étape 4 – Compiler l'application (10 min, automatique)

Dans le dépôt : onglet **Actions > Compiler AgroDiag CI > Run workflow**. Après 5 à 10 minutes, la coche devient verte. En bas de la page, dans **Artifacts**, vous trouvez :
- `AgroDiagCI-apk-de-test` : un fichier `.apk` à installer directement sur votre téléphone pour l'essayer. Autorisez « Installer des applications inconnues » quand Android le demande.
- `AgroDiagCI-playstore-aab` : le fichier `.aab` à envoyer sur le Play Store.

Si la coche est rouge, cliquez sur l'étape en erreur, copiez le message et envoyez-le-moi.

## Étape 5 – Créer le compte développeur Google Play (30 min + vérification)

1. Allez sur https://play.google.com/console et créez un compte développeur **personnel** (frais uniques de 25 USD, payables par carte bancaire).
2. Google vérifie votre identité (pièce d'identité) : comptez quelques jours.

## Étape 6 – Test fermé obligatoire : 12 testeurs pendant 14 jours

Pour les comptes personnels, Google exige un test fermé avec au moins 12 testeurs inscrits sans interruption pendant 14 jours avant d'autoriser la publication publique.

1. Dans la Play Console : **Créer une application**. Nom : AgroDiag CI, langue : français, type : Application, gratuite.
2. **Tester > Test fermé > Créer un canal**. Envoyez le fichier `app-release.aab`.
3. Ajoutez au moins 12 adresses Gmail de testeurs : collègues, conseillers, membres des OP. Envoyez-leur le lien d'inscription au test. Ils doivent l'accepter et garder l'application installée pendant 14 jours.
4. Après 14 jours, demandez l'accès à la production dans la Play Console.

## Étape 7 – Remplir la fiche Play Store

Tout est prêt dans le dossier `playstore` :
- textes (nom, descriptions) : `fiche_play_store.txt` ;
- icône 512 × 512 : `icone_512.png` ;
- image de présentation 1024 × 500 : `banniere_1024x500.png` ;
- captures d'écran : `capture_1` à `capture_4` ;
- réponses au questionnaire « Sécurité des données » et à la classification du contenu : à la fin de `fiche_play_store.txt`.

## Étape 8 – Publier

**Production > Créer une version**, envoyez le même `.aab`, puis **Envoyer pour examen**. Google valide en général en quelques jours.

---

## Mettre à jour l'application plus tard

1. Remplacez `app/src/main/assets/index.html` par la nouvelle version de l'outil.
2. Dans `app/build.gradle`, augmentez `versionCode` de 1 (2, 3, 4…) et changez `versionName` (1.0.1…).
3. Déposez les fichiers modifiés sur GitHub : la compilation repart toute seule.
4. Envoyez le nouveau `.aab` dans la Play Console.

## Informations techniques

- Identifiant de l'application : `com.agrodiag.ci`. Il ne pourra plus être changé après la première publication ; modifiez-le dans `app/build.gradle` avant si vous le souhaitez.
- Android 7.0 minimum (API 24), cible Android 16 (API 36), comme l'exige Google Play depuis le 31 août 2026.
- L'application ne demande aucune autorisation à l'utilisateur et n'envoie aucune donnée. Elle fonctionne sans réseau ; les liens externes (NASA POWER) s'ouvrent dans le navigateur du téléphone.
- Les données (fiches, coûts, villages, climat importé) restent sur le téléphone. Elles sont incluses dans la sauvegarde Google du téléphone si celle-ci est activée.
