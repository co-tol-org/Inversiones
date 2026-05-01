const $ = (id) => document.getElementById(id);
const fmtCOP = n => Number(n).toLocaleString('es-CO', { style:'currency', currency:'COP', maximumFractionDigits:0 });

let map;

// 1. INICIALIZAR EL MAPA
async function initMap() {
    // Si el mapa ya existe, no lo recreamos
    if (map) return;

    map = L.map('map', { 
        zoomControl: false, 
        attributionControl: false 
    }).setView([4.438, -75.232], 9);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    console.log("Mapa iniciado correctamente.");
    
    // Ocultar loader si existe
    const loader = $('loader');
    if (loader) loader.style.display = 'none';
}

// 2. CONFIGURAR EVENTOS DEL CHAT
function setupChatEvents() {
    const btnReset = $('btn-reset');
    const dfMessenger = document.querySelector('df-messenger');

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            console.log("Reiniciando sesión de AMAIA...");
            sessionStorage.clear();
            window.location.reload();
        });
    }

    // Escuchar si el chat reporta algún error en consola
    window.addEventListener('df-messenger-error', (event) => {
        console.error("Error en AMAIA:", event.detail);
    });
}

// 3. ARRANQUE UNIFICADO
window.addEventListener('load', () => {
    initMap();
    setupChatEvents();
});

// 4. DESPERTAR A AMAIA
window.addEventListener('df-messenger-loaded', () => {
    const messenger = document.querySelector('df-messenger');
    
    if (messenger) {
        // Esta es la señal oficial. Como ya cambiaste sus instrucciones, 
        // al recibir esto, ella tomará la iniciativa y lanzará el texto.
        messenger.triggerWelcomeEvent();
    }
});
