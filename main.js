

let historialCotizaciones = [];

// Cargar el historial a localStorage 
const cargarHistorialDesdeStorage = () => {
    const historialGuardado = localStorage.getItem("historialCotizaciones");
    if (historialGuardado) {
        historialCotizaciones = JSON.parse(historialGuardado);
    }
};

// Guardar el historial en localStorage
const guardarHistorialEnStorage = () => {
    localStorage.setItem('historialCotizaciones', JSON.stringify(historialCotizaciones));
};

// Mostrar el historial 
const mostrarHistorial = () => {
    const historialDiv = document.getElementById('historial-cotizaciones');
    historialDiv.innerHTML = ''; 

    if (historialCotizaciones.length > 0) {
        const listaCotizaciones = document.createElement('ul');

        historialCotizaciones.forEach((cotizacion, index) => {
            const li = document.createElement('li');
            li.textContent = `Cotización #${index + 1} - ${cotizacion.marca} ${cotizacion.modelo} (${cotizacion.año}): $${cotizacion.monto}`;
            listaCotizaciones.appendChild(li);
        });

        historialDiv.appendChild(listaCotizaciones);
    } else {
        historialDiv.innerHTML = '<p>No hay cotizaciones anteriores.</p>';
    }
};

// Borrar el historial
const borrarHistorial = () => {
    localStorage.removeItem('historialCotizaciones');
    historialCotizaciones = [];
    mostrarHistorial();
};

document.getElementById('borrar-historial-btn').addEventListener('click', borrarHistorial);

document.getElementById('calcular-btn').addEventListener('click', () => {
    const marcaAuto = document.getElementById('marca-auto').value.trim();
    const modeloAuto = document.getElementById('modelo-auto').value.trim();
    const añoAuto = parseInt(document.getElementById('año-auto').value);
    const tipoSeguro = document.getElementById('tipo-seguro').value;
    const edadConductor = parseInt(document.getElementById('edad-conductor').value);

    if (marcaAuto && modeloAuto && !isNaN(añoAuto) && tipoSeguro && !isNaN(edadConductor)) {
        let precioBase = 0;

        if (tipoSeguro === "total") {
            precioBase = 60000;
        } else if (tipoSeguro === "terceros") {
            precioBase = 45000;
        } else if (tipoSeguro === "responsabilidad civil") {
            precioBase = 36000;
        }

        const añoActual = new Date().getFullYear();
        const edadAuto = añoActual - añoAuto;
        let precioEdadAuto = 0;
        if (edadAuto < 5) {
            precioEdadAuto = 25000;
        } else if (edadAuto >= 5 && edadAuto < 10) {
            precioEdadAuto = 15000;
        } else {
            precioEdadAuto = 10000;
        }

        let precioEdadConductor = 0;
        if (edadConductor < 25) {
            precioEdadConductor = 5000;
        } else if (edadConductor >= 25 && edadConductor < 60) {
            precioEdadConductor = 8500;
        } else {
            precioEdadConductor = 11000;
        }

        const precioTotal = precioBase + precioEdadAuto + precioEdadConductor;

        document.getElementById('monto-cotizacion').textContent = precioTotal.toFixed(2);
        document.getElementById('resultado-cotizacion').style.display = 'block';

        const cotizacion = {
            marca: marcaAuto,
            modelo: modeloAuto,
            año: añoAuto,
            tipoSeguro: tipoSeguro,
            edadConductor: edadConductor,
            monto: precioTotal.toFixed(2)
        };

        historialCotizaciones.push(cotizacion);

        guardarHistorialEnStorage();

        mostrarHistorial();
    } else {
        alert('Por favor llena todos los campos correctamente.');
    }
});

cargarHistorialDesdeStorage();
mostrarHistorial();
