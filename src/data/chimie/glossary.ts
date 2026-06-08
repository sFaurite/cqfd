/**
 * Glossaire du cours « La chimie depuis l'atome ».
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
  // Partie I — l'atome quantique
  { terme: 'Orbitale atomique', def: 'Région de l’espace décrivant la <strong>distribution de probabilité</strong> de présence d’un électron (|ψ|²). Ce n’est pas une trajectoire : l’électron n’a pas de position définie entre deux mesures.', voir: '/chimie/partie-i/atome-hydrogene', alias: ['orbitale', 'fonction d’onde', 'psi', 'ψ'] },
  { terme: 'Nombres quantiques', def: 'Les entiers n (énergie), l (forme), m (orientation) et le spin qui caractérisent l’état d’un électron dans un atome. Chaque orbitale correspond à un triplet (n, l, m).', voir: '/chimie/partie-i/atome-hydrogene', alias: ['n', 'l', 'm', 'spin', 'nombre quantique principal'] },
  { terme: 'Quantification', def: 'Le fait que l’énergie d’un électron lié ne peut prendre que des valeurs <strong>discrètes</strong>, et non continues. Postulat fondamental du cours, vérifié par les spectres de raies.', voir: '/chimie/partie-i/postulats-quantiques', alias: ['niveau d’énergie', 'spectre de raies'] },
  { terme: 'Principe d’exclusion de Pauli', def: 'Deux électrons d’un atome ne peuvent partager les quatre mêmes nombres quantiques : au plus deux électrons (de spins opposés) par orbitale. Une nécessité, pas une règle approchée.', voir: '/chimie/partie-i/structure-electronique', alias: ['Pauli', 'exclusion'] },
  { terme: 'Configuration électronique', def: 'Répartition des électrons d’un atome dans ses orbitales (ex. 1s² 2s² 2p⁶). Construite par les règles de Klechkowski (ordre de remplissage) et de Hund (multiplicité maximale).', voir: '/chimie/partie-i/structure-electronique', alias: ['Klechkowski', 'règle de Hund', 'remplissage'] },
  { terme: 'Charge effective', def: 'Charge nucléaire réellement « ressentie » par un électron, réduite par l’<strong>écrantage</strong> des électrons internes (Z_eff < Z). Explique l’essentiel des tendances périodiques.', voir: '/chimie/partie-i/ecrantage-charge-effective', alias: ['Zeff', 'écrantage', 'effet d’écran'] },

  // Partie II — périodicité & liaison
  { terme: 'Tableau périodique', def: 'Classement des éléments par numéro atomique croissant, organisé pour refléter la <strong>structure électronique</strong> : les colonnes partagent la même configuration de valence.', voir: '/chimie/partie-ii/tableau-periodique', alias: ['période', 'groupe', 'bloc', 'classification périodique'] },
  { terme: 'Électronégativité', def: 'Tendance d’un atome à attirer vers lui les électrons d’une liaison. Échelle de Pauling. Règle empirique très prédictive, mais non rigoureusement définie.', voir: '/chimie/partie-ii/tendances-periodiques', alias: ['Pauling', 'électronégatif'] },
  { terme: 'Énergie d’ionisation', def: 'Énergie nécessaire pour arracher un électron à un atome gazeux. Augmente le long d’une période, diminue en descendant un groupe.', voir: '/chimie/partie-ii/tendances-periodiques', alias: ['ionisation', 'potentiel d’ionisation'] },
  { terme: 'Liaison covalente', def: 'Liaison résultant du <strong>partage</strong> d’un ou plusieurs doublets d’électrons entre deux atomes. Décrite simplement par le modèle de Lewis.', voir: '/chimie/partie-ii/liaison-covalente-lewis', alias: ['doublet liant', 'liaison simple', 'liaison double'] },
  { terme: 'Modèle de Lewis', def: 'Représentation des molécules par leurs doublets liants et non liants, guidée par la <strong>règle de l’octet</strong>. Modèle empirique puissant, mais aux limites réelles (hypervalence, O₂).', voir: '/chimie/partie-ii/liaison-covalente-lewis', alias: ['structure de Lewis', 'règle de l’octet', 'octet', 'charge formelle'] },
  { terme: 'Liaison ionique', def: 'Liaison résultant du <strong>transfert</strong> d’électrons d’un atome peu électronégatif (métal) à un atome très électronégatif, formant des ions de charges opposées qui s’attirent.', voir: '/chimie/partie-ii/liaison-ionique-metallique', alias: ['ion', 'cation', 'anion', 'cristal ionique'] },
  { terme: 'Orbitale moléculaire', def: 'Orbitale s’étendant sur toute la molécule, formée par combinaison des orbitales atomiques. Donne des OM <em>liantes</em> et <em>antiliantes</em> et l’ordre de liaison.', voir: '/chimie/partie-ii/orbitales-moleculaires', alias: ['OM', 'liante', 'antiliante', 'ordre de liaison', 'paramagnétisme'] },

  // Partie III — géométrie, polarité, états
  { terme: 'VSEPR', def: 'Modèle (Valence Shell Electron Pair Repulsion) prédisant la <strong>géométrie</strong> d’une molécule : les doublets autour d’un atome central s’écartent au maximum. Règle empirique de notation AXₙEₘ.', voir: '/chimie/partie-iii/vsepr-geometrie', alias: ['géométrie moléculaire', 'AXE', 'doublet non liant'] },
  { terme: 'Moment dipolaire', def: 'Grandeur vectorielle mesurant la séparation des charges dans une molécule. Résulte de la géométrie et des différences d’électronégativité. Décide si une molécule est <em>polaire</em>.', voir: '/chimie/partie-iii/polarite-moments-dipolaires', alias: ['polarité', 'dipôle', 'polaire', 'apolaire'] },
  { terme: 'Liaison hydrogène', def: 'Interaction attractive entre un atome H lié à N, O ou F et un doublet libre voisin. La plus forte des interactions intermoléculaires : explique le point d’ébullition élevé de l’eau.', voir: '/chimie/partie-iii/interactions-intermoleculaires', alias: ['pont hydrogène', 'van der Waals', 'forces intermoléculaires'] },
  { terme: 'Changement d’état', def: 'Transition entre solide, liquide et gaz, gouvernée par l’équilibre entre agitation thermique et forces intermoléculaires. Décrite par un <strong>diagramme de phases</strong>.', voir: '/chimie/partie-iii/etats-matiere-transitions', alias: ['transition de phase', 'fusion', 'vaporisation', 'diagramme de phases', 'point triple'] },

  // Partie IV — thermochimie
  { terme: 'Enthalpie', def: 'Grandeur (H) dont la variation ΔH mesure la chaleur échangée à pression constante. ΔH < 0 : réaction <em>exothermique</em> ; ΔH > 0 : <em>endothermique</em>. Additive (loi de Hess).', voir: '/chimie/partie-iv/energie-enthalpie', alias: ['ΔH', 'exothermique', 'endothermique', 'loi de Hess'] },
  { terme: 'Entropie', def: 'Grandeur (S) comptant le nombre de <strong>micro-états</strong> accessibles : S = k ln Ω. Ce n’est pas le « désordre » naïf, mais une mesure du nombre de configurations.', voir: '/chimie/partie-iv/entropie-second-principe', alias: ['ΔS', 'micro-état', 'second principe', 'Boltzmann'] },
  { terme: 'Enthalpie libre', def: 'Grandeur (G) de Gibbs : ΔG = ΔH − TΔS. Son signe tranche la <strong>spontanéité</strong> à température et pression constantes : ΔG < 0, réaction spontanée.', voir: '/chimie/partie-iv/enthalpie-libre-spontaneite', alias: ['ΔG', 'Gibbs', 'spontanéité', 'enthalpie libre de Gibbs'] },

  // Partie V — équilibres, cinétique, solutions
  { terme: 'Équilibre chimique', def: 'État où les réactions directe et inverse se compensent : les concentrations n’évoluent plus. Caractérisé par la <strong>constante d’équilibre</strong> K.', voir: '/chimie/partie-v/equilibre-chimique', alias: ['constante d’équilibre', 'K', 'Le Chatelier', 'quotient réactionnel'] },
  { terme: 'Énergie d’activation', def: 'Barrière d’énergie (Eₐ) à franchir pour passer des réactifs aux produits, via un <strong>état de transition</strong>. Un catalyseur l’abaisse sans changer ΔH ni ΔG.', voir: '/chimie/partie-v/cinetique-chimique', alias: ['Ea', 'Arrhenius', 'catalyseur', 'état de transition', 'cinétique'] },
  { terme: 'Acide / base', def: 'Selon Brønsted : un acide cède un proton H⁺, une base le capte. Le couple acide/base est caractérisé par son <strong>pKa</strong> ; l’acidité d’une solution par son pH.', voir: '/chimie/partie-v/acide-base', alias: ['pH', 'pKa', 'Brønsted', 'tampon', 'titrage', 'équivalence'] },
  { terme: 'Oxydoréduction', def: 'Réaction par <strong>transfert d’électrons</strong> : l’oxydant en gagne (réduction), le réducteur en perd (oxydation). Quantifiée par le <em>nombre d’oxydation</em> et le potentiel standard E°.', voir: '/chimie/partie-v/oxydoreduction', alias: ['oxydant', 'réducteur', 'nombre d’oxydation', 'potentiel standard', 'pile', 'redox'] },

  // Partie VI — chimie du carbone
  { terme: 'Hybridation', def: 'Modèle décrivant le mélange des orbitales du carbone (sp³, sp², sp) pour rendre compte de sa géométrie et de ses liaisons σ et π. Modèle descriptif commode, pas une réalité physique.', voir: '/chimie/partie-vi/carbone-squelette', alias: ['sp3', 'sp2', 'sp', 'liaison σ', 'liaison π', 'sigma', 'pi'] },
  { terme: 'Groupe fonctionnel', def: 'Assemblage d’atomes (—OH, —COOH, —NH₂…) qui confère à une molécule organique sa réactivité caractéristique et définit sa <strong>famille</strong> (alcools, acides, amines…).', voir: '/chimie/partie-vi/groupes-fonctionnels', alias: ['fonction', 'alcool', 'amine', 'acide carboxylique', 'ester'] },
  { terme: 'Mécanisme réactionnel', def: 'Description, étape par étape, de la façon dont les liaisons se forment et se rompent lors d’une réaction. Notée par des <strong>flèches courbes</strong> figurant le déplacement des électrons.', voir: '/chimie/partie-vi/mecanismes-reactionnels', alias: ['flèche courbe', 'nucléophile', 'électrophile', 'intermédiaire réactionnel'] },
  { terme: 'Isomérie', def: 'Existence de molécules de même formule brute mais d’arrangement différent (isomères de constitution, stéréo-isomères). Source majeure de la diversité de la chimie du carbone.', voir: '/chimie/partie-vi/carbone-squelette', alias: ['isomère', 'stéréo-isomérie'] },
];
