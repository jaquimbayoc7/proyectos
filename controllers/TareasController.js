const { request } = require('express');
const Proyectos = require('../models/Proyecto');
const Tareas = require('../models/Tareas');

exports.agregarTarea= async (request, response, next)=>{
    const proyecto = await Proyectos.findOne({where:{url:request.params.url}});

    //console.log(proyecto);
    //console.log(request.body);

    const {tarea} = request.body;

    const estado = 0;

    const ProyectoId = proyecto.id;

    //Insertar
    const resultado = await Tareas.create({tarea, estado, ProyectoId});

    if(!resultado){
        return next();
    }

    response.redirect(`/proyectos/${request.params.url}`);
}

exports.cambiarEstadoTarea = async (request, response)=>{
    const { id }= request.params;
    const tarea = await Tareas.findOne({where:{id}});

    let estado =0;
    if(tarea.estado === estado){
        estado =1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();

    if(!resultado) return next();

    response.status(200).send('Actualizado');
}

exports.eliminarTarea = async(request, response)=>{
    //console.log(request.params);
    const { id }= request.params;
    //Eliminar
    const resultado = await Tareas.destroy({where:{id}});

    if(!resultado) return next();

    response.status(200).send("Tarea Eliminada Correctamente");
}