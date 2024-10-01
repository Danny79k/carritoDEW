// Variables, debes hacer el querySelector adecuado

const carrito = document.getElementById("carrito")//Busca el primer elemento cuyo id sea "carrito"
const listaCursos = document.getElementById("lista-cursos") //Busca el primer elemento cuyo id sea "lista-cursos"
const contenedorCarrito = document.getElementsByTagName("tbody")[0] //Busca el primer elemento tbody dentro del elemento con id lista-carrito
const vaciarCarritoBtn = document.getElementById("vaciar-carrito") //Busca el primer elemento cuyo id sea vaciar-carrito
const comprarCarritoBtn = document.getElementById("comprar-carrito") //Busca el primer elemento cuyo id sea vaciar-carrito
const tarjetasCursos = document.getElementsByClassName("card"); //Busca todos los elementos cuya clase sea curso
let articulosCarrito = [];

// Listeners
cargarEventListeners();


function cargarEventListeners() {
     // Dispara cuando se presiona "Agregar Carrito"
     listaCursos.addEventListener('click', agregarCurso);

     comprarCarritoBtn.addEventListener('click', removeElements);

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
          pintarBordeVerdeMismoAutor(curso)
          pintaBorde(curso)
          sumarPrecio(articulosCarrito)
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
          propietario: curso.querySelector(".info-card p").textContent, //Vamos a buscar el data-id del curso, primero buca el elemento y luego accede al atributo
          cantidad: 1
     }
     // console.log(infoCurso.id);
     // console.log(infoCurso.propietario);

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

     // console.log(articulosCarrito)



     // console.log(articulosCarrito)
     carritoHTML();
}

//#region Elimina el curso del carrito en el DOM
function eliminarCurso(e) {
     e.preventDefault();
     // console.log(articulosCarrito);
     if (e.target.classList.contains('borrar-curso')) {
          // e.target.parentElement.parentElement.remove();
          const curso = e.target.parentElement.parentElement;
          const cursoId = curso.querySelector('a').getAttribute('data-id');
          let cursoPropietario = curso.querySelector("#propietario").textContent;

          despintarBordeSeleccionado(cursoId, cursoPropietario)

          // Eliminar del arreglo del carrito
          articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

          carritoHTML();
     }
     // console.log(articulosCarrito);
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
               <td id='propietario'>${curso.propietario} </td>
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

//#region mis funciones

function despintarBordeSeleccionado(cursoId, cursoPropietario) {
     Array.prototype.forEach.call(tarjetasCursos, function (_tarjetaCurso) {
          let actualCursoId = _tarjetaCurso.querySelector(".info-card > a").getAttribute("data-id");
          console.log(actualCursoId, cursoId);
          if (actualCursoId === cursoId) {
               _tarjetaCurso.classList.remove("borderBlue")
               _tarjetaCurso.setAttribute("tipo", null);
               console.log(typeof _tarjetaCurso.querySelector(".info-card > p").textContent);
               console.log(typeof cursoPropietario);
               if (_tarjetaCurso.querySelector(".info-card > p").textContent.localeCompare(cursoPropietario)) {
                    quitaVerde()
               } else console.log("distintos")
          }
     });
}

function quitaVerde() {
     Array.prototype.forEach.call(tarjetasCursos, function (_tarjetaCurso) {
          _tarjetaCurso.classList.remove("borderGreen")
     })
}

function despintarTodosBorde() {

     Array.prototype.forEach.call(tarjetasCursos, function (_tarjetaCurso) {

          if (_tarjetaCurso.classList.contains("rebajado")) {
               let botonCard = _tarjetaCurso.querySelector('a').parentElement
               let redSign = _tarjetaCurso.querySelector("p.rebajado")
               let nuevoPrecioDiv = _tarjetaCurso.querySelector(".info-card > .precio span").parentElement.parentElement
               let nPrecio = _tarjetaCurso.querySelector("div.nuevoPrecio")
               _tarjetaCurso.classList.remove("borderBlue", "borderGreen")
               _tarjetaCurso.querySelector(".info-card > .precio span").classList.remove("crossed")
               botonCard.removeChild(redSign);
               nuevoPrecioDiv.removeChild(nPrecio)
               _tarjetaCurso.classList.remove("rebajado")
          }
     });
}

function pintaBorde(curso) {

     curso.classList.add("borderBlue")
     curso.classList.remove("borderGreen")
     curso.setAttribute("tipo", "seleccionado")
}

function pintarBordeVerdeMismoAutor(curso) {
     let cursoPropietario = curso.querySelector(".info-card p").textContent
     let precio = curso.querySelector(".info-card > .precio span").textContent
     // console.log(precio);
     Array.prototype.forEach.call(tarjetasCursos, function (_tarjetaCurso) {
          if (_tarjetaCurso.querySelector(".info-card > p").textContent === cursoPropietario) {
               if (_tarjetaCurso.getAttribute("tipo") !== "seleccionado") {
                    _tarjetaCurso.classList.add("borderGreen")
               } else {
                    _tarjetaCurso.classList.add("borderBlue")
               }
               if (!_tarjetaCurso.classList.contains("rebajado")) {
                    _tarjetaCurso.querySelector(".info-card > .precio span").classList.add("crossed");
                    let precioUnsigned = precio.substr(1);
                    let precioUnsignedInt = parseInt(precioUnsigned);
                    let precioUnsignedIntRebajado = precioUnsignedInt - 5;
                    // console.log(precioUnsignedIntRebajado);
                    let nuevoPrecio = _tarjetaCurso.querySelector(".info-card > .precio span").parentElement.parentElement
                    let nPrecio = document.createElement("div");
                    nPrecio.classList.add("nuevoPrecio")
                    nPrecio.textContent = "$" + precioUnsignedIntRebajado;
                    nuevoPrecio.appendChild(nPrecio)
                    _tarjetaCurso.classList.add("rebajado")
                    let botonCard = _tarjetaCurso.querySelector('a').parentElement;
                    let redSign = document.createElement("p");
                    redSign.classList.add("rebajado");
                    redSign.innerHTML = "REBAJADO";
                    botonCard.appendChild(redSign)
               } else {
                    console.log("no se cambia el precio");
               }
          }
     });
}

// el array prototype no actualiza el conjunto de elementos ademas el array inverso hace que los elementos no se vean afectado ya que estamos eliminando los elementos superiores [chatGPT]

function removeElements() {
     for (let i = tarjetasCursos.length - 1; i >= 0; i--) {
          let _tarjetaCurso = tarjetasCursos[i];
          //     console.log(_tarjetaCurso.getAttribute("tipo"));
          if (_tarjetaCurso.getAttribute("tipo") !== "seleccionado") {
               _tarjetaCurso.remove();
          }
     }
}

function sumarPrecio(articulosCarrito) {
     articulosCarrito.forEach(curso => {
          console.log(curso.precio);
     })
}

sumarPrecio()
