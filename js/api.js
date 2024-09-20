const API_KEY = '414dcf52c6fda3c190d90dde';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
let exchangeRatesChart;

// Obtener las tasas de cambio desde la API
async function obtenerTasasDeCambio() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            actualizarGraficoTasasDeCambio(data.conversion_rates);
            llenarOpcionesDeDivisas(data.conversion_rates);
        } else {
            mostrarMensaje('Error al obtener las tasas de cambio', 'error');
        }
    } catch (error) {
        mostrarMensaje('Error al conectar con la API de tasas de cambio', 'error');
    }
}

// Actualizar el gráfico de tasas de cambio
function actualizarGraficoTasasDeCambio(rates) {
    const labels = Object.keys(rates);
    const data = Object.values(rates);

    const ctx = document.getElementById('exchangeRatesChart').getContext('2d');
    if (exchangeRatesChart) {
        exchangeRatesChart.destroy();
    }
    exchangeRatesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tasas de Cambio (USD)',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Llenar las opciones de divisas en el select
function llenarOpcionesDeDivisas(rates) {
    const select = document.getElementById('currencyToConvertTo');
    select.innerHTML = '';
    for (const currency of Object.keys(rates)) {
        const option = document.createElement('option');
        option.value = rates[currency];
        option.textContent = currency;
        select.appendChild(option);
    }
}

// Función para convertir el saldo del usuario según la divisa seleccionada
function convertirDivisa() {
    // Obtener el saldo del usuario actual
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    
    if (!usuarioActual || !usuarioActual.saldo) {
        mostrarMensaje('No se pudo obtener el saldo del usuario.', 'error');
        return;
    }

    const saldo = parseFloat(usuarioActual.saldo);  // Obtener el saldo actual del usuario
    const tasa = parseFloat(document.getElementById('currencyToConvertTo').value);
    
    if (isNaN(saldo) || isNaN(tasa)) {
        mostrarMensaje('Saldo o tasa inválidos', 'error');
        return;
    }

    // Realizar la conversión
    const resultado = saldo * tasa;
    
    // Mostrar el resultado en pantalla
    document.getElementById('conversionResult').textContent = `Resultado: ${resultado.toFixed(2)}`;
    
    // Actualizar el saldo del usuario con la nueva cantidad
    usuarioActual.saldo = resultado.toFixed(2);  // Actualiza el saldo con la divisa convertida
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));  // Guardar en localStorage
    
    // Actualizar el saldo mostrado en la interfaz
    document.getElementById('currentBalance').textContent = usuarioActual.saldo;
    
    mostrarMensaje(`Saldo actualizado: ${resultado.toFixed(2)} en la nueva divisa.`, 'success');
}

// Función para mostrar el saldo del usuario al cargar la página
function mostrarSaldoUsuario() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    
    if (usuarioActual && usuarioActual.saldo) {
        document.getElementById('currentBalance').textContent = usuarioActual.saldo;
    } else {
        document.getElementById('currentBalance').textContent = '0.00';
    }
}

// Escuchar el evento para convertir divisa y cargar el saldo inicial
document.addEventListener('DOMContentLoaded', () => {
    obtenerTasasDeCambio();
    mostrarSaldoUsuario();  // Mostrar el saldo al cargar la página
    document.getElementById('convertButton').addEventListener('click', convertirDivisa);
});

// Función para mostrar mensajes (éxito o error)
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = tipo === 'error' ? 'error' : 'success';
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}
