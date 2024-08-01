

document.getElementById('botonCalcularEdad').addEventListener('click', () => {
    const nombre = obtenerNombre();
    if (!nombre) return; 

    const fechaNacimiento = obtenerFecha("nacimiento"); 
    if (!fechaNacimiento) return; 

    const fechaActual = new Date(); // Traer fecha actual
    const fechaActualArray = [fechaActual.getFullYear(), fechaActual.getMonth() + 1, fechaActual.getDate()]; 

    const edad = calcularEdad(fechaNacimiento, fechaActualArray); 

    console.log(`Resultados: Años: ${edad.años}, Meses: ${edad.meses}, Días: ${edad.días}`);
    alert(`Usted tiene ${edad.años} años, ${edad.meses} meses y ${edad.días} días.`);

    agregarPersonaAlListado(nombre, edad); 
    guardarConsulta(nombre, fechaNacimiento, fechaActualArray, edad);
    mostrarConsultasGuardadas();
});


function obtenerNombre() {
    let nombre;
    let intentos = 0;
    do {
        nombre = prompt("¿Cual es tu nombre?"); 
        if (!nombre) {
            alert("Debes ingresar un nombre.");
            intentos++; 
            if (intentos >= 3) {
                alert("Superaste los intentos."); 
                return null;
            }
        }
    } while (!nombre);
    return nombre; 
}

function obtenerFecha() {
    let fecha, dia, mes, año;
    let intentos = 0;
    do {
        fecha = prompt("Ingresa tu fecha de nacimiento en formato DD-MM-YYYY (Ej: 17-01-1994):"); 
        if (fecha) {
            [dia, mes, año] = fecha.split('-').map(Number);
            if (esFechaValida(dia, mes, año) && !esFechaFutura(dia, mes, año)) { 
                return [año, mes, dia]; 
            }
        }
        alert("Fecha no valida. Vuelve a ingresar."); 
        intentos++;
        if (intentos >= 2) {
            alert("Superaste los intentos.");
            return null;
        }
    } while (true);
}

//Validar fechas correctas
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
    const [añoNacimiento, mesNacimiento, diaNacimiento] = fechaNacimiento;
    const [añoActual, mesActual, diaActual] = fechaActual;

    let edadAños = añoActual - añoNacimiento;
    let edadMeses = mesActual - mesNacimiento;
    let edadDías = diaActual - diaNacimiento;

    if (edadDías < 0) {
        edadDías += 30;
        edadMeses--;
    }

    if (edadMeses < 0) {
        edadMeses += 12;
        edadAños--;
    }

    return { años: edadAños, meses: edadMeses, días: edadDías };
}

// DOM CLASE SEMANA 7
function agregarPersonaAlListado(nombre, edad) {
    const listaPersonas = document.getElementById('listaPersonas');
    const li = document.createElement('li');
    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add('botonEliminar');
    botonEliminar.addEventListener('click', () => eliminarConsulta(nombre));

    li.textContent = '${nombre} tiene ${edad.años} años, ${edad.meses} meses y ${edad.días} días.';
    li.appendChild(botonEliminar);
    listaPersonas.appendChild(li);
}

//Guardar en Local
function guardarConsulta(nombre, fechaNacimiento, fechaActual, edad) {
    const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    consultas.push({ nombre, fechaNacimiento, fechaActual, edad }); 
    localStorage.setItem('consultas', JSON.stringify(consultas)); 
}

//Mostrar el local
function mostrarConsultasGuardadas() {
    const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    const listaPersonas = document.getElementById('listaPersonas');
    listaPersonas.innerHTML = ''; 
    consultas.forEach(consulta => {
        const li = document.createElement('li');
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add('botonEliminar');
        botonEliminar.addEventListener('click', () => eliminarConsulta(consulta.nombre)); 

        li.textContent = `${consulta.nombre} tiene ${consulta.edad.años} años, ${consulta.edad.meses} meses y ${consulta.edad.días} días.`;
        li.appendChild(botonEliminar);
        listaPersonas.appendChild(li); 
    });
}


function eliminarConsulta(nombre) {
    let consultas = JSON.parse(localStorage.getItem('consultas')) || []; 
    consultas = consultas.filter(consulta => consulta.nombre !== nombre); 
    localStorage.setItem('consultas', JSON.stringify(consultas));
    mostrarConsultasGuardadas(); 
}

//Mostrar el DOM
document.addEventListener('DOMContentLoaded', mostrarConsultasGuardadas);
