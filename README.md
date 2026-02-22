# 🚧 Sistema de Administracion, Control y Monitoreo de Accesos a Puertas de Fraccionamiento en Residenciales

Aplicación web que simula un sistema IoT para la  **administracion el contro y monitoreo en tiempo real de accesos residenciales**, permitiendo gestionar el estado de múltiples fraccionamientos y visualizar sus eventos mediante una gráfica interactiva.

El proyecto está desarrollado utilizando manipulación del DOM, lógica modular separada y visualización de datos con **Chart.js**.

---

## 🚀 Características

- Cambio dinámico de estado (ABIERTA / CERRADA)
- Validación de obstáculo antes de abrir
- Interfaz interactiva sin botones adicionales
- Registro acumulativo de movimientos
- Visualización gráfica en tiempo real
- Actualización automática del monitoreo
- Diseño modular (control + monitoreo)

---

## 🧱 Tecnologías utilizadas

- **HTML5**
- **CSS3**
- **Chart.js**
- **Bootstrap**

---

## 🏗 Arquitectura del Proyecto

El sistema está dividido en dos módulos principales:

### 🔹 control.js
Responsable de:
- Gestionar eventos de clic
- Cambiar estado de cada acceso
- Validar obstáculos
- Actualizar estilos dinámicamente
- Enviar datos al módulo de monitoreo

### 🔹 monitoreo.js
Responsable de:
- Registrar cambios realizados
- Generar gráfica dinámica con Chart.js
- Acumular historial de movimientos
- Refrescar visualización automáticamente

---

## 📂 Estructura del Proyecto

📁 sistema-control-accesos/
│

├── index.html

├── css/

│ └── styles.css

├── js/

│ ├── control.js

│ └── monitoreo.js

└── README.md

---

## ⚙️ Funcionamiento del Sistema

Cada fraccionamiento mantiene atributos internos como:

- `data-estado`
- `data-obstaculo`

Flujo de ejecución:

1. El usuario hace clic sobre la tarjeta.
2. Se valida si existe obstáculo.
3. Se cambia el estado (ABIERTA / CERRADA).
4. Se actualiza el diseño visual.
5. Se registra el evento.
6. Se actualiza la gráfica de monitoreo.

---

## 📊 Visualización de Datos

La sección de monitoreo incluye:

- Gráfica dinámica generada con Chart.js
- Acumulación de movimientos recientes
- Actualización automática
- Representación visual del estado general del sistema

---

## 🎯 Objetivo Académico

Simular un entorno IoT aplicado a:

- Automatización residencial
- Gestión de accesos
- Sistemas de monitoreo en tiempo real
- Administración de registro
- Interacción dinámica con el DOM

---

## 👨‍💻 Autor

**Dara Sharleen Antonio Azuara**  
Proyecto académico – Implementación de Soluciones IoT  

