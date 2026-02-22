import { getPuertas } from "./api.js";

// Historial acumulado para la tabla (últimos 10 registros)
let historial = [];
let chart = null;

// Historial por puerta para la gráfica de líneas
let historialGrafica = {};

const MAX_PUNTOS = 10;

// Colores por puerta
const COLORES = [
    "#2ecc71",
    "#3498db",
    "#e67e22",
    "#9b59b6",
    "#e74c3c",
];

// Estado anterior de cada puerta para detectar cambios
// { [id]: { estado, obstaculo } }
let estadoAnterior = {};

// -------- NOTIFICACIONES --------
const obstaculosNotificados = new Set();

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
            notificarObstaculo(p);
            obstaculosNotificados.add(p.id);
        } else if (!tieneObstaculo && obstaculosNotificados.has(p.id)) {
            obstaculosNotificados.delete(p.id);
        }
    });
}

// Detecta si alguna puerta cambió de estado u obstáculo
function huboCambio(puertas) {
    return puertas.some(p => {
        const prev = estadoAnterior[p.id];
        return !prev || prev.estado !== p.estado || prev.obstaculo !== p.obstaculo;
    });
}

// Guarda el estado actual como referencia para la próxima comparación
function guardarEstado(puertas) {
    puertas.forEach(p => {
        estadoAnterior[p.id] = { estado: p.estado, obstaculo: p.obstaculo };
    });
}

// -------- TABLA (cada 2 segundos) --------
async function actualizarTabla() {
    const puertas = await getPuertas();

    verificarObstaculos(puertas);

    const ahora = new Date();
    const label = ahora.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit" })
                + " " + ahora.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    puertas.forEach(p => {
        historial.unshift({
            nombre: p.nombre,
            estado: p.estado,
            obstaculo: p.obstaculo,
            timestamp: label
        });
    });

    historial = historial.slice(0, 10);
    renderTabla();

    // Actualizar gráfica SOLO si hubo un cambio real
    if (huboCambio(puertas)) {
        actualizarGrafica(puertas, label);
        guardarEstado(puertas);
    }
}

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

// -------- GRÁFICA (solo al detectar cambio) --------
function actualizarGrafica(puertas, label) {
    puertas.forEach(p => {
        if (!historialGrafica[p.nombre]) {
            historialGrafica[p.nombre] = [];
        }

        historialGrafica[p.nombre].push({
            label,
            valor: p.estado === "abierta" ? 1 : 0,
            obstaculo: p.obstaculo === "hay un obstaculo"
        });

        if (historialGrafica[p.nombre].length > MAX_PUNTOS) {
            historialGrafica[p.nombre].shift();
        }
    });

    renderGrafica();
}

function renderGrafica() {
    const ctx = document.getElementById("graficaEstados").getContext("2d");
    const nombresPuertas = Object.keys(historialGrafica);
    if (nombresPuertas.length === 0) return;

    const labels = historialGrafica[nombresPuertas[0]].map(p => p.label);

    const datasets = nombresPuertas.map((nombre, i) => {
        const color = COLORES[i % COLORES.length];
        const datos = historialGrafica[nombre];

        return {
            label: nombre,
            data: datos.map(d => d.valor),
            borderColor: color,
            backgroundColor: color + "22",
            pointBackgroundColor: datos.map(d => d.obstaculo ? "#fd7e14" : color),
            pointBorderColor: datos.map(d => d.obstaculo ? "#fd7e14" : color),
            pointRadius: datos.map(d => d.obstaculo ? 9 : 5),
            pointHoverRadius: 9,
            borderWidth: 2.5,
            tension: 0.3,
            fill: false
        };
    });

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets = datasets;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: "line",
            data: { labels, datasets },
            options: {
                responsive: true,
                animation: { duration: 500 },
                scales: {
                    y: {
                        min: -0.2,
                        max: 1.2,
                        ticks: {
                            stepSize: 1,
                            color: "#adb5bd",
                            callback: value => value === 1 ? "Abierta" : value === 0 ? "Cerrada" : ""
                        },
                        grid: { color: "rgba(255,255,255,0.07)" }
                    },
                    x: {
                        ticks: {
                            color: "#adb5bd",
                            maxRotation: 45,
                            font: { size: 11 }
                        },
                        grid: { color: "rgba(255,255,255,0.07)" }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: "#f1f1f1",
                            usePointStyle: true,
                            pointStyle: "circle",
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                const nombre = ctx.dataset.label;
                                const estado = ctx.raw === 1 ? "Abierta" : "Cerrada";
                                const datos = historialGrafica[nombre];
                                const punto = datos[ctx.dataIndex];
                                const obs = punto?.obstaculo ? " — ⚠ Obstáculo" : "";
                                return ` ${nombre}: ${estado}${obs}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Pedir permiso al cargar
solicitarPermisoNotificaciones();

// Tabla: refresca cada 2 segundos
// Gráfica: solo se actualiza internamente cuando hay cambio
actualizarTabla();
setInterval(actualizarTabla, 2000);