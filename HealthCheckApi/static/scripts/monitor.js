function checkHealth() {
    fetch('http://127.0.0.1:5000/health')
        .then(response => response.json())
        .then(data => {
            updateStatus(data);
            console.log(data); // Imprimir el resultado en la consola
        })
        .catch(error => console.error('Error:', error));
}

async function updateStatus(data) {
    const statusContainer = document.getElementById('status-container');

    statusContainer.innerHTML = '';

    const databaseStatus = data.database;
    for (const [service, status] of Object.entries(databaseStatus)) {
        const row = document.createElement('tr');
        const serviceCell = document.createElement('td');
        const statusCell = document.createElement('td');

        serviceCell.textContent = service;
        statusCell.textContent = status;

        row.appendChild(serviceCell);
        row.appendChild(statusCell);

        statusContainer.appendChild(row);
    }
}

setInterval(checkHealth, 60000);
checkHealth();
