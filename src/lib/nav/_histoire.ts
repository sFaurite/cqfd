/**
 * Navigation du cours « L'histoire humaine : des premiers hommes aux temps
 * modernes » — SOURCE UNIQUE de l'ordre. Chemins NON préfixés : `index.ts` les
 * préfixe par `/histoire`.
 */
import type { Partie } from './_maths';

export const PARTIES: Partie[] = [
  {
    id: 'introduction',
    roman: '0',
    titre: 'Introduction',
    accroche: 'Comment lire ce cours, ce que signifient les encarts et les badges, et comment on sait ce qu’on raconte.',
    chapitres: [
      { slug: 'comment-lire', path: '/comment-lire', num: 0, titre: 'Comment lire ce cours', court: 'Comment lire ce cours', accroche: 'Les encarts dépliables, l’échelle d’attestation historique, la promesse exacte.' },
      { slug: 'methodologie', path: '/methodologie', num: 0, titre: 'Méthodologie : sources, traces et niveaux d’attestation', court: 'Méthodologie', accroche: 'Ce que veut dire « attesté », « probable », « reconstitué » et « débattu » — et comment on date le passé.' },
    ],
  },
  {
    id: 'partie-i',
    roman: 'I',
    titre: 'Devenir humain : hominisation et paléolithique',
    accroche: 'Des millions d’années pour devenir humain : bipédie, outils, feu, sortie d’Afrique et naissance de la pensée symbolique.',
    chapitres: [
      { slug: 'profondeur-du-temps', path: '/partie-i/profondeur-du-temps', num: 1, titre: 'La profondeur du temps et comment on le mesure', court: 'Profondeur du temps', accroche: 'Le vertige des échelles : datations relatives et absolues, du carbone 14 aux strates géologiques.' },
      { slug: 'premiers-hominines', path: '/partie-i/premiers-hominines', num: 2, titre: 'Les premiers homininés : bipédie et buissonnement', court: 'Premiers homininés', accroche: 'Australopithèques et cousins : l’évolution humaine n’est pas une ligne, mais un buisson.' },
      { slug: 'genre-homo-outils-feu', path: '/partie-i/genre-homo-outils-feu', num: 3, titre: 'Le genre Homo : outils, viande et feu', court: 'Genre Homo : outils & feu', accroche: 'Tailler la pierre, manger de la viande, maîtriser le feu : ce qui change un primate en Homo.' },
      { slug: 'sapiens-sortie-afrique', path: '/partie-i/sapiens-sortie-afrique', num: 4, titre: 'Sapiens, la sortie d’Afrique et les autres humanités', court: 'Sapiens hors d’Afrique', accroche: 'Une espèce africaine peuple la planète, croise Néandertal et Denisova, puis reste seule.' },
      { slug: 'pensee-symbolique-art', path: '/partie-i/pensee-symbolique-art', num: 5, titre: 'Pensée symbolique : langage, sépultures et art pariétal', court: 'Pensée symbolique & art', accroche: 'Parures, tombes, peintures de Lascaux : les premières traces d’un esprit qui symbolise.' },
    ],
  },
  {
    id: 'partie-ii',
    roman: 'II',
    titre: 'La révolution néolithique',
    accroche: 'La fin des glaces ouvre l’agriculture et l’élevage : villages, métaux, inégalités — le tournant le plus profond depuis le feu.',
    chapitres: [
      { slug: 'fin-glaciaire-domestication', path: '/partie-ii/fin-glaciaire-domestication', num: 6, titre: 'La fin des glaces et les premières domestications', court: 'Fin des glaces & domestication', accroche: 'Le réchauffement post-glaciaire : domestiquer plantes et animaux, sur plusieurs foyers indépendants.' },
      { slug: 'village-neolithique', path: '/partie-ii/village-neolithique', num: 7, titre: 'Le village néolithique : sédentariser le quotidien', court: 'Village néolithique', accroche: 'Maisons, greniers, poterie : l’invention de la vie sédentaire et de la maisonnée.' },
      { slug: 'consequences-neolithiques', path: '/partie-ii/consequences-neolithiques', num: 8, titre: 'Le revers du Néolithique : santé, démographie, inégalités', court: 'Revers du Néolithique', accroche: 'Plus de monde, mais plus mal nourri : maladies, hiérarchies et propriété apparaissent.' },
      { slug: 'metaux-echanges', path: '/partie-ii/metaux-echanges', num: 9, titre: 'Métaux, spécialisation et réseaux d’échange', court: 'Métaux & échanges', accroche: 'Cuivre puis bronze : artisans spécialisés, longues routes de commerce, premières élites.' },
    ],
  },
  {
    id: 'partie-iii',
    roman: 'III',
    titre: 'Cités, États et l’invention de l’écriture',
    accroche: 'En Mésopotamie et sur le Nil naissent les villes, l’État et l’écriture : l’histoire « écrite » commence.',
    chapitres: [
      { slug: 'naissance-cites-mesopotamie', path: '/partie-iii/naissance-cites-mesopotamie', num: 10, titre: 'Naissance des cités : Sumer et l’État archaïque', court: 'Cités de Sumer', accroche: 'Uruk, le temple, le palais : comment des villages deviennent des cités-États gouvernées.' },
      { slug: 'invention-ecriture', path: '/partie-iii/invention-ecriture', num: 11, titre: 'L’invention de l’écriture : compter, puis dire', court: 'Invention de l’écriture', accroche: 'Du jeton comptable au cunéiforme : l’écriture naît de la gestion, puis apprend à parler.' },
      { slug: 'egypte-etat-territorial', path: '/partie-iii/egypte-etat-territorial', num: 12, titre: 'L’Égypte : un État territorial sur le Nil', court: 'L’Égypte du Nil', accroche: 'Le fleuve, le pharaon, les hiéroglyphes : un État unifié et durable sur des millénaires.' },
      { slug: 'premiers-empires-droit', path: '/partie-iii/premiers-empires-droit', num: 13, titre: 'Premiers empires, droit écrit et effondrements', court: 'Empires & droit écrit', accroche: 'Akkad, Babylone, le code de Hammurabi, puis l’effondrement de l’âge du bronze.' },
    ],
  },
  {
    id: 'partie-iv',
    roman: 'IV',
    titre: 'Les empires de l’Antiquité, à l’échelle du monde',
    accroche: 'Grèce, Rome, mais aussi Chine, Inde, Perse et Amériques : des mondes en parallèle, connectés par les routes.',
    chapitres: [
      { slug: 'cite-grecque-savoir', path: '/partie-iv/cite-grecque-savoir', num: 14, titre: 'La cité grecque, la politique et le savoir rationnel', court: 'La cité grecque', accroche: 'La polis, la démocratie athénienne, la philosophie : penser la cité et le monde par la raison.' },
      { slug: 'rome-republique-empire', path: '/partie-iv/rome-republique-empire', num: 15, titre: 'Rome : d’une cité à un empire-monde', court: 'Rome, cité-empire', accroche: 'De la République à l’Empire : droit, armée, routes et romanisation d’un bassin méditerranéen.' },
      { slug: 'mondes-paralleles-chine-inde-amerique', path: '/partie-iv/mondes-paralleles-chine-inde-amerique', num: 16, titre: 'Mondes en parallèle : Chine, Inde, Perse et Amériques', court: 'Mondes en parallèle', accroche: 'L’empire Han, les Maurya, la Perse achéménide, les cités américaines : d’autres civilisations majeures.' },
      { slug: 'fin-rome-recompositions', path: '/partie-iv/fin-rome-recompositions', num: 17, titre: 'La fin de Rome en Occident : transformation, pas chute', court: 'Fin de Rome en Occident', accroche: 'Migrations, royaumes barbares, christianisation : non un effondrement brutal, mais une mutation.' },
    ],
  },
  {
    id: 'partie-v',
    roman: 'V',
    titre: 'Le monde médiéval : trois civilisations et leurs routes',
    accroche: 'Byzance, l’islam et l’Occident féodal : trois héritiers de Rome, reliés par un réseau eurasien de routes et de savoirs.',
    chapitres: [
      { slug: 'trois-heritiers-rome', path: '/partie-v/trois-heritiers-rome', num: 18, titre: 'Trois héritiers de Rome : Byzance, l’islam, l’Occident', court: 'Trois héritiers de Rome', accroche: 'L’empire byzantin, l’expansion de l’islam, l’Occident latin : trois mondes issus d’un même héritage.' },
      { slug: 'feodalite-societe-medievale', path: '/partie-v/feodalite-societe-medievale', num: 19, titre: 'Féodalité et société de l’Occident médiéval', court: 'Féodalité', accroche: 'Seigneurs, paysans, Église : comment se tient une société sans État fort, du château au village.' },
      { slug: 'routes-echanges-eurasie', path: '/partie-v/routes-echanges-eurasie', num: 20, titre: 'Un monde connecté : routes, savoirs et grandes religions', court: 'Routes & savoirs', accroche: 'Routes de la soie, commerce, transmission des sciences et diffusion des grandes religions.' },
      { slug: 'ruptures-fin-moyen-age', path: '/partie-v/ruptures-fin-moyen-age', num: 21, titre: 'Ruptures de la fin du Moyen Âge : peste, crises, États', court: 'Ruptures du bas Moyen Âge', accroche: 'La Peste noire, les guerres et les famines, puis la consolidation des premiers États modernes.' },
    ],
  },
  {
    id: 'partie-vi',
    roman: 'VI',
    titre: 'Vers la modernité : découvertes, Renaissance, Réforme, science',
    accroche: 'Imprimerie, voyages océaniques, humanisme, Réforme et science naissante : les portes des temps modernes.',
    chapitres: [
      { slug: 'imprimerie-revolution-information', path: '/partie-vi/imprimerie-revolution-information', num: 22, titre: 'L’imprimerie : une révolution de l’information', court: 'L’imprimerie', accroche: 'Gutenberg et les caractères mobiles : reproduire le savoir en masse, et bouleverser sa diffusion.' },
      { slug: 'grandes-decouvertes-premier-monde-global', path: '/partie-vi/grandes-decouvertes-premier-monde-global', num: 23, titre: 'Voyages océaniques : le premier monde globalisé', court: 'Premier monde global', accroche: 'Caravelles, routes maritimes et empires coloniaux : les continents entrent en contact, pour le meilleur et le pire.' },
      { slug: 'renaissance-humanisme', path: '/partie-vi/renaissance-humanisme', num: 24, titre: 'Renaissance et humanisme : relire les Anciens, regarder autrement', court: 'Renaissance & humanisme', accroche: 'Retour aux Anciens, perspective, dignité de l’homme : un nouveau regard sur le monde et le savoir.' },
      { slug: 'reforme-fractures-religieuses', path: '/partie-vi/reforme-fractures-religieuses', num: 25, titre: 'La Réforme : fractures religieuses et guerres de religion', court: 'La Réforme', accroche: 'Luther, Calvin et la rupture de la chrétienté latine, jusqu’aux guerres de religion.' },
      { slug: 'etat-moderne-science-naissante', path: '/partie-vi/etat-moderne-science-naissante', num: 26, titre: 'Vers la modernité : État souverain et science naissante', court: 'État moderne & science', accroche: 'L’État souverain et la révolution scientifique : une nouvelle façon de gouverner et de connaître.' },
    ],
  },
  {
    id: 'annexes',
    roman: '★',
    titre: 'Annexes',
    accroche: 'Glossaire des termes et index des repères chronologiques et symboles.',
    chapitres: [
      { slug: 'glossaire', path: '/glossaire', num: 0, titre: 'Glossaire', court: 'Glossaire', accroche: 'Tous les termes historiques, reliés à leur page.' },
      { slug: 'symboles', path: '/symboles', num: 0, titre: 'Repères et symboles', court: 'Repères & symboles', accroche: 'Les grands repères chronologiques et symboles du cours, avec leur statut d’attestation.' },
    ],
  },
];
