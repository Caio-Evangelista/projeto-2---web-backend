/**
 * Configuração de autenticação
 */
module.exports = {
    session: {
        secret: 'agenda-eletronica-mvc-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 dia
        }
    }
};
