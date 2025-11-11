const SEGUNDOS_MAXIMOS = 24 * 60 * 60;

let tiempoTotalSegundos;
let intervalId = null;
let estaCorriendo = false;

const displayTemporizador = document.getElementById('display-temporizador');
const botonIniciarPausar = document.getElementById('iniciar-pausar');
const botonReiniciar = document.getElementById('reiniciar');

const addHour = document.getElementById('add-hour');
const subtractHour = document.getElementById('subtract-hour');
const addMinute = document.getElementById('add-minute');
const subtractMinute = document.getElementById('subtract-minute');
const addSecond = document.getElementById('add-second');
const subtractSecond = document.getElementById('subtract-second');

function formatoTiempo(totalSegundos) {
    const segundosAbsolutos = Math.max(0, totalSegundos);

    const horas = Math.floor(segundosAbsolutos / 3600);
    const minutos = Math.floor((segundosAbsolutos % 3600) / 60);
    const segundos = segundosAbsolutos % 60;

    const h = String(horas).padStart(2, '0');
    const m = String(minutos).padStart(2, '0');
    const s = String(segundos).padStart(2, '0');

    return `${h}:${m}:${s}`;
}


function ticTac() {
    if (tiempoTotalSegundos <= 0) {
        pausarTemporizador();
        tiempoTotalSegundos = 0;
        displayTemporizador.textContent = formatoTiempo(tiempoTotalSegundos);
        alert("Tiempo agotado");
        return;
    }

    tiempoTotalSegundos--;
    displayTemporizador.textContent = formatoTiempo(tiempoTotalSegundos);
}

function iniciarPausarTemporizador() {
    if (tiempoTotalSegundos <= 0 && !estaCorriendo) {
        return;
    }
    if (estaCorriendo) {
        pausarTemporizador();
    } else {
        iniciarTemporizador();
    }
}

function iniciarTemporizador() {
    if (intervalId === null) {
        intervalId = setInterval(ticTac, 1000);
        estaCorriendo = true;
    }
    deshabilitarControles(true);
}

function pausarTemporizador() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        estaCorriendo = false;
    }
    deshabilitarControles(false);
}

function reiniciarTemporizador() {
    pausarTemporizador();
    tiempoTotalSegundos = Math.floor(Math.random() * SEGUNDOS_MAXIMOS) + 1;
    displayTemporizador.textContent = formatoTiempo(tiempoTotalSegundos);
}

function modificarTiempo(segundosAModificar) {
    if (estaCorriendo) {
        alert("No puede modificarse el temporizador");
    }
    let nuevoTiempo = tiempoTotalSegundos + segundosAModificar;

    if (nuevoTiempo > SEGUNDOS_MAXIMOS) {
        nuevoTiempo = SEGUNDOS_MAXIMOS;
    }

    if (nuevoTiempo < 0) {
        nuevoTiempo = 0;
    }

    tiempoTotalSegundos = nuevoTiempo;
    displayTemporizador.textContent = formatoTiempo(tiempoTotalSegundos);
}

function deshabilitarControles(deshabilitar) {
    addHour.disabled = deshabilitar;
    subtractHour.disabled = deshabilitar;
    addMinute.disabled = deshabilitar;
    subtractMinute.disabled = deshabilitar;
    addSecond.disabled = deshabilitar;
    subtractSecond.disabled = deshabilitar;
}

document.addEventListener('DOMContentLoaded', () => {
    tiempoTotalSegundos = Math.floor(Math.random() * SEGUNDOS_MAXIMOS) + 1;
    displayTemporizador.textContent = formatoTiempo(tiempoTotalSegundos);

    botonIniciarPausar.addEventListener('click', iniciarPausarTemporizador);
    botonReiniciar.addEventListener('click', reiniciarTemporizador);

    addHour.addEventListener('click', () => modificarTiempo(3600));
    subtractHour.addEventListener('click', () => modificarTiempo(-3600));
    addMinute.addEventListener('click', () => modificarTiempo(600));
    subtractMinute.addEventListener('click', () => modificarTiempo(-600));
    addSecond.addEventListener('click', () => modificarTiempo(10));
    subtractSecond.addEventListener('click', () => modificarTiempo(-10));
});