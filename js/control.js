import { getPuertas, updatePuerta } from "./api.js";

export async function cargarControl() {
    const puertas = await getPuertas();
    const contenedor = document.getElementById("contenedorControl");
    contenedor.innerHTML = "";

    puertas.forEach(p => {
        const estaAbierta = p.estado === "abierta";
        const tieneObstaculo = p.obstaculo === "hay un obstaculo";

        contenedor.innerHTML += `
        <div class="col-md-4">
            <div class="puerta-card ${p.estado}">
                <div class="estado-bar"></div>
                <div class="card-body-inner">

                    <div class="puerta-nombre">${p.nombre}</div>

                    <!-- Icono candado -->
                    <div class="lock-wrapper ${p.estado}" id="lock-${p.id}">
                        <i class="bi ${estaAbierta ? "bi-unlock-fill" : "bi-lock-fill"}"></i>
                    </div>

                    <!-- Badge de estado -->
                    <div class="estado-label ${p.estado}">
                        ${estaAbierta ? "✓ Abierta" : "✕ Cerrada"}
                    </div>

                    <!-- Obstáculo -->
                    <div class="obstaculo-badge ${tieneObstaculo ? "con-obstaculo" : "sin-obstaculo"}">
                        <i class="bi ${tieneObstaculo ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"}"></i>
                        ${tieneObstaculo ? "Obstáculo detectado" : "Sin obstáculo"}
                    </div>

                    <!-- Último acceso -->
                    <div class="ultimo-acceso">
                        <span class="label">Último acceso</span>
                        <span class="value">${new Date(p.ultimoacceso).toLocaleString("es-MX")}</span>
                    </div>

                    <!-- Botón -->
                    <button
                        class="btn-toggle ${estaAbierta ? "cerrar" : "abrir"}"
                        onclick="togglePuerta(${p.id}, '${p.estado}', '${p.obstaculo}')"
                        ${tieneObstaculo && estaAbierta ? "disabled" : ""}>
                        <i class="bi ${estaAbierta ? "bi-lock-fill" : "bi-unlock-fill"} me-2"></i>
                        ${estaAbierta ? "Cerrar puerta" : "Abrir puerta"}
                    </button>

                </div>
            </div>
        </div>`;
    });
}

window.togglePuerta = async function(id, estadoActual, obstaculo) {
    if (estadoActual === "abierta" && obstaculo === "hay un obstaculo") {
        alert("⚠ Hay un obstáculo. No puede cerrarse la puerta.");
        return;
    }

    // Animación del candado
    const lockEl = document.getElementById(`lock-${id}`);
    if (lockEl) {
        lockEl.classList.add("animating");
        setTimeout(() => lockEl.classList.remove("animating"), 400);
    }

    const nuevoEstado = estadoActual === "abierta" ? "cerrada" : "abierta";

    await updatePuerta(id, {
        estado: nuevoEstado,
        ultimoacceso: new Date().toISOString()
    });

    setTimeout(() => cargarControl(), 350);
};

// Carga inicial y refresco cada 5 segundos
cargarControl();
setInterval(cargarControl, 5000);