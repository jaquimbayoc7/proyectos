const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos Son Obligatorios!'
});

exports.usuarioAutenticado = (request, response, next)=>{
    if(request.isAuthenticated()){
        return next();
    }

    return response.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (request, response)=>{ 
    request.session.destroy(()=>{
        response.redirect('/');
    });

}

exports.enviarToken = async(request, response)=>{

    const usuario = await Usuarios.findOne({where:{email:request.body.email}})

    if(!usuario){
        request.flash('error','No existe esta cuenta!');
       /* response.render('restablecer',{
            nombrePagina:'Restablecer Password',
            mensajes:request.flash()
        })*/
        response.redirect('/restablecer');
    }
    //enviar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    //console.log(token);
    usuario.expiracion = Date.now()+3600000;

    await usuario.save();

    const resetUrl =`http://${request.headers.host}/restablecer/${usuario.token}`;
    //console.log(resetUrl);

    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecer-password'
    });

    request.flash('correcto','Se ha enviado un Mensaje a tu correo');
    response.redirect('/iniciar-sesion');
}

exports.resetPassword = async(request, response)=>{

   // response.json(request.params.token);
    const usuario = await Usuarios.findOne({
        where:{token:request.params.token}
    });

    //console.log(usuario);

    if(!usuario){
        request.flash('error','No es Válido el Token');
        response.redirect('/restablecer');
    }

    response.render('resetPassword',{
        nombrePagina: 'Restablecer Password!'
    });

}

exports.actualizarPassword = async(request, response)=>{
    //console.log(request.params.token);
    const usuario = await Usuarios.findOne({
        where:{
            token:request.params.token,
            expiracion:{
                [Op.gte]:Date.now()
            }
        }

    });
    if(!usuario){
        request.flash('error','No válido.. Excedió la Fecha y Hora');
        response.redirect('/restablecer');
    }

    usuario.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10));

    usuario.token = null;

    usuario.expiracion = null;

    await usuario.save();

    request.flash('correcto','Haz cambiado tu Password');

    response.redirect('/iniciar-sesion');
}

