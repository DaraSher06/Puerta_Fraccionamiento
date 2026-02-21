import { getPuertas, createPuerta, updatePuerta, deletePuerta } from "./api.js";

const tablaAdmin = document.getElementById("tablaAdmin");
const contenedorControl = document.getElementById("contenedorControl");
const form = document.getElementById("formPuerta");

// -------- CAMBIO DE PANEL --------
window.mostrarPanel = function (panel) {
    document.querySelectorAll(".panel").forEach(p => p.classList.add("d-none"));
    document.getElementById(`panel-${panel}`).classList.remove("d-none");
};

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
        nombre: document.getElementById("nombre").value,
        estado: "cerrada",
        obstaculo: "no existe obstaculo",
        ultimoacceso: new Date().toISOString()
    });

    form.reset();
    cargarAdmin();
});

// -------- CONTROL --------

import { cargarControl } from "./control.js";

window.cambiarEstado = async (id, estadoActual, obstaculo, checkbox) => {
    if (estadoActual === "abierta" && obstaculo === "hay un obstaculo") {
        alert("⚠ Hay un obstáculo. No puede cerrarse la puerta.");
        // Revertir el checkbox visualmente
        checkbox.checked = true;
        return;
    }

    const nuevoEstado = estadoActual === "abierta" ? "cerrada" : "abierta";

    await updatePuerta(id, {
        estado: nuevoEstado,
        ultimoacceso: new Date().toISOString()
    });

    cargarControl();
};

// Inicial
cargarAdmin();
cargarControl();

// Refrescar control cada 5 segundos para mantener sincronía
setInterval(cargarControl, 5000);