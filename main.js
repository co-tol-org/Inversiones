const $ = (id) => document.getElementById(id);
const norm = s => String(s||'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ');
const fmtCOP = n => Number(n).toLocaleString('es-CO', { style:'currency', currency:'COP', maximumFractionDigits:0 });

let ORIGINAL_DATA = [], RAW_DATA = [], MAP_GEOJSON = null, map;
const state = { sub: "", muni: "", sec: "", munisList: [] };

// 1. INICIALIZAR EL MAPA Y FETCH DE DATOS
async function initMap() {
    // Inicializamos el mapa aunque el fetch falle
    map = L.map('map', { zoomControl: false, attributionControl: false }).setView([4.438, -75.232], 9);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    try {
        const response = await fetch('/api/payload.json'); 
        if (!response.ok) throw new Error("Archivo JSON no encontrado");
        
        const payload = await response.json();
        MAP_GEOJSON = payload.geo;
        ORIGINAL_DATA = payload.data;
        
        // Aquí iría tu lógica de renderizado de capas que ya tienes programada
        console.log("Datos cargados correctamente");
        
        if ($('loader')) $('loader').style.display = 'none';
    } catch (e) { 
        console.warn("Aviso: No se pudieron cargar los datos del mapa (esperando API), pero el sistema sigue.");
        if ($('loader')) $('loader').style.display = 'none';
    }
}

// 2. LÓGICA DEL AGENTE CONVERSACIONAL (AMAIA)
function setupChatIA() {
    const btnReset = document.getElementById('btn-reset');
    const dfMessenger = document.querySelector('df-messenger');
    const wrapper = document.querySelector('.messenger-wrapper');

    // Escuchar cuando el componente de Google esté realmente listo
    if (dfMessenger) {
        dfMessenger.addEventListener('df-messenger-loaded', () => {
            console.log("AMAIA: Conexión establecida con Dialogflow CX");
        });
    }

    // Lógica del botón de reinicio
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (wrapper) wrapper.style.opacity = '0.5';
            
            // Limpiamos sesión y refrescamos para asegurar un chat nuevo
            sessionStorage.clear();
            setTimeout(() => {
                window.location.reload();
            }, 300);
        });
    }
}

// 3. ARRANQUE UNIFICADO (Evita conflictos de carga)
window.addEventListener('load', () => {
    initMap();    // Carga el mapa
    setupChatIA(); // Carga a AMAIA
});
