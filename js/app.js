// Customize your game here:
	//Set a images for the enemy and player
	var bugImage = 'images/enemy-bug.png';
	var playerImage = 'images/char-boy.png'; //Could not get any other characters to work! bad file?
	//Set the winning score
	var winningScore = 5;

// Other Global Variables
var canvasWidth = 505;
var canvasHeight = 606;
var blockHeight = 83;
var blockWidth = canvasWidth / 5;
var pStartX = 200; // starting location of the player
var pStartY = 405;
var theScore = 0;
var gameOver = false;

// Work the scoreboard
var SetScore = function(n) {
    var scoreTextX = 0;
    var scoreTextY = 603;
    var scoreBoxWidth = 500;
    var scoreBoxHeight = 20;
    var scoreBoxX = 60;
    var scoreBoxY = 606 - scoreBoxHeight;
    var sayText;

    theScore = theScore + n;

    // clear out the old score
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(scoreTextX, scoreBoxY, scoreBoxWidth, scoreBoxHeight);

    // see if the player has won or lost (if score gets to 10 or goes below 0)
    if (theScore >= winningScore) {
        gameOver = true;
        sayText = "Congratulations!  You won! (Press <space> to play again.)";
    } else if (theScore < 0) {
        gameOver = true;
        sayText = "You lost!   (Press <space> to play again.)";
    } else if (theScore === 0) {
        sayText = "Welcome to Bugmania! Use arrow keys to play. Score of " + winningScore + " wins!";
    }

    // Update the scoreboard
    if (gameOver || theScore === 0) {

        // write "win or lose"
        ctx.font = "12pt sans-serif";
        ctx.textAlign = "left";
        ctx.strokeStyle = "#808080";
        ctx.fillStyle = "#33CC33";
        ctx.strokeText(sayText, scoreTextX, scoreTextY);
        ctx.fillText(sayText, scoreTextX, scoreTextY);

    } else {

        // write "score"
        ctx.font = "14pt sans-serif";
        ctx.textAlign = "left";
        ctx.strokeStyle = "#808080";
        ctx.fillStyle = "#33CC33";
        ctx.strokeText("Score: ", scoreTextX, scoreTextY);
        ctx.fillText("Score: ", scoreTextX, scoreTextY);

        // write the new score
        ctx.font = "14pt sans-serif";
        ctx.textAlign = "left";
        ctx.strokeStyle = "#808080";
        ctx.fillStyle = "#000000";
        //ctx.strokeText(theScore, scoreBoxX,scoreTextY);
        //ctx.fillText(theScore, scoreBoxX,scoreTextY);
        ctx.strokeText(theScore + " (Press <home> after reaching top to continue.)", scoreBoxX, scoreTextY);
        ctx.fillText(theScore + " (Press <home> after reaching top to continue.)", scoreBoxX, scoreTextY);
    }
};

// Enemies our player must avoid
var randomStart = function(theObject) {
    var bugMinX = -400;
    var bugMaxX = -20; //-200 bugMaxX
    theObject.x = Math.random() * (bugMaxX - bugMinX) + bugMinX;
    var bugMinY = 60;
    //var bugMaxY = 226;  Instead of using a range, make the bugs follow the 3 paths
    theObject.y = bugMinY + blockHeight * (Math.round(Math.random() * 2));
};
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = bugImage;
    this.velocity = Math.random() * 200 + 75;
    randomStart(this);
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.velocity * dt);

    //if x > ?? then reset to random x and y starting position
    if (this.x > canvasWidth) {
        randomStart(this);
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
    var spriteWidth = 83;
    if ((((this.x + spriteWidth) > player.x) && (this.x < (player.x + spriteWidth))) &&
        ((this.y < player.y) && (this.y > (player.y - blockHeight)))) {
        // If touching move player back to start
        player.x = pStartX;
        player.y = pStartY;
		// remove a point
        SetScore(-1);
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
    this.sprite = playerImage;
    this.x = pStartX; //TODO
    this.y = pStartY;
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
			doReset();
        }
    } else {
        // Game is not over
        if (this.y >= 0) {
            //Player is not at the top.  See if any arrow keys pressed.
            switch (theKey) {
                case "left":
                    this.x = this.x - blockWidth;
                    break;
                case "right":
                    this.x = this.x + blockWidth;
                    break;
                case "up":
                    this.y = this.y - blockHeight;
                    break;
                case "down":
                    this.y = this.y + blockHeight;
                    break;
            }
        } else {
            //Player moved to the top.  Ignore all keys except "home"
            if (theKey === 'home') {
                // Player is at the top.  User ready to go again.  Move the player to the starting place
                player.x = pStartX;
                player.y = pStartY;
            }
        }
    }

    // See if player just now made it to the river (was not already there)
    if ((this.y < 0) && (!gameOver) && (origY != this.y)) {
		// Add a point
        SetScore(1);
    }
    // Make sure not moved off canvas
    if ((this.x > (canvasWidth - blockWidth)) || (this.x < (0 - blockWidth))) {
        this.x = origX;
    }
    if (this.y > (canvasHeight - (1.5 * blockHeight))) {
        this.y = origY;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	// Initiallize scoreboard
	SetScore(0);
};

// Game Reset
var doReset = function() {
	gameOver = false;
	player.x = pStartX;
	player.y = pStartY;
	theScore = 0;
	SetScore(0);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
var enemy5 = new Enemy();
var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];

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