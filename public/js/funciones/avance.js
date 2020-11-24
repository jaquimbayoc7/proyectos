import Swal from 'sweetalert2';

export const actualizarAvance = ()=>{
    //Seleccionar Tareas (todas)
    const tareas = document.querySelectorAll('li.tarea');

    if(tareas.length){
        //seleccionar tareas completadas
        const tareasCompletadas = document.querySelectorAll('i.completo');
        //calcular el avance
        const avance = Math.round((tareasCompletadas.length/tareas.length)*100);
        //rellenar barra
        const porcentaje = document.querySelector('#porcentaje');

        porcentaje.style.width= avance+'%';

        if(avance==100){
            Swal.fire(
                'Proyecto Completado',
                'Felicidades, tareas completadas',
                'success'
            )
        }
    }

}