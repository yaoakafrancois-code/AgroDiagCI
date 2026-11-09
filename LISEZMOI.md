# Lecture CNI – version de test

Application Android qui lit la puce de la carte nationale d'identité ivoirienne (NFC)
et affiche tout ce que la puce laisse lire, pour vérifier si les noms des parents y sont.

- Aucune connexion Internet : les données restent sur le téléphone.
- Méthode 1 : code CAN (6 chiffres sur la carte, s'il existe).
- Méthode 2 : numéro du document + date de naissance + date d'expiration (dos de la carte).
- Le bouton « Partager le résultat » permet d'envoyer le résultat pour analyse.

Compilation : automatique par GitHub Actions (onglet « Actions », fichier « LectureCNI-apk »).

Auteur du projet : YAO Aka François.
