import Swal from 'sweetalert2';

import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
btnEliminar.addEventListener('click', e =>{
  const urlProyecto = e.target.dataset.proyectoUrl;

 // console.log(urlProyecto);

 //return ;
    Swal.fire({
      title: 'Estas seguro Eliminar el Proyecto?',
      text: "Si se elimina, pierde el proyecto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrarlo!',
      cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        const url =`${location.origin}/proyectos/${urlProyecto}`;
       // console.log(url);
       // return;
        axios.delete(url, {params: {urlProyecto}})
          .then(function(respuesta){
            console.log(respuesta)

                Swal.fire(
                  'Proyecto Borrado!',
                  respuesta.data,
                  'success'
                );
                
                setTimeout(()=>{
                  window.location.href='/'
                }, 2000);
          })
          .catch(()=>{
            Swal.fire({
              type: 'error',
              title: 'Hubo un eror',
              text: 'No se pudo eliminar el proyecto!',
              icon: 'error'
            })
          })
          }
      })  
  })
}
export default btnEliminar;

