const express = require('express');
const { request, response } = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const helpers= require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser=require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({path:'variables.env'});

require('./models/Proyecto');
require('./models/Tareas');
require('./models/Usuarios');

const db = require('./config/db');

db.sync()
    .then(()=> console.log('Conectado a la Fiesta'))
    .catch(error => console.log(error))

//creción  de una app express

const app = express();

app.use(express.static('public'));

app.set('view engine','pug');

//habilitar librería bodyParser
app.use(bodyParser.urlencoded({extended:true}));

app.set('views', path.join(__dirname,'./views'));

//invocar flash
app.use(flash());

//manejo de sesiones
app.use(cookieParser());

app.use(session({
    secret:'Secreto',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());

app.use(passport.session());

app.use((request, response, next)=>{
    response.locals.vardump = helpers.vardump;
    response.locals.mensajes= request.flash();
    response.locals.usuarios = {...request.user} || null;
    next();
})

app.use((request, response, next)=>{
    //console.log('Otro Middleware');
    const fecha = new Date();
    response.locals.fecha = fecha.getFullYear();
    next();
})


//ruta para el home
app.use('/', routes());

//puerto a escuchar para el servidor
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 4000;

app.listen(port, host, ()=>{
    console.log('el servidor esta activo');
});



