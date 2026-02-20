import { getPuertas, createPuerta, updatePuerta, deletePuerta } from "./api.js";

const tablaAdmin = document.getElementById("tablaAdmin");
const tablaMonitoreo = document.getElementById("tablaMonitoreo");
const contenedorControl = document.getElementById("contenedorControl");
const graficos = document.getElementById("graficos");
const form = document.getElementById("formPuerta");

// -------- CAMBIO DE PANEL --------
window.mostrarPanel = function(panel) {
    document.querySelectorAll(".panel").forEach(p => p.classList.add("d-none"));
    document.getElementById(`panel-${panel}`).classList.remove("d-none");
}

// -------- ADMIN --------
async function cargarAdmin() {
    const puertas = await getPuertas();
    tablaAdmin.innerHTML = "";

    puertas.forEach(p => {
        tablaAdmin.innerHTML += `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.estado}</td>
            <td>${p.obstaculo}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="eliminar(${p.id})">Eliminar</button>
            </td>
        </tr>`;
    });
}

window.eliminar = async (id) => {
    await deletePuerta(id);
    cargarAdmin();
};

form.addEventListener("submit", async e => {
    e.preventDefault();

    await createPuerta({
        nombre: nombre.value,
        estado: "cerrada",
        obstaculo: "no existe obstaculo",
        ultimoacceso: new Date()
    });

    form.reset();
    cargarAdmin();
});

// -------- CONTROL --------
async function cargarControl() {
    const puertas = await getPuertas();
    contenedorControl.innerHTML = "";

    puertas.forEach(p => {
        contenedorControl.innerHTML += `
        <div class="col-md-4">
        <div class="card bg-secondary text-white p-3 mb-3">
            <h5>${p.nombre}</h5>
            <p>Estado: ${p.estado}</p>
            <p>Obstáculo: ${p.obstaculo}</p>

            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox"
                ${p.estado === "abierta" ? "checked" : ""}
                onchange="cambiarEstado('${p.id}', '${p.estado}', '${p.obstaculo}')">
                <label class="form-check-label">Abrir / Cerrar</label>
            </div>
        </div>
        </div>`;
    });
}

window.cambiarEstado = async (id, estadoActual, obstaculo) => {

    if (estadoActual === "abierta" && obstaculo === "hay un obstaculo") {
        alert("⚠ Hay obstáculo. No puede cerrarse.");
        return;
    }

    const nuevoEstado = estadoActual === "abierta" ? "cerrada" : "abierta";

    await updatePuerta(id, {
        estado: nuevoEstado,
        ultimoacceso: new Date()
    });

    cargarControl();
};

// -------- MONITOREO --------
async function cargarMonitoreo() {
    const puertas = await getPuertas();

    tablaMonitoreo.innerHTML = "";
    graficos.innerHTML = "";

    puertas.slice(-10).forEach(p => {
        tablaMonitoreo.innerHTML += `
        <tr>
            <td>${p.nombre}</td>
            <td>${p.estado}</td>
            <td>${p.obstaculo}</td>
            <td>${new Date(p.ultimoacceso).toLocaleString()}</td>
        </tr>`;
    });

    puertas.forEach(p => {
        graficos.innerHTML += `
        <div class="col-md-4">
        <div class="card text-center p-3 
            ${p.estado === "abierta" ? "bg-success" : "bg-danger"} text-white">
            <h5>${p.nombre}</h5>
            <h3>${p.estado.toUpperCase()}</h3>
        </div>
        </div>`;
    });
}

// REFRESCO CADA 2 SEGUNDOS
setInterval(() => {
    cargarMonitoreo();
}, 2000);

// Inicial
cargarAdmin();
cargarControl();
cargarMonitoreo();
