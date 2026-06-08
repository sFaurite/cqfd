/**
 * Glossaire du cours « L'histoire humaine : des premiers hommes aux temps modernes ».
 * Chaque terme, sa définition courte, et la page où il est introduit (`voir`).
 */
export interface TermeGlossaire {
  terme: string;
  /** définition courte (HTML simple autorisé : <em>, <strong>) */
  def: string;
  voir?: string;
  alias?: string[];
}

export const GLOSSAIRE: TermeGlossaire[] = [
  // Méthode & temps
  { terme: 'Préhistoire', def: 'Période de l’aventure humaine <strong>antérieure à l’écriture</strong>, connue surtout par l’archéologie et les fossiles, sans textes pour la raconter.', voir: '/histoire/partie-i/profondeur-du-temps', alias: ['protohistoire'] },
  { terme: 'Datation au carbone 14', def: 'Méthode mesurant la <strong>décroissance radioactive</strong> du carbone 14 (demi-vie ≈ 5 730 ans) pour dater des restes organiques jusqu’à environ 50 000 ans.', voir: '/histoire/partie-i/profondeur-du-temps', alias: ['carbone 14', 'C-14', 'radiocarbone'] },
  { terme: 'Source', def: 'Toute trace du passé exploitée par l’historien : <em>texte, vestige archéologique, image, objet</em>. On distingue sources <em>directes</em> (contemporaines) et <em>indirectes</em>.', voir: '/histoire/methodologie', alias: ['document', 'vestige'] },

  // Paléolithique & hominisation
  { terme: 'Hominisation', def: 'Ensemble des transformations (bipédie, cerveau, outils, langage) menant des primates aux humains. C’est un processus long, pas un instant.', voir: '/histoire/partie-i/premiers-hominines' },
  { terme: 'Bipédie', def: 'Locomotion sur deux membres. Caractère ancien et décisif de la lignée humaine, libérant les mains.', voir: '/histoire/partie-i/premiers-hominines', alias: ['bipède'] },
  { terme: 'Australopithèque', def: 'Genre d’homininés africains anciens (≈ −4 à −2 millions d’années), bipèdes mais au petit cerveau. <em>Lucy</em> en est la plus célèbre.', voir: '/histoire/partie-i/premiers-hominines', alias: ['Lucy', 'hominidé'] },
  { terme: 'Genre Homo', def: 'Groupe auquel nous appartenons, marqué par un cerveau plus grand, l’outillage de pierre et, plus tard, le feu (<em>Homo habilis, erectus, sapiens</em>…).', voir: '/histoire/partie-i/genre-homo-outils-feu', alias: ['Homo habilis', 'Homo erectus'] },
  { terme: 'Paléolithique', def: 'L’« âge de la pierre taillée » : la plus longue période humaine, faite de chasseurs-cueilleurs nomades, jusqu’à la fin des glaces.', voir: '/histoire/partie-i/genre-homo-outils-feu', alias: ['pierre taillée', 'chasseur-cueilleur'] },
  { terme: 'Homo sapiens', def: 'Notre espèce, apparue en Afrique il y a ≈ 300 000 ans, qui a peuplé toute la planète et coexisté un temps avec d’autres humanités.', voir: '/histoire/partie-i/sapiens-sortie-afrique', alias: ['sapiens'] },
  { terme: 'Néandertal', def: 'Humanité d’Eurasie, contemporaine de Sapiens puis disparue (≈ −40 000), avec qui notre espèce s’est en partie métissée.', voir: '/histoire/partie-i/sapiens-sortie-afrique', alias: ['néandertalien', 'Denisova'] },
  { terme: 'Art pariétal', def: 'Peintures et gravures réalisées sur les <strong>parois</strong> des grottes (Lascaux, Chauvet) : trace majeure de la pensée symbolique paléolithique.', voir: '/histoire/partie-i/pensee-symbolique-art', alias: ['Lascaux', 'Chauvet', 'art rupestre'] },

  // Néolithique
  { terme: 'Néolithique', def: 'Période de la <strong>« révolution néolithique »</strong> : adoption de l’agriculture et de l’élevage, de la sédentarité, de la poterie et de la pierre polie.', voir: '/histoire/partie-ii/fin-glaciaire-domestication', alias: ['révolution néolithique', 'pierre polie'] },
  { terme: 'Domestication', def: 'Transformation, par sélection humaine sur des générations, d’espèces sauvages (blé, orge, mouton, bœuf) en espèces cultivées ou élevées.', voir: '/histoire/partie-ii/fin-glaciaire-domestication', alias: ['agriculture', 'élevage'] },
  { terme: 'Sédentarité', def: 'Mode de vie fixé en un même lieu (village), par opposition au nomadisme des chasseurs-cueilleurs. Permise par l’agriculture.', voir: '/histoire/partie-ii/village-neolithique', alias: ['sédentaire', 'village'] },
  { terme: 'Âge des métaux', def: 'Maîtrise progressive du <strong>cuivre puis du bronze</strong> (alliage cuivre-étain), favorisant artisans spécialisés, échanges et élites.', voir: '/histoire/partie-ii/metaux-echanges', alias: ['cuivre', 'bronze', 'métallurgie'] },

  // Cités, États, écriture
  { terme: 'Cité-État', def: 'Ville indépendante gouvernée avec son territoire (Uruk, Athènes). Première forme d’État connue, en Mésopotamie.', voir: '/histoire/partie-iii/naissance-cites-mesopotamie', alias: ['cité', 'polis', 'Uruk'] },
  { terme: 'Mésopotamie', def: 'Région « entre les fleuves » (Tigre et Euphrate), berceau des premières cités, de l’écriture et des premiers empires.', voir: '/histoire/partie-iii/naissance-cites-mesopotamie', alias: ['Sumer', 'Babylone'] },
  { terme: 'Cunéiforme', def: 'Écriture mésopotamienne formée de <strong>coins</strong> imprimés dans l’argile au calame. Née de la comptabilité, elle finit par transcrire la langue.', voir: '/histoire/partie-iii/invention-ecriture', alias: ['écriture', 'tablette', 'calame'] },
  { terme: 'Hiéroglyphe', def: 'Système d’écriture de l’Égypte ancienne, mêlant signes figuratifs et phonétiques, déchiffré grâce à la pierre de Rosette.', voir: '/histoire/partie-iii/egypte-etat-territorial', alias: ['Égypte', 'pierre de Rosette'] },
  { terme: 'Empire', def: 'Vaste État réunissant sous une même autorité des peuples et territoires divers (Akkad, Rome, Han). Souvent issu de conquêtes.', voir: '/histoire/partie-iii/premiers-empires-droit', alias: ['Akkad', 'Hammurabi'] },

  // Antiquité
  { terme: 'Démocratie', def: 'Régime où le pouvoir appartient au <em>dèmos</em> (le peuple des citoyens). Inventée à Athènes, elle excluait femmes, esclaves et étrangers.', voir: '/histoire/partie-iv/cite-grecque-savoir', alias: ['Athènes', 'citoyen'] },
  { terme: 'Romanisation', def: 'Diffusion de la langue, du droit, de l’urbanisme et des modes de vie romains dans les territoires conquis par Rome.', voir: '/histoire/partie-iv/rome-republique-empire', alias: ['Rome', 'République', 'droit romain'] },

  // Moyen Âge
  { terme: 'Féodalité', def: 'Système médiéval de liens personnels entre seigneurs et vassaux, fondé sur le <em>fief</em> et le service, dans un Occident sans État central fort.', voir: '/histoire/partie-v/feodalite-societe-medievale', alias: ['fief', 'seigneur', 'vassal'] },
  { terme: 'Byzance', def: 'L’Empire romain d’Orient, de capitale Constantinople, qui prolonge Rome plus de mille ans après la chute de l’Occident.', voir: '/histoire/partie-v/trois-heritiers-rome', alias: ['Constantinople', 'empire byzantin'] },
  { terme: 'Routes de la soie', def: 'Réseau de routes commerciales et de transmission de savoirs reliant la Chine à la Méditerranée à travers l’Eurasie.', voir: '/histoire/partie-v/routes-echanges-eurasie', alias: ['route de la soie', 'commerce'] },
  { terme: 'Peste noire', def: 'Pandémie du milieu du XIVᵉ siècle qui tua une grande part de la population d’Eurasie, bouleversant durablement les sociétés.', voir: '/histoire/partie-v/ruptures-fin-moyen-age', alias: ['peste', 'pandémie'] },

  // Vers la modernité
  { terme: 'Imprimerie', def: 'Technique de reproduction des textes par <strong>caractères mobiles</strong> (Gutenberg, ≈ 1450) : le savoir se diffuse en masse.', voir: '/histoire/partie-vi/imprimerie-revolution-information', alias: ['Gutenberg', 'caractères mobiles'] },
  { terme: 'Grandes découvertes', def: 'Voyages océaniques européens (XVᵉ–XVIᵉ s.) reliant pour la première fois tous les continents — naissance d’un monde globalisé et des empires coloniaux.', voir: '/histoire/partie-vi/grandes-decouvertes-premier-monde-global', alias: ['découvertes', 'colonisation', 'caravelle'] },
  { terme: 'Humanisme', def: 'Mouvement intellectuel de la Renaissance qui place l’homme et l’étude des textes anciens au cœur du savoir.', voir: '/histoire/partie-vi/renaissance-humanisme', alias: ['Renaissance', 'humaniste'] },
  { terme: 'Réforme', def: 'Rupture religieuse du XVIᵉ siècle (Luther, Calvin) qui divise durablement la chrétienté latine entre catholiques et protestants.', voir: '/histoire/partie-vi/reforme-fractures-religieuses', alias: ['Luther', 'Calvin', 'protestantisme'] },
  { terme: 'Révolution scientifique', def: 'Nouvelle façon de connaître (XVIᵉ–XVIIᵉ s.) fondée sur l’observation, l’expérience et les mathématiques (Copernic, Galilée, Newton).', voir: '/histoire/partie-vi/etat-moderne-science-naissante', alias: ['science', 'Galilée', 'méthode expérimentale'] },
];
