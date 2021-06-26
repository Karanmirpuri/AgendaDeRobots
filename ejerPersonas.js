"use strict";
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const CONTENEDOR_PERSONAS = document.querySelector("#contenedor_personas");
const CONTENEDOR_FICHAJES = document.querySelector("#fichajes");
const NUM_PERSONAS = document.querySelector("#numTodas");
const NUM_FICHAJES = document.querySelector("#numFichajes");
const NUM_PAISES = document.querySelector("#numPaises");
const NUM_PANTALLA = document.querySelector("#numPantalla");
const FICHAJES = new Set();
function crearFecha(fecha) {
    var trozos = fecha.split('/');
    return new Date(trozos[2], trozos[1] - 1, trozos[0])
}
function mostrarFecha(fecha) {
    var f = crearFecha(fecha);
    return f.getDate() + " de " + MESES[f.getMonth()] + " de " + f.getFullYear();
}
function mostrarPersona(p) {
    // console.log(p.nombre + " - " + p.pais + " - " + mostrarFecha(p.nacimiento));
    var elemento = document.createElement("div");
    elemento.classList.add("card");
    elemento.classList.add("text-center");
    elemento.classList.add("m-3");
    elemento.style.width = "8rem";
    elemento.innerHTML = `
      <img class="card-img-top" src="${p.foto}" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${p.nombre}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${p.pais}</h6>
        <p class="card-text small">${mostrarFecha(p.nacimiento)}</p>
        <a href="#" class="btn btn-primary" onclick="fichar(this)">Fichar</a>
      </div>
    `;
    CONTENEDOR_PERSONAS.appendChild(elemento);
    NUM_PANTALLA.innerHTML++;
}

//function mostrar(p) {
//  p.forEach(e => {
//    mostrarPersona(e);
//  });
//}
function filtrar(p) {
    p.filter(sexo);
}
function sexo(p) {
    if (p.sexo == "F") {
        console.log(mostrarPersona(p));
    }
}
const PAISES = new Map();
function iniciarVariables() {
    NUM_PERSONAS.innerHTML = PERSONAS.length;
    NUM_PANTALLA.innerHTML = 0;
    PERSONAS.forEach(p => PAISES.set(p.pais, (PAISES.get(p.pais) || 0) + 1));
    NUM_PAISES.innerHTML = PAISES.size;
    NUM_FICHAJES.innerHTML = 0;
}
function mostrarPais(pais) {
    mostrar(PERSONAS.filter(p => p.pais == pais));
}
function mostrar(x) {
    if (x instanceof Array) {
        borrarPersonas();
        NUM_PANTALLA.innerHTML = 0;
        ordenar(x).forEach(p => mostrarPersona(p));
    }
    else if (typeof x == "string") {
        borrarPersonas();
        mostrar(PERSONAS.filter(p => p.pais == x));
    }
    else {
        borrarPersonas()
        NUM_PANTALLA.innerHTML = 0;
        mostrarPersona(x);
    }
}

function ordenar(lista) {
    var criterio = document.querySelector("input[name='orden']:checked").value;
    if (criterio == "noOrden") return lista;
    var p = lista.slice(0);
    switch (criterio) {
        case "nombre": p.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
            break;
        case "pais": p.sort((a, b) => a.pais < b.pais ? -1 : 1);
            break;
        case "nacimiento": p.sort((a, b) => crearFecha(a.nacimiento) - crearFecha(b.nacimiento));
            break;
        default: console.error("Criterio no válido");
    }
    return p;
}
function botonesListado() {
    document.querySelectorAll("button")[1].addEventListener("click", () => mostrar(PERSONAS[0]));
    document.querySelector("#ultima").addEventListener("click", () => mostrar(PERSONAS[PERSONAS.length - 1]));
    document.querySelector("#todas").addEventListener("click", () => mostrar(PERSONAS));
    document.querySelector("#chicas").addEventListener("click", () => mostrar(PERSONAS.filter(p => p.sexo == "F")));
    document.querySelector("#chicos").addEventListener("click", () => mostrar(PERSONAS.filter(p => p.sexo == "M")));
    document.querySelector("#borrar").addEventListener("click", () => {
        borrarPersonas();
        NUM_PANTALLA.innerHTML = 0;
    })
    document.querySelector("#btn_borrarFichajes").addEventListener('click', borrarFichajes);
    cargarPaises();
}
function cargarPaises() {
    var paises = Array.from(PAISES.keys());
    for (let pais of paises.sort()) {
        var enlace = document.createElement("a");
        enlace.classList.add("dropdown-item");
        enlace.innerHTML = `<span class="badge badge-primary">${PAISES.get(pais)}</span>${pais}`;
        enlace.pais = pais;
        enlace.addEventListener("click", (e) => mostrar(e.target.pais));
        document.querySelector("#contenedorPaises").appendChild(enlace);
    }
}
function borrarContenido(elemento) {
    while (elemento.hasChildNodes()) {
        elemento.childNodes[0].remove();
    }
}
function borrarPersonas() {
    borrarContenido(CONTENEDOR_PERSONAS);
}
function fichar(p) {
    console.log(ficha);
    var ficha = p.parentNode.parentNode;
    var nombre = ficha.querySelector(".card-title").innerHTML;
    if (!FICHAJES.has(nombre)) {
        FICHAJES.add(nombre);
        var fichaje = document.createElement("span");
        fichaje.classList.add("badge");
        fichaje.classList.add("badge-primary");
        fichaje.classList.add("m-1");
        fichaje.innerHTML = nombre +
            ' <span class="badge badge-light">' +
            ficha.querySelector(".card-subtitle").innerText + '</span> ' +
            `<button type="button" class="close" aria-label="Close" onclick="eliminarFichaje(this)">
          <span aria-hidden="true">&times;</span>
        </button>`;
        fichaje.nombre = nombre;
        CONTENEDOR_FICHAJES.appendChild(fichaje);
        NUM_FICHAJES.innerHTML++;
        document.querySelector("#btn_borrarFichajes").classList.remove("d-none");
        ficha.remove();
        NUM_PANTALLA.innerHTML--;
    }
}
function eliminarFichaje(e){
    var fichaje=e.parentNode;
    FICHAJES.delete(fichaje.nombre);
    fichaje.remove();
    NUM_FICHAJES.innerHTML--;
    if(NUM_FICHAJES.innerHTML==0){
    document.querySelector("#btn_borrarFichajes").classList.add("d-none");
    }
}
function borrarFichajes(){
    borrarContenido(CONTENEDOR_FICHAJES);
    NUM_FICHAJES.innerHTML=0;
    document.querySelector("#btn_borrarFichajes").classList.add("d-none");
}
iniciarVariables();
botonesListado();