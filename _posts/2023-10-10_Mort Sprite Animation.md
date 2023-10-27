---
title: Mort Sprite Animation
description: Base animation for Mort sprite in Pokemort
layout: post
type: game
courses: {versions: {week: 0}}
---

<body>
    <div>
        <canvas id="spriteContainer"> <!-- Within the base div is a canvas. An HTML canvas is used only for graphics. It allows the user to access some basic functions related to the image created on the canvas (including animation) -->
            <img id="MortSprite" src="../../../images/transparentmortspritesheet.jpg">  // change sprite here
        </canvas>
        <div id="controls"> <!--basic radio buttons which can be used to check whether each individual animaiton works -->
            <input type="radio" name="animation" id="walking down" checked>
            <label for="walking down">Walking Down</label><br>
            <input type="radio" name="animation" id="walking left">
            <label for="walking left">Walking Left</label><br>
            <input type="radio" name="animation" id="walking right">
            <label for="walking right">Walking Right</label><br>
            <input type="radio" name="animation" id="walking up">
            <label for="walking up">Walking Up</label><br>
        </div>
    </div>
</body>

<script>
    // start on page load
    window.addEventListener('load', function () {
        const canvas = document.getElementById('spriteContainer');
        const ctx = canvas.getContext('2d');
        const SPRITE_WIDTH = 172;  // matches sprite pixel width
        const SPRITE_HEIGHT = 180; // matches sprite pixel height
        const FRAME_LIMIT = 4;  // matches number of frames per sprite row, this code assume each row is same

        const SCALE_FACTOR = 2;  // control size of sprite on canvas
        canvas.width = SPRITE_WIDTH * SCALE_FACTOR;
        canvas.height = SPRITE_HEIGHT * SCALE_FACTOR;

        class Mort {
            constructor() {
                this.image = document.getElementById("MortSprite");
                this.x = 0;
                this.y = 0;
                this.minFrame = 0;
                this.maxFrame = FRAME_LIMIT -1;
                this.frameX = 0;
                this.frameY = 0;
            }

            draw(context) {
                context.drawImage(
                    this.image,
                    this.frameX * SPRITE_WIDTH,
                    this.frameY * SPRITE_HEIGHT,
                    SPRITE_WIDTH,
                    SPRITE_HEIGHT,
                    this.x,
                    this.y,
                    canvas.width,
                    canvas.height
                );
            }

            // update frameX of object
            update() {
                if (this.frameX < this.maxFrame) {
                    this.frameX++;
                } else {
                    this.frameX = 0;
                }
            }
        }

        const mort = new Mort();

        const controls = document.getElementById('controls');
        controls.addEventListener('click', function (event) {
            if (event.target.tagName === 'INPUT') {
                const selectedAnimation = event.target.id;
                switch (selectedAnimation) {
                    case 'walking down':
                        mort.frameY = 0;
                        break;
                    case 'walking left':
                        mort.frameY = 1;
                        break;
                    case 'walking right':
                        mort.frameY = 2;
                        break;
                    case 'walking up':
                        mort.frameY = 3;
                        break;
                    default:
                        break;
                }
            }
        });

        // Animation recursive control function
        function animate() {
            // Clears the canvas to remove the previous frame.
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draws the current frame of the sprite.
            mort.draw(ctx);

            // Updates the `frameX` property to prepare for the next frame in the sprite sheet.
            mort.update();

            // Uses `requestAnimationFrame` to synchronize the animation loop with the display's refresh rate,
            // ensuring smooth visuals.
            setTimeout(() => {requestAnimationFrame(animate);}, 120);
        }

        // run 1st animate
        animate();
    });

const npc = document.getElementById("npc");
const dialogueBox = document.getElementById("dialogue-box");
const dialogueText = document.getElementById("dialogue");
const nextButton = document.getElementById("next-button");

const dialogues = [
    "NPC: Hello there!",
    "NPC: How can I help you?",
    "NPC: Nice weather, isn't it?",
    // Add more dialogues as needed
];

let currentDialogueIndex = 0;

npc.addEventListener("click", () => {
    if (currentDialogueIndex < dialogues.length) {
        dialogueText.textContent = dialogues[currentDialogueIndex];
        dialogueBox.style.display = "block";
        nextButton.style.display = "block";
        currentDialogueIndex++;
    }
});

nextButton.addEventListener("click", () => {
    if (currentDialogueIndex < dialogues.length) {
        dialogueText.textContent = dialogues[currentDialogueIndex];
        currentDialogueIndex++;
    } else {
        dialogueBox.style.display = "none";
        nextButton.style.display = "none";
    }
});


<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
    <div id="npc">
        <img src="npc.png" alt="NPC">
        <div id="dialogue-box">
            <p id="dialogue">NPC: Hello there!</p>
        </div>
    </div>
    <button id="next-button">Next</button>
    <script src="script.js"></script>
</body>
</html>

</script>

# Notes
- Need to adjust dimensions once we can run make on this sprite
- need to change from buttons to keybinds when added to the game