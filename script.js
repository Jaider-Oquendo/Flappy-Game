// Define las variables para la velocidad de movimiento y la gravedad
let move_speed = 5, gravity = 0.5; 

// Obtiene referencias a los elementos del DOM
let bird = document.querySelector('.bird');  // Elemento del pájaro
let img = document.getElementById('bird-1'); // Imagen del pájaro
let sound_point = new Audio('sounds effect/point.mp3'); // Sonido cuando se gana un punto  
let sound_die = new Audio('sounds effect/die.mp3'); // Sonido cuando el jugador pierde o muere

// Define las propiedades de los elementos como el pájaro y el fondo
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect(); // Propiedades del fondo
let score_val = document.querySelector('.score_val'); // Elemento que muestra el puntaje
let message = document.querySelector('.message'); // Mensaje del juego
let score_title = document.querySelector('.score_title'); // Título del puntaje

let game_state = 'Start'; // Estado del juego (Start, Play, End)
let pipe_count = 0; // Contador de tubos
let startTime = null;  // Variable para almacenar el inicio del juego

img.style.display = 'none'; // Oculta la imagen del pájaro inicialmente
message.classList.add('messageStyle'); // Aplica estilo al mensaje de inicio

// Configura los eventos para iniciar el juego
document.addEventListener('keydown', startGame);
document.addEventListener('touchstart', startGame);

// Función para iniciar el juego cuando el jugador presiona Enter o toca la pantalla
function startGame(event) {
    // Si el juego no está en el estado "Play", se reinicia
    if ((event.key === 'Enter' || event.type === 'touchstart') && game_state !== 'Play') {
        // Elimina los tubos existentes
        document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
        img.style.display = 'block';  // Muestra la imagen del pájaro
        bird.style.top = '40vh';  // Ubica el pájaro en la posición inicial
        game_state = 'Play';  // Cambia el estado del juego a "Play"
        message.innerHTML = '';  // Limpia el mensaje de inicio
        score_title.innerHTML = 'Puntuación: ';  // Muestra el título de la puntuación
        score_val.innerHTML = '0';  // Reinicia el puntaje
        message.classList.remove('messageStyle'); // Elimina el estilo de mensaje
        pipe_count = 0;  // Reinicia el contador de tubos
        move_speed = 3;  // Reinicia la velocidad de movimiento
        startTime = Date.now();  // Marca el tiempo de inicio
        play();  // Llama a la función principal para comenzar el juego
    }
}

