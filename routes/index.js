const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ProyectosController = require('../controllers/ProyectosController');
const TareasController = require('../controllers/TareasController');
const UsuariosController = require('../controllers/UsuariosController');
const authController= require('../controllers/authController');

module.exports = function () {
    router.get('/',authController.usuarioAutenticado,ProyectosController.ProyectosHome);
    router.get('/nuevoProyecto',authController.usuarioAutenticado,ProyectosController.FormularioProyecto);
    router.post('/nuevoProyecto', authController.usuarioAutenticado,
    ProyectosController.nuevoProyecto);

    //Listar Proyectos
    router.get('/proyectos/:url', authController.usuarioAutenticado, ProyectosController.ProyectoporUrl)

    // Ruta de Edición
    router.get('/proyecto/editar/:id', authController.usuarioAutenticado, ProyectosController.formularioEditar);

    //crear el metodo post de edición
    router.post('/nuevoProyecto/:id',authController.usuarioAutenticado, ProyectosController.editarProyecto);

    //crear el metodo de eliminación
    router.delete('/proyectos/:url',authController.usuarioAutenticado, ProyectosController.eliminarProyecto);

    //Crear el método para inserción tareas
    router.post('/proyectos/:url',authController.usuarioAutenticado, TareasController.agregarTarea);

    //Método para actualizar
    router.patch('/tareas/:id',authController.usuarioAutenticado, TareasController.cambiarEstadoTarea);
    
    //Crear el método de eliminar Tarea
    router.delete('/tareas/:id',authController.usuarioAutenticado, TareasController.eliminarTarea);

    //crear el metodo para llamar el login
    router.get('/crear-cuenta', UsuariosController.formCrearCuenta);
    router.post('/crear-cuenta', UsuariosController.crearCuenta);
    router.get('/confirmar/:correo', UsuariosController.confirmarCuenta);

    //crear el formulario de Inciar sesión
    router.get('/iniciar-sesion', UsuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //Cerrar Sesión
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //restablecer password
    router.get('/restablecer', UsuariosController.formRestablecerPassword);
    router.post('/restablecer', authController.enviarToken);

    router.get('/restablecer/:token', authController.resetPassword);

    router.post('/restablecer/:token', authController.actualizarPassword);

    
    return router;
}
