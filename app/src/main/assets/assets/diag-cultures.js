/* AKA AgroDiag CI — base du diagnostic des cultures : symptômes, problèmes communs.
   Diagnostic indicatif par les symptômes ; à faire confirmer par un technicien. */
window.PM = { C: {}, CAT: {} };
(function (PM) {
  PM.G = { f: 'Feuilles', t: 'Tiges, tronc, pousses', fr: 'Fruits, fleurs, grains', r: 'Racines, tubercules, souche', p: 'Toute la plante', c: 'Contexte' };
  PM.S = {
    /* Feuilles */
    f_taches: ['f', 'Taches brunes ou noires sur les feuilles'],
    f_losange: ['f', 'Taches en losange : centre gris, bord brun'],
    f_cigare: ['f', 'Longues taches grises en forme de cigare'],
    f_cible: ['f', 'Taches brunes avec des cercles concentriques (comme une cible)'],
    f_oeil: ['f', 'Taches rondes brunes à centre clair (en « œil »)'],
    f_huileuses: ['f', 'Taches brun-vert d\'aspect huileux, duvet blanc dessous par temps humide'],
    f_fondent: ['f', 'Grandes taches brunes humides avec gouttelettes, les feuilles « fondent » en quelques jours'],
    f_anguleuses_jaunes: ['f', 'Taches anguleuses jaunes dessus, duvet gris-violet dessous'],
    f_violacees: ['f', 'Taches allongées violacées ou pourpres sur les feuilles'],
    f_stries_noires: ['f', 'Stries brunes puis grandes taches noires, feuilles qui sèchent tôt'],
    f_stries_blanches: ['f', 'Fines stries blanches ou crème le long des feuilles'],
    f_mosaique: ['f', 'Mosaïque : plages jaunes et vertes, feuilles déformées'],
    f_nervures: ['f', 'Bandes jaunes ou rouges le long des nervures'],
    f_stries_jaunes: ['f', 'Fines stries jaunes continues le long des feuilles'],
    f_jaune_orange: ['f', 'Feuilles jaune-orangé, en commençant par le bout'],
    f_bronzees: ['f', 'Feuilles bronzées ou couleur rouille, d\'abord les vieilles feuilles'],
    f_orangees: ['f', 'Feuilles ou palmes basses jaune-orangé, surtout du côté exposé au soleil'],
    f_poudre_blanche: ['f', 'Poudre blanche sur les feuilles, les jeunes pousses ou les fleurs'],
    f_poudre_orange: ['f', 'Pustules ou poudre orange-brun sur les feuilles (rouille)'],
    f_cuillere: ['f', 'Feuilles jaunes, petites, recourbées en cuillère'],
    f_trous: ['f', 'Feuilles trouées ou déchiquetées'],
    f_criblures: ['f', 'Nombreux petits trous ronds dans les feuilles'],
    f_mines: ['f', 'Galeries claires à l\'intérieur des feuilles (mines)'],
    f_folioles_grises: ['f', 'Folioles grisâtres desséchées, criblées de mines'],
    f_fenetres: ['f', 'Feuilles grignotées en « fenêtres » transparentes, petites chenilles vertes'],
    f_enroulees: ['f', 'Feuilles enroulées ou collées par des fils, chenille à l\'intérieur'],
    f_cornet: ['f', 'Cœur (cornet) troué, avec des excréments comme de la sciure humide'],
    f_tube: ['f', 'Feuille centrale transformée en tube creux (« tube d\'oignon »)'],
    f_v_jaune: ['f', 'Taches jaunes en forme de V au bord des feuilles, nervures noircies'],
    f_angulaires: ['f', 'Taches anguleuses d\'aspect mouillé, puis feuilles qui fanent'],
    f_vieilles_jaunes: ['f', 'Jaunissement des vieilles feuilles du bas, la plante pâlit'],
    f_jaunit_progressif: ['f', 'Jaunissement qui gagne des palmes basses vers les palmes hautes'],
    f_palmes_seches: ['f', 'Palmes basses qui sèchent et se cassent, nouvelles palmes (flèches) courtes et pâles'],
    f_palmes_v: ['f', 'Palmes coupées en V ou en éventail, trous à la base des jeunes palmes'],
    f_bord_brule: ['f', 'Bord des feuilles jaune ou rouge, puis brûlé'],
    f_rougies: ['f', 'Feuilles qui rougissent, bords enroulés vers le bas, plante qui flétrit'],
    f_crispees: ['f', 'Jeunes feuilles crispées, recroquevillées ou déformées'],
    f_argentees: ['f', 'Feuilles argentées ou bronzées, avec de petits points noirs'],
    f_touffe: ['f', 'Bout des tiges en touffe serrée, amas cotonneux blancs'],
    f_cochenilles: ['f', 'Amas cotonneux blancs ou petites carapaces sur feuilles, tiges ou fruits'],
    f_miellat: ['f', 'Feuilles collantes ou couvertes d\'une suie noire (fumagine)'],
    f_toiles: ['f', 'Petites toiles fines, feuilles piquées de points jaunes'],
    f_chute: ['f', 'Chute importante des feuilles'],
    f_brulure: ['f', 'Feuillage qui noircit et se dessèche par plaques (brûlure)'],
    f_ovales: ['f', 'Petites taches brunes ovales, comme des graines de sésame'],
    f_arete: ['f', 'Taches brunes avec nervures noires en « arête de poisson »'],
    f_pucerons: ['f', 'Colonies de petits insectes mous sous les feuilles (pucerons)'],
    f_aleurodes: ['f', 'Petites mouches blanches qui s\'envolent quand on secoue la plante'],
    f_phyllodie: ['f', 'Fleurs transformées en petites feuilles vertes'],
    /* Tiges */
    t_gonfle: ['t', 'Gonflements sur les rameaux ou les tiges'],
    t_sciure: ['t', 'Trous dans le tronc, le stipe ou les branches, avec de la sciure'],
    t_galeries: ['t', 'Galeries à l\'intérieur des tiges, tissu rougi ou pourri'],
    t_pousses: ['t', 'Jeunes pousses ou bouts de branches qui sèchent'],
    t_coeur_mort: ['t', 'Cœur mort : la feuille centrale sèche et s\'arrache facilement'],
    t_cerclees: ['t', 'Branches coupées net ou cerclées comme au couteau'],
    t_gomme: ['t', 'Écoulement de gomme sur le tronc, les branches ou les tiges'],
    t_chancres: ['t', 'Chancres : taches noires enfoncées sur les tiges ou les branches'],
    t_brun_interne: ['t', 'Intérieur de la tige, du tronc ou du stipe bruni quand on coupe'],
    t_croute_rose: ['t', 'Croûte rose sur l\'écorce des branches'],
    t_console: ['t', 'Champignon dur en forme de console au pied du tronc'],
    t_gui: ['t', 'Touffes d\'une autre plante qui pousse sur les branches (gui)'],
    t_cou_noir: ['t', 'Cou de la panicule noirci, la panicule casse'],
    t_encoche: ['t', 'Pas de latex sur une partie de l\'encoche de saignée'],
    t_encoche_noire: ['t', 'Bandes noires verticales sur l\'encoche de saignée'],
    t_fouet: ['t', 'Long fouet noir et poudreux qui sort du sommet de la tige'],
    t_eclatee: ['t', 'Jeunes plants fanés, tige gonflée ou éclatée au ras du sol'],
    t_verse: ['t', 'Plants qui tombent, se cassent ou se déracinent'],
    p_coeur_pourri: ['t', 'Cœur (flèche) qui pourrit, sent mauvais et s\'arrache facilement'],
    /* Fruits, fleurs, grains */
    fr_pourriture: ['fr', 'Tache brune qui s\'étend sur le fruit ou la cabosse, duvet blanc'],
    fr_piqures: ['fr', 'Taches noires ou piqûres sur les fruits, cabosses ou noix'],
    fr_etoiles: ['fr', 'Taches noires en étoile, fendillées et gommeuses sur les fruits'],
    fr_rouille: ['fr', 'Taches couleur rouille sur la peau des fruits'],
    fr_noix_brunes: ['fr', 'Noix avec plages brunes triangulaires sous le chapeau, déformées'],
    fr_trou_bout: ['fr', 'Petit trou au bout des cerises ou des baies, grains percés'],
    fr_chenille: ['fr', 'Fruits, capsules ou gousses troués, avec excréments ou chenille dedans'],
    fr_asticots: ['fr', 'Fruits qui pourrissent avec des asticots à l\'intérieur'],
    fr_rongeurs: ['fr', 'Fruits ou cabosses rongés, graines mangées'],
    fr_cherelles: ['fr', 'Jeunes fruits qui noircissent et sèchent sur l\'arbre, sans pourriture'],
    fr_cul_noir: ['fr', 'Tache noire et sèche au bout du fruit (cul noir)'],
    fr_enfoncees: ['fr', 'Taches rondes enfoncées sur les fruits'],
    fr_soleil: ['fr', 'Fruit brûlé ou jauni d\'un côté (coup de soleil)'],
    fr_ratatines: ['fr', 'Noix, fruits, gousses ou grains ratatinés, mal remplis'],
    fr_fibre: ['fr', 'Fibre ou graines tachées de jaune, capsules piquées'],
    fr_chute: ['fr', 'Chute des jeunes fruits, des noix ou des capsules'],
    fr_fleurs: ['fr', 'Fleurs qui noircissent ou sèchent et tombent'],
    fr_touffes: ['fr', 'Inflorescences en touffes compactes et déformées'],
    fr_panicule_vide: ['fr', 'Panicule ou épi blanc et vide'],
    fr_charbon: ['fr', 'Grains remplacés par une poudre noire (charbon)'],
    fr_balai: ['fr', 'Épi déformé en touffe de petites feuilles (« balai »)'],
    fr_spirale: ['fr', 'Épi avec des galeries en spirale, grains manquants'],
    fr_moisissures: ['fr', 'Grains, graines ou noix moisis (blanc, vert, rose ou noir)'],
    fr_oiseaux: ['fr', 'Grains mangés par les oiseaux'],
    fr_stock: ['fr', 'En stock : grains, graines ou noix percés, poudre, petits insectes'],
    fr_regime: ['fr', 'Régimes petits, doigts maigres'],
    /* Racines */
    r_galles: ['r', 'Boules ou nodules (galles) sur les racines'],
    r_pourries: ['r', 'Racines, tubercules ou bulbes pourris, mous, qui sentent mauvais'],
    r_noires: ['r', 'Racines noircies, courtes, peu nombreuses'],
    r_cordons: ['r', 'Filaments blancs collés sur les racines'],
    r_craquelures: ['r', 'Craquelures sèches et brunes sous la peau du tubercule'],
    r_galeries: ['r', 'Galeries creusées dans la souche (bulbe)'],
    r_galeries_tub: ['r', 'Galeries dans les tubercules, chair au goût amer'],
    r_fourchues: ['r', 'Racines fourchues ou déformées'],
    r_striga: ['r', 'Petite plante à fleurs roses ou rouges qui pousse au pied'],
    /* Plante entière */
    p_fane: ['p', 'La plante fane brusquement en journée, en restant verte'],
    p_filaments: ['p', 'Tige coupée posée dans un verre d\'eau : filaments laiteux qui sortent'],
    p_naine: ['p', 'Plants nains, rabougris'],
    p_meurt: ['p', 'L\'arbre ou la plante jaunit, perd ses feuilles et meurt'],
    p_tache: ['p', 'Plusieurs plants voisins malades, en tache qui s\'agrandit'],
    p_fonte: ['p', 'Jeunes plants qui pourrissent au collet et tombent (fonte des semis)'],
    p_collet: ['p', 'Collet pourri ou couvert de feutrage blanc, la plante s\'affaisse'],
    /* Contexte */
    c_pluies: ['c', 'Saison des pluies ou temps très humide'],
    c_seche: ['c', 'Saison sèche'],
    c_basfond: ['c', 'Bas-fond ou sol mal drainé, eau qui stagne'],
    c_floraison: ['c', 'En pleine floraison'],
    c_pepiniere: ['c', 'En pépinière ou jeunes plants']
  };

  PM.EPI = 'Produit homologué en Côte d\'Ivoire uniquement, à la dose de l\'étiquette, avec gants, masque et bottes ; respecter le délai avant récolte.';

  PM.GEN = [
    { n: 'Carence en azote', t: 'Carence / sol', s: [['f_vieilles_jaunes', 4], ['p_naine', 2]],
      conf: 'Le jaunissement est régulier et part des vieilles feuilles ; il disparaît après un apport d\'azote.',
      vite: ['Apporter de l\'azote : urée ou engrais composé en sol humide, ou fumier bien décomposé'],
      agro: ['Compost et fumier chaque année', 'Associer ou alterner avec une légumineuse (niébé, soja, arachide, mucuna)', 'Paillage pour garder l\'humidité'],
      chim: ['Urée ou NPK selon la fiche technique de la culture, fractionné en 2 apports'],
      prev: ['Faire analyser le sol tous les 3 à 4 ans', 'Ne pas brûler les résidus de récolte'] },
    { n: 'Carence en potassium', t: 'Carence / sol', s: [['f_bord_brule', 3], ['f_ovales', 1], ['fr_ratatines', 1], ['t_verse', 1]],
      conf: 'Le bord des vieilles feuilles brunit en premier ; fréquent sur sols sableux ou très lessivés.',
      vite: ['Apporter du potassium : chlorure ou sulfate de potasse, ou cendres de bois'],
      agro: ['Cendres de bois et compost', 'Restituer les résidus de récolte au champ (pailles, fanes, pelures, coques)'],
      chim: ['Engrais riche en potassium (KCl, NPK à forte teneur en K) selon la fiche technique'],
      prev: ['Analyse de sol', 'Fumure organique régulière'] },
    { n: 'Fonte des semis', t: 'Champignon', s: [['p_fonte', 5], ['c_pepiniere', 2], ['c_basfond', 1]],
      conf: 'En pépinière, les jeunes plants pourrissent au ras du sol et se couchent, par plaques.',
      vite: ['Réduire l\'arrosage et arracher les plants atteints avec leur terre'],
      agro: ['Substrat neuf ou solarisé (terre humide sous plastique transparent 4 à 6 semaines)', 'Semis moins dense, pépinière aérée et bien drainée', 'Arroser le matin seulement', 'Trichoderma (biofongicide) dans le substrat'],
      chim: ['Traitement des semences ou du substrat avec un fongicide homologué', PM.EPI],
      prev: ['Ne pas réutiliser le même sol de pépinière d\'une année sur l\'autre'] }
  ];

  /* Catégories (ordre d'affichage) */
  PM.CATS = [
    ['rente', 'Cultures de rente et d\'exportation'],
    ['vivrier', 'Cultures vivrières'],
    ['maraich', 'Maraîchage']
  ];
})(window.PM);
/* Cultures de rente et d'exportation : maladies et ravageurs majeurs, avec plan d'action. */
(function (PM) {
  var E = PM.EPI;
  function R(crop, list) { PM.C[crop] = list; PM.CAT[crop] = 'rente'; }

  /* ================= CACAO ================= */
  R('Cacao', [
    { n: 'Pourriture brune des cabosses', sci: 'Phytophthora megakarya et P. palmivora', t: 'Champignon', s: [['fr_pourriture', 5], ['c_pluies', 2]],
      conf: 'La tache brune part souvent du pédoncule ou de la pointe et couvre la cabosse en 10 à 15 jours ; duvet blanc par temps humide. Elle peut détruire plus de la moitié de la récolte en saison des pluies.',
      vite: ['Récolte sanitaire : enlever toutes les cabosses malades, y compris les momies sèches restées sur l\'arbre', 'Les enterrer à au moins 30 cm ou les sortir de la parcelle, jamais en tas au pied des arbres'],
      agro: ['Tailler pour aérer : supprimer gourmands et branches basses, garder un tronc dégagé jusqu\'à 1,5 m', 'Ombrage modéré (environ 15 à 20 arbres d\'ombrage par hectare), éclaircir s\'il est trop dense', 'Désherber et drainer les zones où l\'eau stagne', 'Récolter tous les 10 à 15 jours en saison des pluies, sans laisser de cabosses mûres', 'Écabosser au champ, loin des arbres, et enfouir les coques'],
      chim: ['Fongicide à base de cuivre (oxyde cuivreux, hydroxyde de cuivre) ou cuivre + métalaxyl, pulvérisé sur les cabosses en saison des pluies, toutes les 3 à 4 semaines', 'Commencer dès les premières pluies, avant l\'apparition des taches', E],
      prev: ['Récolte sanitaire chaque semaine pendant toute la saison des pluies', 'Densité de plantation recommandée, pas de surpeuplement'],
      plan: ['Semaine 1 : faire le tour de chaque arbre, enlever et enterrer toutes les cabosses malades et momifiées', 'Semaine 1 à 2 : taille d\'aération et désherbage du verger', 'Dès les premières pluies : premier traitement au cuivre sur les cabosses', 'Toutes les semaines : récolte sanitaire', 'Toutes les 3 à 4 semaines jusqu\'à la fin des pluies : renouveler le traitement', 'Fin de campagne : noter le pourcentage de cabosses perdues pour comparer l\'année suivante'] },
    { n: 'Swollen shoot (virus du gonflement des rameaux)', sci: 'CSSV, transmis par les cochenilles', t: 'Virus', s: [['t_gonfle', 5], ['f_nervures', 4], ['f_mosaique', 2], ['p_tache', 2], ['p_meurt', 1], ['f_cochenilles', 1]],
      conf: 'Gonflements sur les rameaux ou les racines, bandes rouges ou jaunes le long des nervures des jeunes feuilles, cabosses arrondies ; les arbres dépérissent en tache qui s\'agrandit. Seul un agent du Conseil du Café-Cacao ou de l\'ANADER peut confirmer.',
      vite: ['Signaler sans tarder au Conseil du Café-Cacao ou à l\'ANADER', 'Marquer les arbres suspects ; ne pas prélever de cabosses de semence, de greffons ni de boutures sur ces arbres'],
      agro: ['Arracher et détruire les arbres malades et les arbres voisins proches (rayon fixé par l\'agent)', 'Laisser le sol sans cacaoyer 3 mois au moins, puis replanter avec du matériel sain et tolérant fourni par les structures agréées', 'Créer une barrière de 10 m de cultures non hôtes (agrumes, palmier) autour des foyers', 'Diversifier les revenus pendant la replantation (vivriers, banane plantain intercalaire)'],
      chim: ['Aucun produit ne guérit le virus', 'Les insecticides contre les cochenilles ne suffisent pas et ne sont pas recommandés'],
      prev: ['Inspection de toutes les parcelles 2 fois par an', 'N\'utiliser que des plants issus de pépinières agréées', 'Ne pas planter de nouveaux cacaoyers à côté d\'un foyer connu'],
      plan: ['Jour 1 : marquer les arbres suspects et alerter le Conseil du Café-Cacao ou l\'ANADER', 'Visite de l\'agent : confirmation et délimitation du foyer', 'Dans le mois : arrachage des arbres malades et voisins, sous contrôle de l\'agent', 'Mois 1 à 3 : cultures vivrières sur la zone arrachée', 'Mois 3 et plus : replantation avec du matériel tolérant et une barrière de cultures non hôtes', 'Ensuite : inspection tous les 6 mois'] },
    { n: 'Mirides (capsides)', sci: 'Sahlbergella singularis, Distantiella theobroma', t: 'Insecte', s: [['fr_piqures', 4], ['t_pousses', 3], ['t_chancres', 2], ['c_seche', 1]],
      conf: 'Piqûres noires rondes sur cabosses et jeunes rameaux, rameaux qui se dessèchent : la cime prend un aspect brûlé (« poches de mirides »). Dégâts plus forts de juillet à janvier.',
      vite: ['Repérer les foyers (zones de cime brûlée) et les traiter en priorité'],
      agro: ['Maintenir un ombrage régulier et regarnir les trous de la canopée : les mirides aiment la lumière', 'Favoriser les fourmis prédatrices (Oecophylla, fourmis tisserandes)', 'Couper et brûler les rameaux morts', 'Extraits de neem en complément sur les petits foyers'],
      chim: ['Insecticide homologué par le Conseil du Café-Cacao, aux périodes de traitement recommandées (en général juillet-août-septembre, puis décembre-janvier)', 'Pulvérisation sur toute la parcelle, en particulier les troncs et les cabosses', E],
      prev: ['Ombrage et canopée continue', 'Inspection mensuelle des foyers'],
      plan: ['Juillet : premier passage d\'observation, repérage des foyers', 'Juillet à septembre : 2 traitements insecticides à environ 1 mois d\'intervalle', 'Décembre à janvier : 1 à 2 traitements selon les foyers', 'Toute l\'année : taille sanitaire et regarnissage de l\'ombrage'] },
    { n: 'Psylle du cacaoyer', sci: 'Tyora tessmanni', t: 'Insecte', s: [['f_crispees', 3], ['t_pousses', 3], ['c_pepiniere', 2]],
      conf: 'Jeunes pousses (flushs) déformées, brunies, qui sèchent ; petits insectes et sécrétions cireuses blanches sur les bourgeons. Surtout sur jeunes plantations.',
      vite: ['Couper et brûler les pousses très atteintes'],
      agro: ['Ombrage provisoire des jeunes plants (bananiers plantains)', 'Neem sur les jeunes plantations'],
      chim: ['Insecticide homologué seulement en pépinière ou jeune plantation fortement attaquée', E],
      prev: ['Plants vigoureux, bonne fumure'] },
    { n: 'Chenilles défoliatrices', sci: 'Anomis, Earias et autres', t: 'Insecte', s: [['f_trous', 4], ['c_pepiniere', 2]],
      conf: 'Jeunes feuilles mangées, surtout sur les jeunes cacaoyers.',
      vite: ['Ramasser les chenilles à la main'],
      agro: ['Bacillus thuringiensis (Bt) ou neem'],
      chim: ['Insecticide homologué si les jeunes plants sont menacés', E],
      prev: ['Surveillance des jeunes plantations'] },
    { n: 'Foreurs des tiges', sci: 'Eulophonotus myrmeleon et autres', t: 'Insecte', s: [['t_sciure', 5], ['t_pousses', 1]],
      conf: 'Trous ronds sur le tronc ou les branches, sciure et excréments au pied.',
      vite: ['Introduire un fil de fer dans la galerie pour tuer la larve'],
      agro: ['Couper et brûler les branches très attaquées', 'Boucher les trous avec de l\'argile'],
      chim: ['Injection d\'un insecticide homologué dans la galerie, puis boucher le trou', E],
      prev: ['Inspecter les troncs à chaque passage de récolte'] },
    { n: 'Plantes parasites (loranthus, « gui »)', sci: 'Tapinanthus et autres Loranthacées', t: 'Plante parasite', s: [['t_gui', 5], ['t_pousses', 1]],
      conf: 'Touffes de feuilles différentes fixées sur les branches ; la branche dépérit au-delà.',
      vite: ['Couper la branche 30 cm sous le point d\'attache du parasite'],
      agro: ['Passage d\'élimination 2 fois par an, avant la floraison du parasite', 'Nettoyer aussi les arbres d\'ombrage infestés'],
      chim: ['Pas de traitement chimique recommandé'],
      prev: ['Surveillance à chaque récolte'] },
    { n: 'Rongeurs et écureuils', sci: 'Rats, écureuils', t: 'Rongeurs', s: [['fr_rongeurs', 5]],
      conf: 'Cabosses trouées, fèves mangées, souvent en bordure de forêt.',
      vite: ['Récolter les cabosses dès qu\'elles sont mûres'],
      agro: ['Dégager les bordures de parcelle', 'Pièges'],
      chim: ['Appâts raticides seulement dans des boîtes fermées, hors de portée des enfants et des animaux'],
      prev: ['Récolte régulière'] },
    { n: 'Flétrissement physiologique des chérelles', sci: 'Régulation naturelle de l\'arbre', t: 'Physiologique', s: [['fr_cherelles', 5]],
      conf: 'Une partie des jeunes cabosses (chérelles) noircit et sèche sans pourriture : c\'est normal quand l\'arbre porte trop de fruits ou manque d\'eau et d\'engrais.',
      vite: ['Pas d\'action urgente'],
      agro: ['Fumure équilibrée', 'Paillage et ombrage en saison sèche'],
      chim: ['Aucun traitement'],
      prev: ['Bonne nutrition du verger'] }
  ]);

  /* ================= CAFÉ ================= */
  R('Café (Robusta et Arabica)', [
    { n: 'Scolyte des baies', sci: 'Hypothenemus hampei', t: 'Insecte', s: [['fr_trou_bout', 5], ['fr_ratatines', 2], ['fr_chute', 1]],
      conf: 'Petit trou rond au bout de la cerise ; en ouvrant, galerie et petit coléoptère noir dans le grain. Fait perdre poids et qualité.',
      vite: ['Ramasser et détruire (faire bouillir ou enterrer) les cerises tombées au sol et restées sur l\'arbre'],
      agro: ['Récolte complète en fin de campagne (« grappillage »), sans laisser de cerises', 'Pièges à alcool (mélange éthanol-méthanol 1 pour 1, type BROCAP), environ 16 à 20 pièges par hectare pendant l\'intercampagne', 'Champignon Beauveria bassiana (biopesticide) si disponible', 'Sécher rapidement les cerises récoltées'],
      chim: ['Insecticide homologué seulement si plus de 10 % des cerises sont percées, au moment où les scolytes entrent dans les cerises', E],
      prev: ['Taille de régénération pour faciliter une récolte complète'],
      plan: ['Fin de récolte : grappillage de toutes les cerises restantes', 'Intercampagne : pose des pièges, vidage et recharge toutes les 2 semaines', 'Formation des jeunes cerises : compter les cerises percées sur 100 cerises', 'Si plus de 10 % : traitement ciblé', 'Toute la campagne : séchage rapide et ramassage des cerises tombées'] },
    { n: 'Trachéomycose', sci: 'Fusarium xylarioides', t: 'Champignon', s: [['p_meurt', 4], ['t_brun_interne', 4], ['p_tache', 2]],
      conf: 'L\'arbre flétrit et meurt rapidement, les feuilles sèches restent accrochées ; sous l\'écorce, le bois présente des stries brun-bleu.',
      vite: ['Arracher et brûler sur place les arbres atteints, racines comprises'],
      agro: ['Désinfecter les outils (eau de Javel) entre deux arbres', 'Replanter avec des clones tolérants du CNRA', 'Ne pas déplacer de bois ou de terre d\'une parcelle malade'],
      chim: ['Pas de traitement curatif'],
      prev: ['Éviter de blesser le collet et les racines lors du désherbage'],
      plan: ['Jour 1 : marquer les arbres atteints', 'Semaine 1 : arrachage et brûlage sur place', 'Toute l\'année : désinfection des outils', 'Saison suivante : replantation avec clones tolérants'] },
    { n: 'Rouille orangée', sci: 'Hemileia vastatrix', t: 'Champignon', s: [['f_poudre_orange', 5], ['f_chute', 2], ['c_pluies', 1]],
      conf: 'Taches jaunes dessus, poudre orange dessous ; l\'Arabica (montagnes de l\'Ouest) est plus sensible que le Robusta.',
      vite: ['Enlever les feuilles très atteintes du bas'],
      agro: ['Taille d\'aération', 'Ombrage modéré', 'Fumure équilibrée : les arbres bien nourris résistent mieux'],
      chim: ['Fongicide à base de cuivre en début de saison des pluies, 2 à 3 passages à 3-4 semaines d\'intervalle si l\'attaque est forte', E],
      prev: ['Variétés et clones tolérants'] },
    { n: 'Cercosporiose du caféier', sci: 'Cercospora coffeicola', t: 'Champignon', s: [['f_oeil', 5], ['fr_piqures', 1]],
      conf: 'Taches rondes brunes à centre clair sur les feuilles et les cerises ; fréquente en pépinière trop exposée au soleil.',
      vite: ['Ombrer la pépinière'],
      agro: ['Fumure équilibrée', 'Ombrage des jeunes plants'],
      chim: ['Cuivre si l\'attaque est forte en pépinière', E],
      prev: ['Pépinière ombragée à 50 %'] },
    { n: 'Foreur de la tige du caféier', sci: 'Bixadus sierricola', t: 'Insecte', s: [['t_sciure', 5], ['p_meurt', 2]],
      conf: 'Trou au bas du tronc avec sciure ; galerie descendante, l\'arbre jaunit et peut casser.',
      vite: ['Tuer la larve avec un fil de fer introduit dans la galerie'],
      agro: ['Badigeonner le bas du tronc d\'un mélange chaux-argile', 'Arracher et brûler les arbres morts'],
      chim: ['Injection d\'un insecticide homologué dans la galerie', E],
      prev: ['Inspection du bas des troncs 2 fois par an'] },
    { n: 'Scolyte des rameaux', sci: 'Xylosandrus compactus', t: 'Insecte', s: [['t_pousses', 4], ['t_sciure', 1]],
      conf: 'Rameaux qui sèchent, avec un minuscule trou à l\'aisselle d\'une feuille.',
      vite: ['Couper les rameaux atteints sous le trou et les brûler'],
      agro: ['Passages réguliers de taille sanitaire'],
      chim: ['Rarement nécessaire'],
      prev: ['Arbres bien nourris et pas stressés par la sécheresse'] },
    { n: 'Punaise du caféier (Arabica)', sci: 'Antestiopsis', t: 'Insecte', s: [['fr_chute', 3], ['fr_piqures', 2], ['t_pousses', 1]],
      conf: 'Sur Arabica : chute des jeunes cerises, grains noircis, rameaux en balai.',
      vite: ['Secouer les arbres sur une bâche le matin pour compter les punaises'],
      agro: ['Taille d\'aération', 'Neem'],
      chim: ['Insecticide homologué si plus de 2 punaises par arbre', E],
      prev: ['Ombrage modéré'] }
  ]);

  /* ================= ANACARDE ================= */
  R('Anacarde', [
    { n: 'Anthracnose', sci: 'Colletotrichum gloeosporioides', t: 'Champignon', s: [['f_taches', 3], ['fr_fleurs', 3], ['fr_piqures', 2], ['t_pousses', 1], ['c_pluies', 2]],
      conf: 'Taches noires sur jeunes feuilles, fleurs, pommes et noix ; fréquente quand la floraison coïncide avec des pluies ou de fortes rosées.',
      vite: ['Enlever et brûler les rameaux et inflorescences très atteints'],
      agro: ['Taille d\'entretien après la récolte : supprimer bois mort et branches qui se croisent', 'Écartement suffisant (10 m x 10 m en plein champ) et éclaircie des vergers trop denses', 'Ramasser et brûler les débris au sol'],
      chim: ['Fongicide à base de cuivre ou de mancozèbe au début de la floraison, puis 2 à 3 semaines après', E],
      prev: ['Plants greffés de clones tolérants'],
      plan: ['Juin-juillet (après récolte) : taille sanitaire et éclaircie', 'Novembre-décembre : nettoyage des débris, pare-feu', 'Début floraison : 1er traitement fongicide', '2 à 3 semaines après : 2e traitement si temps humide'] },
    { n: 'Oïdium de l\'anacardier', sci: 'Oidium anacardii', t: 'Champignon', s: [['f_poudre_blanche', 5], ['fr_fleurs', 3], ['c_floraison', 2]],
      conf: 'Poudre blanche sur les inflorescences et les jeunes noix, qui sèchent et tombent ; peut faire perdre une grande partie de la récolte.',
      vite: ['Traiter dès les premières taches au début de la floraison'],
      agro: ['Taille d\'aération', 'Éliminer les rameaux secs porteurs de la maladie'],
      chim: ['Soufre en poudrage ou mouillable : 1er passage au début de la floraison, 2e et 3e passages 2 à 3 semaines après', E],
      prev: ['Surveiller les arbres à chaque floraison'],
      plan: ['Apparition des premières panicules : inspection de 10 arbres par hectare', 'Premières taches : poudrage de soufre', 'Puis toutes les 2 à 3 semaines pendant la floraison (2 à 3 passages au total)'] },
    { n: 'Punaises et mirides', sci: 'Helopeltis, Anoplocnemis, Pseudotheraptus', t: 'Insecte', s: [['fr_piqures', 4], ['fr_ratatines', 3], ['t_pousses', 3]],
      conf: 'Taches noires de piqûres sur pommes et noix, noix ratatinées ou tombées, jeunes pousses qui sèchent.',
      vite: ['Repérer les arbres les plus attaqués'],
      agro: ['Favoriser les fourmis tisserandes (Oecophylla) : ne pas les détruire, relier les arbres par des lianes', 'Extraits de neem à la floraison'],
      chim: ['Insecticide homologué à la floraison et à la nouaison si les dégâts sont importants', E],
      prev: ['Garder des arbres-abris pour les fourmis tisserandes'] },
    { n: 'Thrips', sci: 'Selenothrips rubrocinctus et autres', t: 'Insecte', s: [['f_argentees', 5], ['fr_rouille', 2], ['c_seche', 1]],
      conf: 'Feuilles argentées ou bronzées avec petits points noirs ; pommes et noix liégeuses.',
      vite: ['Surveiller le dessous des feuilles'],
      agro: ['Neem', 'Préserver les prédateurs naturels'],
      chim: ['Insecticide homologué si l\'attaque est forte à la floraison', E],
      prev: ['Bonne nutrition des arbres'] },
    { n: 'Mineuse des feuilles', sci: 'Acrocercops syngramma', t: 'Insecte', s: [['f_mines', 5], ['f_crispees', 1]],
      conf: 'Galeries claires puis taches brunes boursouflées sur les jeunes feuilles rougeâtres.',
      vite: ['Pas d\'urgence sur arbres adultes'],
      agro: ['Neem sur jeunes plantations'],
      chim: ['Insecticide homologué seulement sur jeunes plants très attaqués', E],
      prev: ['Fumure équilibrée'] },
    { n: 'Coupeur de branches et foreurs', sci: 'Analeptes trifasciata, Apate et autres', t: 'Insecte', s: [['t_cerclees', 5], ['t_sciure', 4]],
      conf: 'Branches coupées net comme au couteau, ou trous avec sciure dans le tronc.',
      vite: ['Ramasser et brûler les branches coupées : elles contiennent les œufs et les larves'],
      agro: ['Tuer la larve dans la galerie avec un fil de fer'],
      chim: ['Injection d\'insecticide homologué dans la galerie en cas de forte attaque', E],
      prev: ['Nettoyer la parcelle des bois morts'] },
    { n: 'Gommose et dépérissement', sci: 'Lasiodiplodia theobromae', t: 'Champignon', s: [['t_gomme', 5], ['t_pousses', 2], ['p_meurt', 1]],
      conf: 'Écoulement de gomme sur le tronc et les branches, écorce qui craque, branches qui meurent.',
      vite: ['Gratter la zone malade jusqu\'au bois sain'],
      agro: ['Badigeonner la plaie avec une bouillie de cuivre ou de chaux', 'Éviter les blessures (machettes, feux)'],
      chim: ['Fongicide cuprique sur les plaies', E],
      prev: ['Pare-feu autour du verger chaque saison sèche'] },
    { n: 'Noix mal séchées ou moisies', sci: 'Moisissures de stockage', t: 'Qualité / stockage', s: [['fr_moisissures', 5], ['fr_stock', 1]],
      conf: 'Noix moisies, amandes tachées : le rendement à l\'usinage (KOR) baisse et les acheteurs déclassent.',
      vite: ['Trier et resécher au soleil sur bâche, pas à même le sol'],
      agro: ['Ramasser les noix tous les 2 à 3 jours', 'Séparer la noix de la pomme le jour même', 'Sécher 2 à 3 jours jusqu\'à ce que la noix sonne sec', 'Stocker en sacs de jute sur palettes, local aéré'],
      chim: ['Aucun'],
      prev: ['Magasin propre, sec et aéré'] }
  ]);

  /* ================= HÉVÉA ================= */
  R('Hévéa', [
    { n: 'Pourriture blanche des racines', sci: 'Rigidoporus microporus', t: 'Champignon', s: [['r_cordons', 5], ['p_meurt', 3], ['f_vieilles_jaunes', 1], ['p_tache', 3]],
      conf: 'Dégager le collet : filaments blancs collés sur les racines ; feuillage jaune, puis l\'arbre meurt et les voisins suivent.',
      vite: ['Abattre et dessoucher les arbres morts, sortir et brûler les racines'],
      agro: ['Creuser une tranchée d\'isolement d\'environ 60 cm de profondeur autour du foyer', 'Dégager et inspecter le collet des arbres voisins tous les 6 mois', 'Bien dessoucher avant toute replantation', 'Plante de couverture (Pueraria) pour accélérer la décomposition des souches'],
      chim: ['Fongicide homologué de la famille des triazoles, appliqué au collet des arbres voisins sains ou peu atteints', E],
      prev: ['Dessouchage soigneux à la création de la plantation'],
      plan: ['Semaine 1 : marquer les arbres morts et les 2 rangées de voisins', 'Semaine 2 : abattage, dessouchage et brûlage', 'Semaine 2 à 4 : tranchée d\'isolement et traitement du collet des voisins', 'Tous les 6 mois : inspection du collet des arbres autour du foyer'] },
    { n: 'Encoche sèche', sci: 'Trouble physiologique de la saignée', t: 'Physiologique', s: [['t_encoche', 5]],
      conf: 'Une partie de l\'encoche ne donne plus de latex ; l\'écorce peut brunir.',
      vite: ['Arrêter la saignée de l\'arbre atteint pendant plusieurs mois'],
      agro: ['Réduire la fréquence de saignée et la stimulation', 'Bonne fumure de l\'arbre'],
      chim: ['Réduire ou arrêter la stimulation à l\'éthéphon'],
      prev: ['Respecter le système de saignée recommandé pour le clone'] },
    { n: 'Pourriture de l\'encoche', sci: 'Phytophthora', t: 'Champignon', s: [['t_encoche_noire', 5], ['c_pluies', 2]],
      conf: 'Bandes noires verticales sur l\'écorce fraîchement saignée, en saison des pluies.',
      vite: ['Arrêter de saigner sous la pluie'],
      agro: ['Nettoyer le couteau', 'Désherber et aérer les rangées'],
      chim: ['Fongicide homologué badigeonné sur l\'encoche en saison des pluies', E],
      prev: ['Abris de pluie (chapeaux) au-dessus de l\'encoche'] },
    { n: 'Oïdium de l\'hévéa', sci: 'Erysiphe (Oidium heveae)', t: 'Champignon', s: [['f_poudre_blanche', 4], ['f_crispees', 3], ['f_chute', 3]],
      conf: 'Lors du renouvellement des feuilles, les jeunes feuilles se crispent, se couvrent de poudre blanche et tombent.',
      vite: ['Traiter pendant le renouvellement du feuillage'],
      agro: ['Engrais azoté au moment de la reprise des feuilles pour accélérer la refoliation'],
      chim: ['Soufre en poudrage pendant la refoliation', E],
      prev: ['Clones moins sensibles'] },
    { n: 'Maladie des taches foliaires (Corynespora)', sci: 'Corynespora cassiicola', t: 'Champignon', s: [['f_arete', 5], ['f_chute', 3]],
      conf: 'Taches brunes avec nervures noircies en « arête de poisson », chute des feuilles hors saison.',
      vite: ['Signaler à l\'encadrement : la maladie peut toucher toute une plantation'],
      agro: ['Planter des clones résistants recommandés pour la zone'],
      chim: ['Fongicide homologué sur conseil de l\'encadrement', E],
      prev: ['Choix du clone adapté'] },
    { n: 'Maladie rose', sci: 'Erythricium salmonicolor', t: 'Champignon', s: [['t_croute_rose', 5], ['t_pousses', 2], ['c_pluies', 1]],
      conf: 'Croûte rose sur les branches, puis les branches meurent ; surtout sur jeunes arbres en saison des pluies.',
      vite: ['Couper les branches mortes'],
      agro: ['Gratter et badigeonner les zones atteintes avec une bouillie de cuivre'],
      chim: ['Fongicide cuprique sur les branches atteintes', E],
      prev: ['Inspection des jeunes arbres en saison des pluies'] }
  ]);

  /* ================= PALMIER À HUILE ================= */
  R('Palmier à huile', [
    { n: 'Fusariose du palmier', sci: 'Fusarium oxysporum f. sp. elaeidis', t: 'Champignon', s: [['f_palmes_seches', 5], ['t_brun_interne', 4], ['p_meurt', 2]],
      conf: 'Palmes basses qui jaunissent, sèchent et se cassent ; nouvelles palmes courtes ; vaisseaux bruns dans le pétiole coupé. Maladie grave en Côte d\'Ivoire.',
      vite: ['Abattre et détruire les palmiers morts'],
      agro: ['Replanter avec du matériel tolérant à la fusariose (semences sélectionnées du CNRA)', 'Ne pas replanter sur une ancienne palmeraie très atteinte sans jachère', 'Fumure potassique suffisante'],
      chim: ['Pas de traitement curatif'],
      prev: ['N\'utiliser que des semences et plants certifiés'],
      plan: ['Recensement des palmiers malades', 'Abattage des palmiers morts', 'Correction de la fumure (potassium)', 'Replantation progressive avec matériel tolérant'] },
    { n: 'Oryctes (scarabée rhinocéros)', sci: 'Oryctes', t: 'Insecte', s: [['f_palmes_v', 5], ['t_sciure', 2]],
      conf: 'Palmes coupées en V ou en éventail, trou à la base des jeunes palmes. Les larves vivent dans les stipes et troncs pourris.',
      vite: ['Retirer le scarabée de sa galerie avec un crochet métallique'],
      agro: ['Détruire les gîtes : stipes abattus, tas de déchets, fumier à proximité', 'Plante de couverture sur les vieux troncs à la replantation', 'Pièges à phéromone (environ 1 piège pour 2 hectares)'],
      chim: ['Insecticide homologué à l\'aisselle des jeunes palmes en cas de forte attaque', E],
      prev: ['Hygiène de la plantation'] },
    { n: 'Charançon du palmier', sci: 'Rhynchophorus phoenicis', t: 'Insecte', s: [['p_coeur_pourri', 4], ['t_sciure', 3], ['p_meurt', 2]],
      conf: 'Le cœur pourrit, odeur forte, larves blanches dans le stipe ; souvent après une blessure ou une attaque d\'Oryctes.',
      vite: ['Abattre et détruire le palmier atteint'],
      agro: ['Pièges à phéromone avec morceaux de stipe ou de canne', 'Éviter les blessures au stipe'],
      chim: ['Insecticide homologué sur les blessures', E],
      prev: ['Lutter contre les Oryctes'] },
    { n: 'Hispine du palmier', sci: 'Coelaenomenodera lameensis', t: 'Insecte', s: [['f_folioles_grises', 5], ['f_mines', 3]],
      conf: 'Folioles grisâtres desséchées, criblées de mines ; la palmeraie paraît grillée. Très présent en Côte d\'Ivoire.',
      vite: ['Faire compter les larves et adultes par l\'encadrement (seuil d\'intervention)'],
      agro: ['Surveillance régulière', 'Préserver les ennemis naturels'],
      chim: ['Traitement insecticide homologué ciblé, sur décision de l\'encadrement technique', E],
      prev: ['Surveillance mensuelle'] },
    { n: 'Carence en magnésium ou potassium', sci: 'Nutrition', t: 'Carence / sol', s: [['f_orangees', 5], ['f_bord_brule', 1]],
      conf: 'Palmes basses jaune-orangé, surtout du côté exposé au soleil (magnésium) ; taches orange ou bords desséchés (potassium).',
      vite: ['Faire une analyse foliaire'],
      agro: ['Restituer les rafles et palmes coupées au pied', 'Fumier ou compost'],
      chim: ['Kiésérite (magnésium) et chlorure de potassium selon l\'analyse foliaire'],
      prev: ['Analyse foliaire tous les 2 ans'] },
    { n: 'Pourriture basale du stipe', sci: 'Ganoderma', t: 'Champignon', s: [['t_console', 5], ['p_meurt', 2], ['f_palmes_seches', 1]],
      conf: 'Champignon dur en forme de console au pied du stipe, palmier qui dépérit et casse.',
      vite: ['Abattre, découper et détruire le palmier, y compris la base du stipe'],
      agro: ['Éliminer les vieux stipes lors de la replantation'],
      chim: ['Pas de traitement efficace'],
      prev: ['Hygiène à la replantation'] },
    { n: 'Maladies de pépinière (blast, taches)', sci: 'Pythium, Rhizoctonia, Cercospora', t: 'Champignon', s: [['c_pepiniere', 3], ['f_taches', 2], ['r_pourries', 2], ['f_vieilles_jaunes', 1]],
      conf: 'En pépinière : jeunes plants qui jaunissent et sèchent, racines pourries, ou taches brunes sur les feuilles.',
      vite: ['Isoler et détruire les plants atteints'],
      agro: ['Ombrage léger et arrosage régulier en saison sèche', 'Espacer les sacs', 'Substrat neuf et bien drainé'],
      chim: ['Fongicide homologué en pépinière si nécessaire', E],
      prev: ['Pépinière à l\'abri du vent sec (harmattan)'] },
    { n: 'Rats sur régimes', sci: 'Rongeurs', t: 'Rongeurs', s: [['fr_rongeurs', 5]],
      conf: 'Fruits rongés sur les régimes.',
      vite: ['Récolter à maturité'],
      agro: ['Nettoyer les ronds et les interlignes', 'Favoriser les rapaces (perchoirs)'],
      chim: ['Appâts en boîtes fermées seulement'],
      prev: ['Entretien régulier'] }
  ]);

  /* ================= COTON ================= */
  R('Coton', [
    { n: 'Chenilles de la capsule', sci: 'Helicoverpa armigera, Diparopsis, Earias', t: 'Insecte', s: [['fr_chenille', 5], ['fr_chute', 3], ['fr_fleurs', 1]],
      conf: 'Boutons floraux, fleurs et capsules percés, chute des organes ; chenilles dans les capsules.',
      vite: ['Compter les chenilles sur 25 plants par parcelle (seuil fixé par l\'encadrement)'],
      agro: ['Lutte étagée ciblée : traiter seulement quand le seuil est dépassé', 'Bacillus thuringiensis (Bt) ou neem sur les jeunes larves', 'Arracher et détruire les cotonniers après la récolte'],
      chim: ['Programme insecticide homologué de la société cotonnière, en alternant les familles chimiques', E],
      prev: ['Semis groupé à la date recommandée', 'Destruction des résidus'],
      plan: ['À 30 jours après la levée : début des observations hebdomadaires', 'Chaque semaine : comptage sur 25 plants', 'Si seuil dépassé : traitement selon le programme de la société cotonnière', 'Après récolte : arrachage et destruction des tiges'] },
    { n: 'Pucerons et aleurodes', sci: 'Aphis gossypii, Bemisia tabaci', t: 'Insecte', s: [['f_pucerons', 4], ['f_aleurodes', 3], ['f_miellat', 3], ['f_crispees', 2]],
      conf: 'Feuilles recroquevillées et collantes, fumagine ; en fin de cycle, le coton devient collant et se vend mal.',
      vite: ['Contrôler le dessous des feuilles'],
      agro: ['Préserver les coccinelles et autres prédateurs', 'Neem'],
      chim: ['Aphicide homologué si l\'attaque est forte, surtout en fin de cycle', E],
      prev: ['Éviter l\'excès d\'azote'] },
    { n: 'Jassides', sci: 'Jacobiella facialis', t: 'Insecte', s: [['f_bord_brule', 4], ['f_crispees', 2]],
      conf: 'Bord des feuilles rougi puis brûlé, feuilles qui se recourbent ; petits insectes verts qui marchent de côté.',
      vite: ['Vérifier le dessous des feuilles'],
      agro: ['Variétés à feuilles poilues'],
      chim: ['Insecticide homologué selon le programme', E],
      prev: ['Semis à la date recommandée'] },
    { n: 'Acariens (tarsonèmes)', sci: 'Polyphagotarsonemus latus', t: 'Acarien', s: [['f_crispees', 4], ['f_argentees', 2]],
      conf: 'Jeunes feuilles déformées en cuillère, brillantes et bronzées en dessous.',
      vite: ['Repérer les foyers'],
      agro: ['Soufre mouillable'],
      chim: ['Acaricide homologué si nécessaire', E],
      prev: ['Destruction des repousses'] },
    { n: 'Punaises du cotonnier', sci: 'Dysdercus', t: 'Insecte', s: [['fr_fibre', 5]],
      conf: 'Capsules piquées, fibre tachée de jaune, graines vides ; punaises rouges et noires.',
      vite: ['Récolter rapidement les capsules ouvertes'],
      agro: ['Éliminer les plantes hôtes autour (kapokier, baobab, gombo sauvage)'],
      chim: ['Insecticide homologué en fin de cycle si nécessaire', E],
      prev: ['Récolte rapide'] },
    { n: 'Bactériose du cotonnier', sci: 'Xanthomonas citri pv. malvacearum', t: 'Bactérie', s: [['f_angulaires', 5], ['t_chancres', 2], ['c_pluies', 1]],
      conf: 'Taches anguleuses d\'aspect mouillé sur les feuilles, nervures noircies, tiges noircies (« bras noir »).',
      vite: ['Pas de traitement au champ'],
      agro: ['Semences délintées et traitées', 'Variétés résistantes', 'Rotation'],
      chim: ['Traitement des semences homologué', E],
      prev: ['Destruction des résidus'] }
  ]);

  /* ================= COCOTIER ================= */
  R('Cocotier', [
    { n: 'Jaunissement mortel du cocotier', sci: 'Phytoplasme (CILY, région de Grand-Lahou)', t: 'Phytoplasme', s: [['fr_chute', 3], ['f_jaunit_progressif', 5], ['fr_fleurs', 2], ['p_meurt', 2], ['p_tache', 2]],
      conf: 'Chute des noix immatures, inflorescences qui noircissent, puis jaunissement des palmes du bas vers le haut ; le cocotier meurt en quelques mois. Grave dans le Sud, notamment autour de Grand-Lahou.',
      vite: ['Signaler au CNRA ou à l\'ANADER', 'Ne pas déplacer de noix ni de plants depuis une zone atteinte'],
      agro: ['Abattre et détruire rapidement les cocotiers malades', 'Replanter avec les variétés tolérantes recommandées par le CNRA', 'Diversifier les cultures pendant la replantation'],
      chim: ['Pas de traitement pratique pour les producteurs'],
      prev: ['Plants certifiés uniquement'],
      plan: ['Jour 1 : signalement', 'Visite de l\'agent : confirmation', 'Abattage rapide des cocotiers atteints', 'Replantation avec matériel tolérant'] },
    { n: 'Pourriture du cœur et chute des noix', sci: 'Phytophthora katsurae', t: 'Champignon', s: [['p_coeur_pourri', 5], ['fr_chute', 3], ['c_pluies', 2]],
      conf: 'La flèche pourrit et s\'arrache, odeur, chute des noix immatures ; surtout sur les hybrides sensibles.',
      vite: ['Abattre les cocotiers dont le cœur est pourri'],
      agro: ['Variétés tolérantes', 'Nettoyer les couronnes'],
      chim: ['Fongicide homologué en injection au stipe selon l\'encadrement', E],
      prev: ['Surveillance en saison des pluies'] },
    { n: 'Oryctes (scarabée rhinocéros)', sci: 'Oryctes', t: 'Insecte', s: [['f_palmes_v', 5], ['t_sciure', 2]],
      conf: 'Palmes coupées en V ou en éventail, trous à la base des jeunes palmes.',
      vite: ['Retirer l\'adulte de sa galerie avec un crochet'],
      agro: ['Détruire les gîtes (troncs pourris, tas de bourre)', 'Pièges à phéromone'],
      chim: ['Insecticide homologué à l\'aisselle des palmes si forte attaque', E],
      prev: ['Hygiène de la plantation'] },
    { n: 'Charançon du palmier', sci: 'Rhynchophorus phoenicis', t: 'Insecte', s: [['p_coeur_pourri', 3], ['t_sciure', 3], ['p_meurt', 2]],
      conf: 'Larves dans le stipe, cœur détruit, odeur.',
      vite: ['Abattre et détruire'],
      agro: ['Pièges à phéromone', 'Éviter les blessures'],
      chim: ['Traitement des blessures', E],
      prev: ['Lutter contre les Oryctes'] },
    { n: 'Acarien des noix', sci: 'Aceria guerreronis', t: 'Acarien', s: [['fr_noix_brunes', 5], ['fr_chute', 1]],
      conf: 'Plages brunes triangulaires sous le chapeau des noix, noix déformées et plus petites.',
      vite: ['Ramasser et détruire les noix tombées'],
      agro: ['Fumure équilibrée', 'Neem sur les régimes jeunes'],
      chim: ['Acaricide homologué sur les régimes si nécessaire', E],
      prev: ['Hygiène des couronnes'] }
  ]);

  /* ================= BANANE DESSERT ================= */
  R('Banane dessert', [
    { n: 'Cercosporiose noire', sci: 'Pseudocercospora fijiensis', t: 'Champignon', s: [['f_stries_noires', 5], ['c_pluies', 2], ['fr_regime', 1]],
      conf: 'Petites stries brunes qui deviennent de grandes taches noires ; les feuilles sèchent avant la récolte et les fruits mûrissent trop tôt.',
      vite: ['Effeuillage sanitaire : couper les feuilles ou parties de feuilles nécrosées'],
      agro: ['Effeuillage toutes les 2 semaines en saison des pluies', 'Drainage et densité adaptée', 'Fumure équilibrée'],
      chim: ['Programme fongicide homologué (en alternant les familles), sur avertissement agricole', E],
      prev: ['Surveillance hebdomadaire de l\'état des feuilles'],
      plan: ['Chaque semaine : noter l\'état des feuilles sur 10 plants', 'Toutes les 2 semaines : effeuillage sanitaire', 'Selon l\'avertissement : traitement fongicide en alternant les familles'] },
    { n: 'Charançon du bananier', sci: 'Cosmopolites sordidus', t: 'Insecte', s: [['r_galeries', 5], ['t_verse', 3], ['fr_regime', 2]],
      conf: 'Galeries noires dans la souche ; plants qui versent, petits régimes.',
      vite: ['Pièges en pseudo-tronc posés au sol, relevés chaque semaine'],
      agro: ['Vitroplants ou rejets parés', 'Pièges à phéromone (environ 4 par hectare)', 'Détruire les souches après récolte', 'Beauveria bassiana'],
      chim: ['Insecticide homologué au pied si forte attaque', E],
      prev: ['Rotation ou jachère avant replantation'] },
    { n: 'Nématodes', sci: 'Radopholus similis et autres', t: 'Nématode', s: [['r_noires', 5], ['t_verse', 4], ['fr_regime', 1]],
      conf: 'Racines noircies et peu nombreuses ; plants qui se déracinent avec leur régime.',
      vite: ['Haubaner les plants porteurs de régime'],
      agro: ['Vitroplants sains', 'Jachère ou culture assainissante avant replantation', 'Matière organique'],
      chim: ['Nématicide homologué seulement sur avis technique', E],
      prev: ['Ne pas déplacer de rejets infestés'] },
    { n: 'Thrips de la rouille', sci: 'Chaetanaphothrips', t: 'Insecte', s: [['fr_rouille', 5]],
      conf: 'Taches couleur rouille sur la peau des fruits : déclassement à l\'export.',
      vite: ['Gainer les régimes'],
      agro: ['Gaines plastiques posées tôt', 'Désherbage'],
      chim: ['Gaines traitées homologuées', E],
      prev: ['Gainage systématique'] },
    { n: 'Cochenilles et fourmis', sci: 'Dysmicoccus et autres', t: 'Insecte', s: [['f_cochenilles', 4], ['f_miellat', 2]],
      conf: 'Amas blancs sur les fruits et le pseudo-tronc, souvent avec des fourmis.',
      vite: ['Brosser les foyers'],
      agro: ['Contrôler les fourmis', 'Gainage'],
      chim: ['Insecticide homologué si besoin', E],
      prev: ['Désherbage'] },
    { n: 'Fusariose (maladie de Panama)', sci: 'Fusarium oxysporum f. sp. cubense', t: 'Champignon', s: [['t_brun_interne', 5], ['f_vieilles_jaunes', 2], ['p_meurt', 2]],
      conf: 'Jaunissement des vieilles feuilles, vaisseaux brun-rouge dans le pseudo-tronc. La race tropicale 4, très dangereuse, n\'est pas signalée en Côte d\'Ivoire : tout cas suspect doit être signalé.',
      vite: ['Isoler la touffe et signaler à l\'encadrement'],
      agro: ['Désinfection des outils, bottes et véhicules', 'Ne pas importer de plants non contrôlés'],
      chim: ['Pas de traitement'],
      prev: ['Vitroplants certifiés'] }
  ]);

  /* ================= ANANAS ================= */
  R('Ananas', [
    { n: 'Wilt de l\'ananas', sci: 'Virus transmis par les cochenilles (PMWaV)', t: 'Virus', s: [['f_rougies', 5], ['f_cochenilles', 3], ['p_tache', 2]],
      conf: 'Feuilles qui rougissent, bords enroulés vers le bas, plants qui flétrissent en tache ; cochenilles à la base des feuilles, avec des fourmis.',
      vite: ['Arracher et détruire les plants malades'],
      agro: ['Rejets sains, trempés avant plantation', 'Lutte contre les fourmis qui protègent les cochenilles', 'Détruire les résidus après récolte'],
      chim: ['Traitement insecticide homologué des rejets et lutte contre les fourmis', E],
      prev: ['Parcelle sans résidus d\'ananas'],
      plan: ['Avant plantation : tri et trempage des rejets', 'Mois 1 à 3 : surveillance des fourmis et des cochenilles', 'Premiers plants rouges : arrachage', 'Fin de cycle : destruction des résidus'] },
    { n: 'Pourriture du cœur et des racines', sci: 'Phytophthora', t: 'Champignon', s: [['p_coeur_pourri', 5], ['r_pourries', 3], ['c_basfond', 2], ['c_pluies', 1]],
      conf: 'Les feuilles du centre s\'arrachent facilement, base pourrie qui sent mauvais ; sol mal drainé.',
      vite: ['Arracher les plants atteints'],
      agro: ['Plantation sur billons', 'Drainage', 'Rejets sains'],
      chim: ['Fongicide homologué en trempage des rejets', E],
      prev: ['Éviter les sols lourds'] },
    { n: 'Symphyles et nématodes', sci: 'Hanseniella, Pratylenchus, Meloidogyne', t: 'Ravageur du sol', s: [['r_noires', 4], ['p_naine', 3], ['r_galles', 2]],
      conf: 'Racines courtes et abîmées, plants chétifs et rougeâtres.',
      vite: ['Examiner les racines'],
      agro: ['Rotation ou jachère', 'Matière organique'],
      chim: ['Traitement du sol homologué sur avis technique', E],
      prev: ['Rotation'] },
    { n: 'Pourriture noire des fruits', sci: 'Thielaviopsis paradoxa', t: 'Champignon', s: [['fr_pourriture', 4], ['fr_moisissures', 2]],
      conf: 'Fruits ou pédoncules qui noircissent et pourrissent après la récolte.',
      vite: ['Trier les fruits'],
      agro: ['Récolter sans blesser', 'Couper le pédoncule proprement'],
      chim: ['Traitement post-récolte homologué', E],
      prev: ['Transport rapide'] },
    { n: 'Coup de soleil des fruits', sci: 'Brûlure solaire', t: 'Physiologique', s: [['fr_soleil', 5], ['c_seche', 1]],
      conf: 'Fruit jauni ou brûlé d\'un côté.',
      vite: ['Couvrir les fruits'],
      agro: ['Ombrer les fruits avec de la paille ou en liant les feuilles'],
      chim: ['Aucun'],
      prev: ['Protection des fruits en saison sèche'] }
  ]);

  /* ================= MANGUE ================= */
  R('Mangue', [
    { n: 'Mouches des fruits', sci: 'Bactrocera dorsalis, Ceratitis', t: 'Insecte', s: [['fr_asticots', 5], ['fr_chute', 2]],
      conf: 'Fruits piqués qui pourrissent avec des asticots : principale cause de refus à l\'exportation.',
      vite: ['Ramasser chaque semaine les fruits tombés et les détruire (sac plastique fermé au soleil ou enfouissement profond)'],
      agro: ['Piégeage des mâles (méthyl eugénol), environ 2 à 4 pièges par hectare dès la nouaison', 'Appât protéique biologique en taches sur le feuillage', 'Fourmis tisserandes (Oecophylla)', 'Récolter au bon stade'],
      chim: ['Appât insecticide homologué (type GF-120) en taches, sans traiter les fruits', E],
      prev: ['Lutte collective avec les vergers voisins'],
      plan: ['Nouaison : pose des pièges', 'Chaque semaine : comptage des mouches et ramassage des fruits tombés', 'Dès que les captures augmentent : appât en taches toutes les semaines', 'Récolte : tri sévère'] },
    { n: 'Anthracnose', sci: 'Colletotrichum gloeosporioides', t: 'Champignon', s: [['fr_fleurs', 3], ['f_taches', 2], ['fr_piqures', 3], ['c_pluies', 2]],
      conf: 'Taches noires sur fleurs, jeunes feuilles et fruits ; taches qui s\'agrandissent après la récolte.',
      vite: ['Enlever les panicules et rameaux malades'],
      agro: ['Taille d\'aération après récolte', 'Bain d\'eau chaude des fruits (environ 52 °C pendant 5 minutes) avant vente ou export'],
      chim: ['Fongicide homologué (cuivre ou autre) de la floraison à la nouaison', E],
      prev: ['Verger aéré'] },
    { n: 'Oïdium du manguier', sci: 'Oidium mangiferae', t: 'Champignon', s: [['f_poudre_blanche', 5], ['fr_fleurs', 2], ['c_floraison', 2]],
      conf: 'Poudre blanche sur les inflorescences, les fleurs tombent.',
      vite: ['Traiter au début de la floraison'],
      agro: ['Taille d\'aération'],
      chim: ['Soufre en poudrage ou mouillable à la floraison', E],
      prev: ['Surveillance à chaque floraison'] },
    { n: 'Bactériose (taches noires)', sci: 'Xanthomonas citri pv. mangiferaeindicae', t: 'Bactérie', s: [['fr_etoiles', 5], ['f_angulaires', 3], ['t_chancres', 1]],
      conf: 'Taches noires en étoile, fendillées et gommeuses sur les fruits ; taches anguleuses sur les feuilles.',
      vite: ['Tailler et brûler les rameaux atteints'],
      agro: ['Brise-vent', 'Désinfection des outils de taille'],
      chim: ['Cuivre après la taille et en saison des pluies', E],
      prev: ['Plants sains'] },
    { n: 'Cochenilles et fumagine', sci: 'Rastrococcus invadens et autres', t: 'Insecte', s: [['f_cochenilles', 4], ['f_miellat', 4]],
      conf: 'Amas blancs sous les feuilles, feuilles couvertes de suie noire.',
      vite: ['Tailler les rameaux très infestés'],
      agro: ['Préserver les ennemis naturels (parasitoïdes déjà présents)', 'Lutte contre les fourmis'],
      chim: ['Huile blanche ou insecticide homologué si nécessaire', E],
      prev: ['Taille d\'aération'] },
    { n: 'Malformation florale', sci: 'Fusarium mangiferae', t: 'Champignon', s: [['fr_touffes', 5]],
      conf: 'Inflorescences en touffes compactes et déformées qui ne donnent pas de fruits.',
      vite: ['Couper les inflorescences malformées 20 cm en dessous et les brûler'],
      agro: ['Désinfection des outils'],
      chim: ['Pas de traitement simple'],
      prev: ['Greffons sains'] }
  ]);

  /* ================= CANNE À SUCRE ================= */
  R('Canne à sucre', [
    { n: 'Foreurs de la tige', sci: 'Eldana saccharina, Sesamia', t: 'Insecte', s: [['t_galeries', 5], ['t_coeur_mort', 3]],
      conf: 'Galeries dans la tige, tissu rougi ou pourri ; cœur mort sur jeunes cannes.',
      vite: ['Couper et détruire les cannes atteintes'],
      agro: ['Récolte sans retard', 'Destruction des résidus', 'Variétés moins sensibles'],
      chim: ['Sur avis de l\'encadrement sucrier', E],
      prev: ['Éviter l\'excès d\'azote'] },
    { n: 'Charbon de la canne', sci: 'Sporisorium scitamineum', t: 'Champignon', s: [['t_fouet', 5]],
      conf: 'Long fouet noir et poudreux au sommet de la tige.',
      vite: ['Couper le fouet dans un sac, puis arracher la souche et la brûler'],
      agro: ['Boutures saines', 'Variétés résistantes'],
      chim: ['Traitement des boutures à l\'eau chaude ou au fongicide homologué', E],
      prev: ['Ne pas prélever de boutures dans une parcelle atteinte'] },
    { n: 'Échaudure des feuilles', sci: 'Xanthomonas albilineans', t: 'Bactérie', s: [['f_stries_blanches', 5], ['t_pousses', 1]],
      conf: 'Fines stries blanches le long des feuilles, puis dessèchement.',
      vite: ['Arracher les touffes malades'],
      agro: ['Boutures saines', 'Désinfection des machettes'],
      chim: ['Aucun'],
      prev: ['Variétés résistantes'] },
    { n: 'Mosaïque de la canne', sci: 'Virus transmis par les pucerons', t: 'Virus', s: [['f_mosaique', 5], ['p_naine', 1]],
      conf: 'Plages vert clair et vert foncé sur les jeunes feuilles.',
      vite: ['Éliminer les touffes atteintes'],
      agro: ['Variétés résistantes', 'Boutures saines'],
      chim: ['Aucun'],
      prev: ['Contrôle des pucerons'] },
    { n: 'Rouille de la canne', sci: 'Puccinia', t: 'Champignon', s: [['f_poudre_orange', 5]],
      conf: 'Pustules brun-orangé sur les feuilles.',
      vite: ['Surveiller'],
      agro: ['Variétés résistantes'],
      chim: ['Rarement rentable'],
      prev: ['Fumure équilibrée'] }
  ]);

  /* ================= NOIX DE COLA ================= */
  R('Noix de cola', [
    { n: 'Charançons de la noix de cola', sci: 'Balanogastris kolae, Sophrorhinus', t: 'Insecte', s: [['fr_stock', 5]],
      conf: 'Noix percées et poudreuses en stock ou en conservation.',
      vite: ['Trier les noix et éliminer les noix percées'],
      agro: ['Récolter à maturité et écosser rapidement', 'Conservation en paniers tapissés de feuilles fraîches, triés chaque semaine'],
      chim: ['Produit de conservation homologué uniquement', E],
      prev: ['Ramasser les fruits tombés'] },
    { n: 'Pourriture des fruits', sci: 'Phytophthora', t: 'Champignon', s: [['fr_pourriture', 5], ['c_pluies', 2]],
      conf: 'Fruits qui brunissent et pourrissent sur l\'arbre.',
      vite: ['Enlever et enterrer les fruits malades'],
      agro: ['Taille d\'aération'],
      chim: ['Cuivre en saison des pluies si nécessaire', E],
      prev: ['Récolte sanitaire'] },
    { n: 'Foreurs du tronc', sci: 'Coléoptères foreurs', t: 'Insecte', s: [['t_sciure', 5]],
      conf: 'Trous avec sciure dans le tronc ou les branches.',
      vite: ['Tuer la larve avec un fil de fer'],
      agro: ['Couper et brûler les branches atteintes'],
      chim: ['Injection d\'insecticide homologué', E],
      prev: ['Inspection régulière'] },
    { n: 'Plantes parasites (gui)', sci: 'Loranthacées', t: 'Plante parasite', s: [['t_gui', 5]],
      conf: 'Touffes d\'une autre plante sur les branches.',
      vite: ['Couper la branche sous le point d\'attache'],
      agro: ['Passage annuel d\'élimination'],
      chim: ['Aucun'],
      prev: ['Surveillance'] }
  ]);

  /* ================= POIVRE ================= */
  R('Poivre', [
    { n: 'Pourriture du pied', sci: 'Phytophthora', t: 'Champignon', s: [['p_fane', 3], ['p_collet', 5], ['f_chute', 2], ['c_pluies', 2]],
      conf: 'Le poivrier flétrit rapidement, collet et racines noircis ; chute des feuilles et des épis.',
      vite: ['Arracher et brûler les lianes mortes'],
      agro: ['Drainage et buttage', 'Paillage pour éviter les éclaboussures', 'Trichoderma au pied'],
      chim: ['Bouillie de cuivre ou fongicide homologué au pied en saison des pluies', E],
      prev: ['Boutures saines'] },
    { n: 'Anthracnose du poivrier', sci: 'Colletotrichum', t: 'Champignon', s: [['f_taches', 4], ['fr_piqures', 2]],
      conf: 'Taches brunes sur feuilles et épis.',
      vite: ['Enlever les parties atteintes'],
      agro: ['Taille d\'aération des tuteurs vivants'],
      chim: ['Cuivre si nécessaire', E],
      prev: ['Ombrage modéré'] },
    { n: 'Nématodes', sci: 'Meloidogyne, Radopholus', t: 'Nématode', s: [['r_galles', 4], ['r_noires', 3], ['f_vieilles_jaunes', 1]],
      conf: 'Racines avec galles ou noircies, lianes qui jaunissent lentement.',
      vite: ['Examiner les racines'],
      agro: ['Matière organique abondante', 'Boutures saines'],
      chim: ['Sur avis technique'],
      prev: ['Ne pas replanter au même endroit'] }
  ]);

  /* ================= GINGEMBRE ================= */
  R('Gingembre', [
    { n: 'Pourriture molle des rhizomes', sci: 'Pythium', t: 'Champignon', s: [['r_pourries', 5], ['f_vieilles_jaunes', 2], ['c_basfond', 2]],
      conf: 'Jaunissement du feuillage, rhizomes mous et pourris à la base des tiges.',
      vite: ['Arracher les touffes malades'],
      agro: ['Billons drainés', 'Semences (rhizomes) saines', 'Rotation de 3 ans'],
      chim: ['Traitement des rhizomes de semence homologué', E],
      prev: ['Sol léger et bien drainé'] },
    { n: 'Flétrissement bactérien', sci: 'Ralstonia solanacearum', t: 'Bactérie', s: [['p_fane', 5], ['p_filaments', 4]],
      conf: 'Les tiges fanent en restant vertes, puis jaunissent ; exsudat laiteux du rhizome coupé.',
      vite: ['Arracher et détruire'],
      agro: ['Rotation longue', 'Rhizomes sains'],
      chim: ['Aucun produit efficace'],
      prev: ['Pas après tomate ou aubergine'] }
  ]);

  /* ================= SÉSAME ================= */
  R('Sésame', [
    { n: 'Phyllodie', sci: 'Phytoplasme transmis par des cicadelles', t: 'Phytoplasme', s: [['f_phyllodie', 5], ['p_naine', 1]],
      conf: 'Fleurs transformées en petites feuilles vertes, pas de capsules.',
      vite: ['Arracher les plants atteints'],
      agro: ['Semer à la date recommandée', 'Variétés tolérantes'],
      chim: ['Aucun traitement'],
      prev: ['Détruire les repousses'] },
    { n: 'Chenille enrouleuse', sci: 'Antigastra catalaunalis', t: 'Insecte', s: [['f_enroulees', 5], ['fr_chenille', 2]],
      conf: 'Feuilles collées ensemble au sommet, chenille dedans ; capsules percées.',
      vite: ['Écraser les chenilles dans les feuilles collées'],
      agro: ['Neem ou Bt'],
      chim: ['Insecticide homologué si forte attaque', E],
      prev: ['Semis précoce'] },
    { n: 'Taches foliaires', sci: 'Cercospora, Alternaria', t: 'Champignon', s: [['f_taches', 4], ['f_chute', 2], ['c_pluies', 1]],
      conf: 'Taches brunes sur les feuilles, défoliation.',
      vite: ['Pas d\'urgence'],
      agro: ['Semences saines', 'Rotation'],
      chim: ['Traitement des semences', E],
      prev: ['Densité adaptée'] }
  ]);

  /* ================= KARITÉ ================= */
  R('Karité', [
    { n: 'Plantes parasites (gui)', sci: 'Tapinanthus', t: 'Plante parasite', s: [['t_gui', 5], ['t_pousses', 2]],
      conf: 'Touffes d\'une autre plante sur les branches : principale cause de baisse de production du karité.',
      vite: ['Couper les branches parasitées 30 cm sous le point d\'attache'],
      agro: ['Campagne collective d\'élimination dans le village, une fois par an'],
      chim: ['Aucun'],
      prev: ['Surveillance annuelle'] },
    { n: 'Feux de brousse', sci: 'Brûlure', t: 'Physiologique', s: [['fr_fleurs', 3], ['t_chancres', 2], ['c_seche', 2]],
      conf: 'Fleurs et jeunes fruits grillés, écorce brûlée après passage du feu.',
      vite: ['Pare-feu autour des parcs'],
      agro: ['Feux précoces contrôlés en début de saison sèche', 'Désherbage autour des pieds'],
      chim: ['Aucun'],
      prev: ['Organisation villageoise contre les feux tardifs'] },
    { n: 'Noix moisies au stockage', sci: 'Moisissures', t: 'Qualité / stockage', s: [['fr_moisissures', 5]],
      conf: 'Amandes moisies : beurre de mauvaise qualité.',
      vite: ['Trier et resécher'],
      agro: ['Ramasser régulièrement, dépulper, étuver ou bouillir puis sécher', 'Stocker au sec'],
      chim: ['Aucun'],
      prev: ['Séchage complet'] }
  ]);
})(window.PM);
/* Cultures vivrières */
(function (PM) {
  var E = PM.EPI;
  function V(crop, list) { PM.C[crop] = list; PM.CAT[crop] = 'vivrier'; }

  V('Riz (pluvial, bas-fond, irrigué)', [
    { n: 'Pyriculariose', sci: 'Magnaporthe oryzae', t: 'Champignon', s: [['f_losange', 5], ['t_cou_noir', 4], ['fr_panicule_vide', 2], ['c_pluies', 1]],
      conf: 'Taches en losange à centre gris sur les feuilles ; au cou de la panicule, tache noire et panicule qui casse ou reste blanche.',
      vite: ['Arrêter les apports d\'azote sur la parcelle atteinte'],
      agro: ['Variétés résistantes (demander à l\'ANADER ou à AfricaRice)', 'Fractionner l\'urée, éviter l\'excès d\'azote', 'Détruire les pailles malades'],
      chim: ['Fongicide homologué (par exemple à base de tricyclazole) au début de l\'épiaison si le risque est fort', E],
      prev: ['Semences saines', 'Semis à la bonne date'] },
    { n: 'Panachure jaune du riz', sci: 'RYMV, transmis par des chrysomèles', t: 'Virus', s: [['f_jaune_orange', 4], ['f_mosaique', 2], ['p_naine', 3], ['fr_ratatines', 2]],
      conf: 'Feuilles jaune-orangé tachetées, plants nains, panicules mal remplies ; surtout en riz irrigué et de bas-fond.',
      vite: ['Arracher et enfouir les plants malades en début de culture'],
      agro: ['Variétés résistantes', 'Repiquer toutes les parcelles voisines en même temps', 'Détruire repousses et pailles après la récolte'],
      chim: ['Aucun produit ne guérit le virus'],
      prev: ['Pépinières propres, loin des vieilles rizières malades'] },
    { n: 'Foreurs des tiges', sci: 'Chilo, Sesamia, Maliarpha', t: 'Insecte', s: [['t_coeur_mort', 5], ['fr_panicule_vide', 4]],
      conf: 'Au tallage, cœur mort qui s\'arrache facilement ; à l\'épiaison, panicule blanche et vide ; chenille dans la tige.',
      vite: ['Arracher et détruire les tiges à cœur mort'],
      agro: ['Couper bas et détruire les chaumes après la récolte', 'Repiquage synchronisé avec les voisins', 'Fumure azotée raisonnée'],
      chim: ['Insecticide homologué seulement en cas de forte attaque', E],
      prev: ['Labour ou mise en eau après récolte pour tuer les larves'] },
    { n: 'Cécidomyie africaine du riz', sci: 'Orseolia oryzivora', t: 'Insecte', s: [['f_tube', 5], ['t_coeur_mort', 1]],
      conf: 'La talle ne porte pas de panicule mais un tube creux comme une feuille d\'oignon.',
      vite: ['Noter le pourcentage de talles atteintes'],
      agro: ['Repiquer tôt et en même temps que les voisins', 'Éviter l\'excès d\'azote', 'Détruire repousses et riz sauvage'],
      chim: ['Rarement justifié'],
      prev: ['Variétés tolérantes'] },
    { n: 'Toxicité ferreuse', sci: 'Excès de fer dans les sols de bas-fond', t: 'Carence / sol', s: [['f_bronzees', 5], ['c_basfond', 4], ['r_noires', 2], ['p_naine', 1]],
      conf: 'Bas-fond engorgé : feuilles bronzées ou orange en partant des vieilles feuilles, racines brunes, eau couleur rouille ou film irisé.',
      vite: ['Drainer la parcelle quelques jours (assec) pour aérer le sol'],
      agro: ['Drains de ceinture pour évacuer l\'eau de nappe chargée en fer', 'Variétés tolérantes', 'Retarder le repiquage de 1 à 2 semaines après la mise en eau', 'Matière organique bien décomposée seulement'],
      chim: ['Apport de potassium et de zinc, qui réduit les symptômes'],
      prev: ['Ne pas laisser stagner l\'eau, renouveler la lame d\'eau'] },
    { n: 'Helminthosporiose', sci: 'Bipolaris oryzae', t: 'Champignon', s: [['f_ovales', 5], ['f_vieilles_jaunes', 1], ['fr_ratatines', 1]],
      conf: 'Petites taches brunes ovales ; fréquente sur sols pauvres ou carencés en potassium.',
      vite: ['Corriger la fertilisation, surtout en potassium'],
      agro: ['Semences saines, triées', 'Fumure équilibrée'],
      chim: ['Traitement des semences avec un fongicide homologué', E],
      prev: ['Rotation, résidus enfouis'] },
    { n: 'Oiseaux granivores', sci: 'Quelea, tisserins', t: 'Oiseaux', s: [['fr_oiseaux', 5]],
      conf: 'Grains vidés ou disparus à partir du stade laiteux.',
      vite: ['Gardiennage tôt le matin et en fin d\'après-midi'],
      agro: ['Rubans réfléchissants, épouvantails', 'Semer et récolter en même temps que les voisins'],
      chim: ['Pas de produit à utiliser par les producteurs'],
      prev: ['Récolter dès la maturité'] }
  ]);

  V('Maïs', [
    { n: 'Chenille légionnaire d\'automne', sci: 'Spodoptera frugiperda', t: 'Insecte', s: [['f_cornet', 5], ['f_trous', 3], ['fr_chenille', 2]],
      conf: 'Trous et déchirures dans les jeunes feuilles, excréments dans le cornet ; chenille avec un Y clair renversé sur la tête.',
      vite: ['Inspecter 20 plants par parcelle chaque semaine jusqu\'à la floraison', 'Écraser les œufs et les jeunes chenilles'],
      agro: ['Une pincée de cendre, de sable ou de terre fine dans le cornet', 'Extraits de neem ou de piment', 'Bacillus thuringiensis (Bt)', 'Association avec une légumineuse (Desmodium, niébé)'],
      chim: ['Insecticide homologué contre la chenille légionnaire si plus de 20 % des plants sont attaqués', E],
      prev: ['Semer tôt et en même temps que les voisins'] },
    { n: 'Striure du maïs', sci: 'MSV, transmis par des cicadelles', t: 'Virus', s: [['f_stries_jaunes', 5], ['p_naine', 3]],
      conf: 'Fines stries jaunes continues le long des nervures ; plants infectés jeunes restent nains.',
      vite: ['Arracher les plants malades au début de la culture'],
      agro: ['Variétés résistantes', 'Semer tôt en début de saison des pluies'],
      chim: ['Aucun produit ne guérit le virus'],
      prev: ['Éviter de semer à côté d\'un maïs plus âgé et malade'] },
    { n: 'Helminthosporiose du maïs', sci: 'Exserohilum turcicum', t: 'Champignon', s: [['f_cigare', 5], ['c_pluies', 1]],
      conf: 'Longues taches grises en forme de cigare sur les feuilles, d\'abord en bas.',
      vite: ['Pas d\'urgence si l\'attaque arrive après la floraison'],
      agro: ['Rotation', 'Enfouir les résidus', 'Variétés tolérantes'],
      chim: ['Fongicide rarement rentable'],
      prev: ['Pas de maïs plusieurs années de suite au même endroit'] },
    { n: 'Rouille du maïs', sci: 'Puccinia', t: 'Champignon', s: [['f_poudre_orange', 5]],
      conf: 'Petites pustules brun-rouille sur les deux faces des feuilles.',
      vite: ['Surveiller l\'évolution'],
      agro: ['Variétés tolérantes', 'Rotation'],
      chim: ['Rarement rentable'],
      prev: ['Semis à la bonne date'] },
    { n: 'Striga', sci: 'Striga hermonthica et autres', t: 'Plante parasite', s: [['r_striga', 5], ['p_naine', 2], ['f_vieilles_jaunes', 1]],
      conf: 'Petites plantes à fleurs roses ou rouges au pied du maïs, qui jaunit et reste chétif.',
      vite: ['Arracher le striga avant qu\'il fleurisse et le brûler'],
      agro: ['Rotation avec soja, niébé ou arachide', 'Fumier et compost', 'Variétés tolérantes', 'Association maïs-Desmodium'],
      chim: ['Pas de traitement simple recommandé'],
      prev: ['Ne pas déplacer de terre ou d\'outils sales depuis un champ infesté'] },
    { n: 'Ravageurs des grains stockés', sci: 'Grand capucin (Prostephanus), charançons', t: 'Insecte', s: [['fr_stock', 5]],
      conf: 'En stock : grains percés, poudre de farine, petits insectes.',
      vite: ['Trier et sécher à nouveau le grain'],
      agro: ['Sacs hermétiques (type PICS) ou fûts fermés', 'Bien sécher avant stockage', 'Feuilles de neem ou cendre pour la consommation familiale'],
      chim: ['Insecticide de stockage homologué uniquement, jamais un produit de champ', E],
      prev: ['Nettoyer le magasin avant chaque récolte'] },
    { n: 'Moisissures et aflatoxines', sci: 'Aspergillus, Fusarium', t: 'Qualité / stockage', s: [['fr_moisissures', 5]],
      conf: 'Grains moisis (vert, rose, noir) : risque de toxines dangereuses pour la santé.',
      vite: ['Ne pas consommer ni donner aux animaux les grains moisis'],
      agro: ['Récolter à maturité, sécher sur bâche', 'Stocker sec (grain qui sonne et casse net)'],
      chim: ['Aucun'],
      prev: ['Séchage rapide'] }
  ]);

  V('Sorgho', [
    { n: 'Charbon du sorgho', sci: 'Sporisorium', t: 'Champignon', s: [['fr_charbon', 5]],
      conf: 'Grains remplacés par des sacs de poudre noire.',
      vite: ['Couper et brûler les panicules charbonnées avant qu\'elles éclatent'],
      agro: ['Semences saines ou traitées', 'Rotation'],
      chim: ['Traitement des semences homologué', E],
      prev: ['Ne pas garder de semences des champs atteints'] },
    { n: 'Moisissures des grains', sci: 'Fusarium, Curvularia', t: 'Champignon', s: [['fr_moisissures', 5], ['c_pluies', 2]],
      conf: 'Grains roses, noirs ou blancs, surtout quand la maturité tombe en saison des pluies.',
      vite: ['Récolter dès la maturité'],
      agro: ['Variétés à grains durs ou colorés', 'Choisir une date de semis pour mûrir en saison sèche'],
      chim: ['Aucun'],
      prev: ['Séchage rapide'] },
    { n: 'Cécidomyie du sorgho', sci: 'Stenodiplosis sorghicola', t: 'Insecte', s: [['fr_panicule_vide', 4], ['fr_ratatines', 2]],
      conf: 'Épillets vides sur la panicule.',
      vite: ['Pas de traitement'],
      agro: ['Semis groupé', 'Détruire les sorghos sauvages'],
      chim: ['Rarement justifié'],
      prev: ['Variétés à floraison groupée'] },
    { n: 'Striga', sci: 'Striga hermonthica', t: 'Plante parasite', s: [['r_striga', 5], ['p_naine', 2]],
      conf: 'Plantes à fleurs roses au pied du sorgho.',
      vite: ['Arracher avant floraison'],
      agro: ['Rotation avec légumineuses', 'Fumure organique'],
      chim: ['Aucun simple'],
      prev: ['Rotation'] },
    { n: 'Oiseaux', sci: 'Quelea', t: 'Oiseaux', s: [['fr_oiseaux', 5]],
      conf: 'Grains mangés à partir du stade laiteux.',
      vite: ['Gardiennage'],
      agro: ['Variétés à grain coloré, moins appréciées'],
      chim: ['Aucun'],
      prev: ['Semis groupé'] }
  ]);

  V('Mil', [
    { n: 'Mildiou du mil', sci: 'Sclerospora graminicola', t: 'Champignon', s: [['fr_balai', 5], ['f_poudre_blanche', 2], ['f_stries_jaunes', 2], ['p_naine', 1]],
      conf: 'Feuilles striées de jaune avec duvet blanc dessous, épi transformé en touffe de feuilles (« balai »).',
      vite: ['Arracher et brûler les plants atteints'],
      agro: ['Semences saines', 'Variétés résistantes', 'Rotation'],
      chim: ['Traitement des semences homologué', E],
      prev: ['Ne pas garder de semences des champs atteints'] },
    { n: 'Mineuse de l\'épi', sci: 'Heliocheilus albipunctella', t: 'Insecte', s: [['fr_spirale', 5]],
      conf: 'Galeries en spirale sur l\'épi, grains manquants.',
      vite: ['Pas de traitement curatif rentable'],
      agro: ['Labour après récolte pour détruire les chrysalides', 'Lâchers de parasitoïdes (Habrobracon) si disponibles'],
      chim: ['Rarement justifié'],
      prev: ['Semis précoce'] },
    { n: 'Charbon et ergot', sci: 'Moesziomyces, Claviceps', t: 'Champignon', s: [['fr_charbon', 5]],
      conf: 'Grains remplacés par une poudre noire ou des masses brunes.',
      vite: ['Couper et brûler les épis atteints'],
      agro: ['Semences saines'],
      chim: ['Traitement des semences', E],
      prev: ['Rotation'] },
    { n: 'Striga', sci: 'Striga hermonthica', t: 'Plante parasite', s: [['r_striga', 5], ['p_naine', 2]],
      conf: 'Plantes à fleurs roses au pied du mil.',
      vite: ['Arracher avant floraison'],
      agro: ['Rotation avec légumineuses', 'Fumure organique'],
      chim: ['Aucun simple'],
      prev: ['Rotation'] }
  ]);

  V('Manioc', [
    { n: 'Mosaïque africaine du manioc', sci: 'Virus transmis par les aleurodes et les boutures', t: 'Virus', s: [['f_mosaique', 5], ['p_naine', 2], ['f_aleurodes', 2]],
      conf: 'Feuilles avec plages jaunes et vertes, déformées et rétrécies ; plants rabougris.',
      vite: ['Arracher les plants malades au début de la culture'],
      agro: ['Boutures uniquement sur des plants sains', 'Variétés tolérantes (CNRA, ANADER)'],
      chim: ['Aucun produit ne guérit le virus'],
      prev: ['Ne jamais distribuer de boutures de plants malades'] },
    { n: 'Bactériose du manioc', sci: 'Xanthomonas', t: 'Bactérie', s: [['f_angulaires', 5], ['t_gomme', 3], ['t_pousses', 3], ['c_pluies', 1]],
      conf: 'Taches anguleuses d\'aspect mouillé, feuilles qui fanent, gomme sur les tiges, bouts de tiges qui sèchent.',
      vite: ['Couper et brûler les tiges atteintes'],
      agro: ['Boutures saines prélevées en saison sèche', 'Rotation de 1 à 2 ans sans manioc', 'Désinfecter la machette'],
      chim: ['Pas de traitement efficace au champ'],
      prev: ['Variétés tolérantes'] },
    { n: 'Cochenille farineuse du manioc', sci: 'Phenacoccus manihoti', t: 'Insecte', s: [['f_touffe', 5], ['c_seche', 2], ['p_naine', 1]],
      conf: 'Bout des tiges en touffe serrée avec amas cotonneux blancs, surtout en saison sèche.',
      vite: ['Couper et brûler les bouts de tiges très infestés'],
      agro: ['Laisser agir les ennemis naturels (petite guêpe Anagyrus)', 'Fumure organique'],
      chim: ['Éviter les insecticides qui tuent les ennemis naturels'],
      prev: ['Boutures propres'] },
    { n: 'Acariens verts du manioc', sci: 'Mononychellus tanajoa', t: 'Acarien', s: [['f_toiles', 4], ['f_crispees', 2], ['c_seche', 2]],
      conf: 'Petits points jaunes sur les jeunes feuilles, qui rétrécissent, en saison sèche.',
      vite: ['Pas d\'action urgente : l\'attaque baisse avec les pluies'],
      agro: ['Préserver les acariens prédateurs', 'Paillage et fumure'],
      chim: ['Éviter les traitements chimiques'],
      prev: ['Planter en début de saison des pluies'] },
    { n: 'Anthracnose du manioc', sci: 'Colletotrichum', t: 'Champignon', s: [['t_chancres', 5], ['t_pousses', 2]],
      conf: 'Chancres enfoncés sur les tiges, qui cassent.',
      vite: ['Ne pas prendre de boutures sur ces tiges'],
      agro: ['Boutures saines'],
      chim: ['Aucun au champ'],
      prev: ['Rotation'] },
    { n: 'Pourriture des racines', sci: 'Champignons du sol', t: 'Champignon', s: [['r_pourries', 5], ['c_basfond', 3], ['c_pluies', 1]],
      conf: 'Racines molles qui sentent mauvais, souvent en sol engorgé.',
      vite: ['Récolter rapidement les plants encore sains de la zone'],
      agro: ['Buttes ou billons en sol humide', 'Drainage', 'Rotation'],
      chim: ['Pas de traitement recommandé'],
      prev: ['Éviter les bas-fonds mal drainés'] }
  ]);

  V('Igname', [
    { n: 'Anthracnose de l\'igname', sci: 'Colletotrichum gloeosporioides', t: 'Champignon', s: [['f_brulure', 5], ['f_taches', 3], ['c_pluies', 2]],
      conf: 'Taches noires sur les feuilles et les tiges, puis le feuillage noircit et sèche par plaques.',
      vite: ['Enlever les feuilles et tiges très atteintes'],
      agro: ['Variétés tolérantes', 'Semenceaux sains', 'Tuteurage pour aérer', 'Rotation'],
      chim: ['Fongicide à base de cuivre ou de mancozèbe dès les premières taches', E],
      prev: ['Pas à côté d\'une parcelle très atteinte l\'année précédente'] },
    { n: 'Mosaïque de l\'igname', sci: 'Virus (YMV)', t: 'Virus', s: [['f_mosaique', 5], ['p_naine', 2]],
      conf: 'Feuilles marbrées de jaune et de vert, déformées.',
      vite: ['Marquer les plants malades et ne pas les utiliser comme semenceaux'],
      agro: ['Semenceaux issus de plants sains', 'Méthode des minisetts pour renouveler les semences'],
      chim: ['Aucun produit ne guérit le virus'],
      prev: ['Renouveler régulièrement les semenceaux'] },
    { n: 'Nématodes de l\'igname', sci: 'Scutellonema, Meloidogyne', t: 'Nématode', s: [['r_craquelures', 5], ['r_galles', 4], ['r_pourries', 1]],
      conf: 'Craquelures sèches et brunes sous la peau du tubercule, ou tubercules bosselés de galles.',
      vite: ['Trier les tubercules atteints et ne pas les replanter'],
      agro: ['Semenceaux sains, parés', 'Tremper les semenceaux 30 minutes dans de l\'eau à environ 50 °C', 'Rotation ou jachère'],
      chim: ['Nématicide rarement justifié'],
      prev: ['Ne pas replanter de l\'igname deux ans de suite au même endroit'] },
    { n: 'Pourriture des tubercules au stockage', sci: 'Champignons et bactéries', t: 'Champignon', s: [['r_pourries', 4], ['fr_stock', 1]],
      conf: 'Tubercules mous, suintants, qui sentent mauvais dans le stock.',
      vite: ['Trier le stock chaque semaine'],
      agro: ['Récolter sans blesser', 'Laisser cicatriser à l\'ombre', 'Stocker au frais et à l\'air (cases sur claies)'],
      chim: ['Pas de traitement recommandé'],
      prev: ['Récolter à maturité'] }
  ]);

  V('Taro', [
    { n: 'Mildiou du taro', sci: 'Phytophthora colocasiae', t: 'Champignon', s: [['f_fondent', 5], ['c_pluies', 2]],
      conf: 'Grandes taches brunes humides avec gouttelettes, les feuilles fondent en quelques jours ; peut détruire la culture.',
      vite: ['Couper et détruire les feuilles atteintes'],
      agro: ['Variétés tolérantes', 'Espacement plus large', 'Plants sains'],
      chim: ['Fongicide à base de cuivre ou de métalaxyl en préventif en saison des pluies', E],
      prev: ['Ne pas planter près d\'une parcelle malade'] },
    { n: 'Pourriture des cormes', sci: 'Pythium et autres', t: 'Champignon', s: [['r_pourries', 5], ['c_basfond', 2]],
      conf: 'Cormes mous et pourris.',
      vite: ['Récolter les plants sains'],
      agro: ['Drainage', 'Semenceaux sains'],
      chim: ['Aucun'],
      prev: ['Rotation'] }
  ]);

  V('Patate douce', [
    { n: 'Charançon de la patate douce', sci: 'Cylas', t: 'Insecte', s: [['r_galeries_tub', 5]],
      conf: 'Galeries dans les tubercules, chair au goût amer, même après cuisson.',
      vite: ['Récolter sans tarder dès la maturité'],
      agro: ['Boutures saines prises en haut des tiges', 'Buttage pour fermer les fentes du sol', 'Rotation', 'Détruire les résidus'],
      chim: ['Trempage des boutures dans un insecticide homologué si l\'attaque est forte', E],
      prev: ['Ne pas laisser les tubercules en terre en saison sèche'] },
    { n: 'Viroses de la patate douce', sci: 'SPFMV, SPCSV', t: 'Virus', s: [['f_mosaique', 3], ['f_crispees', 3], ['p_naine', 3]],
      conf: 'Feuilles petites, déformées, marbrées ; plants chétifs qui produisent peu.',
      vite: ['Ne pas prendre de boutures sur ces plants'],
      agro: ['Boutures de plants sains', 'Variétés tolérantes'],
      chim: ['Aucun'],
      prev: ['Renouveler les boutures'] }
  ]);

  V('Banane plantain', [
    { n: 'Cercosporiose noire', sci: 'Pseudocercospora fijiensis', t: 'Champignon', s: [['f_stries_noires', 5], ['c_pluies', 2], ['fr_regime', 1]],
      conf: 'Petites stries brunes qui deviennent de grandes taches noires ; les feuilles sèchent avant la récolte.',
      vite: ['Effeuillage sanitaire : couper les feuilles ou parties nécrosées'],
      agro: ['Densité adaptée et drainage', 'Fumure équilibrée', 'Variétés tolérantes (hybrides PITA, FHIA)'],
      chim: ['Fongicide homologué seulement en plantation commerciale, sur conseil technique', E],
      prev: ['Effeuillage toutes les 2 à 3 semaines'] },
    { n: 'Charançon du bananier', sci: 'Cosmopolites sordidus', t: 'Insecte', s: [['r_galeries', 5], ['t_verse', 3], ['fr_regime', 2]],
      conf: 'Galeries noires dans la souche ; plants qui versent ou petits régimes.',
      vite: ['Piéger avec des morceaux de pseudo-tronc posés au sol, relevés chaque semaine'],
      agro: ['Rejets sains, parés', 'Détruire les vieilles souches', 'Beauveria bassiana sur les pièges'],
      chim: ['Insecticide homologué au pied si forte attaque', E],
      prev: ['Nouvelle plantation sur parcelle sans bananiers depuis 1 an'] },
    { n: 'Nématodes du bananier', sci: 'Radopholus similis et autres', t: 'Nématode', s: [['r_noires', 5], ['t_verse', 4], ['fr_regime', 1]],
      conf: 'Racines noircies ; les plants se déracinent et tombent avec leur régime.',
      vite: ['Tuteurer les plants porteurs de régime'],
      agro: ['Rejets parés trempés 20 minutes dans de l\'eau à environ 52 °C', 'Plants PIF ou vitroplants', 'Jachère avant replantation'],
      chim: ['Rarement justifié'],
      prev: ['Ne pas déplacer de rejets infestés'] }
  ]);

  V('Arachide', [
    { n: 'Rosette de l\'arachide', sci: 'Virus transmis par les pucerons', t: 'Virus', s: [['p_naine', 4], ['f_mosaique', 3], ['f_pucerons', 2]],
      conf: 'Plants nains en touffe, feuilles petites, jaunes ou marbrées.',
      vite: ['Arracher les plants malades tôt'],
      agro: ['Semis précoce et dense', 'Variétés résistantes'],
      chim: ['Aphicide seulement en début de culture si pucerons nombreux', E],
      prev: ['Semis groupé'] },
    { n: 'Cercosporioses', sci: 'Cercospora, Nothopassalora', t: 'Champignon', s: [['f_taches', 4], ['f_chute', 3]],
      conf: 'Taches brunes ou noires rondes sur les feuilles, chute des feuilles avant la récolte.',
      vite: ['Pas d\'urgence en début de culture'],
      agro: ['Rotation', 'Variétés tolérantes', 'Enfouir les fanes malades'],
      chim: ['Fongicide homologué si l\'attaque est précoce', E],
      prev: ['Rotation de 3 ans'] },
    { n: 'Rouille de l\'arachide', sci: 'Puccinia arachidis', t: 'Champignon', s: [['f_poudre_orange', 5]],
      conf: 'Pustules orange sous les feuilles.',
      vite: ['Surveiller'],
      agro: ['Variétés tolérantes'],
      chim: ['Fongicide si attaque précoce', E],
      prev: ['Rotation'] },
    { n: 'Aflatoxines (graines moisies)', sci: 'Aspergillus flavus', t: 'Qualité / stockage', s: [['fr_moisissures', 5]],
      conf: 'Graines moisies vert-jaune : toxines dangereuses pour la santé.',
      vite: ['Trier et jeter les graines moisies, abîmées ou ridées'],
      agro: ['Récolter à maturité, sécher rapidement sur bâche', 'Stocker en sacs hermétiques au sec'],
      chim: ['Aucun'],
      prev: ['Éviter les blessures à la récolte'] }
  ]);

  V('Niébé', [
    { n: 'Thrips des fleurs', sci: 'Megalurothrips sjostedti', t: 'Insecte', s: [['fr_fleurs', 5], ['c_floraison', 2]],
      conf: 'Boutons floraux qui brunissent et tombent : peu de gousses.',
      vite: ['Inspecter les fleurs'],
      agro: ['Neem à la floraison', 'Association avec céréales'],
      chim: ['Insecticide homologué au début de la floraison si nécessaire', E],
      prev: ['Semis à la bonne date'] },
    { n: 'Foreur des gousses', sci: 'Maruca vitrata', t: 'Insecte', s: [['fr_chenille', 5], ['f_enroulees', 2]],
      conf: 'Fleurs et gousses collées par des fils, gousses percées avec chenille dedans.',
      vite: ['Ramasser les gousses attaquées'],
      agro: ['Neem ou Bt à la floraison'],
      chim: ['Insecticide homologué à la floraison et à la formation des gousses', E],
      prev: ['Rotation'] },
    { n: 'Punaises des gousses', sci: 'Clavigralla, Riptortus', t: 'Insecte', s: [['fr_ratatines', 5]],
      conf: 'Graines ridées et tachées dans les gousses.',
      vite: ['Récolter régulièrement'],
      agro: ['Neem'],
      chim: ['Insecticide homologué si forte attaque', E],
      prev: ['Récolte rapide'] },
    { n: 'Pucerons et mosaïque', sci: 'Aphis craccivora, virus', t: 'Insecte', s: [['f_pucerons', 4], ['f_mosaique', 3], ['p_naine', 1]],
      conf: 'Colonies noires sur jeunes pousses, feuilles marbrées.',
      vite: ['Eau savonneuse'],
      agro: ['Neem', 'Semences saines'],
      chim: ['Aphicide homologué si besoin', E],
      prev: ['Variétés tolérantes'] },
    { n: 'Bruches en stock', sci: 'Callosobruchus maculatus', t: 'Insecte', s: [['fr_stock', 5]],
      conf: 'Graines percées de petits trous ronds, petits insectes.',
      vite: ['Exposer au soleil sur bâche noire'],
      agro: ['Sacs hermétiques (triple ensachage PICS)', 'Huile végétale ou cendre pour la consommation familiale'],
      chim: ['Produit de stockage homologué uniquement', E],
      prev: ['Stocker bien sec'] }
  ]);

  V('Soja', [
    { n: 'Rouille du soja', sci: 'Phakopsora pachyrhizi', t: 'Champignon', s: [['f_poudre_orange', 5], ['f_chute', 2], ['c_pluies', 1]],
      conf: 'Petites pustules brun-roux sous les feuilles, défoliation rapide.',
      vite: ['Surveiller à partir de la floraison'],
      agro: ['Variétés tolérantes', 'Semis précoce'],
      chim: ['Fongicide homologué à l\'apparition des pustules si avant la formation des gousses', E],
      prev: ['Rotation'] },
    { n: 'Punaises des gousses', sci: 'Nezara, Riptortus', t: 'Insecte', s: [['fr_ratatines', 5]],
      conf: 'Graines ridées, gousses vides.',
      vite: ['Récolter à temps'],
      agro: ['Neem'],
      chim: ['Insecticide homologué si forte attaque', E],
      prev: ['Récolte rapide'] },
    { n: 'Chenilles défoliatrices', sci: 'Spodoptera et autres', t: 'Insecte', s: [['f_trous', 5]],
      conf: 'Feuilles mangées.',
      vite: ['Évaluer le pourcentage de défoliation'],
      agro: ['Bt ou neem'],
      chim: ['Insecticide homologué si défoliation importante avant la floraison', E],
      prev: ['Surveillance'] }
  ]);
})(window.PM);
/* Maraîchage */
(function (PM) {
  var E = PM.EPI;
  function M(crop, list) { PM.C[crop] = list; PM.CAT[crop] = 'maraich'; }
  var RALSTONIA = { n: 'Flétrissement bactérien', sci: 'Ralstonia solanacearum', t: 'Bactérie', s: [['p_fane', 5], ['p_filaments', 5], ['t_brun_interne', 2], ['p_tache', 1]],
    conf: 'La plante fane d\'un coup en journée en restant verte ; tige coupée posée dans l\'eau : filaments laiteux.',
    vite: ['Arracher les plants malades avec la motte et les détruire loin de la parcelle'],
    agro: ['Rotation de 3 ans sans tomate, piment, aubergine ni pomme de terre', 'Greffage sur porte-greffe tolérant', 'Sol bien drainé'],
    chim: ['Aucun produit efficace'],
    prev: ['Ne pas irriguer avec l\'eau qui a coulé sur une parcelle malade'] };
  var GALLES = { n: 'Nématodes à galles', sci: 'Meloidogyne', t: 'Nématode', s: [['r_galles', 5], ['p_fane', 1], ['f_vieilles_jaunes', 1], ['p_naine', 1]],
    conf: 'En arrachant un plant : racines couvertes de boules (galles).',
    vite: ['Détruire les racines après la récolte'],
    agro: ['Rotation avec céréales ou oignon', 'Tagètes (œillets d\'Inde) en culture ou en bordure', 'Fumier et compost en grande quantité', 'Solarisation du sol de pépinière'],
    chim: ['Nématicide rarement rentable'],
    prev: ['Pépinière sur sol sain'] };
  var ACARIENS = { n: 'Acariens', sci: 'Tetranychus', t: 'Acarien', s: [['f_toiles', 5], ['c_seche', 2]],
    conf: 'Points jaunes et petites toiles sous les feuilles, feuillage bronzé en saison sèche.',
    vite: ['Asperger le feuillage d\'eau'],
    agro: ['Extraits de neem', 'Arrosage régulier'],
    chim: ['Acaricide homologué si nécessaire', E],
    prev: ['Éviter le stress hydrique'] };

  M('Tomate', [
    RALSTONIA,
    { n: 'Mildiou de la tomate', sci: 'Phytophthora infestans', t: 'Champignon', s: [['f_huileuses', 5], ['fr_pourriture', 3], ['c_pluies', 2]],
      conf: 'Taches brun-vert huileuses sur feuilles et fruits, duvet blanc dessous par temps humide ; évolution très rapide.',
      vite: ['Enlever et détruire les feuilles et fruits atteints'],
      agro: ['Espacer et tuteurer pour aérer', 'Arroser au pied, jamais sur le feuillage', 'Paillage'],
      chim: ['Fongicide à base de cuivre ou de mancozèbe en préventif en saison des pluies', E],
      prev: ['Préférer la contre-saison pour la tomate'] },
    { n: 'Alternariose', sci: 'Alternaria', t: 'Champignon', s: [['f_cible', 5], ['f_vieilles_jaunes', 1]],
      conf: 'Taches brunes avec cercles concentriques, d\'abord sur les vieilles feuilles du bas.',
      vite: ['Enlever les feuilles du bas atteintes'],
      agro: ['Rotation', 'Fumure équilibrée', 'Tuteurage'],
      chim: ['Fongicide homologué si l\'attaque progresse', E],
      prev: ['Semences saines'] },
    { n: 'Enroulement jaune de la tomate (TYLCV)', sci: 'Virus transmis par les aleurodes', t: 'Virus', s: [['f_cuillere', 5], ['p_naine', 3], ['f_aleurodes', 3]],
      conf: 'Jeunes feuilles petites, jaunes sur les bords et recourbées en cuillère ; plante naine qui donne peu.',
      vite: ['Arracher et détruire les plants malades jeunes'],
      agro: ['Pépinière sous filet anti-insectes', 'Variétés tolérantes', 'Pièges jaunes englués', 'Neem contre les aleurodes'],
      chim: ['Aucun produit ne guérit le virus ; insecticide homologué contre les aleurodes si besoin', E],
      prev: ['Ne pas planter à côté d\'une vieille parcelle malade'] },
    { n: 'Noctuelle et mineuse de la tomate', sci: 'Helicoverpa armigera, Tuta absoluta', t: 'Insecte', s: [['fr_chenille', 5], ['f_mines', 4], ['f_trous', 1]],
      conf: 'Fruits troués par une chenille, ou galeries claires dans les feuilles et petits trous dans les fruits.',
      vite: ['Ramasser et détruire les fruits troués'],
      agro: ['Pièges à phéromone pour la mineuse', 'Bacillus thuringiensis (Bt) ou neem', 'Arracher les vieux plants après la récolte'],
      chim: ['Insecticide homologué en alternant les familles chimiques', E],
      prev: ['Pépinière protégée'] },
    GALLES,
    { n: 'Cul noir (nécrose apicale)', sci: 'Manque de calcium dans le fruit', t: 'Physiologique', s: [['fr_cul_noir', 5], ['c_seche', 1]],
      conf: 'Tache noire, sèche et ronde au bout du fruit ; dû à un arrosage irrégulier.',
      vite: ['Arroser régulièrement'],
      agro: ['Paillage', 'Éviter l\'excès d\'azote'],
      chim: ['Amendement calcaire si le sol est acide'],
      prev: ['Irrigation régulière'] },
    ACARIENS
  ]);

  M('Piment', [
    { n: 'Anthracnose du piment', sci: 'Colletotrichum', t: 'Champignon', s: [['fr_enfoncees', 5], ['c_pluies', 2]],
      conf: 'Taches rondes enfoncées sur les fruits, avec des cercles orange ou noirs.',
      vite: ['Ramasser et détruire les fruits atteints'],
      agro: ['Semences saines', 'Rotation', 'Récolter régulièrement'],
      chim: ['Fongicide à base de cuivre ou de mancozèbe en saison des pluies', E],
      prev: ['Espacement suffisant'] },
    { n: 'Viroses du piment', sci: 'Virus transmis par pucerons et aleurodes', t: 'Virus', s: [['f_mosaique', 4], ['f_crispees', 3], ['p_naine', 2], ['f_pucerons', 2], ['f_aleurodes', 1]],
      conf: 'Feuilles marbrées, déformées ou crispées, plante qui pousse mal.',
      vite: ['Arracher les plants malades jeunes'],
      agro: ['Pépinière sous filet', 'Pièges jaunes', 'Neem'],
      chim: ['Aucun produit ne guérit le virus'],
      prev: ['Éliminer les mauvaises herbes autour'] },
    RALSTONIA,
    { n: 'Mouches des fruits', sci: 'Bactrocera, Ceratitis', t: 'Insecte', s: [['fr_asticots', 5]],
      conf: 'Fruits qui pourrissent avec des asticots à l\'intérieur.',
      vite: ['Ramasser chaque semaine les fruits piqués et les détruire'],
      agro: ['Pièges à appât', 'Récolte régulière'],
      chim: ['Appât insecticide homologué en taches si besoin', E],
      prev: ['Nettoyer les fruits tombés'] },
    { n: 'Tarsonèmes', sci: 'Polyphagotarsonemus latus', t: 'Acarien', s: [['f_crispees', 4], ['f_toiles', 1]],
      conf: 'Jeunes feuilles étroites, recourbées vers le bas, bronzées en dessous.',
      vite: ['Couper les pousses très atteintes'],
      agro: ['Neem, soufre mouillable'],
      chim: ['Acaricide homologué si nécessaire', E],
      prev: ['Plants de pépinière sains'] }
  ]);

  M('Aubergine', [
    { n: 'Foreur des fruits et des pousses', sci: 'Leucinodes', t: 'Insecte', s: [['t_pousses', 4], ['fr_chenille', 5]],
      conf: 'Bouts de tiges qui fanent ; fruits percés avec excréments et chenille rose dedans.',
      vite: ['Couper et détruire chaque semaine les pousses fanées et les fruits percés'],
      agro: ['Pièges à phéromone', 'Neem ou Bt', 'Arracher les vieux plants'],
      chim: ['Insecticide homologué en alternant les familles', E],
      prev: ['Pas d\'aubergine en continu au même endroit'] },
    RALSTONIA,
    { n: 'Cicadelles (jassides)', sci: 'Jacobiella', t: 'Insecte', s: [['f_bord_brule', 3], ['f_crispees', 2]],
      conf: 'Bords des feuilles jaunes puis brûlés ; petits insectes verts qui sautent.',
      vite: ['Vérifier le dessous des feuilles'],
      agro: ['Neem'],
      chim: ['Insecticide homologué si l\'attaque est forte', E],
      prev: ['Éliminer les mauvaises herbes'] },
    ACARIENS, GALLES
  ]);

  M('Gombo', [
    { n: 'Viroses du gombo', sci: 'Virus transmis par les aleurodes', t: 'Virus', s: [['f_mosaique', 4], ['f_nervures', 3], ['f_crispees', 3], ['f_aleurodes', 2], ['p_naine', 2]],
      conf: 'Feuilles marbrées ou à nervures jaunes, crispées ; fruits petits et déformés.',
      vite: ['Arracher les plants malades jeunes'],
      agro: ['Variétés tolérantes', 'Pièges jaunes, neem', 'Semer en début de saison des pluies'],
      chim: ['Aucun produit ne guérit le virus'],
      prev: ['Éliminer les plantes hôtes autour'] },
    { n: 'Altises', sci: 'Podagrica', t: 'Insecte', s: [['f_criblures', 5]],
      conf: 'Nombreux petits trous ronds dans les feuilles ; petits coléoptères qui sautent.',
      vite: ['Traiter tôt, au stade jeune plant'],
      agro: ['Neem ou piment en pulvérisation', 'Cendre sur les jeunes plants'],
      chim: ['Insecticide homologué si les jeunes plants sont menacés', E],
      prev: ['Semis dense puis démariage'] },
    { n: 'Chenilles des fruits', sci: 'Earias, Helicoverpa', t: 'Insecte', s: [['fr_chenille', 5]],
      conf: 'Fruits percés et déformés, chenille à l\'intérieur.',
      vite: ['Ramasser les fruits percés'],
      agro: ['Bt ou neem', 'Récolte fréquente'],
      chim: ['Insecticide homologué si besoin', E],
      prev: ['Rotation'] },
    { n: 'Oïdium du gombo', sci: 'Erysiphe', t: 'Champignon', s: [['f_poudre_blanche', 5], ['c_seche', 1]],
      conf: 'Poudre blanche sur les feuilles, qui jaunissent et sèchent.',
      vite: ['Enlever les feuilles très atteintes'],
      agro: ['Soufre mouillable, bicarbonate de soude dilué'],
      chim: ['Soufre homologué', E],
      prev: ['Espacement suffisant'] },
    GALLES
  ]);

  M('Chou et légumes-feuilles', [
    { n: 'Teigne du chou', sci: 'Plutella xylostella', t: 'Insecte', s: [['f_fenetres', 5], ['f_trous', 2]],
      conf: 'Feuilles grignotées en fenêtres transparentes, petites chenilles vertes qui se tortillent.',
      vite: ['Inspecter deux fois par semaine'],
      agro: ['Bt ou neem, en alternance', 'Filet anti-insectes en pépinière', 'Rotation'],
      chim: ['Insecticide homologué en alternant les familles : la teigne devient vite résistante', E],
      prev: ['Arracher les vieux pieds après la récolte'] },
    { n: 'Pourriture noire', sci: 'Xanthomonas campestris', t: 'Bactérie', s: [['f_v_jaune', 5], ['c_pluies', 2]],
      conf: 'Taches jaunes en V au bord des feuilles, nervures noircies.',
      vite: ['Enlever les feuilles et plants atteints'],
      agro: ['Semences saines', 'Rotation de 2 à 3 ans', 'Arroser au pied'],
      chim: ['Cuivre en préventif en saison des pluies', E],
      prev: ['Pépinière sur sol neuf'] },
    { n: 'Pucerons', sci: 'Brevicoryne, Lipaphis, Myzus', t: 'Insecte', s: [['f_pucerons', 5], ['f_crispees', 2]],
      conf: 'Colonies grises ou vertes sous les feuilles, qui se recroquevillent.',
      vite: ['Jet d\'eau ou eau savonneuse'],
      agro: ['Neem', 'Préserver les coccinelles'],
      chim: ['Insecticide homologué si forte attaque', E],
      prev: ['Éviter l\'excès d\'azote'] },
    { n: 'Pyrale du chou', sci: 'Hellula undalis', t: 'Insecte', s: [['f_trous', 3], ['t_coeur_mort', 3]],
      conf: 'Le cœur du jeune chou est dévoré, la pomme ne se forme pas.',
      vite: ['Détruire les chenilles dans le cœur'],
      agro: ['Bt ou neem', 'Rotation'],
      chim: ['Insecticide homologué si besoin', E],
      prev: ['Pépinière protégée'] },
    { n: 'Pourriture du collet (laitue, salades)', sci: 'Sclerotinia, Rhizoctonia', t: 'Champignon', s: [['p_collet', 5], ['c_pluies', 1]],
      conf: 'Le collet pourrit, feutrage blanc, la plante s\'affaisse.',
      vite: ['Arracher et détruire les plants atteints'],
      agro: ['Planches surélevées et drainées', 'Rotation', 'Trichoderma'],
      chim: ['Fongicide homologué en préventif si la maladie revient chaque année', E],
      prev: ['Arroser le matin'] }
  ]);

  M('Oignon', [
    { n: 'Thrips de l\'oignon', sci: 'Thrips tabaci', t: 'Insecte', s: [['f_argentees', 5], ['c_seche', 2]],
      conf: 'Feuilles argentées avec petites taches blanches, pointes qui sèchent.',
      vite: ['Contrôler la base des feuilles'],
      agro: ['Neem', 'Irrigation par aspersion légère', 'Rotation'],
      chim: ['Insecticide homologué si l\'attaque est forte', E],
      prev: ['Éloigner des vieilles parcelles d\'oignon'] },
    { n: 'Alternariose et mildiou', sci: 'Alternaria porri, Peronospora destructor', t: 'Champignon', s: [['f_violacees', 5], ['c_pluies', 2]],
      conf: 'Taches allongées violacées ou duvet gris-violet sur les feuilles, qui sèchent.',
      vite: ['Enlever les feuilles atteintes'],
      agro: ['Rotation', 'Espacement', 'Éviter l\'irrigation le soir'],
      chim: ['Fongicide homologué (mancozèbe ou autre)', E],
      prev: ['Semences saines'] },
    { n: 'Pourriture des bulbes', sci: 'Champignons et bactéries de stockage', t: 'Qualité / stockage', s: [['r_pourries', 5]],
      conf: 'Bulbes mous et pourris en stock.',
      vite: ['Trier le stock chaque semaine'],
      agro: ['Arrêter l\'irrigation 2 semaines avant la récolte', 'Bien sécher les bulbes (ressuyage) avant stockage', 'Stocker en local aéré'],
      chim: ['Aucun'],
      prev: ['Éviter l\'excès d\'azote'] }
  ]);

  M('Concombre, pastèque, courgette', [
    { n: 'Mouches des cucurbitacées', sci: 'Zeugodacus, Dacus', t: 'Insecte', s: [['fr_asticots', 5]],
      conf: 'Fruits piqués qui pourrissent avec des asticots.',
      vite: ['Ramasser et détruire chaque jour les fruits piqués'],
      agro: ['Pièges à appât', 'Protéger les jeunes fruits (sachets, papier)'],
      chim: ['Appât insecticide homologué en taches', E],
      prev: ['Rotation'] },
    { n: 'Mildiou des cucurbitacées', sci: 'Pseudoperonospora cubensis', t: 'Champignon', s: [['f_anguleuses_jaunes', 5], ['c_pluies', 2]],
      conf: 'Taches anguleuses jaunes sur le dessus, duvet gris-violet dessous.',
      vite: ['Enlever les feuilles atteintes'],
      agro: ['Espacement, irrigation au pied'],
      chim: ['Fongicide homologué en préventif en saison des pluies', E],
      prev: ['Variétés tolérantes'] },
    { n: 'Oïdium des cucurbitacées', sci: 'Podosphaera', t: 'Champignon', s: [['f_poudre_blanche', 5]],
      conf: 'Poudre blanche sur les feuilles.',
      vite: ['Traiter au soufre ou au bicarbonate'],
      agro: ['Bicarbonate de soude dilué'],
      chim: ['Soufre homologué', E],
      prev: ['Espacement'] },
    { n: 'Chrysomèles et coccinelles phytophages', sci: 'Aulacophora, Henosepilachna', t: 'Insecte', s: [['f_trous', 4], ['f_criblures', 2]],
      conf: 'Feuilles trouées ou grignotées par des petits coléoptères orange ou tachetés.',
      vite: ['Ramasser les insectes le matin'],
      agro: ['Neem', 'Cendre sur les jeunes plants'],
      chim: ['Insecticide homologué si les jeunes plants sont menacés', E],
      prev: ['Surveillance à la levée'] },
    { n: 'Viroses des cucurbitacées', sci: 'Mosaïques transmises par pucerons et aleurodes', t: 'Virus', s: [['f_mosaique', 5], ['p_naine', 2]],
      conf: 'Feuilles marbrées et déformées, fruits bosselés.',
      vite: ['Arracher les plants malades'],
      agro: ['Pièges jaunes', 'Variétés tolérantes'],
      chim: ['Aucun produit ne guérit le virus'],
      prev: ['Éliminer les mauvaises herbes'] }
  ]);

  M('Haricot vert', [
    { n: 'Mouche du haricot', sci: 'Ophiomyia', t: 'Insecte', s: [['t_eclatee', 5], ['c_pepiniere', 1]],
      conf: 'Jeunes plants fanés, tige gonflée ou éclatée au ras du sol.',
      vite: ['Butter les jeunes plants'],
      agro: ['Buttage pour favoriser de nouvelles racines', 'Semis à la bonne date'],
      chim: ['Traitement des semences homologué', E],
      prev: ['Rotation'] },
    { n: 'Anthracnose du haricot', sci: 'Colletotrichum lindemuthianum', t: 'Champignon', s: [['fr_enfoncees', 4], ['f_taches', 2]],
      conf: 'Taches brunes enfoncées sur les gousses, nervures noircies.',
      vite: ['Enlever les plants atteints'],
      agro: ['Semences saines', 'Ne pas travailler dans la parcelle mouillée'],
      chim: ['Fongicide homologué si besoin', E],
      prev: ['Rotation'] },
    { n: 'Rouille du haricot', sci: 'Uromyces', t: 'Champignon', s: [['f_poudre_orange', 5]],
      conf: 'Pustules brun-rouille sur les feuilles.',
      vite: ['Surveiller'],
      agro: ['Variétés tolérantes'],
      chim: ['Fongicide homologué si attaque précoce', E],
      prev: ['Rotation'] },
    { n: 'Foreur des gousses', sci: 'Maruca vitrata', t: 'Insecte', s: [['fr_chenille', 5]],
      conf: 'Gousses percées avec chenille.',
      vite: ['Ramasser les gousses attaquées'],
      agro: ['Neem ou Bt'],
      chim: ['Insecticide homologué si besoin', E],
      prev: ['Rotation'] }
  ]);

  M('Carotte et légumes-racines', [
    GALLES,
    { n: 'Racines fourchues', sci: 'Sol caillouteux, fumier frais ou nématodes', t: 'Physiologique', s: [['r_fourchues', 5]],
      conf: 'Racines fourchues ou tordues.',
      vite: ['Pas d\'action sur la culture en cours'],
      agro: ['Sol meuble et ameubli en profondeur', 'Fumier bien décomposé seulement'],
      chim: ['Aucun'],
      prev: ['Préparation du sol soignée'] },
    { n: 'Alternariose de la carotte', sci: 'Alternaria dauci', t: 'Champignon', s: [['f_taches', 4], ['f_brulure', 2]],
      conf: 'Taches brunes sur les feuilles, qui sèchent.',
      vite: ['Enlever les feuilles atteintes'],
      agro: ['Rotation', 'Semences saines'],
      chim: ['Fongicide homologué si besoin', E],
      prev: ['Espacement'] }
  ]);
})(window.PM);
/* Interface de l'onglet « Plante malade ? » */
(function (PM) {
  'use strict';
  var S = PM.S, G = PM.G, C = PM.C;
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function problems(crop) { return (C[crop] || []).concat(PM.GEN); }
  function cropSigns(crop) {
    var set = {};
    problems(crop).forEach(function (p) { p.s.forEach(function (x) { if (S[x[0]]) set[x[0]] = 1; }); });
    return Object.keys(set);
  }
  var PILL = { 'Champignon': 'p-cond', 'Virus': 'p-bad', 'Phytoplasme': 'p-bad', 'Bactérie': 'p-bad', 'Insecte': 'p-risk', 'Acarien': 'p-risk', 'Nématode': 'p-risk', 'Ravageur du sol': 'p-risk', 'Plante parasite': 'p-risk', 'Rongeurs': 'p-neutral', 'Oiseaux': 'p-neutral', 'Carence / sol': 'p-acc', 'Physiologique': 'p-acc', 'Qualité / stockage': 'p-acc' };

  function score(p, sel) {
    var got = 0, key = false, hits = [];
    p.s.forEach(function (x) { if (sel[x[0]] && x[1] > 0) { got += x[1]; hits.push(S[x[0]][1]); if (x[1] >= 4) key = true; } });
    var lvl = got === 0 ? null : (key && got >= 6) ? ['Très probable', 'p-bad'] : (key || got >= 4) ? ['Probable', 'p-risk'] : ['Possible', 'p-neutral'];
    return { p: p, got: got, hits: hits, lvl: lvl };
  }
  function ranked() {
    return problems(state.crop).map(function (p) { return score(p, state.sel); }).filter(function (r) { return r.lvl; })
      .sort(function (a, b) { return b.got - a.got; });
  }

  var state = { crop: null, sel: {} };
  function pref(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  function renderHead() {
    var n = (C[state.crop] || []).length, rente = PM.CAT[state.crop] === 'rente';
    $('#pmInfo').innerHTML = '<span class="pill ' + (rente ? 'p-fav' : 'p-neutral') + '">' + (rente ? 'Culture de rente · couverture complète' : 'Principaux problèmes') + '</span> <span class="small muted">' + n + ' maladies et ravageurs suivis pour cette culture' + (rente ? ', avec plan d\'action' : '') + '.</span>';
  }

  function renderSigns() {
    var ids = cropSigns(state.crop), groups = {};
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
    $('#pmSigns').innerHTML = h;
  }

  /* Plan d'action : rédigé pour les problèmes majeurs ; pour les autres cultures de rente,
     composé dans l'ordre chronologique à partir des mesures de la fiche. */
  function planOf(p) {
    if (p.plan) return p.plan;
    if (PM.CAT[state.crop] !== 'rente') return null;
    var out = [];
    (p.vite || []).forEach(function (x) { out.push('Aujourd\'hui : ' + x); });
    (p.agro || []).slice(0, 3).forEach(function (x, i) { out.push((i === 0 ? 'Dans les 2 semaines : ' : 'Puis : ') + x); });
    var ch = (p.chim || []).filter(function (x) { return x !== PM.EPI && !/^Aucun|^Pas de|^Rarement|^Éviter/.test(x); });
    if (ch.length) out.push('Si le problème continue malgré ces mesures : ' + ch[0]);
    (p.prev || []).forEach(function (x) { out.push('Chaque saison : ' + x); });
    return out.length ? out : null;
  }

  function list(title, arr, ordered) {
    if (!arr || !arr.length) return '';
    var tag = ordered ? 'ol' : 'ul';
    return '<div class="pm-sub' + (ordered ? ' pm-plan' : '') + '"><b>' + esc(title) + '</b><' + tag + '>' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</' + tag + '></div>';
  }

  function results() {
    var out = $('#pmOut'), n = Object.keys(state.sel).filter(function (k) { return state.sel[k]; }).length;
    if (!n) { out.innerHTML = '<p class="muted small" style="margin:0">Cochez ce que vous observez sur la plante : les maladies et ravageurs possibles s\'afficheront ici, avec ce qu\'il faut faire.</p>'; $('#pmPrint').disabled = true; return; }
    var rs = ranked().slice(0, 4);
    if (!rs.length) { out.innerHTML = '<p class="notice">Aucun problème connu ne correspond à ces signes pour cette culture. Ajoutez d\'autres observations ou faites venir un technicien.</p>'; $('#pmPrint').disabled = true; return; }
    out.innerHTML = rs.map(function (r, i) {
      var p = r.p;
      return '<details class="pm-res"' + (i === 0 ? ' open' : '') + '><summary><span class="pm-name">' + esc(p.n) + '</span>' +
        '<span class="pill ' + r.lvl[1] + '">' + r.lvl[0] + '</span><span class="pill ' + (PILL[p.t] || 'p-neutral') + '">' + esc(p.t) + '</span></summary>' +
        (p.sci ? '<p class="small muted" style="margin:6px 0 0">' + esc(p.sci) + '</p>' : '') +
        '<p class="small" style="margin:6px 0 0"><b>Signes retrouvés :</b> ' + esc(r.hits.join(' ; ')) + '.</p>' +
        '<p class="small" style="margin:6px 0 0"><b>Pour vérifier :</b> ' + esc(p.conf) + '</p>' +
        list('À faire tout de suite', p.vite) + list('Plan d\'action', planOf(p), true) + list('Lutte agroécologique et biologique', p.agro) +
        list('Si nécessaire : lutte chimique', p.chim) + list('Pour éviter que ça revienne', p.prev) +
        '</details>';
    }).join('') + '<p class="small muted" style="margin:4px 0 0">Diagnostic indicatif, établi à partir des symptômes. Faites-le confirmer par un technicien (ANADER, CNRA, Conseil du Café-Cacao, encadrement de votre filière) avant tout traitement chimique.</p>';
    $('#pmPrint').disabled = false;
  }

  function ficheHTML() {
    var rs = ranked().slice(0, 3);
    var obs = Object.keys(state.sel).filter(function (k) { return state.sel[k] && S[k]; }).map(function (k) { return S[k][1]; });
    var cons = '';
    try { if (typeof PROFIL !== 'undefined' && PROFIL) cons = (PROFIL.prenoms + ' ' + PROFIL.nom).trim(); } catch (e) {}
    var prod = $('#pmProd').value.trim(), lieu = $('#pmLieu').value.trim();
    var css = 'body{font:13px/1.45 "Source Sans 3",Arial,sans-serif;color:#18231C;margin:24px}h1{font-size:20px;margin:0 0 4px;color:#1D6A4A}h2{font-size:15px;margin:16px 0 4px;border-bottom:2px solid #1D6A4A;padding-bottom:2px}table{border-collapse:collapse;width:100%}td{padding:3px 6px;border-bottom:1px solid #D3DACF;vertical-align:top}td:first-child{color:#5B6A60;width:28%}ul,ol{margin:4px 0;padding-left:20px}.lvl{font-weight:700;color:#B4501A}.small{font-size:11px;color:#5B6A60}';
    var h = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Diagnostic ' + esc(state.crop) + '</title><style>' + css + '</style></head><body>' +
      '<h1>Fiche diagnostic : ' + esc(state.crop) + '</h1><p class="small">AKA AgroDiag CI · ' + new Date().toLocaleDateString('fr-FR') + '</p>' +
      '<table><tr><td>Producteur</td><td>' + esc(prod || '—') + '</td></tr><tr><td>Lieu / parcelle</td><td>' + esc(lieu || '—') + '</td></tr><tr><td>Conseiller</td><td>' + esc(cons || '—') + '</td></tr></table>' +
      '<h2>Ce qui a été observé</h2><ul>' + obs.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul>';
    rs.forEach(function (r, i) {
      var p = r.p;
      h += '<h2>' + (i + 1) + '. ' + esc(p.n) + ' <span class="lvl">(' + r.lvl[0] + ')</span></h2><p class="small">' + esc(p.t) + (p.sci ? ' · ' + esc(p.sci) : '') + '</p>' +
        '<p><b>Pour vérifier :</b> ' + esc(p.conf) + '</p>';
      [['À faire tout de suite', p.vite], ['Plan d\'action', planOf(p), 1], ['Lutte agroécologique et biologique', p.agro], ['Si nécessaire : lutte chimique', p.chim], ['Prévention', p.prev]].forEach(function (b) {
        if (!b[1] || !b[1].length) return; var tag = b[2] ? 'ol' : 'ul';
        h += '<p style="margin:6px 0 0"><b>' + b[0] + '</b></p><' + tag + '>' + b[1].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</' + tag + '>';
      });
    });
    h += '<p class="small" style="margin-top:18px">Diagnostic indicatif établi à partir des symptômes observés. À faire confirmer par un technicien avant tout traitement chimique. Produits homologués uniquement, avec équipement de protection.</p></body></html>';
    return h;
  }

  function printFiche() {
    var html = ficheHTML(), name = 'Diagnostic ' + state.crop;
    if (window.AgroDiagAndroid && window.AgroDiagAndroid.printHtml) { window.AgroDiagAndroid.printHtml(html, name); return; }
    var w = window.open('', '_blank');
    if (w) { w.document.open(); w.document.write(html.replace('</body>', '<script>setTimeout(function(){window.print()},400)<\/script></body>')); w.document.close(); }
  }

  function setCrop(c) { state.crop = c; state.sel = {}; pref('agrodiag.pmCrop', c); renderHead(); renderSigns(); results(); }

  function init() {
    var sel = $('#pmCrop'); if (!sel) return;
    var h = '';
    PM.CATS.forEach(function (cat) {
      var crops = Object.keys(C).filter(function (k) { return PM.CAT[k] === cat[0]; }).sort(function (a, b) { return a.localeCompare(b, 'fr'); });
      if (!crops.length) return;
      h += '<optgroup label="' + esc(cat[1]) + '">' + crops.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('') + '</optgroup>';
    });
    sel.innerHTML = h;
    var saved = pref('agrodiag.pmCrop'); if (saved && C[saved]) sel.value = saved; else sel.value = 'Cacao';
    sel.addEventListener('change', function () { setCrop(sel.value); });
    $('#pmSigns').addEventListener('change', function (e) { var id = e.target.getAttribute('data-s'); if (!id) return; state.sel[id] = e.target.checked; results(); });
    $('#pmReset').addEventListener('click', function () { state.sel = {}; renderSigns(); results(); });
    $('#pmPrint').addEventListener('click', printFiche);
    setCrop(sel.value);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window.PM);