// Función que maneja el movimiento del juego
function play() {
    function move() {
        if (game_state !== 'Play') return;  // Si el juego no está en "Play", sale

        // Mueve todos los tubos
        document.querySelectorAll('.pipe_sprite').forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();  // Obtiene las propiedades del tubo
            bird_props = bird.getBoundingClientRect();  // Actualiza las propiedades del pájaro

            // Si el tubo ha salido de la pantalla, lo elimina
            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                // Verifica si el pájaro colisiona con el tubo
                if (
                    bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && // Verifica si el borde izquierdo del pájaro está antes del borde derecho del tubo
                    bird_props.left + bird_props.width > pipe_sprite_props.left && // Verifica si el borde derecho del pájaro está después del borde izquierdo del tubo
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && // Verifica si el borde superior del pájaro está por encima del borde inferior del tubo
                    bird_props.top + bird_props.height > pipe_sprite_props.top // Verifica si el borde inferior del pájaro está por debajo del borde superior del tubo
                ) {
                    gameOver();  // Si colisiona, termina el juego
                    return;     
                } else {
                    // Verifica si el pájaro ha pasado el tubo y suma puntos
                    if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1') {
                        score_val.innerHTML = +score_val.innerHTML + 1; // Incrementa el puntaje
                        sound_point.play();  // Reproduce el sonido de ganar puntos
                        pipe_count++; // Incrementa el contador de tubos

                        // Aumenta la velocidad del juego cada 5 tubos
                        if (pipe_count % 5 === 0) { // Se cumple cuando el contador es múltiplo de 5
                            move_speed += 1; 
                        }
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';  // Mueve el tubo hacia la izquierda
                }
            }
        });
        requestAnimationFrame(move);  // Continúa el movimiento de los tubos
    }
    requestAnimationFrame(move);

    let bird_dy = 0;  // Velocidad vertical del pájaro

    // Función para aplicar la gravedad al pájaro
    function apply_gravity() {
        if (game_state !== 'Play') return;  // Si el juego no está en "Play", sale
        bird_dy += gravity;  // Aplica la gravedad

        bird.style.top = bird_props.top + bird_dy + 'px';  // Actualiza la posición del pájaro
        bird_props = bird.getBoundingClientRect();  // Obtiene las coordenadas actuales del pájaro

        // Si el pájaro toca el techo o el suelo, termina el juego
        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            gameOver();
            return;
        }

        requestAnimationFrame(apply_gravity);  // Continúa aplicando la gravedad
    }
    requestAnimationFrame(apply_gravity);

    // Maneja el control de salto con las teclas o la pantalla táctil
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'images/Pajaro-2.png';  // Cambia la imagen del pájaro al saltar
            bird_dy = -7.6;  // Da una velocidad negativa para hacer que el pájaro suba
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'images/Pajaro.png';  // Cambia la imagen del pájaro a la normal
        }
    });

    // Control para el salto en dispositivos táctiles
    document.addEventListener('touchstart', () => {
        img.src = 'images/Pajaro-2.png';  // Cambia la imagen del pájaro al saltar
        bird_dy = -7.6;  // Da la velocidad negativa para el salto
    });

    document.addEventListener('touchend', () => {
        img.src = 'images/Pajaro.png';  // Cambia la imagen del pájaro a la normal
    });

    let pipe_separation = 0;  // Controla la separación entre tubos
    let pipe_gap = 35;  // Controla el espacio entre los tubos

    // Función para crear nuevos tubos
    function create_pipe() {
        if (game_state !== 'Play') return;  // Si el juego no está en "Play", sale

        // Aumenta la frecuencia de aparición de los tubos después de 1 minuto (60,000 ms)
        let currentTime = Date.now();
        let elapsedTime = currentTime - startTime;
        
        // Si han pasado más de dos minuto (120000 ms), crea tubos más rápidamente
        if (pipe_separation > (elapsedTime > 120000 ? 80 : 115)) {
            pipe_separation = 0;  // Reinicia la separación

            // Genera una posición aleatoria para el tubo
            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            // Crea el tubo superior
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);

            // Crea el tubo inferior
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';  // Indicador de aumento de puntuación

            document.body.appendChild(pipe_sprite);
        }
        pipe_separation++;  // Aumenta la separación
        requestAnimationFrame(create_pipe);  // Crea más tubos continuamente
    }
    requestAnimationFrame(create_pipe);  // Inicia la creación de tubos
}

// Función para manejar el fin del juego
function gameOver() {
    game_state = 'End';  // Cambia el estado a "End"
    let countdown = 3;  // Temporizador para reiniciar el juego
    message.classList.add('game-over');  // Aplica la clase game-over al mensaje
    img.style.display = 'none';  // Oculta la imagen del pájaro
    sound_die.play();  // Reproduce el sonido de perder

    // Elimina los eventos para que no se reinicie el juego accidentalmente
    document.removeEventListener('keydown', startGame);
    document.removeEventListener('touchstart', startGame);

    // Actualiza el mensaje de fin de juego
    function updateMessage() {
        if (countdown > 0) {
            message.innerHTML = `
                <h3>Game Over</h3>
                <p class="countdown">Reiniciando en ${countdown}...</p>`;
            countdown--;
            setTimeout(updateMessage, 1000);  // Actualiza el mensaje cada segundo
        } else {
            window.location.reload();  // Recarga la página para reiniciar el juego
        }
    }

    updateMessage();  // Inicia el contador de reinicio
}
