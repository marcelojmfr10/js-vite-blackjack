import _ from 'underscore';
// import { crearDeck as crearNuevoDeck } from './usecases/crear-deck';
// import crearDeck, { miNombre } from './usecases/crear-deck';

import { crearDeck, pedirCarta, valorCarta } from './usecases';

    let deck = [];
    const tipos = ['C','D','H','S'], especiales = ['A','J','Q','K'];

    // let puntosJugador = 0, puntosComputadora = 0;
    let puntosJugadores = [];

    // referencias de html
    const btnNuevo = document.querySelector('#btnNuevo'),
     btnPedir = document.querySelector('#btnPedir'),
     btnDetener = document.querySelector('#btnDetener'),
     puntosHTML = document.querySelectorAll('small');
    const divCartasJugadores = document.querySelectorAll('.divCartas');
    //  divCartasJugador = document.querySelector('#jugador-cartas'),
    //  divCartasComputadora = document.querySelector('#computadora-cartas');

     // esta función inicializa el juego
    const inicializarJuego = (numJugadores = 2) =>{
        deck = crearDeck(tipos, especiales);
        puntosJugadores = [];
        for(let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled=false;
        btnDetener.disabled=false;
    }

    // turno: 0 = primer jugador y el último será la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarga = document.createElement('img');
            imgCarga.src = `assets/cartas/${carta}.png`;
            imgCarga.classList.add('carta');
            divCartasJugadores[turno].append(imgCarga);
            // divCartasComputadora.append(imgCarga);
    }

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores
        setTimeout(() => {
            if(puntosComputadora === puntosMinimos){
                alert('Nadie gana :(');
            } else if(puntosMinimos > 21){
                alert('Computadora gana');
            } else if (puntosComputadora > 21) {
                alert('Jugador gana');
            } else {
                alert('Computadora gana');
            }
        }, 100);
    }

    // turno de la computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta(deck);
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

            if (puntosMinimos>21){
                break;
            }

        } while((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
        
    }

    // eventos
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta(deck);
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);

        if(puntosJugador > 21){
            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21){
            console.warn('21, genial!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {
        btnDetener.disabled = true;
        btnPedir.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });
