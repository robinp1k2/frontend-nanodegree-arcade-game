frontend-nanodegree-arcade-game
===============================
- Created by:			Robin L. Paone
- Original source:  	Udacity Front-End Web Developer Nanodegree

How to Install
--------------
- Simply copy the project files onto your computer using the same directory structure.  Open "index.html" in your favorite browser to start the game.

How to Play
-----------
- The goal is to guide your player past enemies to reach a lake.  Use arrow keys to navigate your player.
- Your player starts on the grassy lawn.  The enemies are moving along a stone path which you must cross to reach the lake.  Keep your player away from the enemies.
- Each time you sucessfully cross the path and reach the lake you will get a point.  Press the "home" button to try again for more points.
- If an enemy "gets" you then you will lose a point and be moved back to the lawn.
- To win you need a total of 5 points.
- You lose if your score goes below zero.
- Press the spacebar to restart the game.

Description
-----------
- This is a simple JavaScript game created by drawing on the canvas.  The scene is a grassy section and water which is separated by a stone path.  The starting point for the character is in the grassy section.  Arrow keys are used to guide a character across the path to reach the water.  The users must navigate the character around enemies which randomly glide along the path.  Each time the player crosses the path without touching an enemy the score is increased by one point. If the player comes in contact with an enemy then a point is lost and the player location is reset to the starting point in the grass.  If the score goes below zero the game is lost.  If the score reaches the winning score the game is won.  After winning or losing the user may reset the game and play continuously.  Instructions to the user are displayed as the game is played.

Included Files
--------------
- README.md (this file) - software documentation
- index.html - website load page
- Folder "css":
	-- style.css - Style sheet
- Folder "images" contains all imagery used in the game:
	-- char-boy.png
	-- enemy-bug.png
	-- grass-block.png
	-- stone-block.png
	-- water-block.png
	-- (and optionally other image files you wish to add for enhancing game.)
- Folder "js":
	-- app.js - application code
	-- engine.js - game looping code
	-- resource.js - image loading utility

Customizing
-----------
- Modify the file "app.js" to make some easy customizations.  At the top of this file are  global variables for setting the player and enemy images. Also, the number of points required to win the game can be set.  

- For making even more customizations read through the code in "app.js".  The "engine.js" and other files are also a possibility for even more specialized changes.
