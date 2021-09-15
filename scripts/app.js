const farmaciaPagina = document.getElementById("farmacia")
const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const juguetesPaginas = document.getElementById("juguetes")
const form = document.getElementById("form");
const btnContacto = document.getElementById("staticBackdropcontacto")
const select = document.getElementById("select-precio")

// Brian cuenca js start

// inicio sequencia de identificacion de paginas
let url = window.document.URL
// buscar coincidencias con regExp
let reg = /\b[index|contacto|farmacia|juguetes]+\b/g // numeros de caracteres: index = 5, contacto & farmacia & juguetes = 8
// obtener la pagina actual
let page = url.match(reg) // resultado/output: se identificara la pagina que coincida con el patron del regExp
let currentPage = page[1]

// funciones para cada pagina
const indexFunctions = () => {
    const image = document.getElementById("image");
    let dirImg = ["../img/bunny.jpg", "../img/cat-1.jpg", "../img/dog-1.jpg", "../img/dog-2.jpg", "../img/cat-2.jpg"]

    let i = 0;
    image.style.backgroundImage = `url("${dirImg[i]}")`;
    image.style.backgroundSize = "cover";
    image.style.backgroundPosition = "center";
    image.style.backgroundRepeat = "no-repeat"
    image.style.transition = "all 1s ease";

    setInterval(() => {
        i++
        if (i === dirImg.length - 1) {
            i = 0
        }
        image.style.backgroundImage = `url("${dirImg[i]}")`;

        switch (i) {
            case 0:
                image.style.backgroundPosition = "center"
                break;
            case 1:
                image.style.backgroundPosition = "center -400px"
                break;
            case 2:
                image.style.backgroundPosition = "center -200px"
                break;
            case 3:
                image.style.backgroundPosition = "center"
                break;
            case 4:
                image.style.backgroundPosition = "center -100px"
                break;
        }
    }, 5000);
}

// Brian Cuenca js end

let templateCard = ""

farmaciaPagina ? templateCard = document.getElementById("template-card").content : juguetesPaginas ? templateCard = document.getElementById("template-card").content : null

const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()
const modal = document.getElementById("staticBackdrop")
const btnModal = document.getElementById("btn-modal")
let carrito = {}
let datos = []
let farmacia = []
let juguetes = []
let parametro = farmacia ? `${farmacia}` : `${juguetes}`

/* select.addEventListener("change", (e)=>{
    if (e.target.value === "menor") {
       datos = datos.sort((a,b)=>{
            if (a.precio < b.precio) {
                return -1
            }
            if (a.precio > b.precio) {
                return 1
            } return 0
        })
    }
    console.log(e.target.value)
}) */

fetch("https://apipetshop.herokuapp.com/api/articulos")
    .then(res => res.json())
    .then(data => {
        datos = data.response
        farmacia = datos.filter(i => i.tipo === "Medicamento")
        juguetes = datos.filter(i => i.tipo === "Juguete")

        if (cards) {
            farmaciaPagina ? imagenCards(farmacia) : imagenCards(juguetes)

            cards.addEventListener("click", e => {
                agregarAlCarrito(e)
            })
        }




        if (localStorage.getItem('carrito')) {
            carrito = JSON.parse(localStorage.getItem('carrito'))
            mostrarCarrito()
        }
    })
    .catch(err => console.error(err.message))



////////////FUNCION PARA PINTAR CARDS//////////////////////
const imagenCards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.nombre
        templateCard.querySelector(".p").textContent = producto.precio
        templateCard.querySelector(".cardDescripcion").textContent = producto.descripcion
        templateCard.querySelector("img").setAttribute("src", producto.imagen)
        templateCard.querySelector(".btn-primary").dataset.id = producto._id
        templateCard.querySelector(".stock").textContent = producto.stock
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
    showAndHide(cards)
    select.addEventListener("change", (e)=>{
        if (e.target.value === "todos") {
            data = data.sort((a,b)=>{
                if (a._id < b._id) {
                  return -1  
                }
                if (a._id > b._id) {
                    return 1  
                  } return 0
            })
            mostrar(data)
        }
        
        if (e.target.value === "menor") {
            console.log(data)
            data = data.sort((a, b) => {
                if (a.precio < b.precio) {
                    return -1
                }
                if (a.precio > b.precio) {
                    return 1
                } return 0
            })
            mostrar(data)
        }
        if (e.target.value === "mayor") {
            console.log(data)
            data = data.sort((a, b) => {
                if (a.precio < b.precio) {
                    return 1
                }
                if (a.precio > b.precio) {
                    return -1
                } return 0
            })
            mostrar(data)
        }
        console.log(e.target.value)
    })


}

function mostrar(data) {
    cards.innerHTML = ""
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.nombre
        templateCard.querySelector(".p").textContent = producto.precio
        templateCard.querySelector(".cardDescripcion").textContent = producto.descripcion
        templateCard.querySelector("img").setAttribute("src", producto.imagen)
        templateCard.querySelector(".btn-primary").dataset.id = producto._id
        templateCard.querySelector(".stock").textContent = producto.stock
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
    showAndHide(cards)
}



