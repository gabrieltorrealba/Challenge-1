const farmaciaPagina = document.getElementById("farmacia")
const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const juguetesPaginas = document.getElementById("juguetes")
const form = document.querySelector("form")
const btnContacto = document.getElementById("staticBackdropcontacto")

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



const imagenCards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.nombre
        templateCard.querySelector(".p").textContent = producto.precio
        templateCard.querySelector("img").setAttribute("src", producto.imagen)
        templateCard.querySelector(".btn-primary").dataset.id = producto._id
        templateCard.querySelector(".stock").textContent = producto.stock
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}



const agregarAlCarrito = e => {
    if (e.target.classList.contains("btn-primary")) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

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
form.addEventListener('submit', (e) => {
    e.preventDefault()
})

