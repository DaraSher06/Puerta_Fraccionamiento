![Status](https://img.shields.io/badge/status-academic-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-green)


🚧 Sistema IoT de Control y Monitoreo de Accesos Residenciales
📋 1. Descripción General

El presente proyecto consiste en el desarrollo de una aplicación web para el control y monitoreo en tiempo real de accesos vehiculares en fraccionamientos residenciales, simulando un entorno IoT.

La solución implementa:

Control dinámico del estado de puertas (ABIERTA / CERRADA)

Validación de condición de obstáculo

Registro histórico de eventos

Visualización gráfica en tiempo real

Arquitectura modular basada en separación de responsabilidades

El sistema simula dispositivos IoT conectados mediante una interfaz web interactiva.

🎯 2. Objetivos
Objetivo General

Desarrollar una solución web que permita la administración y monitoreo dinámico de dispositivos IoT simulados.

Objetivos Específicos

Implementar un sistema CRUD de dispositivos

Simular estados operativos en tiempo real

Registrar los últimos 10 eventos de modificación

Visualizar métricas mediante gráfica dinámica

Aplicar buenas prácticas de organización de proyecto

🏗 3. Arquitectura del Sistema

El sistema está dividido en dos módulos principales:

🔹 Módulo de Control (control.js)

Responsable de:

Manejo de eventos de clic

Cambio de estado dinámico

Validación de obstáculo

Actualización visual del componente

Envío de eventos al módulo de monitoreo

🔹 Módulo de Monitoreo (monitoreo.js)

Responsable de:

Actualización automática cada 2 segundos

Renderización de gráfica en tiempo real (Chart.js)

Registro acumulativo de los últimos 10 cambios

Organización cronológica por timestamp

🧩 4. Funcionalidades Técnicas
4.1 Control Dinámico

Las tarjetas son completamente clickeables

No existen botones independientes

El estado cambia con un solo evento onclick

Se conserva la validación de obstáculo

Se mantiene sincronización con la gráfica

4.2 Registro Histórico

Se almacenan únicamente los últimos 10 registros

Se acumulan conforme al horario de modificación

Se ordenan cronológicamente

Se actualizan automáticamente cada 2 segundos

4.3 Visualización en Tiempo Real

Implementación con Chart.js

Actualización dinámica sin recargar la página

Representación gráfica del estado de accesos

🛠 5. Tecnologías Utilizadas
Tecnología	Uso
HTML5	Estructura del sistema
CSS3	Diseño visual y estilos
JavaScript (ES6)	Lógica de negocio
Chart.js	Visualización gráfica
Git	Control de versiones

📂 6. Estructura del Proyecto
📁 sistema-iot-accesos/
│
├── 📄 index.html
├── 📁 css/
│   └── styles.css
│
├── 📁 js/
│   ├── control.js
│   └── monitoreo.js
│
├── 📁 assets/
│   └── favicon.ico
│
└── 📄 README.md

🔄 8. Flujo de Funcionamiento

Usuario hace clic en una tarjeta de control.

Se valida condición de obstáculo.

Se cambia el estado.

Se actualiza el estilo visual.

Se registra el evento con timestamp.

El módulo de monitoreo refresca cada 2 segundos.

Se actualiza la gráfica y la tabla histórica.

📊 9. Características Técnicas Destacadas

Separación de lógica por módulos

Actualización asincrónica sin recarga

Manipulación dinámica del DOM

Manejo de eventos eficiente

Organización profesional del proyecto

Diseño responsivo

Favicon personalizado

Footer institucional con autoría

🔐 10. Escalabilidad

El sistema puede evolucionar hacia:

Conexión con API REST (MockAPI o backend real)

Persistencia en base de datos (MySQL / Firebase)

Integración con sensores físicos

Implementación con Angular o React

Autenticación de usuarios

Dashboard administrativo avanzado

👨‍💻 11. Autor

Nombre: Dara Sharleen Antonio Azuara
Materia: Implementación de Soluciones IoT
Nivel: Universitario
Tipo de Proyecto: Académico