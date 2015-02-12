// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // height and width of sprite to be used in collision detection
    this.height = 82;
    this.width = 101;

    // Set a random initial start position for Enemy. Includes
    // a randome y position (row), a random x position not currently visible
    // on the board and the enemy's speed.
    this.x = this.y = this.speed = 0;
    this.setStartPosition();

    // Save previous location to use in Player collision detection
    this.previousX = this.x;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // If Enemy and Player collide, reset Player to its starting position
    if (this.collision()) {
        player.reset();
    }

    // Calculate Enemy's new x postion as it moves along its
    // row.  Store the previous x value for Player collision detection.
    var newX = Math.round(this.x + (dt * this.speed));
    this.previousX = this.x;

    // Check new Enemy postion to see if it has moved off board
    if (newX > 505) {
        // Enemy has moved off board, move it to a new starting position
        this.setStartPosition();
    } else {
        // Enemy still on board, update new position on current row
        this.x = newX;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage( Resources.get(this.sprite), this.x, this.y);
}

// Set a random start position on 1 of 3 possible rows (y).
// The start position will be on the left side of the board
// at a point not on the board.
Enemy.prototype.setStartPosition = function() {
    // Set a random start x position off the left side of the board
    this.x = this.getRandomInt(-505, -101);

    // Determine a random start row
    var rows = [69, 152, 235];
    var row = this.getRandomInt(0, 2);
    this.y = rows[row];

    // Set a random speed
    this.speed = this.getRandomInt(100, 500);
}

// Using the bounding box method described in the HTML5 games class.
// Need the top (y), left (x) corner from the Enemy's previous
// location and the bottom (y), right (x) corner from the Enemy's
// current position.
// For the Player we only need the top (y), left(x) and bottom(y),
// right (x) from its current position.
// Returns true if there is a collision otherwise false.
Enemy.prototype.collision = function() {
    // Only check for collision if Player and Enemy on same row
    if (this.y == player.y) {

        // Create Enemy bounding box object
        // This object will be passed to the intersect function
        // which determines if the boxes overlap (collide)
        var enemyBox = {
            top: this.y,
            left: this.previousX,
            bottom: this.y + this.width,
            right: this.x + this.height
        };

        // Create Player bounding box object
        // This object will be passed to the intersect function
        // Adding 20 to player's x position to allow the Enemy to
        // get closer to Player for a more realistic collision.
        var playerBox = {
            top: player.y,
            left: player.x + 20,
            bottom: player.y + player.height,
            right: player.x + player.width
        };

        // Do the bounding boxes overlap?
        if (this.intersect(enemyBox, playerBox)) {
            return true;
        }
    }
    return false;
}

// Returns true if the Enemy and Player overlap at any point
Enemy.prototype.intersect = function(enemy, player) {
    return !(player.left > enemy.right || player.right < enemy.left ||
             player.top > enemy.bottom || player.bottom < enemy.top);
}

// The random number generator function I got from stackoverflow.com
// http://stackoverflow.com/questions/1527803/
//        generating-random-numbers-in-javascript-in-a-specific-range
// Returns a random integer between min and max and can include min or max
Enemy.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Load player image and set starting position of character.
    // Each visible portion of a tile is 101 pixels wide and 83
    // pixels tall, so x = 202 and y = 401 starts the player in the
    // bottom row on the center tile.
    this.sprite = 'images/char-boy.png';

    // height and width of sprite to be used in collision detection
    this.height = 82;
    this.width = 101;

    // reset() moves the Player to the starting position
    this.x = this.y = 0;
    this.reset();
}

// Not used
Player.prototype.update = function() {
}

// Draw the Player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Determine if an arrow key was pressed and which one.  Move the
// Player in that direction as long as it is within the bounds of
// the board. If the Player moves into water (top row), reset Player
// back to original start position.
Player.prototype.handleInput = function(allowedKeys) {
    // x and y are local variables used to store the requested next
    // position of the Player when an arrow key is pressed.
    // these will be used to keep the Player from moving off the board.
    var x = y = 0;

    // left arrow
    if (allowedKeys === 'left') {
        x = this.x - 101;
        // Do not allow Player to move off left side of board
        if (x >= 0) {
            this.x = x;
        }
    }

    // right arrow
    if (allowedKeys === 'right') {
        x = this.x + 101;
        // Do not allow Player to move off right side of board
        if (x <= 404) {
            this.x = x;
        }
    }

    // up arrow
    if (allowedKeys === 'up') {
        y = this.y - 83;
        // Do not allow Player to move off top of board
        if (y >= -14) {
            this.y = y;
        }
        if (y == -14) {
            // Player moved into water row, move back to starting position
            this.reset();
        }
    }

    // down arrow
    if (allowedKeys === 'down') {
        y = this.y + 83;
        // Do not allow Player to move off bottom of board
        if (y <= 401) {
            this.y = y;
        }
    }
}

// Move player back to original starting position
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 401;
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Set the number of enemies to display on the board
var numEnemies = 5;
var allEnemies = [];

// Create Enemies
for(var i = 0; i < numEnemies; i++) {
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

// Create Player
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
