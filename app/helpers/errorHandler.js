// on récupére notre méthode errorHandler
const ApiError = require('../errors/apiError');

const errorHandler = (err, res) => {
    const { message } = err;
    // "?" Si il y'a une info alors j'envoie le statusCode
    let statusCode = err.infos?.statusCode;
    // statuscode doit retourner un nombre sinon on passe une erreur 500
    if (!statusCode || Number.isNaN(Number(statusCode))) {
        statusCode = 500;
    }
    // si la statusCode est 500 on console.log l'erreur
    if (statusCode === 500) {
        console.error(err);
    }

    // Si l'application n'est pas en développement on reste vague sur l'erreur serveur
    if (statusCode === 500 && res.app.get('env') !== 'development') {
        // message = 'Internal Server Error';
    }
    // "?" Si il y'a une info alors j'envoie la suite des instructions
    // Si on est dans un contenu de type html on envoie l'erreur dans le navigateur directement avec le titre, le statut code et le message
    if (res.get('Content-type')?.includes('html')) {
        res.status(statusCode).render('error', {
            statusCode,
            message,
            title: `Error ${err.statusCode}`,
        });
    } else {
        // Sinon on envoie du json avec les infos sur l'erreur
        res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
    }
};

// On exporte le module 
module.exports = {
    ApiError,
    errorHandler,
};