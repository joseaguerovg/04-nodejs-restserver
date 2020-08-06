// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Url DB
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;

// Vencimiento token
process.env.TOKEN_EXPIRE = 60 * 60 * 24 * 30;

// Seed de autenticación
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'secret-token-dev';