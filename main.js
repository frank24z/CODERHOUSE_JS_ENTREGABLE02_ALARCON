$(function() {
    // Rellenar los selects de días y años
    for (let i = 1; i <= 31; i++) {
        $('#dia').append(`<option value="${i}">${i}</option>`);
    }

    const anoActual = new Date().getFullYear();
    for (let i = anoActual; i >= 1900; i--) {
        $('#ano').append(`<option value="${i}">${i}</option>`);
    }

    $("#formularioEdad").on("submit", async function(e) {
        e.preventDefault();
        
        const nombre = $("#nombre").val();
        const dia = parseInt($("#dia").val());
        const mes = parseInt($("#mes").val());
        const ano = parseInt($("#ano").val());
        
        if (!esFechaValida(dia, mes, ano) || esFechaFutura(dia, mes, ano)) {
            mostrarError("Fecha no válida. Por favor, vuelve a ingresar.");
            return;
        }

        try {
            const fechaActual = await obtenerFechaActual();
            const edad = calcularEdad(new Date(ano, mes - 1, dia), fechaActual);

            mostrarMensaje(`Usted tiene ${edad.anos} años, ${edad.meses} meses y ${edad.dias} días.`);
            
            agregarPersonaAlListado(nombre, edad);
            guardarConsulta(nombre, [dia, mes, ano], edad);
            mostrarConsultasGuardadas();
        } catch (error) {
            mostrarError("Error al obtener la fecha actual. Intenta de nuevo más tarde.");
        }
    });
});

// Funciones auxiliares para el cálculo de la edad
function esFechaValida(dia, mes, ano) {
    const date = new Date(ano, mes - 1, dia);
    return date.getFullYear() === ano && date.getMonth() + 1 === mes && date.getDate() === dia;
}

function esFechaFutura(dia, mes, ano) {
    const fechaIngresada = new Date(ano, mes - 1, dia);
    const fechaActual = new Date();
    return fechaIngresada > fechaActual;
}

async function obtenerFechaActual() {
    const response = await fetch('https://worldtimeapi.org/api/timezone/America/Santiago');
    const data = await response.json();
    return new Date(data.datetime);
}

function calcularEdad(fechaNacimiento, fechaActual) {
    let anos = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    let meses = fechaActual.getMonth() - fechaNacimiento.getMonth();
    let dias = fechaActual.getDate() - fechaNacimiento.getDate();

    if (dias < 0) {
        meses--;
        const ultimoDiaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0).getDate();
        dias += ultimoDiaMesAnterior;
    }

    if (meses < 0) {
        anos--;
        meses += 12;
    }

    return { anos: anos, meses: meses, dias: dias };
}

function agregarPersonaAlListado(nombre, edad) {
    const listaPersonas = $("#listaPersonas");
    const li = $("<li></li>").text(`${nombre} tiene ${edad.anos} años, ${edad.meses} meses y ${edad.dias} días.`);
    const botonEliminar = $("<button></button>").text("Eliminar").addClass("botonEliminar").on("click", function() {
        eliminarConsulta(nombre);
    });

    li.append(botonEliminar);
    listaPersonas.append(li);
}

function guardarConsulta(nombre, fechaNacimiento, edad) {
    const nuevaConsulta = `${nombre},${fechaNacimiento.join('-')},${edad.anos},${edad.meses},${edad.dias}`;
    let consultas = localStorage.getItem('consultas') || "";
    consultas += (consultas ? ";" : "") + nuevaConsulta;
    localStorage.setItem('consultas', consultas);
}

function mostrarConsultasGuardadas() {
    const consultas = localStorage.getItem('consultas') || "";
    const listaPersonas = $("#listaPersonas");
    listaPersonas.empty();
    if (consultas) {
        consultas.split(';').forEach(consulta => {
            const [nombre, fechaNacimiento, anos, meses, dias] = consulta.split(',');
            const li = $("<li></li>").text(`${nombre} tiene ${anos} años, ${meses} meses y ${dias} días.`);
            const botonEliminar = $("<button></button>").text("Eliminar").addClass("botonEliminar").on("click", function() {
                eliminarConsulta(nombre);
            });

            li.append(botonEliminar);
            listaPersonas.append(li);
        });
    }
}

function eliminarConsulta(nombre) {
    let consultas = localStorage.getItem('consultas') || "";
    consultas = consultas.split(';').filter(consulta => !consulta.startsWith(nombre)).join(';');
    localStorage.setItem('consultas', consultas);
    mostrarConsultasGuardadas();
}

function mostrarMensaje(mensaje) {
    alert(mensaje);
}

function mostrarError(error) {
    alert(error);
}

$(document).ready(function() {
    mostrarConsultasGuardadas();
});

