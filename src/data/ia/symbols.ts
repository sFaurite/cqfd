/**
 * Index des symboles et notations du cours « L'IA moderne, de zéro ».
 * Affiché par /ia/symboles. `katex` contient le code KaTeX (sans les $).
 */
export interface Symbole {
  katex: string;
  nom: string;
  desc: string;
  unite?: string;
  /** valeur ou statut, le cas échéant (démontré / empirique / recette) */
  valeur?: string;
  voir?: string;
}

export const SYMBOLES: Symbole[] = [
  // Le neurone et l'ajustement
  { katex: '\\mathbf{x}', nom: 'Vecteur d’entrée', desc: 'Les caractéristiques fournies au modèle, regroupées en un vecteur.', unite: '—', voir: '/ia/partie-i/neurone-formel' },
  { katex: '\\mathbf{w}', nom: 'Poids', desc: 'Coefficients appris, un par entrée. Paramètres ajustés par la descente de gradient.', unite: '—', voir: '/ia/partie-i/neurone-formel' },
  { katex: 'b', nom: 'Biais', desc: 'Terme constant additionné à la somme pondérée ; décale le seuil de déclenchement.', unite: '—', voir: '/ia/partie-i/neurone-formel' },
  { katex: 'z = \\mathbf{w}\\cdot\\mathbf{x} + b', nom: 'Pré-activation', desc: 'Somme pondérée des entrées plus le biais, avant la fonction d’activation.', unite: '—', voir: '/ia/partie-i/neurone-formel' },
  { katex: '\\hat{y}', nom: 'Prédiction', desc: 'Sortie du modèle, à comparer à la cible y. Continue (régression) ou probabilité (classification).', unite: '—', voir: '/ia/partie-i/regression-lineaire' },
  { katex: '\\sigma', nom: 'Sigmoïde', desc: 'Activation σ(z) = 1/(1+e⁻ᶻ) qui écrase un réel dans ]0, 1[ et le rend lisible comme probabilité.', unite: '—', voir: '/ia/partie-i/regression-logistique' },

  // Apprendre = descendre une pente
  { katex: '\\mathcal{L}', nom: 'Fonction de perte', desc: 'Mesure chiffrée de l’erreur du modèle. La quantité que l’apprentissage minimise.', unite: '—', voir: '/ia/partie-ii/fonction-de-perte' },
  { katex: '\\theta', nom: 'Paramètres', desc: 'L’ensemble des poids et biais du modèle, vus comme un seul grand vecteur.', unite: '—', voir: '/ia/partie-ii/descente-de-gradient' },
  { katex: '\\nabla_\\theta \\mathcal{L}', nom: 'Gradient de la perte', desc: 'Vecteur des dérivées partielles de la perte ; pointe vers la plus forte montée.', unite: '—', voir: '/ia/partie-ii/derivees-gradient' },
  { katex: '\\eta', nom: 'Taux d’apprentissage', desc: 'Taille du pas de la descente de gradient. Hyperparamètre à régler.', unite: '—', valeur: '≈ 10⁻³ à 10⁻⁴ (recette, dépend du modèle)', voir: '/ia/partie-ii/descente-de-gradient' },
  { katex: '\\delta', nom: 'Erreur rétropropagée', desc: 'Dérivée de la perte par rapport à la pré-activation d’un nœud, propagée vers l’arrière.', unite: '—', voir: '/ia/partie-ii/retropropagation' },
  { katex: '\\frac{\\partial f}{\\partial g}', nom: 'Dérivée partielle', desc: 'Sensibilité d’une sortie à une variable ; les arêtes du graphe de calcul portent ces dérivées.', unite: '—', voir: '/ia/partie-ii/graphe-de-calcul' },

  // Le réseau profond
  { katex: '\\mathbf{a}^{(l)}', nom: 'Activations de la couche l', desc: 'Vecteur des sorties des neurones de la couche l d’un perceptron multicouche.', unite: '—', voir: '/ia/partie-iii/perceptron-multicouche' },
  { katex: 'W^{(l)}', nom: 'Matrice de poids (couche l)', desc: 'Tous les poids reliant la couche l−1 à la couche l, rangés en matrice.', unite: '—', voir: '/ia/partie-iii/perceptron-multicouche' },
  { katex: '\\text{ReLU}(z)', nom: 'Activation ReLU', desc: 'max(0, z) : laisse passer le positif, annule le négatif. Activation par défaut des réseaux profonds.', unite: '—', voir: '/ia/partie-iii/non-linearites' },
  { katex: 'B', nom: 'Taille du lot (batch)', desc: 'Nombre d’exemples utilisés pour estimer le gradient à chaque pas de SGD.', unite: '—', valeur: 'typiquement 32 à 1024 (recette)', voir: '/ia/partie-iii/optimiseurs-sgd-adam' },
  { katex: '\\lambda', nom: 'Coefficient de régularisation', desc: 'Force de la pénalité sur les poids (weight decay). Compromis entre ajustement et simplicité.', unite: '—', valeur: 'réglé par validation (recette)', voir: '/ia/partie-iii/regularisation-overfitting' },

  // Voir et représenter
  { katex: 'K', nom: 'Noyau de convolution', desc: 'Petit filtre (ex. 3×3) glissé sur l’image ; ses coefficients sont appris et partagés.', unite: '—', voir: '/ia/partie-iv/convolution' },
  { katex: 'd', nom: 'Dimension de plongement', desc: 'Taille du vecteur dense représentant un mot ou un objet dans l’espace latent.', unite: '—', valeur: '≈ 100 à plusieurs milliers (implémentation)', voir: '/ia/partie-iv/plongements' },

  // Attention & transformer
  { katex: 'Q,\\, K,\\, V', nom: 'Requêtes, clés, valeurs', desc: 'Les trois projections de l’attention : on compare requêtes et clés pour pondérer les valeurs.', unite: '—', voir: '/ia/partie-v/mecanisme-attention' },
  { katex: '\\text{softmax}(z)_i = \\dfrac{e^{z_i}}{\\sum_j e^{z_j}}', nom: 'Softmax', desc: 'Transforme un vecteur de scores en distribution de probabilités. Cœur de l’attention et de la sortie d’un classifieur.', unite: '—', voir: '/ia/partie-v/mecanisme-attention' },
  { katex: '\\text{Attn}(Q,K,V)=\\text{softmax}\\!\\left(\\tfrac{QK^\\top}{\\sqrt{d_k}}\\right)V', nom: 'Attention par produit scalaire', desc: 'Formule de l’attention : pondérer les valeurs par la similarité requête-clé, mise à l’échelle.', unite: '—', voir: '/ia/partie-v/transformer' },

  // Grands modèles de langage
  { katex: 'V', nom: 'Taille du vocabulaire', desc: 'Nombre de tokens distincts que le modèle connaît, fixé par la tokenisation.', unite: '—', valeur: '≈ 30 000 à 200 000 (implémentation)', voir: '/ia/partie-vi/tokenisation' },
  { katex: 'P(x_{t}\\mid x_{<t})', nom: 'Probabilité du token suivant', desc: 'Distribution prédite pour le token t connaissant les précédents. Objet du pré-entraînement et de la génération.', unite: '—', voir: '/ia/partie-vi/pre-entrainement' },
  { katex: 'T', nom: 'Température', desc: 'Paramètre de décodage : T élevée aplatit la distribution (plus de hasard), T basse l’affûte.', unite: '—', valeur: '0 (glouton) à ≈ 1,5 (recette)', voir: '/ia/partie-vi/generation-decodage' },
  { katex: 'N,\\, D,\\, C', nom: 'Paramètres, données, calcul', desc: 'Les trois axes des lois d’échelle : nombre de paramètres N, de tokens d’entraînement D, et budget de calcul C.', unite: '—', voir: '/ia/partie-vi/lois-echelle' },
  { katex: '\\mathcal{L} \\propto N^{-\\alpha}', nom: 'Loi de puissance', desc: 'Forme empirique des lois d’échelle : la perte décroît comme une puissance de la taille. Constatée, non démontrée.', unite: '—', valeur: 'statut empirique (pas de théorie)', voir: '/ia/partie-vi/lois-echelle' },
];
