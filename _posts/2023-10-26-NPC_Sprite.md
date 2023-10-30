---
layout: post
title: NPC
description: NPC Sprite
courses: { versions: {week: 0} }
---

<head>
    <meta name="layout" content="post">
    <meta name="title" content="Version 1.0">
    <meta name="description" content="Initial Version">
    <meta name="type" content="game">
    <meta name="courses" content="{ versions: {week: 0} }">
</head>

<html>
    <div class="gameWrapper">
        <div class="frameWrapper">
            <div id="topMenu">
                <button class="topMenuBtn" id="mainMenuBtn">Main Menu</button>
                <button class="topMenuBtn" id="inventoryBtn">Inventory</button>
                <button class="topMenuBtn" id="mapBtn">Map</button>
            </div>
            <canvas id="npcContainer"> <!-- Within the base div is a canvas. An HTML canvas is used only for graphics. It allows the user to access some basic functions related to the image created on the canvas (including animation) -->
                <img id="npc" src="../../../images/NPC.png">  
            </canvas>
            </canvas>
            <img id="backgroundImage" width="854" height="850" src="../../../images/mortensenlabbackground.jpg"/>
        </div>
    </div>
</html>

<script>
    // start on page load
    window.addEventListener('load', function () {
        const canvas = document.getElementById('npcContainer');
        const ctx = canvas.getContext('2d');
        const SPRITE_WIDTH = 300;  // matches sprite pixel width
        const SPRITE_HEIGHT = 300; // matches sprite pixel height
        const FRAME_LIMIT = 4;  // matches number of frames per sprite row, this code assume each row is same

        const SCALE_FACTOR = 4;  // control size of sprite on canvas
        canvas.width = SPRITE_WIDTH * SCALE_FACTOR;
        canvas.height = SPRITE_HEIGHT * SCALE_FACTOR;

        class npc {
            constructor() {
                this.image = document.getElementById("npcSprite");
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

        const npc = new npc();

        // const controls = document.getElementById('controls');
        // controls.addEventListener('click', function (event) {
        //     if (event.target.tagName === 'INPUT') {
        //         const selectedAnimation = event.target.id;
        //         switch (selectedAnimation) {
        //             case 'walking down':
        //                 mort.frameY = 0;
        //                 break;
        //             case 'walking left':
        //                 mort.frameY = 1;
        //                 break;
        //             case 'walking right':
        //                 mort.frameY = 2;
        //                 break;
        //             case 'walking up':
        //                 mort.frameY = 3;
        //                 break;
        //             default:
        //                 break;
        //         }
        //     }
        // });

        // Animation recursive control function
        function animate() {
            // Clears the canvas to remove the previous frame.
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draws the current frame of the sprite.
            npc.draw(ctx);

            // Updates the `frameX` property to prepare for the next frame in the sprite sheet.
            npc.update();

            // Uses `requestAnimationFrame` to synchronize the animation loop with the display's refresh rate,
            // ensuring smooth visuals.
            setTimeout(() => {requestAnimationFrame(animate);}, 120);
        }

        // run 1st animate
        animate();
    });

    window.addEventListener('load', function () {
        const canvas = document.getElementById('lopezContainer');
        const ctx = canvas.getContext('2d');
        const SPRITE_WIDTH = 43.5;  // matches sprite pixel width
        const SPRITE_HEIGHT = 50.25; // matches sprite pixel height
        const FRAME_LIMIT = 4;  // matches number of frames per sprite row, this code assume each row is same
        let LOPEZ_SPEED = 10;
        const SCALE_FACTOR = 2;  // control size of sprite on canvas
        const START_LEFT = 600;
        const START_TOP = 600;
        let ANIMATION_SPEED = 100
        let isMoving = false;
        canvas.width = SPRITE_WIDTH * SCALE_FACTOR;
        canvas.height = SPRITE_HEIGHT * SCALE_FACTOR;

        class Lopez {
            constructor() {
                this.image = document.getElementById("LopezSprite");
                this.x = 0;
                this.y = 0;
                this.minFrame = 0;
                this.maxFrame = FRAME_LIMIT -1;
                this.frameX = 0;
                this.frameY = 0;
                this.left = START_LEFT;
                this.top = START_TOP;
                this.moveDown = false;
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

        const lopez = new Lopez();
    
        const validKeys = {
            "w": "up",
            "a": "left",
            "s": "down",
            "d": "right"

        }

        let currentKeys = []

        document.addEventListener("keydown", (event) => {
            const key = event.key
            if (!Object.keys(validKeys).includes(key)) return;

            if (!currentKeys.includes(key)) currentKeys.push(key)

            const direction = validKeys[key];

            if (!isMoving) {
                isMoving = true
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                animate()
                console.log('animate')
            }
            switch (direction) {
                    case 'down':
                        lopez.frameY = 0;
                        lopez.top += LOPEZ_SPEED
                        isMoving = true;
                        break;
                    case 'left':
                        lopez.frameY = 1;
                        lopez.left += -LOPEZ_SPEED;
                        isMoving = true;
                        break;
                    case 'right':
                        lopez.frameY = 2;
                        lopez.left += LOPEZ_SPEED;
                        isMoving = true;
                        break;
                    case 'up':
                        lopez.frameY = 3;
                        lopez.top += -LOPEZ_SPEED;
                        isMoving = true;
                        break;
                    default:
                        break;
                }
                
        })

        document.addEventListener("keyup", (event) => {
            const key = event.key

            if (!Object.keys(validKeys).includes(key)) return;
            isMoving = false
            currentKeys = currentKeys.filter((currKey) => {
                return currKey !== key
            })

            if (!currentKeys[0]) {
                keydown = false
                lopez.frameX = 2 //idle frame

                if (lopez.frameY == 2) {
                    lopez.frameX = 0 //idle frame for row 3
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height); //clear old frame
                lopez.draw(ctx); //draw idle frame
            }
        })
        // Animation recursive control function
        function animate() {
            if (!isMoving) return;
            isMoving = true;
            // Clears the canvas to remove the previous frame.
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draws the current frame of the sprite.
            lopez.draw(ctx);

            // Updates the `frameX` property to prepare for the next frame in the sprite sheet.
            lopez.update();
            document.getElementById("lopezContainer").style.left = lopez.left + "px"
            document.getElementById("lopezContainer").style.top = lopez.top + "px"

            // Uses `requestAnimationFrame` to synchronize the animation loop with the display's refresh rate,
            // ensuring smooth visuals.
            setTimeout(() => {requestAnimationFrame(animate);}, ANIMATION_SPEED);
        }

        // run 1st animate
        // animate();
        // Clears the canvas to remove the previous frame.
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draws the current frame of the sprite.
        lopez.draw(ctx);

        // Updates the `frameX` property to prepare for the next frame in the sprite sheet.
        lopez.update();
        document.getElementById("lopezContainer").style.left = lopez.left + "px"
        document.getElementById("lopezContainer").style.top = lopez.top + "px"
    });
</script>

<style>
    .frameWrapper {
        margin: auto;
        width: 854px;
        border: 2px solid #00ADB5;
        text-align: center;
        margin-top: 1%;
    }
    
    .topMenuBtn {
        border: 0px;
        background-color: #393E46;
        padding: 15px;
    }

    .topMenuBtn:hover {
        border: 0px;
        background-color: #393e469f;
        padding: 15px;
    }

    #topMenu {
        display: flex;
        gap: 10px;
        background-color: #393e465c;
        justify-content: space-evenly;
        align-content: center;
        flex-direction: row;
        align-items: stretch;
    }

    #gameFrame {
        background-color: #fff;
        border-top: 2px solid #00ADB5;
    }

    #npcContainer {
        position: absolute;
        left: 500px;
        top: 500px;
    }

    #lopezContainer {
        position: absolute;
    }
</style>