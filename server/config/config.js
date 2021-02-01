//=========================================
//puerto
//========================

process.env.PORT = process.env.PORT || 3000;


//=========================================
//Entorno
//=========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================================
//Vencimiento del token 
//==============    ===========================

process.env.CADUCIDAD_TOKEN = '72h';

//=========================================
//SEED de autenticación 
//==============    ===========================

process.env.SEED = process.env.SEED || 'la-seguridad-de-la-app-dev';

//=========================================
//Base de datos 
//==============    ===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=========================================
// Google Client ID
//=========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '57447081062-npdanf5f3aelqcnc5b0m1mgut4j3itni.apps.googleusercontent.com';