const { request } = require("express")
const Proyectos = require('../models/Proyecto');
const Tareas = require('../models/Tareas');
const { body } = require('express-validator');
const slug = require('slug');


exports.ProyectosHome = async (request, response)=>{
    
   // console.log(response.locals.usuarios);
   const usuarioId = response.locals.usuarios.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});

    response.render('index',{
        nombrePagina:'Proyectos ',
        proyectos
    
    });
}

exports.FormularioProyecto = async (request, response)=>{

    const usuarioId = response.locals.usuarios.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    response.render('nuevoProyecto',{nombrePagina:'Nuevo Proyecto', proyectos});
}

exports.nuevoProyecto = async (request, response) =>{
    const usuarioId = response.locals.usuarios.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    //response.send("Enviaste el Formulario Correctamente")
    console.log(request.body);
    
    const { nombre } = request.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto':'Agrega un Proyecto'})
    }

    if(!/^[a-záéíóúA-ZÁÉÍÓÚñÑ ]+$/.test(nombre)){
        errores.push({'texto':'Solo se aceptan Letras A-Z, ni caracteres especiales'});

    }

    if(errores.length>0){
        response.render('nuevoProyecto',{
            nombrePagina:'Nuevo proyecto',
            errores,
            proyectos
        })
    }else{
        
       //console.log(slug(nombre));
       const usuarioId = response.locals.usuarios.id;

       const proyecto= await Proyectos.create({ nombre, usuarioId });
       response.redirect('/');
        
    }
}

exports.ProyectoporUrl= async (request, response, next)=>{

    const usuarioId = response.locals.usuarios.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});


    const proyectoPromise = Proyectos.findOne(
        {
            where:{
                url:request.params.url
            }
        }
    );

    const[proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    //Buscar Tareas
    const tareas = await Tareas.findAll({
        where:{
            proyectoId : proyecto.id
        }
        //, include: [{model: Proyectos}]
    });

    //console.log(tareas);

    if(!proyecto) return next();

   // console.log('Listo');

    //response.send(proyecto);

    response.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto, //findOne -url
        proyectos,
        tareas // findAll
    })

}

/*exports.formularioEditar = async (request, response)=>{

const proyectos = await Proyectos.findAll();

response.render('nuevoProyecto',{
    nombrePagina:'Editar Proyecto',
    proyectos
})
}*/

exports.formularioEditar = async(request, response)=>{

    const usuarioId = response.locals.usuarios.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});


    const proyectoPromise = Proyectos.findOne(
        {
            where:{
                id:request.params.id
            }
        }
    );

    const[proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    response.render('nuevoProyecto',{
        nombrePagina:'Editar Proyecto',
        proyectos,
        proyecto
    })

}

exports.editarProyecto = async (request, response) =>{
    const usuarioId = response.locals.usuarios.id;
    const proyectos = Proyectos.findAll({where:{usuarioId}});

    //response.send("Enviaste el Formulario Correctamente")
    console.log(request.body);
    
    const { nombre } = request.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto':'Agrega un Proyecto'})
    }

    if(!/^[a-záéíóúA-ZÁÉÍÓÚñÑ ]+$/.test(nombre)){
        errores.push({'texto':'Solo se aceptan Letras A-Z, ni caracteres especiales'});

    }

    if(errores.length>0){
        response.render('nuevoProyecto',{
            nombrePagina:'Nuevo proyecto',
            errores,
            proyectos
        })
    }else{
        
       //console.log(slug(nombre));
    

       await Proyectos.update(
           { nombre:nombre },
           {
               where:{id:request.params.id}
           });
           
       response.redirect('/');
        
    }
}

exports.eliminarProyecto = async(request, response, next)=>{

    const {urlProyecto} = request.query;

    console.log(urlProyecto);

    const resultado = await Proyectos.destroy({where:{url:urlProyecto}});

    console.log(resultado);

    if(!resultado){
        return next();
    }

    response.status(200).send('Proyecto Eliminado Correctamente!');

}
