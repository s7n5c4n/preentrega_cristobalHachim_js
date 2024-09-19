// chartbar.js

let balanceChart;
let transactionChart;
let balanceData = [0];
let transactionData = [];

function initializeCharts() {
    const balanceCtx = document.getElementById('balanceChart').getContext('2d');
    const transactionCtx = document.getElementById('transactionChart').getContext('2d');

    balanceChart = new Chart(balanceCtx, {
        type: 'line',
        data: {
            labels: ['Inicio'],
            datasets: [{
                label: 'Saldo',
                data: balanceData,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
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

    transactionChart = new Chart(transactionCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Transacciones',
                data: transactionData,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
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

function updateBalanceChart(newBalance) {
    balanceData.push(newBalance);
    balanceChart.data.labels.push(`Transacción ${balanceData.length - 1}`);
    balanceChart.update();
}

function updateTransactionChart(amount) {
    transactionData.push(amount);
    transactionChart.data.labels.push(`Transacción ${transactionData.length}`);
    transactionChart.update();
}

document.addEventListener('DOMContentLoaded', initializeCharts);