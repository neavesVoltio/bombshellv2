import {  getReservas } from './reservationAdmin.js'
import { getContactos } from './contactoAdmin.js'
import { getProductos } from './productAdminGetList.js'

//cancelarReserva,
let productosTab = document.getElementById("productosTab")
let reservasTab = document.getElementById("reservasTab")
let contactoTab = document.getElementById("contactoTab")
let productTabSection = document.getElementById("productTabSection")
let reservasSection = document.getElementById("reservasSection")
let contactoSection = document.getElementById("contactoSection")


productosTab.addEventListener("click", function () {
    productosTab.className = "nav-link active"
    reservasTab.className = "nav-link"
    contactoTab.className = "nav-link"
    productTabSection.style.display = "block"
    reservasSection.style.display = "none"
    contactoSection.style.display = 'none'
    getProductos()
    
})

reservasTab.addEventListener("click", function () {
    productosTab.className = "nav-link"
    reservasTab.className = "nav-link active"
    contactoTab.className = "nav-link"
    productTabSection.style.display = "none"
    reservasSection.style.display = "block"
    contactoSection.style.display = 'none'
    getReservas('asc', 'proceso')
    //cancelarReserva()
})

contactoTab.addEventListener("click", function () {
    productosTab.className = "nav-link"
    reservasTab.className = "nav-link"
    contactoTab.className = "nav-link active"
    productTabSection.style.display = "none"
    reservasSection.style.display = "none"
    contactoSection.style.display = 'block'
    getContactos('asc', 'porContactar')
})