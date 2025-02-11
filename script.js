let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
let pipe_count = 0; // Contador de tubos

img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', startGame);
document.addEventListener('touchstart', startGame);

function startGame(event) {
    if ((event.key === 'Enter' || event.type === 'touchstart') && game_state !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Puntuación: ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        pipe_count = 0;  // Reiniciar contador de tubos
        move_speed = 3;   // Reiniciar velocidad
        play();
    }
}

function play() {
    function move() {
        if (game_state !== 'Play') return;

        document.querySelectorAll('.pipe_sprite').forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (
                    bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top
                ) {
                    gameOver();
                    return;
                } else {
                    if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1') {
                        score_val.innerHTML = +score_val.innerHTML + 1;
                        sound_point.play();
                        pipe_count++;


                        if (pipe_count % 5 === 0) {
                            move_speed += 1;
                        }
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;

    function apply_gravity() {
        if (game_state !== 'Play') return;
        bird_dy += gravity;

        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            gameOver();
            return;
        }

        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'images/Bird-2.png';
            bird_dy = -7.6;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'images/Bird.png';
        }
    });

    document.addEventListener('touchstart', () => {
        img.src = 'images/Bird-2.png';
        bird_dy = -7.6;
    });

    document.addEventListener('touchend', () => {
        img.src = 'images/Bird.png';
    });

    let pipe_separation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if (game_state !== 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;
            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);

            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}

function gameOver() {
    game_state = 'End';
    let countdown = 3;
    message.classList.add('messageStyle');
    img.style.display = 'none';
    sound_die.play();

    document.removeEventListener('keydown', startGame);
    document.removeEventListener('touchstart', startGame);

    function updateMessage() {
        if (countdown > 0) {
            message.innerHTML = `Game Over`.fontcolor('red') + `<br>Reiniciando en ${countdown}...`;
            countdown--;
            setTimeout(updateMessage, 1000);
        } else {
            window.location.reload();
        }
    }

    updateMessage();
}
