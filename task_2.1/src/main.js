const ctx = document.getElementById('exchangeRatesChart').getContext('2d');
let chart;

async function fetchExchangeRates(base) {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
    const data = await response.json();
    return data.rates;
}

async function updateChart() {
    const baseCurrency = document.getElementById('baseCurrency').value;
    const rates = await fetchExchangeRates(baseCurrency);

    const labels = [];
    const data = [];

    if (document.getElementById('eur').checked) {
        labels.push('EUR');
        data.push(rates.EUR);
    }
    if (document.getElementById('usd').checked) {
        labels.push('USD');
        data.push(rates.USD);
    }
    if (document.getElementById('pln').checked) {
        labels.push('PLN');
        data.push(rates.PLN);
    }

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Kursy względem ${baseCurrency}`,
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

document.getElementById('baseCurrency').addEventListener('change', updateChart);
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateChart);
});

updateChart();