/* ===============================
   PENCERE (ŞEHİRLER) MANTIĞI
================================= */
let currentSlideIndex = 0;
const slides = ["slide-sanliurfa", "slide-istanbul"];

function openWindowModal() {
    document.getElementById('window-modal').style.display = 'block';
    currentSlideIndex = 0; 
    showSlide(currentSlideIndex);
}

function closeWindowModal() {
    document.getElementById('window-modal').style.display = 'none';
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    if (currentSlideIndex >= slides.length) { currentSlideIndex = 0; } 
    else if (currentSlideIndex < 0) { currentSlideIndex = slides.length - 1; }
    showSlide(currentSlideIndex);
}

function showSlide(index) {
    document.getElementById("slide-sanliurfa").style.display = "none";
    document.getElementById("slide-istanbul").style.display = "none";
    document.getElementById(slides[index]).style.display = "block";
}

/* ===============================
   GİYSİ DOLABI (TARZIM) MANTIĞI
================================= */
let currentWardrobeIndex = 1;
const totalWardrobeImages = 10; 

function openWardrobeModal() {
    document.getElementById('wardrobe-modal').style.display = 'block';
    currentWardrobeIndex = 1; 
    updateWardrobeImage();
}

function closeWardrobeModal() {
    document.getElementById('wardrobe-modal').style.display = 'none';
}

function changeWardrobeSlide(direction) {
    currentWardrobeIndex += direction;
    if (currentWardrobeIndex > totalWardrobeImages) {
        currentWardrobeIndex = 1;
    } else if (currentWardrobeIndex < 1) {
        currentWardrobeIndex = totalWardrobeImages;
    }
    updateWardrobeImage();
}

function updateWardrobeImage() {
    document.getElementById('wardrobe-img').src = `img/${currentWardrobeIndex}.jpeg`;
}

/* ===============================
   BİLGİSAYAR VE OYUN MANTIĞI
================================= */
let gameInterval; 

function openPC() {
    const room = document.querySelector('.room-wrapper');
    room.classList.add('zoom-in-effect');
    
    setTimeout(() => {
        document.getElementById('pc-modal').style.display = 'block';
    }, 800); 
}

function closePC() {
    document.getElementById('pc-modal').style.display = 'none';
    const room = document.querySelector('.room-wrapper');
    room.classList.remove('zoom-in-effect');
    closeInnerWindow(); 
}

function showSection(id) {
    document.getElementById('pc-window').style.display = 'block';
    document.querySelectorAll('.pc-content').forEach(el => el.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if(gameInterval) clearInterval(gameInterval); 
}

function closeInnerWindow() {
    document.getElementById('pc-window').style.display = 'none';
    if(gameInterval) clearInterval(gameInterval);
}

function startGame() {
    showSection('game-container');
    if(gameInterval) clearInterval(gameInterval);
    
    const canvas = document.getElementById("brickBreaker");
    const ctx = canvas.getContext("2d");

    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    const ballRadius = 10;

    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    let bricks = [];
    for(let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for(let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") { rightPressed = true; }
        else if(e.key == "Left" || e.key == "ArrowLeft") { leftPressed = true; }
    }

    function keyUpHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") { rightPressed = false; }
        else if(e.key == "Left" || e.key == "ArrowLeft") { leftPressed = false; }
    }

    function collisionDetection() {
        for(let c = 0; c < brickColumnCount; c++) {
            for(let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if(b.status == 1) {
                    if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#e74c3c";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#2c3e50";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for(let c = 0; c < brickColumnCount; c++) {
            for(let r = 0; r < brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#f1c40f";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) { dx = -dx; }
        if(y + dy < ballRadius) { dy = -dy; } 
        else if(y + dy > canvas.height - ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) { dy = -dy; } 
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }

        if(rightPressed && paddleX < canvas.width - paddleWidth) { paddleX += 7; }
        else if(leftPressed && paddleX > 0) { paddleX -= 7; }

        x += dx;
        y += dy;
    }

    gameInterval = setInterval(draw, 10);
}