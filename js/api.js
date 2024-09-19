const API_KEY ='414dcf52c6fda3c190d90dde'; 
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

let exchangeRatesChart;

async function obtenerTasasDeCambio() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.result === 'success') {
            actualizarGraficoTasasDeCambio(data.conversion_rates);
        } else {
            mostrarMensaje('Error al obtener las tasas de cambio', 'error');
        }
    } catch (error) {
        mostrarMensaje('Error al conectar con la API de tasas de cambio', 'error');
    }
}

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

document.addEventListener('DOMContentLoaded', () => {
    obtenerTasasDeCambio();
});