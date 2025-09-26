// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 400;
canvas.height = 600;

// Game objects
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    dx: 0,
    dy: 0,
    speed: 3,
    maxSpeed: 8
};

const paddleWidth = 80;
const paddleHeight = 10;
const playerPaddle = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: canvas.height - 30,
    width: paddleWidth,
    height: paddleHeight,
    dx: 5,
    score: 0
};

const computerPaddle = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: 30,
    width: paddleWidth,
    height: paddleHeight,
    dx: 4,
    score: 0
};

// Draw functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(paddle) {
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawCenterLine() {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game objects
    drawCenterLine();
    drawBall();
    drawPaddle(playerPaddle);
    drawPaddle(computerPaddle);
    
    // Update score display
    document.getElementById('player-score').textContent = playerPaddle.score;
    document.getElementById('computer-score').textContent = computerPaddle.score;
}

// Movement and controls
function movePaddles() {
    // Computer AI
    const paddleCenter = computerPaddle.x + computerPaddle.width / 2;
    const ballCenter = ball.x;
    
    if (paddleCenter < ballCenter - 35) {
        computerPaddle.x += computerPaddle.dx;
    } else if (paddleCenter > ballCenter + 35) {
        computerPaddle.x -= computerPaddle.dx;
    }

    // Keep paddles within canvas
    playerPaddle.x = Math.max(0, Math.min(canvas.width - playerPaddle.width, playerPaddle.x));
    computerPaddle.x = Math.max(0, Math.min(canvas.width - computerPaddle.width, computerPaddle.x));
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Left and right collisions
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    // Paddle collisions
    if (checkPaddleCollision(playerPaddle) && ball.dy > 0) { // Only if ball is moving downward
        // Bounce off player paddle (bottom)
        ball.dy = -Math.abs(ball.dy); // Ensure it moves upward
        
        // Add a small angle change based on where the ball hits the paddle
        const hitPoint = (ball.x - playerPaddle.x) / playerPaddle.width;
        ball.dx = (hitPoint - 0.5) * 6; // Max horizontal speed component
        
        // Ensure consistent overall speed
        const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        const speedFactor = ball.speed / currentSpeed;
        ball.dx *= speedFactor;
        ball.dy *= speedFactor;
        
        // Add a small offset to prevent sticking
        ball.y = playerPaddle.y - ball.size - 1; // Move ball slightly above the paddle
    } else if (checkPaddleCollision(computerPaddle) && ball.dy < 0) { // Only if ball is moving upward
        // Bounce off computer paddle (top)
        ball.dy = Math.abs(ball.dy); // Ensure it moves downward
        
        // Add a small angle change based on where the ball hits the paddle
        const hitPoint = (ball.x - computerPaddle.x) / computerPaddle.width;
        ball.dx = (hitPoint - 0.5) * 6; // Max horizontal speed component
        
        // Ensure consistent overall speed
        const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        const speedFactor = ball.speed / currentSpeed;
        ball.dx *= speedFactor;
        ball.dy *= speedFactor;
        
        // Add a small offset to prevent sticking
        ball.y = computerPaddle.y + computerPaddle.height + ball.size + 1; // Move ball slightly below the paddle
    }

    // Score points - only when ball clearly passes the paddle
    if (ball.y - ball.size < 0) {
        // Ensure the ball has completely passed the top paddle before scoring
        if (ball.dy < 0) { // Only if the ball was moving upward
            playerPaddle.score++;
            resetBall();
        }
    } else if (ball.y + ball.size > canvas.height) {
        // Ensure the ball has completely passed the bottom paddle before scoring
        if (ball.dy > 0) { // Only if the ball was moving downward
            computerPaddle.score++;
            resetBall();
        }
    }
}

function checkPaddleCollision(paddle) {
    // More precise collision detection to prevent sticking
    return ball.y + ball.size > paddle.y && 
           ball.y - ball.size < paddle.y + paddle.height &&
           ball.x + ball.size > paddle.x && 
           ball.x - ball.size < paddle.x + paddle.width;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    // Set initial angle ensuring minimum horizontal movement to avoid straight up/down motion
    let angle = (Math.random() - 0.5) * Math.PI / 2;
    
    // Ensure a minimum horizontal speed to prevent straight up/down loops
    const minHorizontalSpeed = 1.5;
    ball.dx = ball.speed * Math.sin(angle);
    
    // If the horizontal speed is too low, adjust it
    if (Math.abs(ball.dx) < minHorizontalSpeed) {
        // Adjust the angle to ensure minimum horizontal movement
        if (ball.dx >= 0) {
            ball.dx = minHorizontalSpeed;
        } else {
            ball.dx = -minHorizontalSpeed;
        }
    }
    
    ball.dy = ball.speed * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
    
    // Ensure there's a minimum vertical speed as well
    const minVerticalSpeed = 1.5;
    if (Math.abs(ball.dy) < minVerticalSpeed) {
        if (ball.dy >= 0) {
            ball.dy = minVerticalSpeed;
        } else {
            ball.dy = -minVerticalSpeed;
        }
    }
}

// Keyboard controls
const keys = {
    a: false,
    d: false
};

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'a') keys.a = true;
    if (e.key.toLowerCase() === 'd') keys.d = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'a') keys.a = false;
    if (e.key.toLowerCase() === 'd') keys.d = false;
});

function handlePlayerInput() {
    if (keys.a) playerPaddle.x -= playerPaddle.dx;
    if (keys.d) playerPaddle.x += playerPaddle.dx;
}

// Initialize game loop
function gameLoop() {
    handlePlayerInput();
    movePaddles();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
resetBall();
gameLoop();