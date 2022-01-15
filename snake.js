const SNAKE_UP = 38;
const SNAKE_DOWN = 40;
const SNAKE_LEFT = 37;
const SNAKE_RIGHT = 39;
const SNAKE_GAME_SPEED = 120;

let snakeGame = class {
    constructor(snakeWindow) {
        this.snakeWindow = snakeWindow;
        this.text = this.snakeWindow.getElementsByClassName('text')[0];
        this.snakeBody = [];
        this.apple = undefined;
        this.reset();

        document.onkeydown = () => this.onKeyDown();
        setInterval(() => this.gameLoop(), SNAKE_GAME_SPEED);
    }

    reset() {
        while (this.snakeBody.length > 0) {
            let snakePart = this.snakeBody.shift();
            snakePart.el.remove();
        }
        if (this.apple !== undefined)
            this.apple.el.remove();
        this.snakePosition = { x: 0, y: 0 };
        this.snakeDirection = undefined;
        this.length = 1;
        this.createSnakePart();
        this.createApple();
        this.text.style.opacity = "100%";
    }

    onKeyDown(e) {
        e = e || window.event;
        switch (e.keyCode) {
            case SNAKE_UP:
            case SNAKE_LEFT:
            case SNAKE_RIGHT:
            case SNAKE_DOWN:
                this.snakeDirection = e.keyCode;
            default:
                break;
        }
    }

    mod(n, m) {
        return ((n % m) + m) % m;
    }

    gameLoop() {
        if (this.snakeDirection !== undefined) {
            this.text.style.opacity = "0%";
            if (this.snakeDirection == SNAKE_UP)
                this.snakePosition.y -= 1;
            else if (this.snakeDirection == SNAKE_DOWN)
                this.snakePosition.y += 1;
            else if (this.snakeDirection == SNAKE_LEFT)
                this.snakePosition.x -= 1;
            else if (this.snakeDirection == SNAKE_RIGHT)
                this.snakePosition.x += 1;

            this.snakePosition.x = this.mod(this.snakePosition.x, 20);
            this.snakePosition.y = this.mod(this.snakePosition.y, 15);

            // Check for collision
            for (let i = 0; i < this.snakeBody.length - 1; i++) {
                let snakePart = this.snakeBody[i];
                if (this.snakePosition.x === snakePart.x && this.snakePosition.y === snakePart.y) {
                    this.reset();
                    break;
                }
            }

            this.createSnakePart();
        }

        while (this.snakeBody.length > this.length) {
            let snakePart = this.snakeBody.shift();
            snakePart.el.remove();
        }

        // Check for apple
        if (this.snakePosition.x === this.apple.x && this.snakePosition.y === this.apple.y) {
            this.apple.el.remove();
            this.createApple();
            this.length += 1;
        }
    }

    createSnakePart() {
        let snakePart = document.createElement("div");
        snakePart.classList.add('cell');
        snakePart.classList.add('snake');
        snakePart.style.left = this.snakePosition.x * 20 + 'px';
        snakePart.style.top = this.snakePosition.y * 20 + 'px';
        this.snakeWindow.appendChild(snakePart);
        this.snakeBody.push({ el: snakePart, x: this.snakePosition.x, y: this.snakePosition.y });
    }

    createApple() {
        let x, y;
        while (true) {
            x = Math.floor(Math.random() * 20);
            y = Math.floor(Math.random() * 15);
            let valid = true;
            for (let i = 0; i < this.snakeBody.length; i++) {
                let snakePart = this.snakeBody[i];
                if (x === snakePart.x && y === snakePart.y) {
                    valid = false;
                    break;
                }
            }

            if (valid)
                break;
        }
        let apple = document.createElement("div");
        apple.classList.add('cell');
        apple.classList.add('apple');
        apple.style.left = x * 20 + 'px';
        apple.style.top = y * 20 + 'px';
        this.snakeWindow.appendChild(apple);
        this.apple = { el: apple, x: x, y: y };
    }
}

let snakeWindow = document.getElementById('snakeWindow');
new snakeGame(snakeWindow);