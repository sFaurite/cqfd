/**
 * Glossaire du cours « L'IA moderne, de zéro ».
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
  // Partie I — le neurone et l'ajustement
  { terme: 'Neurone formel', def: 'Unité de calcul de base : une <strong>somme pondérée</strong> des entrées plus un biais, suivie d’une fonction d’activation. Géométriquement, un hyperplan qui sépare l’espace.', voir: '/ia/partie-i/neurone-formel', alias: ['perceptron', 'unité'] },
  { terme: 'Poids', def: 'Coefficients <em>w</em> multipliant chaque entrée. Ce sont les paramètres ajustés pendant l’apprentissage ; ils encodent ce que le modèle a « appris ».', voir: '/ia/partie-i/neurone-formel', alias: ['weights', 'paramètres'] },
  { terme: 'Biais', def: 'Terme constant <em>b</em> ajouté à la somme pondérée. Il décale le seuil de déclenchement du neurone indépendamment des entrées.', voir: '/ia/partie-i/neurone-formel', alias: ['bias'] },
  { terme: 'Fonction d’activation', def: 'Fonction non linéaire appliquée à la somme pondérée (seuil, sigmoïde, ReLU…). C’est elle qui permet à un réseau d’aller au-delà du linéaire.', voir: '/ia/partie-iii/non-linearites', alias: ['activation', 'ReLU', 'tanh'] },
  { terme: 'Régression linéaire', def: 'Modèle qui prédit une sortie continue comme combinaison linéaire des entrées. Le premier ajustement : trouver la « meilleure » droite à travers des points.', voir: '/ia/partie-i/regression-lineaire' },
  { terme: 'Régression logistique', def: 'Neurone à activation sigmoïde dont la sortie s’interprète comme une <strong>probabilité</strong>. Le pas du calcul brut vers la classification.', voir: '/ia/partie-i/regression-logistique' },
  { terme: 'Sigmoïde', def: 'Fonction en forme de S, σ(z) = 1 / (1 + e⁻ᶻ), qui écrase tout réel dans l’intervalle ]0, 1[. Transforme un score en probabilité.', voir: '/ia/partie-i/regression-logistique', alias: ['σ', 'logistique'] },

  // Partie II — apprendre = descendre une pente
  { terme: 'Fonction de perte', def: 'Mesure chiffrée de l’écart entre les prédictions et la vérité (erreur quadratique, entropie croisée). Apprendre, c’est la <strong>minimiser</strong>.', voir: '/ia/partie-ii/fonction-de-perte', alias: ['loss', 'coût', 'fonction objectif', 'entropie croisée'] },
  { terme: 'Gradient', def: 'Vecteur des dérivées partielles de la perte par rapport aux paramètres. Il pointe dans la direction de plus forte <em>montée</em> de la perte.', voir: '/ia/partie-ii/derivees-gradient', alias: ['dérivée partielle', '∇'] },
  { terme: 'Descente de gradient', def: 'Algorithme d’optimisation : modifier les paramètres à petits pas dans le sens <strong>opposé</strong> au gradient pour faire baisser la perte.', voir: '/ia/partie-ii/descente-de-gradient', alias: ['gradient descent'] },
  { terme: 'Taux d’apprentissage', def: 'Taille du pas de la descente de gradient (η). Trop petit : lent ; trop grand : oscillations ou divergence. Un hyperparamètre clé à régler.', voir: '/ia/partie-ii/descente-de-gradient', alias: ['learning rate', 'η', 'pas d’apprentissage'] },
  { terme: 'Graphe de calcul', def: 'Représentation d’une expression comme un graphe d’opérations élémentaires. Dériver une composition revient à multiplier les dérivées le long des arêtes.', voir: '/ia/partie-ii/graphe-de-calcul', alias: ['computational graph'] },
  { terme: 'Règle de la chaîne', def: 'Règle de dérivation des fonctions composées : la dérivée de f∘g est le produit des dérivées. Le fondement mathématique de la rétropropagation.', voir: '/ia/partie-ii/graphe-de-calcul', alias: ['chain rule'] },
  { terme: 'Rétropropagation', def: 'Algorithme qui calcule efficacement toutes les dérivées d’un réseau en remontant le graphe une seule fois, en appliquant la règle de la chaîne.', voir: '/ia/partie-ii/retropropagation', alias: ['backprop', 'backpropagation', 'passe arrière'] },

  // Partie III — le réseau profond
  { terme: 'Perceptron multicouche', def: 'Réseau de neurones organisé en couches successives (entrée, couches cachées, sortie). Une couche cachée suffit à créer des frontières non linéaires.', voir: '/ia/partie-iii/perceptron-multicouche', alias: ['MLP', 'couche cachée', 'réseau dense', 'fully connected'] },
  { terme: 'ReLU', def: 'Activation max(0, z) : laisse passer les valeurs positives, annule les négatives. Simple, peu coûteuse, et efficace contre l’atténuation du gradient.', voir: '/ia/partie-iii/non-linearites', alias: ['rectified linear unit'] },
  { terme: 'Approximation universelle', def: 'Théorème : un réseau à une couche cachée assez large peut approcher n’importe quelle fonction continue sur un domaine borné (compact), avec la précision voulue. <em>Existence</em> d’un réseau — pas garantie qu’on l’apprenne.', voir: '/ia/partie-iii/approximation-universelle', alias: ['théorème d’approximation universelle'] },
  { terme: 'SGD', def: 'Descente de gradient <strong>stochastique</strong> : estimer le gradient sur un petit lot (mini-batch) plutôt que sur tout le jeu de données. Plus rapide et plus robuste.', voir: '/ia/partie-iii/optimiseurs-sgd-adam', alias: ['descente de gradient stochastique', 'mini-batch', 'mini-lot'] },
  { terme: 'Adam', def: 'Optimiseur à pas adaptatif combinant momentum (inertie) et mise à l’échelle par les gradients passés. La recette par défaut pour entraîner un réseau.', voir: '/ia/partie-iii/optimiseurs-sgd-adam', alias: ['momentum', 'optimiseur adaptatif'] },
  { terme: 'Surapprentissage', def: 'Le modèle colle au <em>bruit</em> des données d’entraînement au lieu d’en capter la loi générale : excellent à l’entraînement, médiocre sur des données nouvelles.', voir: '/ia/partie-iii/regularisation-overfitting', alias: ['overfitting', 'généralisation', 'sous-apprentissage'] },
  { terme: 'Régularisation', def: 'Techniques limitant le surapprentissage (pénalité sur les poids, dropout, arrêt précoce, augmentation de données). On bride la complexité pour mieux généraliser.', voir: '/ia/partie-iii/regularisation-overfitting', alias: ['dropout', 'weight decay', 'arrêt précoce'] },

  // Partie IV — voir et représenter
  { terme: 'Convolution', def: 'Application d’un même petit filtre glissé sur toute l’image. <strong>Localité</strong> et <strong>partage de poids</strong> détectent un motif où qu’il se trouve, à faible coût.', voir: '/ia/partie-iv/convolution', alias: ['filtre', 'noyau', 'kernel'] },
  { terme: 'Réseau convolutif', def: 'Réseau empilant convolutions et sous-échantillonnages (pooling). Construit une hiérarchie de représentations, des bords aux objets.', voir: '/ia/partie-iv/reseaux-convolutifs', alias: ['CNN', 'convnet', 'pooling', 'carte de caractéristiques'] },
  { terme: 'Plongement', def: 'Représentation d’un objet (mot, item) par un <strong>vecteur dense</strong> où la proximité géométrique reflète la proximité de sens. Le sens devient géométrie.', voir: '/ia/partie-iv/plongements', alias: ['embedding', 'vecteur de mots', 'word embedding', 'espace latent'] },

  // Partie V — attention & transformer
  { terme: 'Token', def: 'Unité élémentaire que le modèle manipule : un mot, un sous-mot ou un caractère. Le texte est d’abord découpé en suite de tokens.', voir: '/ia/partie-vi/tokenisation', alias: ['jeton'] },
  { terme: 'Mécanisme d’attention', def: 'Opération où chaque position calcule une <strong>requête</strong> et la compare aux <strong>clés</strong> de toutes les positions (la sienne comprise) pour pondérer leurs <strong>valeurs</strong>. Chercher l’information par son contenu.', voir: '/ia/partie-v/mecanisme-attention', alias: ['attention', 'requête', 'clé', 'valeur', 'query', 'key', 'value', 'self-attention'] },
  { terme: 'Transformer', def: 'Architecture empilant des blocs d’attention multi-têtes, de couches denses, de connexions résiduelles et de normalisation. Traite la séquence en parallèle ; socle des grands modèles.', voir: '/ia/partie-v/transformer', alias: ['multi-têtes', 'connexion résiduelle', 'résidu', 'normalisation de couche'] },
  { terme: 'Modèle récurrent', def: 'Réseau qui traite une séquence pas à pas en maintenant un état (RNN, LSTM). Naturel pour le texte, mais peine sur les longues dépendances.', voir: '/ia/partie-v/sequences-limite-rnn', alias: ['RNN', 'LSTM', 'récurrent'] },

  // Partie VI — grands modèles de langage
  { terme: 'Tokenisation', def: 'Découpage du texte en tokens (souvent des sous-mots). Détermine le vocabulaire réellement vu par le modèle ; fragmente les mots rares et les nombres.', voir: '/ia/partie-vi/tokenisation', alias: ['BPE', 'sous-mot', 'tokeniseur'] },
  { terme: 'Pré-entraînement', def: 'Phase où le modèle apprend, sur d’énormes corpus, à <strong>prédire le token suivant</strong>. Cette seule tâche suffit à faire émerger de larges capacités.', voir: '/ia/partie-vi/pre-entrainement', alias: ['pretraining', 'prédiction du mot suivant', 'auto-supervisé'] },
  { terme: 'Grand modèle de langage', def: 'Transformer de très grande taille pré-entraîné à prédire le token suivant sur du texte massif, puis souvent affiné et aligné. Abrégé LLM.', voir: '/ia/partie-vi/pre-entrainement', alias: ['LLM', 'large language model'] },
  { terme: 'Décodage', def: 'Procédé qui transforme la distribution de probabilités prédite en texte : choix glouton, échantillonnage, top-k, recherche en faisceau.', voir: '/ia/partie-vi/generation-decodage', alias: ['génération', 'échantillonnage', 'top-k', 'faisceau', 'beam search'] },
  { terme: 'Température', def: 'Paramètre du décodage qui aplatit (température haute, plus de hasard) ou affûte (basse, plus déterministe) la distribution avant l’échantillonnage.', voir: '/ia/partie-vi/generation-decodage' },
  { terme: 'Lois d’échelle', def: 'Régularités empiriques où la perte décroît en <em>loi de puissance</em> avec la taille du modèle, des données et du calcul. Observées, pas démontrées (Chinchilla).', voir: '/ia/partie-vi/lois-echelle', alias: ['scaling laws', 'Chinchilla'] },
  { terme: 'Alignement', def: 'Ensemble de techniques (affinage par instructions, apprentissage par préférences humaines) qui font d’un prédicteur de texte un <strong>assistant</strong> utile et sûr.', voir: '/ia/partie-vi/alignement', alias: ['RLHF', 'affinage par instructions', 'fine-tuning', 'instruction tuning'] },
];
