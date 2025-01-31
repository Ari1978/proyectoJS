

let historialCotizaciones = [];

// Cargar el historial desde localStorage
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

// Evento para eliminar historial con confirmación
document.getElementById('borrar-historial-btn').addEventListener("click", () => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Vas a eliminar la cotización!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "red",
        cancelButtonColor: "green",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            borrarHistorial();
            Swal.fire({
                icon: "success",
                title: "Cotización eliminada",
                text: "Se vació el historial",
            });
        }
    });
});

// Evento para calcular cotización
document.getElementById('calcular-btn').addEventListener('click', () => {
    const marcaAuto = document.getElementById('marca-auto').value.trim();
    const modeloAuto = document.getElementById('modelo-auto').value.trim();
    const añoAuto = parseInt(document.getElementById('año-auto').value);
    const tipoSeguro = document.getElementById('tipo-seguro').value;
    const edadConductor = parseInt(document.getElementById('edad-conductor').value);

    if (!marcaAuto || !modeloAuto || isNaN(añoAuto) || !tipoSeguro || isNaN(edadConductor)) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor, llena todos los campos correctamente.",
        });
        return;
    }

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

    let precioEdadAuto = edadAuto < 5 ? 25000 : edadAuto < 10 ? 15000 : 10000;
    let precioEdadConductor = edadConductor < 25 ? 5000 : edadConductor < 60 ? 8500 : 11000;

    const precioTotal = precioBase + precioEdadAuto + precioEdadConductor;

    document.getElementById('monto-cotizacion').textContent = precioTotal.toFixed(2);
    document.getElementById('resultado-cotizacion').style.display = 'block';

    // Guardar la cotización en historial
    historialCotizaciones.push({
        marca: marcaAuto,
        modelo: modeloAuto,
        año: añoAuto,
        tipoSeguro: tipoSeguro,
        edadConductor: edadConductor,
        monto: precioTotal.toFixed(2),
    });

    guardarHistorialEnStorage();
    mostrarHistorial();
});

// Cargar historial al iniciar
cargarHistorialDesdeStorage();
mostrarHistorial();
