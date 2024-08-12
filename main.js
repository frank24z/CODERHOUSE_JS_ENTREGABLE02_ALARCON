document.getElementById('formularioEdad').addEventListener('submit', (e) => {
    e.preventDefault(); // EVITAR RECARGAR LA PAGINA, AL USAR FORMULARIO y NO PROMPTS
    
    const nombre = document.getElementById('nombre').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value.split('-').map(Number);
    
    if (!esFechaValida(fechaNacimiento[0], fechaNacimiento[1], fechaNacimiento[2]) || esFechaFutura(fechaNacimiento[0], fechaNacimiento[1], fechaNacimiento[2])) {
        alert("Fecha no válida. Por favor, vuelve a ingresar.");
        return;
    }
    
    const fechaActual = new Date();
    const edad = calcularEdad(new Date(fechaNacimiento[2], fechaNacimiento[1] - 1, fechaNacimiento[0]), fechaActual);

    alert(`Usted tiene ${edad.años} años, ${edad.meses} meses y ${edad.días} días.`);

    agregarPersonaAlListado(nombre, edad);
    guardarConsulta(nombre, fechaNacimiento, edad);
    mostrarConsultasGuardadas();
});

function esFechaValida(dia, mes, año) {
    const date = new Date(año, mes - 1, dia);
    return date.getFullYear() === año && date.getMonth() + 1 === mes && date.getDate() === dia;
}

function esFechaFutura(dia, mes, año) {
    const fechaIngresada = new Date(año, mes - 1, dia);
    const fechaActual = new Date();
    return fechaIngresada > fechaActual;
}

function calcularEdad(fechaNacimiento, fechaActual) {
    let edadAños = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    let edadMeses = fechaActual.getMonth() - fechaNacimiento.getMonth();
    let edadDías = fechaActual.getDate() - fechaNacimiento.getDate();

    if (edadDías < 0) {
        edadMeses--;
        const ultimoDiaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0).getDate();
        edadDías += ultimoDiaMesAnterior;
    }

    if (edadMeses < 0) {
        edadAños--;
        edadMeses += 12;
    }

    return { años: edadAños, meses: edadMeses, días: edadDías };
}

function agregarPersonaAlListado(nombre, edad) {
    const listaPersonas = document.getElementById('listaPersonas');
    const li = document.createElement('li');
    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add('botonEliminar');
    botonEliminar.addEventListener('click', () => eliminarConsulta(nombre));

    li.textContent = `${nombre} tiene ${edad.años} años, ${edad.meses} meses y ${edad.días} días.`;
    li.appendChild(botonEliminar);
    listaPersonas.appendChild(li);
}

function guardarConsulta(nombre, fechaNacimiento, edad) {
    const nuevaConsulta = `${nombre},${fechaNacimiento.join('-')},${edad.años},${edad.meses},${edad.días}`;
    let consultas = localStorage.getItem('consultas') || "";
    consultas += (consultas ? ";" : "") + nuevaConsulta;
    localStorage.setItem('consultas', consultas);
}

function mostrarConsultasGuardadas() {
    const consultas = localStorage.getItem('consultas') || "";
    const listaPersonas = document.getElementById('listaPersonas');
    listaPersonas.innerHTML = '';
    if (consultas) {
        consultas.split(';').forEach(consulta => {
            const [nombre, fechaNacimiento, años, meses, días] = consulta.split(',');
            const li = document.createElement('li');
            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = "Eliminar";
            botonEliminar.classList.add('botonEliminar');
            botonEliminar.addEventListener('click', () => eliminarConsulta(nombre));

            li.textContent = `${nombre} tiene ${años} años, ${meses} meses y ${días} días.`;
            li.appendChild(botonEliminar);
            listaPersonas.appendChild(li);
        });
    }
}

function eliminarConsulta(nombre) {
    let consultas = localStorage.getItem('consultas') || "";
    consultas = consultas.split(';').filter(consulta => !consulta.startsWith(nombre)).join(';');
    localStorage.setItem('consultas', consultas);
    mostrarConsultasGuardadas();
}

document.addEventListener('DOMContentLoaded', mostrarConsultasGuardadas);
