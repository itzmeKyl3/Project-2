let gameCharacter;
let monsters = [];
let collectibles = [];
let score = 0;
let isGameOver = false;
let mySound;
let backgroundImage;
let playerImage;
let monsterImage;
let collectiblesImage;
let youdie;
let scream;
let StartScreen;
let bo2;
let jumpsound;

let gameStarted = false;

function preload() {
  // Load Startscreen
  StartScreen = loadImage("startscreen.gif");
  // Load Background
  backgroundImage = loadImage("background.jpg");
  // Load Player
  playerImage = loadImage("player.gif");
  // Load Slenderman
  monsterImage = loadImage("slender.png");
  // Load GameOver
  youdie = loadImage("gameover.gif");
  // Load Pages
  collectiblesImage = loadImage("pages.png");
  // Load sound
  scream = loadSound("scream.mp3");
  // Load Sound
  bo2 = loadSound("bo2.mp3");
  // Load Jumpsound
  jumpsound = loadSound("jumpman.mp3")
}

class GameCharacter {
  constructor() {
    this.width = 100;
    this.height = 60;
    this.x = 40;
    this.y = height - this.height;
    this.velocityY = 0;
    this.gravity = 0.95;
  }

  show() {
    image(playerImage, this.x, this.y, this.width, this.height);
  }

  update() {
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    this.y = constrain(this.y, 0, height - this.height);
  }

  jump() {
    if (this.y === height - this.height) {
      this.velocityY = -20;
    }
  }

  hits(collectible) {
    return (
      this.x + this.width > collectible.x &&
      this.x < collectible.x + collectible.size &&
      this.y + this.height > collectible.y &&
      this.y < collectible.y + collectible.size
    );
  }

  collidesWith(object) {
    let playerLeft = this.x;
    let playerRight = this.x + this.width;
    let playerTop = this.y;
    let playerBottom = this.y + this.height;

    let objectLeft = object.x;
    let objectRight = object.x + object.width;
    let objectTop = object.y;
    let objectBottom = object.y + object.height;

    return (
      playerLeft < objectRight &&
      playerRight > objectLeft &&
      playerTop < objectBottom &&
      playerBottom > objectTop
    );
  }
}

function setup() {
  createCanvas(720, 400);
  gameCharacter = new GameCharacter();
  scream.setVolume(1); // Scream volume
  jumpsound.setVolume(1); //jump volume
}

function draw() {
  if (gameStarted) {
    image(backgroundImage, 0, 0, width, height);

    if (!isGameOver) {
      gameCharacter.show();
      gameCharacter.update();
      handleCollectibles();
      handleMonsters();
      displayScore();
    } else {
      displayGameOver();
    }
  } else {
    displayStartScreen();
  }
}

function keyPressed() {
  if (!gameStarted) {
    // Start the game on any key press
    gameStarted = true;
    bo2.play(); // Play music
  } else if (!isGameOver) {
    if (key === " ") {
      gameCharacter.jump();
      jumpsound.play();
    }
  } else {
    resetGame();
  }
}

function handleCollectibles() {
  if (frameCount % 100 === 0) {
    collectibles.push(new Collectible());
  }

  for (let i = collectibles.length - 1; i >= 0; i--) {
    collectibles[i].show();
    collectibles[i].update();

    if (gameCharacter.hits(collectibles[i])) {
      score++;
      collectibles.splice(i, 1);
    }
  }
}

function handleMonsters() {
  if (frameCount % 100 === 0) {
    monsters.push(new Monster());
  }

  for (let i = monsters.length - 1; i >= 0; i--) {
    monsters[i].show();
    monsters[i].update();

    if (gameCharacter.collidesWith(monsters[i])) {
      stopBo2();
      gameOver();
      scream.play(); // Scream when contact is made
      return;
    }

    if (monsters[i].offscreen()) {
      monsters.splice(i, 1);
      score++;
    }
  }
}

function stopBo2() {
  if (bo2.isPlaying()) {
    bo2.stop();
  }
}

function gameOver() {
  isGameOver = true;
  scream.play(); // Scream when the game is over.
  displayGameOver();
}

function resetGame() {
  gameCharacter = new GameCharacter();
  monsters = [];
  collectibles = [];
  score = 0;
  isGameOver = false;
  gameStarted = false;
}

function displayScore() {
  textSize(24);
  fill(255);
  text(`Score: ${score}`, 70, 30);
}

function displayGameOver() {
  image(youdie, 0, 0, 720, 400);
  textSize(48);
  fill(200, 8, 8);
  textStyle(BOLD);
  text(`Score: ${score}`, width / 4 + 180, height / 2 + 100);
}

function displayStartScreen() {
  image(StartScreen, 0, 0, 720, 400);
  textSize(24);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Press any key to start", width / 2, height - 50);
}

class Collectible {
  constructor() {
    this.x = 720;
    this.y = random(150, 400);
    this.size = 20;
  }

  show() {
    image(collectiblesImage, this.x, this.y, this.size, this.size);
  }

  update() {
    this.x -= 3;
  }
}

class Monster {
  constructor() {
    this.width = 30;
    this.height = random(30, 120);
    this.x = width;
    this.y = height - this.height;
    this.speed = 8;
  }

  show() {
    image(monsterImage, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x < -this.width;
  }
}
