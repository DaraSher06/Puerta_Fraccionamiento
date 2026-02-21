import { getPuertas } from "./api.js";

// Historial acumulado (últimos 10 registros reales)
let historial = [];
let chart = null;

// Registro de puertas con obstáculo para no repetir notificación
const obstaculosNotificados = new Set();

// -------- NOTIFICACIONES --------
async function solicitarPermisoNotificaciones() {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }
}

function notificarObstaculo(puerta) {
    if (Notification.permission !== "granted") return;

    new Notification("⚠ Obstáculo detectado", {
        body: `La puerta "${puerta.nombre}" tiene un obstáculo y no puede cerrarse.`,
        icon: "assets/img/favicon.jpg"
    });
}

function verificarObstaculos(puertas) {
    puertas.forEach(p => {
        const tieneObstaculo = p.obstaculo === "hay un obstaculo";

        if (tieneObstaculo && !obstaculosNotificados.has(p.id)) {
            // Puerta nueva con obstáculo — notificar
            notificarObstaculo(p);
            obstaculosNotificados.add(p.id);
        } else if (!tieneObstaculo && obstaculosNotificados.has(p.id)) {
            // El obstáculo se resolvió — quitar del registro para notificar si vuelve
            obstaculosNotificados.delete(p.id);
        }
    });
}

// --------------------------------

async function actualizarMonitoreo() {
    const puertas = await getPuertas();

    // Verificar obstáculos y lanzar notificaciones si aplica
    verificarObstaculos(puertas);

    // Acumular cada puerta como un registro nuevo en el historial
    puertas.forEach(p => {
        historial.unshift({
            nombre: p.nombre,
            estado: p.estado,
            obstaculo: p.obstaculo,
            timestamp: new Date().toLocaleTimeString()
        });
    });

    // Mantener solo los últimos 10 registros
    historial = historial.slice(0, 10);

    renderTabla();
    renderGrafica(puertas);
}

// Pedir permiso al cargar
solicitarPermisoNotificaciones();

function renderTabla() {
    const tbody = document.getElementById("tablaMonitoreo");
    tbody.innerHTML = "";

    historial.forEach(h => {
        tbody.innerHTML += `
            <tr>
                <td>${h.nombre}</td>
                <td>
                    <span class="badge ${h.estado === "abierta" ? "bg-success" : "bg-danger"}">
                        ${h.estado.toUpperCase()}
                    </span>
                </td>
                <td>${h.obstaculo}</td>
                <td>${h.timestamp}</td>
            </tr>
        `;
    });
}

function renderGrafica(puertas) {
    const ctx = document.getElementById("graficaEstados").getContext("2d");

    const labels = puertas.map(p => p.nombre);
    const datos = puertas.map(p => p.estado === "abierta" ? 1 : 0);
    const colores = puertas.map(p => p.estado === "abierta" ? "#198754" : "#dc3545");

    if (chart) {
        // Actualizar datos sin destruir el chart (más suave visualmente)
        chart.data.labels = labels;
        chart.data.datasets[0].data = datos;
        chart.data.datasets[0].backgroundColor = colores;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Estado de Puertas (1 = Abierta, 0 = Cerrada)",
                    data: datos,
                    backgroundColor: colores,
                    borderRadius: 6,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                animation: { duration: 400 },
                scales: {
                    y: {
                        min: 0,
                        max: 1,
                        ticks: {
                            stepSize: 1,
                            color: "#fff",
                            callback: value => value === 1 ? "Abierta" : "Cerrada"
                        },
                        grid: { color: "rgba(255,255,255,0.1)" }
                    },
                    x: {
                        ticks: { color: "#fff" },
                        grid: { color: "rgba(255,255,255,0.1)" }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: "#fff" }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => ctx.raw === 1 ? " Abierta" : " Cerrada"
                        }
                    }
                }
            }
        });
    }
}

// Ejecutar inmediatamente y luego cada 2 segundos
actualizarMonitoreo();
setInterval(actualizarMonitoreo, 2000);