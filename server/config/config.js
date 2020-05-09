//PUERTO
process.env.PORT = process.env.PORT || 3000;


//ENTORNO

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//Caducidad TOKEN
//El valor se encuentra en minutos
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//SEED DE TOKEN
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';


//GOOGLE CLIENT ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '530944329453-3n13nkkmofjtu55kqgo1v17t0qs4vce4.apps.googleusercontent.com';


//BASE DE DATOS

let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;