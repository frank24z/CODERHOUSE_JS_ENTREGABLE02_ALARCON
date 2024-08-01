// Agrega un evento al botón de calcular edad para iniciar el proceso
document.getElementById('botonCalcularEdad').addEventListener('click', () => {
    const nombre = obtenerNombre(); // Obtener el nombre del usuario
    if (!nombre) return; // Salir si no se obtiene un nombre válido

    const fechaNacimiento = obtenerFecha("nacimiento"); // Obtener la fecha de nacimiento
    if (!fechaNacimiento) return; // Salir si no se obtiene una fecha válida

    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaActualArray = [fechaActual.getFullYear(), fechaActual.getMonth() + 1, fechaActual.getDate()]; // Convertir la fecha actual a un array

    const edad = calcularEdad(fechaNacimiento, fechaActualArray); // Calcular la edad

    console.log(`Resultados: Años: ${edad.años}, Meses: ${edad.meses}, Días: ${edad.días}`);
    alert(`Usted tiene ${edad.años} años, ${edad.meses} meses y ${edad.días} días.`); // Mostrar la edad calculada

    agregarPersonaAlListado(nombre, edad); // Agregar la persona al listado
    guardarConsulta(nombre, fechaNacimiento, fechaActualArray, edad); // Guardar la consulta en el Local Storage
    mostrarConsultasGuardadas(); // Mostrar las consultas guardadas actualizadas
});

// Función para obtener el nombre del usuario, con validación de entradas y un límite de 3 intentos
function obtenerNombre() {
    let nombre;
    let intentos = 0;
    do {
        nombre = prompt("Ingresa tu nombre:"); // Pedir al usuario que ingrese su nombre
        if (!nombre) {
            alert("El nombre no puede estar vacío. Inténtalo de nuevo."); // Alerta si el nombre está vacío
            intentos++; // Incrementar el contador de intentos
            if (intentos >= 3) {
                alert("Has superado el número máximo de intentos."); // Alerta si se alcanzan 3 intentos
                return null; // Salir de la función y devolver null
            }
        }
    } while (!nombre);
    return nombre; // Devolver el nombre válido
}

// Función para obtener una fecha del usuario, con validación de entradas y un límite de 3 intentos
function obtenerFecha(tipo) {
    let fecha, dia, mes, año;
    let intentos = 0;
    do {
        fecha = prompt(`Ingresa tu fecha de ${tipo} en formato DD-MM-YYYY (Ej: 17-01-1994):`); // Pedir la fecha
        if (fecha) {
            [dia, mes, año] = fecha.split('-').map(Number); // Dividir la fecha en día, mes y año
            if (esFechaValida(dia, mes, año) && !esFechaFutura(dia, mes, año)) { // Validar la fecha
                return [año, mes, dia]; // Devolver la fecha válida como un array
            }
        }
        alert("Fecha no válida o en el futuro. Inténtalo de nuevo."); // Alerta si la fecha no es válida o es futura
        intentos++; // Incrementar el contador de intentos
        if (intentos >= 3) {
            alert("Has superado el número máximo de intentos."); // Alerta si se alcanzan 3 intentos
            return null; // Salir de la función y devolver null
        }
    } while (true);
}

// Función para validar una fecha
function esFechaValida(dia, mes, año) {
    const date = new Date(año, mes - 1, dia); // Crear un objeto Date
    return date.getFullYear() === año && date.getMonth() + 1 === mes && date.getDate() === dia; // Comprobar si la fecha es válida
}

// Función para verificar si una fecha es futura
function esFechaFutura(dia, mes, año) {
    const fechaIngresada = new Date(año, mes - 1, dia); // Crear un objeto Date para la fecha ingresada
    const fechaActual = new Date(); // Obtener la fecha actual
    return fechaIngresada > fechaActual; // Devolver true si la fecha ingresada es futura
}

// Función para calcular la edad en años, meses y días
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

    return { años: edadAños, meses: edadMeses, días: edadDías }; // Devolver la edad calculada
}

// Función para agregar una persona al listado en el DOM
function agregarPersonaAlListado(nombre, edad) {
    const listaPersonas = document.getElementById('listaPersonas');
    const li = document.createElement('li');
    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add('botonEliminar');
    botonEliminar.addEventListener('click', () => eliminarConsulta(nombre)); // Agregar evento para eliminar la consulta

    li.textContent = `${nombre} tiene ${edad.años} años, ${edad.meses} meses y ${edad.días} días.`;
    li.appendChild(botonEliminar);
    listaPersonas.appendChild(li); // Añadir el elemento li al listado
}

// Función para guardar una consulta en el Local Storage
function guardarConsulta(nombre, fechaNacimiento, fechaActual, edad) {
    const consultas = JSON.parse(localStorage.getItem('consultas')) || []; // Obtener las consultas existentes o crear un array vacío
    consultas.push({ nombre, fechaNacimiento, fechaActual, edad }); // Añadir la nueva consulta
    localStorage.setItem('consultas', JSON.stringify(consultas)); // Guardar las consultas actualizadas en el Local Storage
}

// Función para mostrar las consultas guardadas desde el Local Storage
function mostrarConsultasGuardadas() {
    const consultas = JSON.parse(localStorage.getItem('consultas')) || []; // Obtener las consultas guardadas
    const listaPersonas = document.getElementById('listaPersonas');
    listaPersonas.innerHTML = ''; // Limpiar la lista antes de mostrar
    consultas.forEach(consulta => {
        const li = document.createElement('li');
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add('botonEliminar');
        botonEliminar.addEventListener('click', () => eliminarConsulta(consulta.nombre)); // Agregar evento para eliminar la consulta

        li.textContent = `${consulta.nombre} tiene ${consulta.edad.años} años, ${consulta.edad.meses} meses y ${consulta.edad.días} días.`;
        li.appendChild(botonEliminar);
        listaPersonas.appendChild(li); // Añadir el elemento li al listado
    });
}

// Función para eliminar una consulta del Local Storage y actualizar el listado
function eliminarConsulta(nombre) {
    let consultas = JSON.parse(localStorage.getItem('consultas')) || []; // Obtener las consultas guardadas
    consultas = consultas.filter(consulta => consulta.nombre !== nombre); // Filtrar la consulta a eliminar
    localStorage.setItem('consultas', JSON.stringify(consultas)); // Guardar las consultas actualizadas en el Local Storage
    mostrarConsultasGuardadas(); // Actualizar el listado mostrado
}

// Mostrar las consultas guardadas al cargar la página
document.addEventListener('DOMContentLoaded', mostrarConsultasGuardadas);
