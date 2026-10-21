/* AKA AgroDiag CI — onglet « Plante malade ? » : diagnostic des maladies et ravageurs des cultures.
   Diagnostic indicatif par les symptômes ; à faire confirmer par un technicien. */
(function () {
  'use strict';

  /* ---------------- Symptômes ---------------- */
  var G = { f: 'Feuilles', t: 'Tiges, tronc, pousses', fr: 'Fruits, fleurs, grains', r: 'Racines, tubercules, souche', p: 'Toute la plante', c: 'Contexte' };
  var S = {
    f_taches: ['f', 'Taches brunes ou noires sur les feuilles'],
    f_losange: ['f', 'Taches en losange : centre gris, bord brun'],
    f_cigare: ['f', 'Longues taches grises en forme de cigare'],
    f_cible: ['f', 'Taches brunes avec des cercles concentriques (comme une cible)'],
    f_huileuses: ['f', 'Taches brun-vert d\'aspect huileux, duvet blanc dessous par temps humide'],
    f_stries_noires: ['f', 'Stries brunes puis grandes taches noires, feuilles qui sèchent tôt'],
    f_mosaique: ['f', 'Mosaïque : plages jaunes et vertes, feuilles déformées'],
    f_nervures: ['f', 'Bandes jaunes ou rouges le long des nervures'],
    f_stries_jaunes: ['f', 'Fines stries jaunes continues le long des feuilles'],
    f_jaune_orange: ['f', 'Feuilles jaune-orangé, en commençant par le bout'],
    f_bronzees: ['f', 'Feuilles bronzées ou couleur rouille, d\'abord les vieilles feuilles'],
    f_poudre_blanche: ['f', 'Poudre blanche sur les feuilles, les jeunes pousses ou les fleurs'],
    f_poudre_orange: ['f', 'Poudre orange sous les feuilles (rouille)'],
    f_cuillere: ['f', 'Feuilles jaunes, petites, recourbées en cuillère'],
    f_trous: ['f', 'Feuilles trouées ou déchiquetées'],
    f_criblures: ['f', 'Nombreux petits trous ronds dans les feuilles'],
    f_mines: ['f', 'Galeries claires à l\'intérieur des feuilles (mines)'],
    f_fenetres: ['f', 'Feuilles grignotées en « fenêtres » transparentes, petites chenilles vertes'],
    f_cornet: ['f', 'Cœur (cornet) troué, avec des excréments comme de la sciure humide'],
    f_tube: ['f', 'Feuille centrale transformée en tube creux (« tube d\'oignon »)'],
    f_v_jaune: ['f', 'Taches jaunes en forme de V au bord des feuilles, nervures noircies'],
    f_angulaires: ['f', 'Taches anguleuses d\'aspect mouillé, puis feuilles qui fanent'],
    f_vieilles_jaunes: ['f', 'Jaunissement des vieilles feuilles du bas, la plante pâlit'],
    f_bord_brule: ['f', 'Bord des vieilles feuilles jaune puis brûlé'],
    f_crispees: ['f', 'Jeunes feuilles crispées, recroquevillées'],
    f_touffe: ['f', 'Bout des tiges en touffe serrée, amas cotonneux blancs'],
    f_toiles: ['f', 'Petites toiles fines, feuilles piquées de points jaunes'],
    f_chute: ['f', 'Chute importante des feuilles'],
    f_brulure: ['f', 'Feuillage qui noircit et se dessèche par plaques (brûlure)'],
    f_ovales: ['f', 'Petites taches brunes ovales, comme des graines de sésame'],
    f_arete: ['f', 'Taches brunes avec nervures noires en « arête de poisson »'],
    f_pucerons: ['f', 'Colonies de petits insectes mous sous les feuilles (pucerons)'],
    f_aleurodes: ['f', 'Petites mouches blanches qui s\'envolent quand on secoue la plante'],
    t_gonfle: ['t', 'Gonflements sur les rameaux ou les tiges'],
    t_sciure: ['t', 'Trous dans le tronc ou les branches, avec de la sciure'],
    t_pousses: ['t', 'Jeunes pousses ou bouts de branches qui sèchent'],
    t_coeur_mort: ['t', 'Cœur mort : la feuille centrale sèche et s\'arrache facilement'],
    t_cerclees: ['t', 'Branches coupées net ou cerclées comme au couteau'],
    t_gomme: ['t', 'Écoulement de gomme sur les tiges'],
    t_chancres: ['t', 'Chancres : taches noires enfoncées sur les tiges'],
    t_brun_interne: ['t', 'Intérieur de la tige ou du tronc bruni quand on coupe'],
    t_gui: ['t', 'Touffes d\'une autre plante qui pousse sur les branches'],
    t_cou_noir: ['t', 'Cou de la panicule noirci, la panicule casse'],
    t_encoche: ['t', 'Pas de latex sur une partie de l\'encoche de saignée'],
    t_verse: ['t', 'Plants qui tombent, se cassent ou se déracinent'],
    fr_pourriture: ['fr', 'Tache brune qui s\'étend sur le fruit ou la cabosse, duvet blanc'],
    fr_piqures: ['fr', 'Taches noires ou piqûres sur les fruits, cabosses ou noix'],
    fr_trou_bout: ['fr', 'Petit trou au bout des cerises, grains percés'],
    fr_chenille: ['fr', 'Fruits troués, avec excréments ou chenille à l\'intérieur'],
    fr_asticots: ['fr', 'Fruits qui pourrissent avec des asticots à l\'intérieur'],
    fr_cul_noir: ['fr', 'Tache noire et sèche au bout du fruit (cul noir)'],
    fr_enfoncees: ['fr', 'Taches rondes enfoncées sur les fruits'],
    fr_ratatines: ['fr', 'Noix, fruits ou grains ratatinés, mal remplis'],
    fr_fleurs: ['fr', 'Fleurs qui noircissent ou sèchent et tombent'],
    fr_panicule_vide: ['fr', 'Panicule ou épi blanc et vide'],
    fr_oiseaux: ['fr', 'Grains mangés par les oiseaux'],
    fr_stock: ['fr', 'En stock : grains percés, poudre, petits insectes'],
    fr_regime: ['fr', 'Régimes petits, doigts maigres'],
    r_galles: ['r', 'Boules ou nodules (galles) sur les racines'],
    r_pourries: ['r', 'Racines ou tubercules pourris, mous, qui sentent mauvais'],
    r_noires: ['r', 'Racines noircies, peu nombreuses'],
    r_cordons: ['r', 'Filaments blancs collés sur les racines'],
    r_craquelures: ['r', 'Craquelures sèches et brunes sous la peau du tubercule'],
    r_galeries: ['r', 'Galeries creusées dans la souche (bulbe)'],
    r_striga: ['r', 'Petite plante à fleurs roses ou rouges qui pousse au pied'],
    p_fane: ['p', 'La plante fane brusquement en journée, en restant verte'],
    p_filaments: ['p', 'Tige coupée posée dans un verre d\'eau : filaments laiteux qui sortent'],
    p_naine: ['p', 'Plants nains, rabougris'],
    p_meurt: ['p', 'L\'arbre jaunit, perd ses feuilles et meurt'],
    p_tache: ['p', 'Plusieurs plants voisins malades, en tache qui s\'agrandit'],
    c_pluies: ['c', 'Saison des pluies ou temps très humide'],
    c_seche: ['c', 'Saison sèche'],
    c_basfond: ['c', 'Bas-fond mal drainé, eau qui stagne'],
    c_floraison: ['c', 'En pleine floraison']
  };

  var EPI = 'Produit homologué en Côte d\'Ivoire uniquement, à la dose de l\'étiquette, avec gants, masque et bottes ; respecter le délai avant récolte.';

  /* ---------------- Problèmes génériques (toutes cultures) ---------------- */
  var GEN = [
    { n: 'Carence en azote', t: 'Carence / sol', s: [['f_vieilles_jaunes', 4], ['p_naine', 2], ['c_seche', 0]],
      conf: 'Le jaunissement est régulier et part des vieilles feuilles ; il disparaît après un apport d\'azote.',
      vite: ['Apporter de l\'azote : urée ou engrais composé en sol humide, ou fumier bien décomposé'],
      agro: ['Compost et fumier chaque année', 'Associer ou alterner avec une légumineuse (niébé, soja, arachide, mucuna)', 'Paillage pour garder l\'humidité'],
      chim: ['Urée ou NPK selon la fiche technique de la culture, fractionné en 2 apports'],
      prev: ['Faire analyser le sol tous les 3 à 4 ans', 'Ne pas brûler les résidus de récolte'] },
    { n: 'Carence en potassium', t: 'Carence / sol', s: [['f_bord_brule', 4], ['f_ovales', 1], ['fr_ratatines', 1], ['t_verse', 1]],
      conf: 'Le bord des vieilles feuilles brunit en premier ; fréquent sur sols sableux ou très lessivés.',
      vite: ['Apporter du potassium : chlorure ou sulfate de potasse, ou cendres de bois'],
      agro: ['Cendres de bois et compost', 'Restituer les résidus de récolte au champ (pailles, fanes, pelures)'],
      chim: ['Engrais riche en potassium (KCl, NPK à forte teneur en K) selon la fiche technique'],
      prev: ['Analyse de sol', 'Fumure organique régulière'] }
  ];

  /* ---------------- Cultures et problèmes ---------------- */
  var C = {
    'Cacao': [
      { n: 'Pourriture brune des cabosses', sci: 'Phytophthora', t: 'Champignon', s: [['fr_pourriture', 5], ['c_pluies', 2]],
        conf: 'La tache brune part souvent du pédoncule ou de la pointe et couvre la cabosse en quelques jours ; duvet blanc par temps humide.',
        vite: ['Récolte sanitaire : enlever toutes les cabosses malades chaque semaine et les enterrer ou les sortir de la parcelle'],
        agro: ['Tailler pour aérer et laisser passer la lumière', 'Ombrage modéré, pas trop dense', 'Désherber et dégager le pied des arbres', 'Récolter les cabosses mûres sans attendre'],
        chim: ['Fongicide à base de cuivre, ou cuivre + métalaxyl, en saison des pluies, toutes les 3 à 4 semaines', EPI],
        prev: ['Récolte sanitaire régulière pendant toute la saison des pluies', 'Bonne densité de plantation'] },
      { n: 'Swollen shoot (virus du gonflement des rameaux)', sci: 'CSSV, transmis par les cochenilles', t: 'Virus', s: [['t_gonfle', 5], ['f_nervures', 4], ['f_mosaique', 2], ['p_tache', 2], ['p_meurt', 1]],
        conf: 'Gonflements sur les rameaux ou les racines, bandes rouges ou jaunes le long des nervures ; les arbres dépérissent en tache qui s\'agrandit. Seul un agent du Conseil du Café-Cacao ou de l\'ANADER peut confirmer.',
        vite: ['Signaler sans tarder au Conseil du Café-Cacao ou à l\'ANADER', 'Ne pas prélever de cabosses ni de greffons sur ces arbres'],
        agro: ['Arracher et détruire les arbres malades et les arbres voisins proches, selon les consignes de l\'agent', 'Replanter avec du matériel végétal sain et tolérant fourni par les structures agréées', 'Barrière de cultures non hôtes entre anciennes et nouvelles parcelles'],
        chim: ['Aucun produit ne guérit le virus ; les insecticides contre les cochenilles ne suffisent pas'],
        prev: ['Surveiller régulièrement les parcelles', 'N\'utiliser que des plants issus de pépinières agréées'] },
      { n: 'Mirides (capsides)', sci: 'Sahlbergella, Distantiella', t: 'Insecte', s: [['fr_piqures', 4], ['t_pousses', 3], ['t_chancres', 2], ['c_seche', 1]],
        conf: 'Piqûres noires rondes sur cabosses et jeunes rameaux, rameaux qui se dessèchent : la cime prend un aspect brûlé.',
        vite: ['Repérer les foyers (zones de cime brûlée) et les traiter en priorité'],
        agro: ['Maintenir un ombrage régulier : les mirides aiment les trous de lumière', 'Favoriser les fourmis prédatrices (Oecophylla)', 'Extraits de neem en complément'],
        chim: ['Insecticide homologué par le Conseil du Café-Cacao, aux périodes de traitement recommandées (généralement de juillet à septembre, puis décembre-janvier)', EPI],
        prev: ['Entretenir l\'ombrage et regarnir les trous de la canopée'] },
      { n: 'Foreurs des tiges', sci: 'Chenilles foreuses (Eulophonotus) et coléoptères', t: 'Insecte', s: [['t_sciure', 5], ['t_pousses', 1]],
        conf: 'Trous ronds sur le tronc ou les branches, sciure et excréments au pied.',
        vite: ['Introduire un fil de fer dans la galerie pour tuer la larve'],
        agro: ['Couper et brûler les branches très attaquées', 'Boucher les trous avec de l\'argile ou du goudron végétal'],
        chim: ['Injection d\'un insecticide homologué dans la galerie si l\'attaque est forte', EPI],
        prev: ['Inspecter les troncs à chaque passage'] },
      { n: 'Plantes parasites (loranthus, « gui »)', sci: 'Loranthacées', t: 'Plante parasite', s: [['t_gui', 5], ['t_pousses', 1]],
        conf: 'Touffes de feuilles différentes fixées sur les branches, la branche dépérit au-delà.',
        vite: ['Couper la branche 30 cm sous le point d\'attache du parasite'],
        agro: ['Passage régulier d\'élimination, avant la floraison du parasite'],
        chim: ['Pas de traitement chimique recommandé'],
        prev: ['Nettoyer aussi les arbres d\'ombrage infestés'] }
    ],
    'Café': [
      { n: 'Scolyte des baies', sci: 'Hypothenemus hampei', t: 'Insecte', s: [['fr_trou_bout', 5], ['fr_ratatines', 2]],
        conf: 'Petit trou rond au bout de la cerise ; en ouvrant, galerie et petit coléoptère noir dans le grain.',
        vite: ['Ramasser et détruire les cerises tombées au sol et restées sur l\'arbre'],
        agro: ['Récolte complète, sans laisser de cerises après la campagne', 'Pièges à alcool (mélange éthanol-méthanol) pendant l\'intercampagne', 'Champignon Beauveria bassiana (biopesticide) si disponible'],
        chim: ['Insecticide homologué seulement si l\'attaque dépasse le seuil indiqué par l\'agent', EPI],
        prev: ['Sécher rapidement les cerises récoltées', 'Taille de régénération pour faciliter la récolte'] },
      { n: 'Trachéomycose', sci: 'Fusarium xylarioides', t: 'Champignon', s: [['p_meurt', 4], ['t_brun_interne', 4], ['p_tache', 2]],
        conf: 'L\'arbre flétrit et meurt rapidement ; sous l\'écorce, le bois présente des stries brunes.',
        vite: ['Arracher et brûler sur place les arbres atteints, racines comprises'],
        agro: ['Désinfecter les outils (eau de Javel) entre deux arbres', 'Replanter avec des clones tolérants'],
        chim: ['Pas de traitement curatif'],
        prev: ['Éviter de blesser le collet et les racines lors du désherbage'] },
      { n: 'Rouille orangée', sci: 'Hemileia vastatrix', t: 'Champignon', s: [['f_poudre_orange', 5], ['f_chute', 2], ['c_pluies', 1]],
        conf: 'Taches jaunes dessus, poudre orange dessous ; le robusta est assez tolérant.',
        vite: ['Enlever les feuilles très atteintes du bas'],
        agro: ['Taille d\'aération', 'Fumure équilibrée : les arbres bien nourris résistent mieux'],
        chim: ['Fongicide à base de cuivre en début de saison des pluies si l\'attaque est forte', EPI],
        prev: ['Variétés et clones tolérants'] },
      { n: 'Scolyte des rameaux', sci: 'Xylosandrus', t: 'Insecte', s: [['t_pousses', 4], ['t_sciure', 2]],
        conf: 'Rameaux qui sèchent avec un minuscule trou à l\'aisselle d\'une feuille.',
        vite: ['Couper les rameaux atteints sous le trou et les brûler'],
        agro: ['Passages réguliers de taille sanitaire'],
        chim: ['Rarement nécessaire'],
        prev: ['Arbres bien nourris et pas stressés par la sécheresse'] }
    ],
    'Anacarde': [
      { n: 'Anthracnose', sci: 'Colletotrichum', t: 'Champignon', s: [['f_taches', 3], ['fr_fleurs', 3], ['fr_piqures', 2], ['t_pousses', 1], ['c_pluies', 2]],
        conf: 'Taches noires sur jeunes feuilles, fleurs, pommes et noix ; fréquente quand la floraison coïncide avec des pluies.',
        vite: ['Enlever et brûler les rameaux et inflorescences très atteints'],
        agro: ['Taille d\'aération après la récolte', 'Écartement suffisant entre les arbres', 'Ramasser les débris au sol'],
        chim: ['Fongicide à base de cuivre ou de mancozèbe en début de floraison', EPI],
        prev: ['Choisir des plants greffés de clones tolérants'] },
      { n: 'Oïdium de l\'anacardier', sci: 'Oidium anacardii', t: 'Champignon', s: [['f_poudre_blanche', 5], ['fr_fleurs', 3], ['c_floraison', 2]],
        conf: 'Poudre blanche sur les inflorescences et les jeunes noix, qui sèchent et tombent.',
        vite: ['Traiter dès les premières taches au début de la floraison'],
        agro: ['Taille d\'aération', 'Éliminer les rameaux secs porteurs de la maladie'],
        chim: ['Soufre en poudrage ou mouillable, au début de la floraison puis 2 à 3 semaines après', EPI],
        prev: ['Surveiller les arbres à chaque floraison'] },
      { n: 'Punaises et mirides', sci: 'Helopeltis, Anoplocnemis', t: 'Insecte', s: [['fr_piqures', 4], ['fr_ratatines', 3], ['t_pousses', 3]],
        conf: 'Taches noires de piqûres sur pommes et noix, noix ratatinées, jeunes pousses qui sèchent.',
        vite: ['Repérer les arbres les plus attaqués'],
        agro: ['Favoriser les fourmis tisserandes (Oecophylla), très efficaces', 'Extraits de neem'],
        chim: ['Insecticide homologué à la floraison et à la nouaison si les dégâts sont importants', EPI],
        prev: ['Garder des arbres-abris pour les fourmis tisserandes'] },
      { n: 'Coupeur de branches et foreurs', sci: 'Analeptes trifasciata et autres coléoptères', t: 'Insecte', s: [['t_cerclees', 5], ['t_sciure', 4]],
        conf: 'Branches coupées net comme au couteau, ou trous avec sciure dans le tronc.',
        vite: ['Ramasser et brûler les branches coupées : elles contiennent les œufs et les larves'],
        agro: ['Tuer la larve dans la galerie avec un fil de fer'],
        chim: ['Injection d\'insecticide homologué dans la galerie en cas de forte attaque', EPI],
        prev: ['Nettoyer la parcelle des bois morts'] }
    ],
    'Hévéa': [
      { n: 'Pourriture blanche des racines', sci: 'Rigidoporus', t: 'Champignon', s: [['r_cordons', 5], ['p_meurt', 3], ['f_vieilles_jaunes', 1], ['p_tache', 3]],
        conf: 'Dégager le collet : filaments blancs collés sur les racines ; les arbres voisins meurent les uns après les autres.',
        vite: ['Abattre et dessoucher les arbres morts, sortir et brûler les racines'],
        agro: ['Creuser une tranchée d\'isolement autour du foyer', 'Inspecter le collet des arbres voisins tous les 6 mois', 'Bien dessoucher avant de planter'],
        chim: ['Fongicide homologué (famille des triazoles) au collet des arbres voisins encore sains ou peu atteints', EPI],
        prev: ['Planter des légumineuses de couverture (Pueraria)', 'Dessouchage soigneux à la création de la plantation'] },
      { n: 'Encoche sèche', sci: 'Trouble physiologique de la saignée', t: 'Physiologique', s: [['t_encoche', 5]],
        conf: 'Une partie de l\'encoche ne donne plus de latex ; l\'écorce peut brunir.',
        vite: ['Arrêter la saignée de l\'arbre atteint pendant plusieurs mois'],
        agro: ['Réduire la fréquence de saignée et la stimulation', 'Bonne fumure de l\'arbre'],
        chim: ['Réduire ou arrêter la stimulation à l\'éthéphon'],
        prev: ['Respecter le système de saignée recommandé pour le clone'] },
      { n: 'Oïdium de l\'hévéa', sci: 'Erysiphe (Oidium heveae)', t: 'Champignon', s: [['f_poudre_blanche', 4], ['f_crispees', 3], ['f_chute', 3]],
        conf: 'Lors du renouvellement des feuilles, les jeunes feuilles se crispent, se couvrent de poudre blanche et tombent.',
        vite: ['Traiter pendant le renouvellement du feuillage'],
        agro: ['Engrais azoté au moment de la reprise des feuilles pour accélérer la refoliation'],
        chim: ['Soufre en poudrage pendant la refoliation', EPI],
        prev: ['Clones moins sensibles'] },
      { n: 'Maladie des taches foliaires (Corynespora)', sci: 'Corynespora cassiicola', t: 'Champignon', s: [['f_arete', 5], ['f_chute', 3]],
        conf: 'Taches brunes avec nervures noircies en « arête de poisson », chute des feuilles hors saison.',
        vite: ['Signaler à l\'encadrement : la maladie peut toucher toute une plantation'],
        agro: ['Planter des clones résistants'],
        chim: ['Fongicide homologué sur conseil de l\'encadrement', EPI],
        prev: ['Choix du clone adapté à la zone'] }
    ],
    'Riz': [
      { n: 'Pyriculariose', sci: 'Magnaporthe oryzae', t: 'Champignon', s: [['f_losange', 5], ['t_cou_noir', 4], ['fr_panicule_vide', 2], ['c_pluies', 1]],
        conf: 'Taches en losange à centre gris sur les feuilles ; au cou de la panicule, tache noire et panicule qui casse ou reste blanche.',
        vite: ['Arrêter les apports d\'azote sur la parcelle atteinte'],
        agro: ['Variétés résistantes (demander à l\'ANADER ou à AfricaRice)', 'Fractionner l\'urée, éviter l\'excès d\'azote', 'Détruire les pailles malades'],
        chim: ['Fongicide homologué (par exemple à base de tricyclazole) au début de l\'épiaison si le risque est fort', EPI],
        prev: ['Semences saines', 'Semis à la bonne date'] },
      { n: 'Panachure jaune du riz', sci: 'RYMV, transmis par des chrysomèles', t: 'Virus', s: [['f_jaune_orange', 4], ['f_mosaique', 2], ['p_naine', 3], ['fr_ratatines', 2]],
        conf: 'Feuilles jaune-orangé tachetées, plants nains, panicules mal remplies ; touche surtout le riz irrigué et de bas-fond.',
        vite: ['Arracher et enfouir les plants malades en début de culture'],
        agro: ['Variétés résistantes', 'Repiquer toutes les parcelles voisines en même temps', 'Détruire les repousses et les pailles après la récolte'],
        chim: ['Aucun produit ne guérit le virus'],
        prev: ['Pépinières propres, loin des vieilles rizières malades'] },
      { n: 'Foreurs des tiges', sci: 'Chilo, Sesamia, Maliarpha', t: 'Insecte', s: [['t_coeur_mort', 5], ['fr_panicule_vide', 4]],
        conf: 'Au tallage, cœur mort qui s\'arrache facilement ; à l\'épiaison, panicule blanche et vide ; chenille dans la tige.',
        vite: ['Arracher et détruire les tiges à cœur mort'],
        agro: ['Couper bas et détruire les chaumes après la récolte', 'Repiquage synchronisé avec les voisins', 'Fumure azotée raisonnée'],
        chim: ['Insecticide homologué seulement en cas de forte attaque', EPI],
        prev: ['Labour ou mise en eau après récolte pour tuer les larves'] },
      { n: 'Cécidomyie africaine du riz', sci: 'Orseolia oryzivora', t: 'Insecte', s: [['f_tube', 5], ['t_coeur_mort', 1]],
        conf: 'La talle ne porte pas de panicule mais un tube creux comme une feuille d\'oignon.',
        vite: ['Noter le pourcentage de talles atteintes'],
        agro: ['Repiquer tôt et en même temps que les voisins', 'Éviter l\'excès d\'azote', 'Détruire les repousses et le riz sauvage'],
        chim: ['Rarement justifié'],
        prev: ['Variétés tolérantes'] },
      { n: 'Toxicité ferreuse', sci: 'Excès de fer dans les sols de bas-fond', t: 'Carence / sol', s: [['f_bronzees', 5], ['c_basfond', 4], ['r_noires', 2], ['p_naine', 1]],
        conf: 'Bas-fond engorgé : feuilles bronzées ou orange en partant des vieilles feuilles, racines brunes, eau couleur rouille ou film irisé.',
        vite: ['Drainer la parcelle quelques jours (assec) pour aérer le sol'],
        agro: ['Aménager des drains de ceinture pour évacuer l\'eau de nappe chargée en fer', 'Variétés tolérantes', 'Retarder le repiquage de 1 à 2 semaines après la mise en eau'],
        chim: ['Apport de potassium et de zinc, qui réduit les symptômes'],
        prev: ['Ne pas laisser stagner l\'eau, renouveler la lame d\'eau'] },
      { n: 'Helminthosporiose', sci: 'Bipolaris oryzae', t: 'Champignon', s: [['f_ovales', 5], ['f_vieilles_jaunes', 1], ['fr_ratatines', 1]],
        conf: 'Petites taches brunes ovales ; fréquente sur sols pauvres ou carencés en potassium.',
        vite: ['Corriger la fertilisation, surtout en potassium'],
        agro: ['Semences saines, triées', 'Fumure équilibrée'],
        chim: ['Traitement des semences avec un fongicide homologué', EPI],
        prev: ['Rotation, résidus enfouis'] },
      { n: 'Oiseaux granivores', sci: 'Quelea, tisserins', t: 'Oiseaux', s: [['fr_oiseaux', 5]],
        conf: 'Grains vidés ou disparus à partir du stade laiteux.',
        vite: ['Gardiennage tôt le matin et en fin d\'après-midi'],
        agro: ['Rubans réfléchissants, épouvantails', 'Semer et récolter en même temps que les voisins'],
        chim: ['Pas de produit à utiliser par les producteurs'],
        prev: ['Récolter dès la maturité'] }
    ],
    'Maïs': [
      { n: 'Chenille légionnaire d\'automne', sci: 'Spodoptera frugiperda', t: 'Insecte', s: [['f_cornet', 5], ['f_trous', 3], ['fr_chenille', 2]],
        conf: 'Trous et déchirures dans les jeunes feuilles, excréments dans le cornet ; chenille avec un Y clair renversé sur la tête.',
        vite: ['Inspecter 20 plants par parcelle chaque semaine jusqu\'à la floraison', 'Écraser les œufs et les jeunes chenilles'],
        agro: ['Mettre une pincée de cendre, de sable ou de terre fine dans le cornet', 'Extraits de neem ou de piment', 'Bacillus thuringiensis (Bt), biopesticide', 'Associer avec une légumineuse (Desmodium, niébé)'],
        chim: ['Insecticide homologué contre la chenille légionnaire si plus de 20 % des plants sont attaqués', EPI],
        prev: ['Semer tôt et en même temps que les voisins', 'Éviter les semis échelonnés'] },
      { n: 'Striure du maïs', sci: 'MSV, transmis par des cicadelles', t: 'Virus', s: [['f_stries_jaunes', 5], ['p_naine', 3]],
        conf: 'Fines stries jaunes continues le long des nervures ; les plants infectés jeunes restent nains.',
        vite: ['Arracher les plants malades au début de la culture'],
        agro: ['Variétés résistantes', 'Semer tôt en début de saison des pluies'],
        chim: ['Aucun produit ne guérit le virus'],
        prev: ['Éviter de semer à côté d\'un maïs plus âgé et malade'] },
      { n: 'Helminthosporiose du maïs', sci: 'Exserohilum turcicum', t: 'Champignon', s: [['f_cigare', 5], ['c_pluies', 1]],
        conf: 'Longues taches grises en forme de cigare sur les feuilles, d\'abord en bas.',
        vite: ['Pas d\'action d\'urgence si l\'attaque arrive après la floraison'],
        agro: ['Rotation des cultures', 'Enfouir les résidus', 'Variétés tolérantes'],
        chim: ['Fongicide rarement rentable'],
        prev: ['Ne pas cultiver le maïs plusieurs années de suite sur la même parcelle'] },
      { n: 'Striga', sci: 'Striga hermonthica et autres', t: 'Plante parasite', s: [['r_striga', 5], ['p_naine', 2], ['f_vieilles_jaunes', 1]],
        conf: 'Petites plantes à fleurs roses ou rouges au pied du maïs, qui jaunit et reste chétif.',
        vite: ['Arracher le striga avant qu\'il fleurisse et le brûler'],
        agro: ['Rotation avec soja, niébé ou arachide, qui font germer le striga sans le nourrir', 'Fumier et compost', 'Variétés tolérantes', 'Association maïs-Desmodium'],
        chim: ['Pas de traitement simple recommandé'],
        prev: ['Ne pas déplacer de terre ou d\'outils sales depuis un champ infesté'] },
      { n: 'Ravageurs des grains stockés', sci: 'Grand capucin (Prostephanus), charançons', t: 'Insecte', s: [['fr_stock', 5]],
        conf: 'En stock : grains percés, poudre de farine, petits insectes.',
        vite: ['Trier et sécher à nouveau le grain'],
        agro: ['Sacs hermétiques (type PICS) ou fûts fermés', 'Bien sécher avant stockage', 'Feuilles de neem ou cendre mélangées au grain pour la consommation familiale'],
        chim: ['Insecticide de stockage homologué uniquement, jamais un produit de champ', EPI],
        prev: ['Nettoyer le magasin avant chaque récolte'] },
      { n: 'Rouille du maïs', sci: 'Puccinia', t: 'Champignon', s: [['f_poudre_orange', 5]],
        conf: 'Petites pustules brun-rouille sur les deux faces des feuilles.',
        vite: ['Surveiller l\'évolution'],
        agro: ['Variétés tolérantes', 'Rotation'],
        chim: ['Rarement rentable'],
        prev: ['Semis à la bonne date'] }
    ],
    'Manioc': [
      { n: 'Mosaïque africaine du manioc', sci: 'Virus transmis par les aleurodes et les boutures', t: 'Virus', s: [['f_mosaique', 5], ['p_naine', 2], ['f_aleurodes', 2]],
        conf: 'Feuilles avec plages jaunes et vertes, déformées et rétrécies ; plants rabougris.',
        vite: ['Arracher les plants malades au début de la culture'],
        agro: ['Ne prendre des boutures que sur des plants sains', 'Variétés tolérantes (demander au CNRA ou à l\'ANADER)'],
        chim: ['Aucun produit ne guérit le virus'],
        prev: ['Ne jamais distribuer de boutures de plants malades'] },
      { n: 'Bactériose du manioc', sci: 'Xanthomonas', t: 'Bactérie', s: [['f_angulaires', 5], ['t_gomme', 3], ['t_pousses', 3], ['c_pluies', 1]],
        conf: 'Taches anguleuses d\'aspect mouillé, feuilles qui fanent, gomme sur les tiges, bouts de tiges qui sèchent.',
        vite: ['Couper et brûler les tiges atteintes'],
        agro: ['Boutures saines prélevées en saison sèche', 'Rotation de 1 à 2 ans sans manioc', 'Désinfecter la machette'],
        chim: ['Pas de traitement efficace au champ'],
        prev: ['Variétés tolérantes'] },
      { n: 'Cochenille farineuse du manioc', sci: 'Phenacoccus manihoti', t: 'Insecte', s: [['f_touffe', 5], ['c_seche', 2], ['p_naine', 1]],
        conf: 'Bout des tiges en touffe serrée avec des amas cotonneux blancs, surtout en saison sèche.',
        vite: ['Couper et brûler les bouts de tiges très infestés'],
        agro: ['Laisser agir les ennemis naturels (petite guêpe Anagyrus déjà présente)', 'Fumure organique : les plants vigoureux résistent mieux'],
        chim: ['Éviter les insecticides qui tuent les ennemis naturels'],
        prev: ['Boutures propres, trempées si besoin dans une solution savonneuse'] },
      { n: 'Acariens verts du manioc', sci: 'Mononychellus tanajoa', t: 'Acarien', s: [['f_toiles', 4], ['f_crispees', 2], ['c_seche', 2]],
        conf: 'Petits points jaunes sur les jeunes feuilles, qui rétrécissent, en saison sèche.',
        vite: ['Pas d\'action urgente : l\'attaque baisse avec les pluies'],
        agro: ['Préserver les acariens prédateurs', 'Paillage et fumure'],
        chim: ['Éviter les traitements chimiques'],
        prev: ['Planter en début de saison des pluies'] },
      { n: 'Pourriture des racines', sci: 'Champignons du sol', t: 'Champignon', s: [['r_pourries', 5], ['c_basfond', 3], ['c_pluies', 1]],
        conf: 'Racines molles qui sentent mauvais, souvent en sol engorgé.',
        vite: ['Récolter rapidement les plants encore sains de la zone'],
        agro: ['Planter sur buttes ou billons en sol humide', 'Drainer', 'Rotation'],
        chim: ['Pas de traitement recommandé'],
        prev: ['Éviter les bas-fonds mal drainés'] }
    ],
    'Igname': [
      { n: 'Anthracnose de l\'igname', sci: 'Colletotrichum', t: 'Champignon', s: [['f_brulure', 5], ['f_taches', 3], ['c_pluies', 2]],
        conf: 'Taches noires sur les feuilles et les tiges, puis le feuillage noircit et sèche par plaques.',
        vite: ['Enlever les feuilles et tiges très atteintes'],
        agro: ['Variétés tolérantes', 'Semenceaux sains', 'Tuteurage pour aérer', 'Rotation'],
        chim: ['Fongicide à base de cuivre ou de mancozèbe dès les premières taches, en saison des pluies', EPI],
        prev: ['Ne pas planter près d\'une parcelle très atteinte l\'année précédente'] },
      { n: 'Mosaïque de l\'igname', sci: 'Virus (YMV)', t: 'Virus', s: [['f_mosaique', 5], ['p_naine', 2]],
        conf: 'Feuilles marbrées de jaune et de vert, déformées.',
        vite: ['Marquer les plants malades et ne pas les utiliser comme semenceaux'],
        agro: ['Semenceaux issus de plants sains', 'Lutte contre les pucerons par la diversité des cultures'],
        chim: ['Aucun produit ne guérit le virus'],
        prev: ['Renouveler régulièrement les semenceaux'] },
      { n: 'Nématodes de l\'igname', sci: 'Scutellonema, Meloidogyne', t: 'Nématode', s: [['r_craquelures', 5], ['r_galles', 4], ['r_pourries', 1]],
        conf: 'Craquelures sèches et brunes sous la peau du tubercule, ou tubercules bosselés de galles.',
        vite: ['Trier les tubercules atteints et ne pas les replanter'],
        agro: ['Semenceaux sains, parés', 'Tremper les semenceaux 30 minutes dans de l\'eau à environ 50 °C', 'Jachère ou rotation avec des cultures non hôtes'],
        chim: ['Nématicide rarement justifié'],
        prev: ['Ne pas replanter de l\'igname deux ans de suite au même endroit'] },
      { n: 'Pourriture des tubercules au stockage', sci: 'Champignons et bactéries', t: 'Champignon', s: [['r_pourries', 4], ['fr_stock', 1]],
        conf: 'Tubercules mous, suintants, qui sentent mauvais dans le stock.',
        vite: ['Trier le stock chaque semaine et retirer les tubercules atteints'],
        agro: ['Récolter sans blesser', 'Laisser cicatriser les blessures à l\'ombre', 'Stocker au frais et à l\'air (cases en claie)'],
        chim: ['Pas de traitement recommandé'],
        prev: ['Récolter à maturité'] }
    ],
    'Banane plantain': [
      { n: 'Cercosporiose noire', sci: 'Pseudocercospora fijiensis', t: 'Champignon', s: [['f_stries_noires', 5], ['c_pluies', 2], ['fr_regime', 1]],
        conf: 'Petites stries brunes qui deviennent de grandes taches noires ; les feuilles sèchent avant la récolte du régime.',
        vite: ['Effeuillage sanitaire : couper les feuilles ou parties de feuilles nécrosées'],
        agro: ['Densité adaptée et drainage', 'Fumure équilibrée', 'Variétés tolérantes (hybrides PITA, FHIA)'],
        chim: ['Fongicide homologué seulement en plantation commerciale, sur conseil technique', EPI],
        prev: ['Effeuillage régulier toutes les 2 à 3 semaines'] },
      { n: 'Charançon du bananier', sci: 'Cosmopolites sordidus', t: 'Insecte', s: [['r_galeries', 5], ['t_verse', 3], ['fr_regime', 2]],
        conf: 'Galeries noires dans la souche ; les plants versent ou donnent de petits régimes.',
        vite: ['Piéger avec des morceaux de pseudo-tronc posés au sol, à relever et nettoyer chaque semaine'],
        agro: ['Rejets sains, parés (enlever racines et partie externe de la souche)', 'Détruire les vieilles souches après la récolte', 'Champignon Beauveria bassiana sur les pièges'],
        chim: ['Insecticide homologué au pied seulement si l\'attaque est forte', EPI],
        prev: ['Nouvelle plantation sur une parcelle sans bananiers depuis 1 an'] },
      { n: 'Nématodes du bananier', sci: 'Radopholus similis et autres', t: 'Nématode', s: [['r_noires', 5], ['t_verse', 4], ['fr_regime', 1]],
        conf: 'Racines noircies et peu nombreuses ; les plants se déracinent et tombent avec leur régime.',
        vite: ['Tuteurer les plants porteurs de régime'],
        agro: ['Rejets parés et trempés 20 minutes dans de l\'eau à environ 52 °C', 'Plants issus de vitroplants ou de PIF', 'Jachère ou rotation avant replantation'],
        chim: ['Nématicide rarement justifié chez les petits producteurs'],
        prev: ['Ne pas déplacer de rejets d\'une parcelle infestée'] },
      { n: 'Fusariose (maladie de Panama)', sci: 'Fusarium oxysporum', t: 'Champignon', s: [['t_brun_interne', 5], ['f_vieilles_jaunes', 2], ['p_meurt', 2]],
        conf: 'Jaunissement des vieilles feuilles ; en coupant le pseudo-tronc, vaisseaux brun-rouge. Le plantain y est assez résistant : faire confirmer.',
        vite: ['Arracher et détruire la touffe atteinte'],
        agro: ['Ne pas prélever de rejets sur la touffe malade', 'Désinfecter les outils'],
        chim: ['Pas de traitement'],
        prev: ['Rejets ou vitroplants sains'] }
    ],
    'Tomate': [
      { n: 'Flétrissement bactérien', sci: 'Ralstonia solanacearum', t: 'Bactérie', s: [['p_fane', 5], ['p_filaments', 5], ['t_brun_interne', 2], ['p_tache', 1]],
        conf: 'La plante fane d\'un coup en journée en restant verte ; tige coupée posée dans l\'eau : filaments laiteux.',
        vite: ['Arracher les plants malades avec la motte et les détruire loin de la parcelle'],
        agro: ['Rotation de 3 ans sans tomate, piment, aubergine ni pomme de terre', 'Greffage sur porte-greffe tolérant', 'Variétés tolérantes', 'Éviter les sols mal drainés'],
        chim: ['Aucun produit efficace'],
        prev: ['Ne pas irriguer avec l\'eau qui a coulé sur une parcelle malade'] },
      { n: 'Mildiou de la tomate', sci: 'Phytophthora infestans', t: 'Champignon', s: [['f_huileuses', 5], ['fr_pourriture', 3], ['c_pluies', 2]],
        conf: 'Taches brun-vert huileuses sur feuilles et fruits, duvet blanc dessous par temps humide ; évolution très rapide.',
        vite: ['Enlever et détruire les feuilles et fruits atteints'],
        agro: ['Espacer et tuteurer pour aérer', 'Arroser au pied, jamais sur le feuillage', 'Paillage'],
        chim: ['Fongicide à base de cuivre ou de mancozèbe en préventif en saison des pluies', EPI],
        prev: ['Préférer la contre-saison pour la tomate'] },
      { n: 'Alternariose', sci: 'Alternaria', t: 'Champignon', s: [['f_cible', 5], ['f_vieilles_jaunes', 1]],
        conf: 'Taches brunes avec cercles concentriques, d\'abord sur les vieilles feuilles du bas.',
        vite: ['Enlever les feuilles du bas atteintes'],
        agro: ['Rotation', 'Fumure équilibrée', 'Tuteurage'],
        chim: ['Fongicide homologué (mancozèbe ou autre) si l\'attaque progresse', EPI],
        prev: ['Semences saines'] },
      { n: 'Enroulement jaune de la tomate (TYLCV)', sci: 'Virus transmis par les aleurodes', t: 'Virus', s: [['f_cuillere', 5], ['p_naine', 3], ['f_aleurodes', 3]],
        conf: 'Jeunes feuilles petites, jaunes sur les bords et recourbées en cuillère ; plante naine qui donne peu.',
        vite: ['Arracher et détruire les plants malades jeunes'],
        agro: ['Pépinière sous filet anti-insectes', 'Variétés tolérantes', 'Pièges jaunes englués', 'Neem contre les aleurodes'],
        chim: ['Aucun produit ne guérit le virus ; insecticide homologué contre les aleurodes si besoin', EPI],
        prev: ['Ne pas planter à côté d\'une vieille parcelle malade'] },
      { n: 'Noctuelle et mineuse de la tomate', sci: 'Helicoverpa armigera, Tuta absoluta', t: 'Insecte', s: [['fr_chenille', 5], ['f_mines', 4], ['f_trous', 1]],
        conf: 'Fruits troués par une chenille (Helicoverpa) ou galeries claires dans les feuilles et fruits percés de petits trous (Tuta).',
        vite: ['Ramasser et détruire les fruits troués'],
        agro: ['Pièges à phéromone pour la mineuse', 'Bacillus thuringiensis (Bt) ou neem', 'Arracher les vieux plants après la récolte'],
        chim: ['Insecticide homologué en alternant les familles chimiques', EPI],
        prev: ['Pépinière protégée'] },
      { n: 'Nématodes à galles', sci: 'Meloidogyne', t: 'Nématode', s: [['r_galles', 5], ['p_fane', 1], ['f_vieilles_jaunes', 1], ['p_naine', 1]],
        conf: 'En arrachant un plant : racines couvertes de boules (galles).',
        vite: ['Détruire les racines après la récolte'],
        agro: ['Rotation avec des céréales ou des oignons', 'Tagètes (œillets d\'Inde) en culture ou en bordure', 'Fumier et compost en grande quantité'],
        chim: ['Nématicide rarement rentable'],
        prev: ['Pépinière sur sol sain'] },
      { n: 'Cul noir (nécrose apicale)', sci: 'Manque de calcium dans le fruit', t: 'Physiologique', s: [['fr_cul_noir', 5], ['c_seche', 1]],
        conf: 'Tache noire, sèche et ronde au bout du fruit ; dû à un arrosage irrégulier.',
        vite: ['Arroser régulièrement'],
        agro: ['Paillage pour garder l\'humidité', 'Éviter l\'excès d\'azote'],
        chim: ['Amendement calcaire si le sol est acide'],
        prev: ['Irrigation régulière'] },
      { n: 'Acariens', sci: 'Tetranychus', t: 'Acarien', s: [['f_toiles', 5], ['c_seche', 2]],
        conf: 'Points jaunes sur les feuilles, petites toiles, feuillage bronzé en saison sèche.',
        vite: ['Asperger le feuillage d\'eau'],
        agro: ['Extraits de neem', 'Arroser régulièrement'],
        chim: ['Acaricide homologué si nécessaire', EPI],
        prev: ['Éviter le stress hydrique'] }
    ],
    'Piment': [
      { n: 'Anthracnose du piment', sci: 'Colletotrichum', t: 'Champignon', s: [['fr_enfoncees', 5], ['c_pluies', 2]],
        conf: 'Taches rondes enfoncées sur les fruits, avec des cercles orange ou noirs.',
        vite: ['Ramasser et détruire les fruits atteints'],
        agro: ['Semences saines', 'Rotation', 'Récolter régulièrement'],
        chim: ['Fongicide à base de cuivre ou de mancozèbe en saison des pluies', EPI],
        prev: ['Espacement suffisant'] },
      { n: 'Viroses du piment', sci: 'Virus transmis par les pucerons et les aleurodes', t: 'Virus', s: [['f_mosaique', 4], ['f_crispees', 3], ['p_naine', 2], ['f_pucerons', 2], ['f_aleurodes', 1]],
        conf: 'Feuilles marbrées, déformées ou crispées, plante qui pousse mal.',
        vite: ['Arracher les plants malades jeunes'],
        agro: ['Pépinière sous filet', 'Pièges jaunes', 'Neem contre les pucerons et aleurodes'],
        chim: ['Aucun produit ne guérit le virus'],
        prev: ['Éliminer les mauvaises herbes autour de la parcelle'] },
      { n: 'Flétrissement bactérien', sci: 'Ralstonia solanacearum', t: 'Bactérie', s: [['p_fane', 5], ['p_filaments', 5]],
        conf: 'Le plant fane brusquement en restant vert ; filaments laiteux de la tige dans l\'eau.',
        vite: ['Arracher et détruire les plants malades'],
        agro: ['Rotation de 3 ans sans solanacées', 'Sol bien drainé'],
        chim: ['Aucun produit efficace'],
        prev: ['Ne pas planter après tomate ou aubergine'] },
      { n: 'Mouches des fruits', sci: 'Bactrocera, Ceratitis', t: 'Insecte', s: [['fr_asticots', 5]],
        conf: 'Fruits qui pourrissent avec des asticots à l\'intérieur.',
        vite: ['Ramasser chaque semaine les fruits piqués et les enterrer profondément ou les enfermer dans un sac au soleil'],
        agro: ['Pièges à appât (protéines ou attractifs)', 'Récolte régulière'],
        chim: ['Appât insecticide homologué en taches si besoin', EPI],
        prev: ['Nettoyer les fruits tombés'] },
      { n: 'Tarsonèmes et acariens', sci: 'Polyphagotarsonemus', t: 'Acarien', s: [['f_crispees', 4], ['f_toiles', 2]],
        conf: 'Jeunes feuilles étroites, recourbées vers le bas, bronzées en dessous.',
        vite: ['Couper les pousses très atteintes'],
        agro: ['Extraits de neem, soufre mouillable'],
        chim: ['Acaricide homologué si nécessaire', EPI],
        prev: ['Plants de pépinière sains'] }
    ],
    'Aubergine': [
      { n: 'Foreur des fruits et des pousses', sci: 'Leucinodes', t: 'Insecte', s: [['t_pousses', 4], ['fr_chenille', 5]],
        conf: 'Bouts de tiges qui fanent et se courbent ; fruits percés avec excréments et chenille rose à l\'intérieur.',
        vite: ['Couper et détruire les pousses fanées et les fruits percés chaque semaine'],
        agro: ['Pièges à phéromone', 'Neem ou Bt', 'Arracher les vieux plants après la culture'],
        chim: ['Insecticide homologué en alternant les familles', EPI],
        prev: ['Ne pas cultiver l\'aubergine en continu au même endroit'] },
      { n: 'Flétrissement bactérien', sci: 'Ralstonia solanacearum', t: 'Bactérie', s: [['p_fane', 5], ['p_filaments', 5]],
        conf: 'Le plant fane brusquement en restant vert ; filaments laiteux de la tige dans l\'eau.',
        vite: ['Arracher et détruire les plants malades'],
        agro: ['Rotation sans solanacées', 'Greffage sur aubergine sauvage tolérante'],
        chim: ['Aucun produit efficace'],
        prev: ['Sol bien drainé'] },
      { n: 'Cicadelles (jassides)', sci: 'Jacobiella', t: 'Insecte', s: [['f_bord_brule', 3], ['f_crispees', 2]],
        conf: 'Bords des feuilles jaunes puis brûlés, feuilles qui se recourbent ; petits insectes verts qui sautent.',
        vite: ['Vérifier le dessous des feuilles'],
        agro: ['Neem', 'Variétés à feuilles poilues'],
        chim: ['Insecticide homologué si l\'attaque est forte', EPI],
        prev: ['Éliminer les mauvaises herbes'] },
      { n: 'Acariens', sci: 'Tetranychus', t: 'Acarien', s: [['f_toiles', 5], ['c_seche', 2]],
        conf: 'Points jaunes et petites toiles sous les feuilles en saison sèche.',
        vite: ['Asperger le feuillage d\'eau'],
        agro: ['Neem', 'Arrosage régulier'],
        chim: ['Acaricide homologué si nécessaire', EPI],
        prev: ['Éviter le stress hydrique'] }
    ],
    'Gombo': [
      { n: 'Viroses du gombo (enroulement, mosaïque)', sci: 'Virus transmis par les aleurodes', t: 'Virus', s: [['f_mosaique', 4], ['f_nervures', 3], ['f_crispees', 3], ['f_aleurodes', 2], ['p_naine', 2]],
        conf: 'Feuilles marbrées ou à nervures jaunes, crispées et enroulées ; fruits petits et déformés.',
        vite: ['Arracher les plants malades jeunes'],
        agro: ['Variétés tolérantes', 'Pièges jaunes, neem contre les aleurodes', 'Semer en début de saison des pluies'],
        chim: ['Aucun produit ne guérit le virus'],
        prev: ['Éliminer les plantes hôtes autour de la parcelle'] },
      { n: 'Altises', sci: 'Podagrica', t: 'Insecte', s: [['f_criblures', 5]],
        conf: 'Nombreux petits trous ronds dans les feuilles ; petits coléoptères qui sautent.',
        vite: ['Traiter tôt, au stade jeune plant'],
        agro: ['Neem ou piment en pulvérisation', 'Cendre sur les jeunes plants'],
        chim: ['Insecticide homologué si les jeunes plants sont menacés', EPI],
        prev: ['Semis dense puis démariage'] },
      { n: 'Chenilles des fruits', sci: 'Earias, Helicoverpa', t: 'Insecte', s: [['fr_chenille', 5], ['t_pousses', 1]],
        conf: 'Fruits percés et déformés, chenille à l\'intérieur.',
        vite: ['Ramasser les fruits percés'],
        agro: ['Bt ou neem', 'Récolte fréquente'],
        chim: ['Insecticide homologué si besoin', EPI],
        prev: ['Rotation'] },
      { n: 'Oïdium du gombo', sci: 'Erysiphe', t: 'Champignon', s: [['f_poudre_blanche', 5], ['c_seche', 1]],
        conf: 'Poudre blanche sur les feuilles, qui jaunissent et sèchent.',
        vite: ['Enlever les feuilles très atteintes'],
        agro: ['Soufre mouillable, bicarbonate de soude dilué'],
        chim: ['Soufre homologué', EPI],
        prev: ['Espacement suffisant'] },
      { n: 'Nématodes à galles', sci: 'Meloidogyne', t: 'Nématode', s: [['r_galles', 5], ['p_naine', 1]],
        conf: 'Racines couvertes de galles.',
        vite: ['Détruire les racines après la récolte'],
        agro: ['Rotation avec céréales', 'Tagètes', 'Fumier abondant'],
        chim: ['Rarement rentable'],
        prev: ['Pépinière sur sol sain'] }
    ],
    'Chou': [
      { n: 'Teigne du chou', sci: 'Plutella xylostella', t: 'Insecte', s: [['f_fenetres', 5], ['f_trous', 2]],
        conf: 'Feuilles grignotées en fenêtres transparentes, petites chenilles vertes qui se tortillent quand on les touche.',
        vite: ['Inspecter deux fois par semaine'],
        agro: ['Bacillus thuringiensis (Bt) ou neem, en alternance', 'Filet anti-insectes en pépinière', 'Rotation avec des cultures d\'une autre famille'],
        chim: ['Insecticide homologué en alternant les familles : la teigne devient vite résistante', EPI],
        prev: ['Arracher les vieux pieds après la récolte'] },
      { n: 'Pourriture noire', sci: 'Xanthomonas campestris', t: 'Bactérie', s: [['f_v_jaune', 5], ['c_pluies', 2]],
        conf: 'Taches jaunes en V au bord des feuilles, nervures noircies.',
        vite: ['Enlever les feuilles et plants atteints'],
        agro: ['Semences saines ou traitées à l\'eau chaude', 'Rotation de 2 à 3 ans sans chou', 'Arroser au pied'],
        chim: ['Cuivre en préventif en saison des pluies', EPI],
        prev: ['Pépinière sur sol neuf'] },
      { n: 'Pucerons', sci: 'Brevicoryne, Lipaphis', t: 'Insecte', s: [['f_pucerons', 5], ['f_crispees', 2]],
        conf: 'Colonies grises ou vertes sous les feuilles, qui se recroquevillent.',
        vite: ['Jet d\'eau ou eau savonneuse'],
        agro: ['Neem', 'Préserver les coccinelles'],
        chim: ['Insecticide homologué si l\'attaque est forte', EPI],
        prev: ['Éviter l\'excès d\'azote'] },
      { n: 'Pyrale du chou', sci: 'Hellula undalis', t: 'Insecte', s: [['f_trous', 3], ['t_coeur_mort', 3]],
        conf: 'Le cœur du jeune chou est dévoré, la pomme ne se forme pas.',
        vite: ['Détruire les chenilles dans le cœur'],
        agro: ['Bt ou neem', 'Rotation'],
        chim: ['Insecticide homologué si besoin', EPI],
        prev: ['Pépinière protégée'] }
    ]
  };

  /* ---------------- Outils ---------------- */
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function problems(crop) { return (C[crop] || []).concat(GEN); }
  function cropSigns(crop) {
    var set = {};
    problems(crop).forEach(function (p) { p.s.forEach(function (x) { if (S[x[0]]) set[x[0]] = 1; }); });
    return Object.keys(set);
  }
  var PILL = { 'Champignon': 'p-cond', 'Virus': 'p-bad', 'Bactérie': 'p-bad', 'Insecte': 'p-risk', 'Acarien': 'p-risk', 'Nématode': 'p-risk', 'Plante parasite': 'p-risk', 'Oiseaux': 'p-neutral', 'Carence / sol': 'p-acc', 'Physiologique': 'p-acc' };

  function score(p, sel) {
    var got = 0, key = false, hits = [];
    p.s.forEach(function (x) { if (sel[x[0]] && x[1] > 0) { got += x[1]; hits.push(S[x[0]][1]); if (x[1] >= 4) key = true; } });
    var lvl = got === 0 ? null : (key && got >= 6) ? ['Très probable', 'p-bad'] : (key || got >= 4) ? ['Probable', 'p-risk'] : ['Possible', 'p-neutral'];
    return { p: p, got: got, key: key, hits: hits, lvl: lvl };
  }

  /* ---------------- Interface ---------------- */
  var state = { crop: null, sel: {} };
  function pref(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  function renderSigns() {
    var crop = state.crop, box = $('#pmSigns');
    var ids = cropSigns(crop), groups = {};
    ids.forEach(function (id) { var g = S[id][0]; (groups[g] = groups[g] || []).push(id); });
    var h = '';
    ['f', 't', 'fr', 'r', 'p', 'c'].forEach(function (g) {
      if (!groups[g]) return;
      h += '<fieldset class="pm-group"><legend>' + esc(G[g]) + '</legend>';
      groups[g].forEach(function (id) {
        h += '<label class="pm-sign"><input type="checkbox" data-s="' + id + '"' + (state.sel[id] ? ' checked' : '') + '><span>' + esc(S[id][1]) + '</span></label>';
      });
      h += '</fieldset>';
    });
    box.innerHTML = h;
  }

  function list(title, arr) { return arr && arr.length ? '<div class="pm-sub"><b>' + esc(title) + '</b><ul>' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' : ''; }

  function results() {
    var out = $('#pmOut'), n = Object.keys(state.sel).filter(function (k) { return state.sel[k]; }).length;
    if (!state.crop) { out.innerHTML = ''; return []; }
    if (!n) { out.innerHTML = '<p class="muted small" style="margin:0">Cochez ce que vous observez sur la plante : les maladies et ravageurs possibles s\'afficheront ici, avec quoi faire.</p>'; $('#pmPrint').disabled = true; return []; }
    var rs = problems(state.crop).map(function (p) { return score(p, state.sel); }).filter(function (r) { return r.lvl; })
      .sort(function (a, b) { return b.got - a.got; }).slice(0, 4);
    if (!rs.length) { out.innerHTML = '<p class="notice">Aucun problème connu ne correspond à ces signes pour cette culture. Ajoutez d\'autres observations ou faites venir un technicien.</p>'; $('#pmPrint').disabled = true; return []; }
    out.innerHTML = rs.map(function (r, i) {
      var p = r.p;
      return '<details class="pm-res"' + (i === 0 ? ' open' : '') + '><summary><span class="pm-name">' + esc(p.n) + '</span>' +
        '<span class="pill ' + r.lvl[1] + '">' + r.lvl[0] + '</span><span class="pill ' + (PILL[p.t] || 'p-neutral') + '">' + esc(p.t) + '</span></summary>' +
        (p.sci ? '<p class="small muted" style="margin:6px 0 0">' + esc(p.sci) + '</p>' : '') +
        '<p class="small" style="margin:6px 0 0"><b>Signes retrouvés :</b> ' + esc(r.hits.join(' ; ')) + '.</p>' +
        '<p class="small" style="margin:6px 0 0"><b>Pour vérifier :</b> ' + esc(p.conf) + '</p>' +
        list('À faire tout de suite', p.vite) + list('Lutte agroécologique et biologique', p.agro) + list('Si nécessaire : lutte chimique', p.chim) + list('Pour éviter que ça revienne', p.prev) +
        '</details>';
    }).join('') + '<p class="small muted" style="margin:4px 0 0">Diagnostic indicatif, établi à partir des symptômes. Faites-le confirmer par un technicien (ANADER, CNRA, Conseil du Café-Cacao) avant tout traitement chimique.</p>';
    $('#pmPrint').disabled = false;
    return rs;
  }

  function ficheHTML() {
    var rs = problems(state.crop).map(function (p) { return score(p, state.sel); }).filter(function (r) { return r.lvl; }).sort(function (a, b) { return b.got - a.got; }).slice(0, 3);
    var obs = Object.keys(state.sel).filter(function (k) { return state.sel[k] && S[k]; }).map(function (k) { return S[k][1]; });
    var cons = '';
    try { if (typeof PROFIL !== 'undefined' && PROFIL) cons = (PROFIL.prenoms + ' ' + PROFIL.nom).trim(); } catch (e) {}
    var prod = $('#pmProd').value.trim(), lieu = $('#pmLieu').value.trim();
    var css = 'body{font:13px/1.45 "Source Sans 3",Arial,sans-serif;color:#18231C;margin:24px}h1{font-size:20px;margin:0 0 4px;color:#1D6A4A}h2{font-size:15px;margin:16px 0 4px;border-bottom:2px solid #1D6A4A;padding-bottom:2px}table{border-collapse:collapse;width:100%}td{padding:3px 6px;border-bottom:1px solid #D3DACF;vertical-align:top}td:first-child{color:#5B6A60;width:28%}ul{margin:4px 0;padding-left:18px}.lvl{font-weight:700;color:#B4501A}.small{font-size:11px;color:#5B6A60}';
    var h = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Diagnostic ' + esc(state.crop) + '</title><style>' + css + '</style></head><body>' +
      '<h1>Fiche diagnostic : ' + esc(state.crop) + '</h1><p class="small">AKA AgroDiag CI · ' + new Date().toLocaleDateString('fr-FR') + '</p>' +
      '<table><tr><td>Producteur</td><td>' + esc(prod || '—') + '</td></tr><tr><td>Lieu / parcelle</td><td>' + esc(lieu || '—') + '</td></tr><tr><td>Conseiller</td><td>' + esc(cons || '—') + '</td></tr></table>' +
      '<h2>Ce qui a été observé</h2><ul>' + obs.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul>';
    rs.forEach(function (r, i) {
      var p = r.p;
      h += '<h2>' + (i + 1) + '. ' + esc(p.n) + ' <span class="lvl">(' + r.lvl[0] + ')</span></h2><p class="small">' + esc(p.t) + (p.sci ? ' · ' + esc(p.sci) : '') + '</p>' +
        '<p><b>Pour vérifier :</b> ' + esc(p.conf) + '</p>' +
        ['À faire tout de suite', 'Lutte agroécologique et biologique', 'Si nécessaire : lutte chimique', 'Prévention'].map(function (t, j) {
          var a = [p.vite, p.agro, p.chim, p.prev][j]; return a && a.length ? '<p style="margin:6px 0 0"><b>' + t + '</b></p><ul>' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '';
        }).join('');
    });
    h += '<p class="small" style="margin-top:18px">Diagnostic indicatif établi à partir des symptômes observés. À faire confirmer par un technicien avant tout traitement chimique. Produits homologués uniquement, avec équipement de protection.</p></body></html>';
    return h;
  }

  async function printFiche() {
    var html = ficheHTML(), name = 'Diagnostic ' + state.crop;
    if (window.AgroDiagAndroid && window.AgroDiagAndroid.printHtml) { window.AgroDiagAndroid.printHtml(html, name); return; }
    var w = window.open('', '_blank');
    if (w) { w.document.open(); w.document.write(html.replace('</body>', '<script>setTimeout(function(){window.print()},400)<\/script></body>')); w.document.close(); }
  }

  function setCrop(c) {
    state.crop = c; state.sel = {}; pref('agrodiag.pmCrop', c);
    renderSigns(); results();
  }

  function init() {
    var sel = $('#pmCrop'); if (!sel) return;
    var crops = Object.keys(C);
    sel.innerHTML = crops.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('');
    var saved = pref('agrodiag.pmCrop'); if (saved && C[saved]) sel.value = saved;
    sel.addEventListener('change', function () { setCrop(sel.value); });
    $('#pmSigns').addEventListener('change', function (e) { var id = e.target.getAttribute('data-s'); if (!id) return; state.sel[id] = e.target.checked; results(); });
    $('#pmReset').addEventListener('click', function () { state.sel = {}; renderSigns(); results(); });
    $('#pmPrint').addEventListener('click', printFiche);
    setCrop(sel.value);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
