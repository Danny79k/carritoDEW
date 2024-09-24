// Variables, debes hacer el querySelector adecuado

const carrito = document.getElementById("carrito")//Busca el primer elemento cuyo id sea "carrito"
const listaCursos = document.getElementById("lista-cursos") //Busca el primer elemento cuyo id sea "lista-cursos"
const contenedorCarrito = document.getElementsByTagName("tbody")[0] //Busca el primer elemento tbody dentro del elemento con id lista-carrito
const vaciarCarritoBtn = document.getElementById("vaciar-carrito") //Busca el primer elemento cuyo id sea vaciar-carrito
const tarjetasCursos = document.getElementsByClassName("card"); //Busca todos los elementos cuya clase sea curso
let articulosCarrito = [];

// Listeners
cargarEventListeners();

function cargarEventListeners() {
     // Dispara cuando se presiona "Agregar Carrito"
     listaCursos.addEventListener('click', agregarCurso);

     // Cuando se elimina un curso del carrito
     carrito.addEventListener('click', eliminarCurso);

     // Al Vaciar el carrito
     vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
     vaciarCarritoBtn.addEventListener('click', despintarTodosBorde);


     // NUEVO: Contenido cargado
     document.addEventListener('DOMContentLoaded', () => {
          articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
          // console.log(articulosCarrito);
          carritoHTML();
     });
}


//#region // Función que añade el curso al carrito
function agregarCurso(e) {
     e.preventDefault();
     // Delegation para agregar-carrito
     if (e.target.classList.contains('agregar-carrito')) {
          const curso = e.target.parentElement.parentElement;
          pintaBorde(curso)
          // pintarBordeVerdeMismoAutor(curso)
          // Enviamos el curso seleccionado para tomar sus datos
          leerDatosCurso(curso);
     }
}

// Lee los datos del curso
// Usa querySelector para encontrar los elementos que se indican
function leerDatosCurso(curso) {
     const infoCurso = {
          imagen: curso.querySelector("img").src, //La imagen del curso
          titulo: curso.querySelector(".info-card h4").textContent, //el título del curso
          precio: curso.querySelector(".precio").textContent, //el precio con el descuento ya aplicado
          id: curso.querySelector("a").getAttribute("data-id"), //Vamos a buscar el data-id del curso, primero buca el elemento y luego accede al atributo
          propietario: curso.querySelector(".info-card p"), //Vamos a buscar el data-id del curso, primero buca el elemento y luego accede al atributo
          cantidad: 1
     }
     console.log(infoCurso.id);
     console.log(infoCurso.propietario);

     if (articulosCarrito.some(curso => curso.id === infoCurso.id)) {
          const cursos = articulosCarrito.map(curso => {
               if (curso.id === infoCurso.id) {
                    let cantidad = parseInt(curso.cantidad);
                    cantidad++
                    curso.cantidad = cantidad;
                    return curso;
               } else {
                    return curso;
               }
          })
          articulosCarrito = [...cursos];
     } else {
          articulosCarrito = [...articulosCarrito, infoCurso];
     }

     console.log(articulosCarrito)



     // console.log(articulosCarrito)
     carritoHTML();
}

//#region Elimina el curso del carrito en el DOM
function eliminarCurso(e) {
     e.preventDefault();
     console.log(articulosCarrito);
     if (e.target.classList.contains('borrar-curso')) {
          // e.target.parentElement.parentElement.remove();
          const curso = e.target.parentElement.parentElement;
          const cursoId = curso.querySelector('a').getAttribute('data-id');
          
          despintarBordeSeleccionado(curso, cursoId)

          // Eliminar del arreglo del carrito
          articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
          carritoHTML();
     }
     console.log(articulosCarrito);
}


// Muestra el curso seleccionado en el Carrito
function carritoHTML() {

     vaciarCarrito();

     articulosCarrito.forEach(curso => {
          const row = document.createElement('tr');
          row.innerHTML = `
               <td>  
                    <img src="${curso.imagen}" width=100>
               </td>
               <td>${curso.titulo}</td>
               <td>${curso.precio}</td>
               <td>${curso.cantidad} </td>
               <td>
                    <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
               </td>
          `;
          contenedorCarrito.appendChild(row);
     });

     // NUEVO:
     sincronizarStorage();

}


// NUEVO: 
function sincronizarStorage() {
     localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del carrito en el DOM
function vaciarCarrito() {
     // forma rapida (recomendada)
     while (contenedorCarrito.firstChild) {
          contenedorCarrito.removeChild(contenedorCarrito.firstChild)
          localStorage.clear();
     }
}

function despintarBordeSeleccionado(curso, cursoId){

     console.log(cursoId);
     console.log(curso => curso.id);
}

function despintarTodosBorde(){

     Array.prototype.forEach.call(tarjetasCursos, function (_tarjetaCurso) {
               _tarjetaCurso.style.borderStyle = ""
               _tarjetaCurso.style.borderWidth = ""
               _tarjetaCurso.style.borderColor = ""
     });
}

function pintaBorde(curso) {

     curso.style.borderStyle = "solid"
     curso.style.borderWidth = "5px"
     curso.style.borderColor = "blue"
     curso.setAttribute("tipo", "seleccionado")
}

// function pintarBordeVerdeMismoAutor(curso) {
//      leerDatosCurso(curso)
//      let cursoPropietario = curso.querySelector(".info-card p")
//      Array.prototype.forEach.call(tarjetasCursos, function (_tarjetaCurso) {
//           if (infoCurso.propietario === cursoPropietario) {
//                curso.style.borderStyle = "solid"
//                curso.style.borderWidth = "5px"
//                curso.style.borderColor = "green"
//           }
//      });
// }