/**
 * Glossaire — chaque terme technique, sa définition, et la page où il est
 * introduit/démontré (`voir`). Trié et affiché par /glossaire.
 */
export interface TermeGlossaire {
  terme: string;
  /** définition courte (le HTML simple est autorisé : <em>, <strong>) */
  def: string;
  /** lien vers la page de référence */
  voir?: string;
  /** mots-clés alternatifs pour la recherche */
  alias?: string[];
}

export const GLOSSAIRE: TermeGlossaire[] = [
  { terme: 'Référentiel (galiléen)', def: 'Système de coordonnées d’espace et de temps depuis lequel on décrit le mouvement. Galiléen (ou inertiel) : sans accélération, où un corps libre va en ligne droite à vitesse constante.', voir: '/physique/partie-i/postulats' },
  { terme: 'Postulat', def: 'Hypothèse de départ admise sans démonstration, sur laquelle repose toute une théorie. La relativité restreinte en a deux.', voir: '/physique/partie-i/postulats' },
  { terme: 'Vitesse limite invariante (c)', def: 'Vitesse identique dans tous les référentiels galiléens, qui borne toute propagation de cause à effet. Elle vaut exactement 299 792 458 m/s. La lumière la suit parce qu’elle est sans masse — d’où son nom historique de « vitesse de la lumière ».', voir: '/physique/partie-i/postulats', alias: ['vitesse de la lumière', 'célérité'] },
  { terme: 'Relativité de la simultanéité', def: 'Deux événements simultanés dans un référentiel ne le sont pas forcément dans un autre. Conséquence directe des postulats.', voir: '/physique/partie-i/postulats' },
  { terme: 'Dilatation du temps', def: 'Une horloge en mouvement bat plus lentement, vue depuis le référentiel où elle se déplace : Δt = γ·Δt₀.', voir: '/physique/partie-i/consequences' },
  { terme: 'Temps propre', def: 'Durée mesurée par une horloge entre deux événements qui se produisent au même endroit pour elle (Δt₀). C’est la plus courte de toutes les durées mesurées.', voir: '/physique/partie-i/consequences' },
  { terme: 'Contraction des longueurs', def: 'Un objet en mouvement est mesuré plus court dans le sens du déplacement : L = L₀/γ.', voir: '/physique/partie-i/consequences' },
  { terme: 'Facteur de Lorentz (γ)', def: 'Nombre γ = 1/√(1 − v²/c²) ≥ 1 qui quantifie tous les effets relativistes. Vaut 1 au repos, tend vers l’infini quand v → c.', voir: '/physique/partie-i/lorentz-gamma', alias: ['gamma'] },
  { terme: 'Transformations de Lorentz', def: 'Formules qui relient les coordonnées (t, x) d’un même événement entre deux référentiels en mouvement relatif. Remplacent les transformations de Galilée.', voir: '/physique/partie-i/transformations-lorentz' },
  { terme: 'Composition des vitesses', def: 'Règle relativiste d’addition des vitesses qui garantit qu’on ne dépasse jamais c, même en additionnant deux vitesses proches de c.', voir: '/physique/partie-i/transformations-lorentz' },
  { terme: 'Espace-temps de Minkowski', def: 'Cadre géométrique à 4 dimensions (1 de temps + 3 d’espace) où se déroule la relativité restreinte.', voir: '/physique/partie-i/minkowski' },
  { terme: 'Intervalle d’espace-temps', def: 'Quantité s² = (cΔt)² − Δx² identique dans tous les référentiels (invariant). Joue le rôle de « distance » dans l’espace-temps.', voir: '/physique/partie-i/minkowski' },
  { terme: 'Cône de lumière', def: 'Surface décrivant tous les rayons lumineux passant par un événement ; sépare le passé, le futur et l’« ailleurs » causalement inaccessible.', voir: '/physique/partie-i/minkowski' },
  { terme: 'Quantité de mouvement relativiste', def: 'p = γmv. Se réduit à mv aux faibles vitesses, mais diverge quand v → c, rendant c inatteignable pour une masse non nulle.', voir: '/physique/partie-ii/quantite-mouvement' },
  { terme: 'Énergie de repos', def: 'Énergie E = mc² qu’une particule possède du seul fait de sa masse, même immobile. Cas particulier de E = γmc² quand v = 0.', voir: '/physique/partie-ii/energie' },
  { terme: 'Relation énergie-impulsion', def: 'E² = (mc²)² + (pc)². Relie énergie, masse et quantité de mouvement ; valable aussi pour les particules sans masse (E = pc).', voir: '/physique/partie-ii/e-mc2' },
  { terme: 'Particule sans masse', def: 'Particule de masse nulle (ex. photon, gluon). Elle se déplace forcément à c, ne peut être au repos, et vérifie E = pc.', voir: '/physique/partie-ii/particules-sans-masse' },
  { terme: 'Défaut de masse', def: 'Différence entre la masse d’un système lié et la somme des masses de ses constituants ; correspond à l’énergie de liaison (E = mc²).', voir: '/physique/partie-ii/masse-energie-confinee' },
  { terme: 'Énergie de liaison', def: 'Énergie qu’il faut fournir pour séparer les constituants d’un système lié (noyau, proton). Compte négativement dans la masse totale.', voir: '/physique/partie-ii/masse-energie-confinee' },
  { terme: 'Corps noir', def: 'Objet idéal absorbant tout rayonnement. Le spectre de son émission, inexplicable classiquement, a lancé la physique quantique (Planck, 1900).', voir: '/physique/partie-iii/echec-classique' },
  { terme: 'Effet photoélectrique', def: 'Émission d’électrons par un métal éclairé. Son seuil en fréquence prouve que la lumière est faite de quanta d’énergie E = hν (Einstein, 1905).', voir: '/physique/partie-iii/echec-classique' },
  { terme: 'Quantum / quantification', def: 'Une grandeur est quantifiée si elle ne prend que des valeurs discrètes (par paquets), comme l’énergie échangée par la lumière (hν).', voir: '/physique/partie-iii/echec-classique' },
  { terme: 'Constante de Planck (h, ħ)', def: 'Constante fondamentale du monde quantique. h = 6,626×10⁻³⁴ J·s ; ħ = h/2π. Fixe l’échelle des phénomènes quantiques.', voir: '/physique/partie-iii/dualite-de-broglie' },
  { terme: 'Dualité onde-corpuscule', def: 'Toute particule présente à la fois des aspects ondulatoires et corpusculaires, selon l’expérience réalisée.', voir: '/physique/partie-iii/dualite-de-broglie' },
  { terme: 'Longueur d’onde de de Broglie', def: 'λ = h/p : longueur d’onde associée à toute particule de quantité de mouvement p.', voir: '/physique/partie-iii/dualite-de-broglie' },
  { terme: 'Principe d’incertitude de Heisenberg', def: 'On ne peut connaître simultanément position et quantité de mouvement avec une précision arbitraire : Δx·Δp ≥ ħ/2.', voir: '/physique/partie-iii/heisenberg' },
  { terme: 'Champ quantique', def: 'Entité fondamentale remplissant tout l’espace ; une particule est une excitation localisée de son champ. Il y a un champ par type de particule.', voir: '/physique/partie-iii/champs-quantiques' },
  { terme: 'Fermion', def: 'Particule de spin demi-entier (½) obéissant au principe d’exclusion de Pauli. Les fermions constituent la matière : quarks et leptons.', voir: '/physique/partie-iv/fermions' },
  { terme: 'Boson', def: 'Particule de spin entier. Les bosons de jauge (spin 1) transmettent les forces ; le Higgs est un boson de spin 0.', voir: '/physique/partie-iv/bosons-jauge' },
  { terme: 'Quark', def: 'Fermion sensible à l’interaction forte, porteur d’une charge de couleur et d’une charge électrique fractionnaire. 6 saveurs : u, d, c, s, t, b.', voir: '/physique/partie-iv/fermions' },
  { terme: 'Lepton', def: 'Fermion insensible à l’interaction forte : électron, muon, tau et leurs trois neutrinos.', voir: '/physique/partie-iv/fermions' },
  { terme: 'Génération', def: 'Les fermions se rangent en 3 familles (générations) de structure identique mais de masses croissantes. La matière ordinaire n’utilise que la première.', voir: '/physique/partie-iv/fermions' },
  { terme: 'Saveur', def: 'Nom de l’« espèce » d’un quark ou d’un lepton (up, down, électron, muon…). L’interaction faible peut changer la saveur.', voir: '/physique/partie-iv/fermions' },
  { terme: 'Chiralité', def: 'Propriété « gaucher / droitier » d’une particule, liée à la façon dont son spin se rapporte à son mouvement. Centrale pour la masse et la force faible.', voir: '/physique/partie-iv/chiralite' },
  { terme: 'Spin', def: 'Moment cinétique intrinsèque d’une particule, quantifié. Distingue fermions (½) et bosons (0, 1).', voir: '/physique/partie-iv/fermions' },
  { terme: 'Boson de jauge', def: 'Particule médiatrice d’une interaction, imposée par une symétrie de jauge : photon (électromagnétisme), gluons (force forte), W et Z (force faible).', voir: '/physique/partie-iv/bosons-jauge' },
  { terme: 'Symétrie de jauge', def: 'Invariance d’une théorie sous certaines transformations locales des champs. Elle impose l’existence des bosons médiateurs et protège la masse nulle du photon et des gluons.', voir: '/physique/partie-v/electromagnetisme' },
  { terme: 'Champ de Higgs', def: 'Champ non nul partout dans l’Univers. Son interaction avec les particules élémentaires leur donne leur masse ; son excitation est le boson de Higgs (~125 GeV).', voir: '/physique/partie-iv/higgs' },
  { terme: 'Mécanisme de Higgs', def: 'Processus par lequel le champ de Higgs donne leur masse aux particules élémentaires (fermions, W, Z) sans briser explicitement les symétries de jauge.', voir: '/physique/partie-iv/higgs' },
  { terme: 'Interaction forte', def: 'Force la plus intense, portée par les gluons entre quarks colorés. Responsable du confinement.', voir: '/physique/partie-v/interaction-forte' },
  { terme: 'Confinement', def: 'Impossibilité d’isoler un quark ou un gluon : ils restent enfermés dans des particules composites (hadrons) de couleur neutre.', voir: '/physique/partie-v/interaction-forte' },
  { terme: 'Force nucléaire (résiduelle)', def: 'Effet résiduel de l’interaction forte qui lie protons et neutrons dans le noyau, transmis par des mésons (pions). Distincte de la force forte fondamentale entre quarks.', voir: '/physique/partie-v/interaction-forte' },
  { terme: 'Hadron', def: 'Particule composite faite de quarks liés par la force forte : baryons (3 quarks, ex. proton) et mésons (quark + antiquark, ex. pion).', voir: '/physique/partie-v/interaction-forte' },
  { terme: 'Charge de couleur', def: 'Charge de l’interaction forte, portée par quarks et gluons. Trois valeurs (rouge, vert, bleu) ; seules les combinaisons « neutres » existent librement.', voir: '/physique/partie-v/interaction-forte' },
  { terme: 'Interaction faible', def: 'Force responsable du changement de saveur et de la désintégration β, transmise par les bosons massifs W et Z, d’où sa très courte portée.', voir: '/physique/partie-v/interaction-faible' },
  { terme: 'Désintégration β', def: 'Transformation d’un neutron en proton (ou inverse) avec émission d’un électron (ou positron) et d’un (anti)neutrino, via l’interaction faible.', voir: '/physique/partie-v/interaction-faible' },
  { terme: 'Unification électrofaible', def: 'Description commune de l’électromagnétisme et de l’interaction faible comme deux facettes d’une même interaction au-delà de ~100 GeV.', voir: '/physique/partie-v/electrofaible' },
  { terme: 'Graviton', def: 'Boson hypothétique de spin 2 qui transmettrait la gravitation dans une théorie quantique. Jamais observé ; absent du Modèle Standard.', voir: '/physique/partie-v/gravitation' },
  { terme: 'Relativité générale', def: 'Théorie de la gravitation d’Einstein (1915) : la gravité est la courbure de l’espace-temps par l’énergie. Non quantique.', voir: '/physique/partie-vi/gravite-quantique' },
  { terme: 'Oscillation des neutrinos', def: 'Phénomène où un neutrino change de saveur en se propageant. Il prouve que les neutrinos ont une masse non nulle — incompatible avec le Modèle Standard d’origine.', voir: '/physique/partie-vi/masse-neutrinos' },
  { terme: 'Mécanisme du seesaw', def: 'Hypothèse expliquant la petitesse des masses des neutrinos par l’existence de partenaires très lourds. Plausible mais non confirmée.', voir: '/physique/partie-vi/masse-neutrinos' },
  { terme: 'Particule de Majorana', def: 'Particule qui serait sa propre antiparticule. Le neutrino pourrait en être une — question ouverte.', voir: '/physique/partie-vi/masse-neutrinos' },
  { terme: 'Matière noire', def: 'Matière invisible, détectée seulement par ses effets gravitationnels, qui constituerait ~27 % de l’Univers. Sa nature est inconnue.', voir: '/physique/partie-vi/matiere-noire' },
  { terme: 'Énergie noire', def: 'Composante responsable de l’accélération de l’expansion de l’Univers (~68 % du contenu énergétique). Nature inconnue, distincte de la matière noire.', voir: '/physique/partie-vi/matiere-noire' },
  { terme: 'Asymétrie matière-antimatière', def: 'Excès observé de matière sur l’antimatière dans l’Univers, encore inexpliqué par le Modèle Standard.', voir: '/physique/partie-vi/asymetrie' },
  { terme: 'Problème de hiérarchie', def: 'Mystère de l’extrême faiblesse de la gravité (et de la légèreté de la masse du Higgs) face à l’échelle de Planck.', voir: '/physique/partie-vi/hierarchie' },
  { terme: 'Antiparticule', def: 'Pour chaque particule, une partenaire de même masse mais de charges opposées. Quand elles se rencontrent, elles s’annihilent en énergie.', voir: '/physique/partie-iv/fermions' },
];
