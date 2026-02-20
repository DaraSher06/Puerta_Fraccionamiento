import { updatePuerta } from "./api.js";

export function renderControl(puertas) {
    const contenedor = document.getElementById("panelControl");
    contenedor.innerHTML = "";

    puertas.forEach(p => {
        contenedor.innerHTML += `
            <div class="col-md-4">
                <div class="card shadow">
                    <div class="card-body text-center">
                        <h5>${p.nombre}</h5>
                        <p>${p.ubicacion}</p>
                        <button class="btn ${p.estado === "abierta" ? "btn-success" : "btn-danger"}"
                            onclick="togglePuerta('${p.id}', '${p.estado}')">
                            ${p.estado.toUpperCase()}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

window.togglePuerta = async function(id, estadoActual) {
    const nuevoEstado = estadoActual === "abierta" ? "cerrada" : "abierta";

    await updatePuerta(id, {
        estado: nuevoEstado,
        timestamp: new Date().toISOString()
    });

    location.reload();
}