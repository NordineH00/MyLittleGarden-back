// Mise en place de la gestion des erreurs utilisé une seule fois dans le code pour le moment

module.exports = class ApiError extends Error {
  constructor(message, infos) {
    // On envoie le message à la classe mère Error
    super(message, infos);
    // On défini le nom de l'erreur qui de base est 'Error'
    this.name = 'ApiError';
    // on défini les infos supplémentaires afin de les transporter
    this.infos = infos;
  }
};
