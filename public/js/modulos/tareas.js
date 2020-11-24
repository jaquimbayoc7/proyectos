import axios from 'axios';
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';


const tareas = document.querySelector('.listado-pendientes');

if(tareas){
    tareas.addEventListener('click', e =>{
        //console.log(e.target.classList);
        if(e.target.classList.contains('fa-check-circle')){
           // console.log('actualizando');
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            const url = `${location.origin}/tareas/${idTarea}`;
           // console.log(url);
           axios.patch(url, { idTarea })
           .then(function(respuesta){
              // console.log(respuesta);
              if(respuesta.status===200){
                  icono.classList.toggle('completo');
                  actualizarAvance();
              }
           })
        }
        if(e.target.classList.contains('fa-trash')){
            //console.log('Eliminando...');
            const tareaHTML = e.target.parentElement.parentElement,
            idTarea = tareaHTML.dataset.tarea;
            //console.log(tareaHTML);
           // console.log(idTarea);
            Swal.fire({
                title: 'Estas seguro Eliminar la Tarea?',
                text: "Si se elimina, pierde la Tarea!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borrarlo!',
                cancelButtonText: 'Cancelar!'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, {params:{idTarea}})
                    .then(function(respuesta){
                        //console.log(respuesta);
                        if(respuesta.status===200){
                            tareaHTML.parentElement.removeChild(tareaHTML);

                            //opcional
                            Swal.fire(
                                'Tarea Eliminada',
                                respuesta.data,
                                'success'
                            )

                            actualizarAvance();
                           
                        }
                    })
                }
            })
        }
    });
}
export default tareas;