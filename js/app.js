// Customize your game here:
	//Set a images for the enemy and player
	var ENEMY_IMAGE = 'images/enemy-bug.png';
	var PLAYER_IMAGE = 'images/char-boy.png'; //Could not get any other characters to work! bad file?
	var PLAYER_WIDTH = 83;
	//Set the winning score
	var WINNING_SCORE = 5;

// Other Global Constants
var CANVAS_WIDTH = 505;
var CANVAS_HEIGHT = 606;
var BLOCK_HEIGHT = 83;
var BLOCK_WIDTH = CANVAS_WIDTH / 5;
var PLAYER_START_X = 200; // starting location of the player
var PLAYER_START_Y = 405;
var SCORE_TEXT_X = 0;
var SCORE_TEXT_Y = 603;
var SCORE_BOX_WIDTH = 500;
var SCORE_BOX_HEIGHT = 20;
var SCORE_BOX_X = 60;
var SCORE_BOX_Y = 606 - SCORE_BOX_HEIGHT;
var ENEMY_MIN_X = -400;
var ENEMY_MAX_X = -20;
var ENEMY_MIN_Y = 60;
var ENEMY_MIN_VELOCITY = 75;
var ENEMY_MAX_VELOCITY = 200;

// Global Variables
var gameOver = false;
var theScore = 0;

// Work the scoreboard
var setScore = function(n) {
    var sayText;

    theScore = theScore + n;

    // clear out the old score
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(SCORE_TEXT_X, SCORE_BOX_Y, SCORE_BOX_WIDTH, SCORE_BOX_HEIGHT);

    // see if the player has won or lost (if score gets to 10 or goes below 0)
    if (theScore >= WINNING_SCORE) {
        gameOver = true;
        sayText = "Congratulations!  You won! (Press <space> to play again.)";
    } else if (theScore < 0) {
        gameOver = true;
        sayText = "You lost!   (Press <space> to play again.)";
    } else if (theScore === 0) {
        sayText = "Welcome to Bugmania! Use arrow keys to play. Score of " + WINNING_SCORE + " wins!";
    }

    // Update the scoreboard
    if (gameOver || theScore === 0) {

        // write "win or lose"
        ctx.font = "12pt sans-serif";
        ctx.textAlign = "left";
        ctx.strokeStyle = "#808080";
        ctx.fillStyle = "#33CC33";
        ctx.strokeText(sayText, SCORE_TEXT_X, SCORE_TEXT_Y);
        ctx.fillText(sayText, SCORE_TEXT_X, SCORE_TEXT_Y);

    } else {

        // write "score"
        ctx.font = "14pt sans-serif";
        ctx.textAlign = "left";
        ctx.strokeStyle = "#808080";
        ctx.fillStyle = "#33CC33";
        ctx.strokeText("Score: ", SCORE_TEXT_X, SCORE_TEXT_Y);
        ctx.fillText("Score: ", SCORE_TEXT_X, SCORE_TEXT_Y);

        // write the new score
        ctx.font = "14pt sans-serif";
        ctx.textAlign = "left";
        ctx.strokeStyle = "#808080";
        ctx.fillStyle = "#000000";
        ctx.strokeText(theScore + " (Press <home> after reaching top to continue.)", SCORE_BOX_X, SCORE_TEXT_Y);
        ctx.fillText(theScore + " (Press <home> after reaching top to continue.)", SCORE_BOX_X, SCORE_TEXT_Y);
    }
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = ENEMY_IMAGE;
    this.velocity = (Math.random() * ENEMY_MAX_VELOCITY) + ENEMY_MIN_VELOCITY;
	this.randomStart();
};

Enemy.prototype.randomStart = function() {
   this.x = (Math.random() * (ENEMY_MAX_X - ENEMY_MIN_X)) + ENEMY_MIN_X;
   this.y = ENEMY_MIN_Y + (BLOCK_HEIGHT * (Math.round(Math.random() * 2)));
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.velocity * dt);

    //if x > ?? then reset to random x and y starting position
    if (this.x > CANVAS_WIDTH) {
        this.randomStart();
    }
    // see if got the player!
    this.gotPlayer();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// See if enemy is touching player
Enemy.prototype.gotPlayer = function() {
    if ((((this.x + PLAYER_WIDTH) > player.x) && (this.x < (player.x + PLAYER_WIDTH))) &&
        ((this.y < player.y) && (this.y > (player.y - BLOCK_HEIGHT)))) {
        // If touching move player back to start
		player.resetPosition();
		// remove a point
        setScore(-1);
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = PLAYER_IMAGE;
	this.resetPosition();
};

Player.prototype.update = function() {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

Player.prototype.handleInput = function(theKey) {
    var origX = this.x;
    var origY = this.y;

    if (gameOver) {
        // Ignore all keys except "spacebar"
        if (theKey === 'space') {
            // Users wants to play another game. Reset.
			this.newGame();
        }
    } else {
        // Game is not over
        if (this.y >= 0) {
            //Player is not at the top.  See if any arrow keys pressed.
            switch (theKey) {
                case "left":
                    this.x = this.x - BLOCK_WIDTH;
                    break;
                case "right":
                    this.x = this.x + BLOCK_WIDTH;
                    break;
                case "up":
                    this.y = this.y - BLOCK_HEIGHT;
                    break;
                case "down":
                    this.y = this.y + BLOCK_HEIGHT;
                    break;
            }
        } else {
            //Player moved to the top.  Ignore all keys except "home"
            if (theKey === 'home') {
                // Player is at the top.  User ready to go again.  Move the player to the starting place
				this.resetPosition();
            }
        }
    }

    // See if player just now made it to the river (was not already there)
    if ((this.y < 0) && (!gameOver) && (origY != this.y)) {
		// Add a point
        setScore(1);
    }
    // Make sure not moved off canvas
    if ((this.x > (CANVAS_WIDTH - BLOCK_WIDTH)) || (this.x < (0 - BLOCK_WIDTH))) {
        this.x = origX;
    }
    if (this.y > (CANVAS_HEIGHT - (1.5 * BLOCK_HEIGHT))) {
        this.y = origY;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	// Initialize scoreboard
	setScore(0);
};

Player.prototype.resetPosition = function() {
	this.x = PLAYER_START_X;
	this.y = PLAYER_START_Y;	
}

// Game Reset
Player.prototype.newGame = function() {
	gameOver = false;
	this.resetPosition();
	theScore = 0;
	setScore(0);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < 5; i++) {
	allEnemies.push(new Enemy());
}
// Place the player object in a variable called player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        36: 'home',
        32: 'space'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});