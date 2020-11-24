const { request, response } = require("express");
const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (request, response)=>{
   // response.send('Funciona!!!!!!!!');
   response.render('crearCuenta',{
        nombrePagina:'Crear Cuenta Plataforma'
   });

}

exports.formIniciarSesion = (request, response)=>{
   // response.send('Funciona!!!!!!!!');
   const { error }= response.locals.mensajes;

   response.render('iniciarSesion',{
        nombrePagina:'Iniciar Sesión Plataforma',
        error
   });

}

exports.crearCuenta = async (request, response)=>{
   //console.log(request.body);
   const {email, password} = request.body;

   try {
     await Usuarios.create({
         email, password
      });

      const confirmarUrl =`http://${request.headers.host}/confirmar/${email}`;

      const usuario ={
         email
      }
      await enviarEmail.enviar({
         usuario,
         subject: 'Confirma tu Cuenta de Proyectos',
         confirmarUrl,
         archivo: 'confirmar-cuenta'
     });

     request.flash('correcto','enviamos un correo confirma tu cuenta');
     response.redirect('/iniciar-sesion');

   } catch (error) {
      request.flash('error', error.errors.map(error => error.message));
      response.render('crearCuenta',{
         mensajes: request.flash(),
         nombrePagina:'Crear Cuenta Plataforma',
         email,
         password
      })
     // console.log(error);
   }

}

exports.formRestablecerPassword = (request, response)=>{
   response.render('restablecer',{
      nombrePagina: 'Restablecer tu Password'
   })
}

exports.confirmarCuenta =async (request, response)=>{
   //response.json(request.params.correo);

   const usuario = await Usuarios.findOne({
      where:{
         email:request.params.correo
      }
   });
   if(!usuario){
      request.flash('error', 'No existe la cuenta');
      response.redirect('/crear-cuenta');
   }

   usuario.activo =1;

   await usuario.save();

   request.flash('correcto','Cuenta Activa Correctamente');
   response.redirect('/iniciar-sesion');
}