import { getPuertas } from "./api.js";

let historial = [];

async function actualizarTabla() {
    const puertas = await getPuertas();

    puertas.forEach(p => {
        historial.unshift({
            nombre: p.nombre,
            estado: p.estado,
            timestamp: new Date().toLocaleTimeString()
        });
    });

    historial = historial.slice(0, 10); // SOLO últimos 10

    renderTabla();
    renderGrafica(puertas);
}

function renderTabla() {
    const tbody = document.getElementById("tablaMonitoreo");
    tbody.innerHTML = "";

    historial.forEach(h => {
        tbody.innerHTML += `
            <tr>
                <td>${h.nombre}</td>
                <td>${h.estado}</td>
                <td>${h.timestamp}</td>
            </tr>
        `;
    });
}

setInterval(actualizarTabla, 2000);

let chart;

function renderGrafica(puertas) {
    const ctx = document.getElementById("grafica").getContext("2d");

    if(chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: puertas.map(p => p.nombre),
            datasets: [{
                label: "Estado (1 = Abierta, 0 = Cerrada)",
                data: puertas.map(p => p.estado === "abierta" ? 1 : 0),
                backgroundColor: "#0d6efd"
            }]
        }
    });
}