//////////////BOTON AGREGAR AL CARRITO///////////////
const agregarAlCarrito = e => {
    if (e.target.classList.contains("btn-primary")) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
///////////////////AGREGAR PRODUCTOS AL CARRITO////////////
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector(".btn-primary").dataset.id,
        titulo: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector(".p").textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    mostrarCarrito()
}
////////////////FUNCION PINTAR CUERPO TABLA CARRITO///////////////////
const mostrarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelectorAll("td")[0].textContent = producto.titulo
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    mostrarFooter()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
////////////////BOTONES CARRITO(AUMENTAR O DISMINUIR CANTIDAD)///////////////
const btnAccion = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        mostrarCarrito()
    }
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        mostrarCarrito()
    }
    e.stopPropagation()
}
items.addEventListener('click', (e) => {
    btnAccion(e)
})
//////////////////FUNCION PINTAR FOOTER TABLA CARRITO/////////
const mostrarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="4">Carrito vacio</th>`
        let btnM = document.querySelector('.badge').textContent = "0"
        return
    }
    const cantidades = Object.values(carrito).reduce((acumulador, { cantidad }) => acumulador + cantidad, 0)
    const precios = Object.values(carrito).reduce((acumulador, { cantidad, precio }) => acumulador + cantidad * precio, 0)
    templateFooter.querySelectorAll('td')[0].textContent = cantidades
    let btnM = document.querySelector('.badge').textContent = `${cantidades}`
    templateFooter.querySelector('span').textContent = precios
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    const vaciarCarrito = document.getElementById("vaciar-carrito")
    vaciarCarrito.addEventListener('click', () => {
        carrito = {}
        mostrarCarrito()
    })
}


/* var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
 */

// Brian Cuenca js call functions start

function showAndHide(div) {
    let child = div.querySelectorAll("#cardsVenta")
    child.forEach(c => {
        c.addEventListener("mouseenter", (e) => {
            let classHided = e.target.querySelector(".cardDescripcion")
            classHided.style.display = "block"
        })

        c.addEventListener("mouseleave", (e) => {
            let classHided = e.target.querySelector(".cardDescripcion")
            classHided.style.display = "none"
        })
    })
}

/////////////////EVENTO SUBMIT//////////////
const textVerify = (e, inputsValue) => {
    // si se comparte la misma funcion se debe identificar donde guardar cada valor dependiendo del id del elemento
    switch (e.target.id) {
        case "inputNombre":
            inputsValue.nombre = e.target.value
            break;
        case "inputRaza":
            inputsValue.raza = e.target.value
            break;
    }

    // verificacion caracter por caracter
    let verifyText = /[a-zA-Z]+/g;
    let verifyNotText = /\W+|[^a-zA-Z]/g
    let firstNotText = inputsValue.nombre.match(verifyNotText)
    let result = inputsValue.nombre.match(verifyText)

    if (firstNotText != null) {
        e.target.classList.add("inputErr")
    } else {
        e.target.classList.remove("inputErr")
    }

    if (result !== null) {
        e.target.classList.add("inputErr")
        if (result[0].length !== inputsValue.nombre.length) {
            e.target.classList.add("inputErr")
            inputsValue.nombreCasilla = false
        } else {
            e.target.classList.remove("inputErr")
            inputsValue.nombreCasilla = true
        }
    }
}

const verifyNumber = (e, inputsValue) => {
    inputsValue.telefono = e.target.value
    let verifyNumbers = /\d+/g
    let verifyNotText = /^[a-zA-Z]+|\W/g
    let firstNotNumber = inputsValue.telefono.match(verifyNotText)
    let resultNumber = inputsValue.telefono.match(verifyNumbers)

    if (firstNotNumber !== null) {
        e.target.classList.add("inputErr")
    } else {
        e.target.classList.remove("inputErr")
    }

    if (resultNumber[0].length !== inputsValue.telefono.length) {
        e.target.classList.add("inputErr")
        inputsValue.telCasilla = false
    } else {
        e.target.classList.remove("inputErr")
        inputsValue.telCasilla = true
    }
}

const verifyEmail = (e, inputsValue) => {
    inputsValue.email = e.target.value;
    let verifyEmails = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let email = inputsValue.email.match(verifyEmails)

    if (email === null) {
        e.target.classList.add("inputErr")
        inputsValue.mailCasiila = false
    } else {
        e.target.classList.remove("inputErr")
        inputsValue.mailCasiila = true
    }

}

const formFunctions = () => {
    const btnSubmit = document.getElementById("btn-contacto")
    /* btnSubmit.disabled = true; */

    let inputsValue = {
        nombre: "",
        telefono: "",
        email: "",
        raza: "",
        genero: "",
        edad: "",
        consulta: "",
        nombreCasilla: false,
        telCasilla: false,
        mailCasiila: false
    }

    form.addEventListener('input', (e) => {
        switch (e.target.id) {
            case "inputNombre":
                textVerify(e, inputsValue)
                break;
            case "inputTelefono":
                verifyNumber(e, inputsValue)
                break;
            case "inputEmail":
                verifyEmail(e, inputsValue)
                break;
            case "inputRaza":
                textVerify(e, inputsValue)
                break;
            case "inputGenero":
                inputsValue.genero = e.target.value
                break;
            case "inputEdad":
                inputsValue.edad = e.target.value
                break;
            case "query":
                inputsValue.consulta = e.target.value
                break;
        }

        if(inputsValue.nombreCasilla && inputsValue.telCasilla && inputsValue.mailCasiila && inputsValue.consulta !== "") {
            btnSubmit.disabled = false;
        }
    })
}

// se inicia condicionales para las direcciones
switch (currentPage) {
    case "index":
        indexFunctions()
        break;
    case "contacto":
        formFunctions()
        break;
}

// Brian Cuenca call functions end

