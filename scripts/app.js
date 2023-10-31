window.addEventListener('load', function () {
    const gameFrame = document.getElementById('gameContainer');
    const ctx = gameFrame.getContext('2d');


    const firstBackgroundImage = document.getElementById("housefloor2")
    const BACKGROUND_HEIGHT = 700
    const BACKGROUND_WIDTH = 800

    let LOPEZ_SPEED = 4;
    let ANIMATION_SPEED = 100
    const FRAME_LIMIT = 4;  // matches number of frames per sprite row, this code assume each row is same
    const SPRITE_WIDTH = 46;  // matches sprite pixel width
    const SPRITE_HEIGHT = 52.5; // matches sprite pixel height
    const SCALE_FACTOR = 1.7;  // control size of sprite on canvas

    const START_X = 200
    const START_Y = 300

    let isMoving = false;

    gameFrame.width = BACKGROUND_WIDTH
    gameFrame.height = BACKGROUND_HEIGHT

    class Lopez {
        constructor() {
            this.image = document.getElementById("lopezSprite");
            this.x = START_X;
            this.y = START_Y;
            this.width = SPRITE_WIDTH*SCALE_FACTOR
            this.height = SPRITE_HEIGHT*SCALE_FACTOR
            this.minFrame = 0;
            this.maxFrame = FRAME_LIMIT -1;
            this.frameX = 0;
            this.frameY = 0;
            this.currentDirection = 'down'; 
        }

        resize() {
            this.width = SPRITE_WIDTH*backgroundImage.playerScaleFactor
            this.height = SPRITE_HEIGHT*backgroundImage.playerScaleFactor
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
                this.width,
                this.height
            );
        }
        // update frameX of object
        updateFrame() {
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
        }
    }

    class BackgroundImage {
        constructor () {
            this.image = firstBackgroundImage;
            this.height = Number(this.image.getAttribute("height"));
            this.width = Number(this.image.getAttribute("width"))
            this.playerScaleFactor = SCALE_FACTOR
        }
        draw(context) {
            context.drawImage(
                this.image,
                0,
                0,
                gameFrame.width,
                gameFrame.height,
            );
        }
    }

    class HitBox extends HTMLDivElement {
    static observedAttributes = ["width", "height", "x", "y"]
    constructor() {
        super()
        if (!this.getAttribute("width") || !this.getAttribute("height") || !this.getAttribute("x") || !this.getAttribute("y") || !this.getAttribute("backgroundId")) {
            throw new Error("Needs required attributes (height, width, x, y, and background)")
        }
        this.height = Number(this.getAttribute("height"))
        this.width = Number(this.getAttribute("width"))
        this.x = Number(this.getAttribute("x"))
        this.y =  Number(this.getAttribute("y"))
        this.style.backgroundColor = 'red'
        this.active = false
        this.background = document.getElementById(this.getAttribute("backgroundId"))
    }
    getNonCollidingDirections(player) {

        const canMoveUp = () => {
            const futureY = player.y - LOPEZ_SPEED
            if (
            player.x + (player.width) >= this.x && //left 
            player.x <= this.x + this.width && //right
            futureY + (player.height) >= this.y && //top
            futureY <= this.y + this.height //bottom
            )
            {
                if (Math.abs(player.y - (this.y+this.height)) <= LOPEZ_SPEED) {
                    player.y -= Math.abs(player.y - (this.y+this.height))-1
                }
                return false
            }
            return true
        }
        const canMoveDown = () => {
            const futureY = player.y + LOPEZ_SPEED
            if (
            player.x + (player.width) >= this.x && //left 
            player.x <= this.x + this.width && //right
            futureY + (player.height) >= this.y && //top
            futureY <= this.y + this.height //bottom
            )
            {
                if (Math.abs((player.y+player.height) - this.y) <= LOPEZ_SPEED) {
                    player.y += Math.abs((player.y+player.height) - this.y)-1
                }
                return false
            }
            return true
        }
        const canMoveLeft = () => {
            const futureX = player.x - LOPEZ_SPEED
            if (
            futureX + (player.width) >= this.x && //left 
            futureX <= this.x + this.width && //right
            player.y + (player.height) >= this.y && //top
            player.y <= this.y + this.height //bottom
            )
            {
                if (Math.abs(player.x - (this.x+this.width)) <= LOPEZ_SPEED) {
                    player.x -= Math.abs(player.x - (this.x+this.width))-1
                }
                return false
            }
            return true
        }
        const canMoveRight = () => {
            const futureX = player.x + LOPEZ_SPEED
            if (
            futureX + (player.width) >= this.x && //left 
            futureX <= this.x + this.width && //right
            player.y + (player.height) >= this.y && //top
            player.y <= this.y + this.height //bottom
            )
            {
                if (Math.abs((player.x+player.width) - this.x) <= LOPEZ_SPEED) {
                    player.x += Math.abs((player.x+player.width) - this.x) -1
                }
                return false
            }
            return true
        }

        const moveableDirections = {
            'left': canMoveLeft(),
            'right': canMoveRight(),
            'up': canMoveUp(),
            'down': canMoveDown()
        }

        return moveableDirections
    }
    draw (context) {
            context.fillStyle = 'red'
            context.fillRect(
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
}

class ColliderZone extends HTMLDivElement {
    static observedAttributes = ["width", "height", "x", "y"]
    constructor() {
        super()
        if (!this.getAttribute("width") || !this.getAttribute("height") || !this.getAttribute("x") || !this.getAttribute("y") || !this.getAttribute("newBackground") || !this.getAttribute("newX") || !this.getAttribute("newY")) {
            throw new Error("Needs required attributes (height, width, x, y, newX, and newY)")
        }
        this.height = Number(this.getAttribute("height"))
        this.width = Number(this.getAttribute("width"))
        this.x = Number(this.getAttribute("x"))
        this.y =  Number(this.getAttribute("y"))
        this.newBackground = this.getAttribute("newBackground")
        this.style.backgroundColor = 'red'
        this.newX = this.getAttribute("newX")
        this.newY = this.getAttribute("newY")
        this.isActive = false;
    }
    
    isColliding(player) {
        if (
            player.x + (player.width) >= this.x && //left 
            player.x <= this.x + this.width && //right
            player.y + (player.height) >= this.y && //top
            player.y <= this.y + this.height //bottom
        ) {
            return true
        }
        return false
    }
    draw (context) {
            context.fillStyle = 'blue'
            context.fillRect(
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
}

customElements.define("collider-zone", ColliderZone, {extends: "div"})
customElements.define("hit-box", HitBox, { extends: "div" });

    const backgroundImage = new BackgroundImage()
    const lopez = new Lopez();

    const validKeys = {
        "w": "up",
        "a": "left",
        "s": "down",
        "d": "right"

    }

    let currentKeys = []


    lopez.draw(ctx)
    
    document.addEventListener("keydown", (event) => {
        const key = event.key;
        const validKey = validKeys[key]

        if (validKey === undefined) {
            return;
        };

        if (!currentKeys.includes(validKey)) {
            currentKeys.push(validKey) //add to currentKeys
        } 

        isMoving = true;
    })

    document.addEventListener("keyup", (event) => {
        const key = event.key;
        const validKey = validKeys[key]

        if (key == "e") {
            console.log(`(${lopez.x},${lopez.y})`);
            debugger;
        };

        if (validKey === undefined) {
            return;
        };

        currentKeys = currentKeys.filter((currKey) => {
                return currKey !== validKey;  //remove from currentKeys 
        }) 

        isMoving = !!currentKeys.length
    })

    let isLoading = false

    function getAllCollisionsmovableDirections () {
        let hitBoxes = document.querySelectorAll("div[is='hit-box']")
        let colliderZones = document.querySelectorAll("div[is='collider-zone']")


        colliderZones.forEach((zone) => {
            if (zone.isActive && zone.isColliding(lopez)) {
                lopez.x = Number(zone.newX)
                lopez.y = Number(zone.newY)
                isLoading = true
                backgroundImage.playerScaleFactor = document.getElementById(zone.newBackground).getAttribute("newScaleFactor") ? Number(document.getElementById(zone.newBackground).getAttribute("newScaleFactor")) : SCALE_FACTOR
                lopez.resize()
                LOPEZ_SPEED = speedValues[backgroundImage.playerScaleFactor]
                isMoving = false
                backgroundImage.image = document.getElementById("loadingScreen")
                setTimeout(() => {
                    backgroundImage.image = document.getElementById(zone.newBackground)
                    isLoading = false
                    hitBoxes.forEach((hitbox) => {
                        if (hitbox.background == backgroundImage.image) {
                            hitbox.active = true
                        }
                        else {
                            hitbox.active = false
                        }
                    })
                }, 1000)
                zone.isActive = false
            }
            zone.isActive = zone.getAttribute("backgroundId") == backgroundImage.image.getAttribute("id")
        })

        const allPossibleDirections = {
                'left': true,
                'right': true,
                'up': true,
                'down': true,
                
        }

        hitBoxes.forEach((hitbox) => {
            const hitboxDirections = hitbox.getNonCollidingDirections(lopez);

            if (!hitbox.active) {
                return;
            }

            if (hitboxDirections.left == false) {
                allPossibleDirections.left = false
            }
            if (hitboxDirections.right == false) {
                allPossibleDirections.right = false
            }
            if (hitboxDirections.up == false) {
                allPossibleDirections.up = false
            }
            if (hitboxDirections.down == false) {
                allPossibleDirections.down = false
            }
        })
        return allPossibleDirections;
    }

    function moveLopez () {
        const movableDirections = getAllCollisionsmovableDirections()

        if (currentKeys.includes("up") && isMoving && lopez.y > 0 && movableDirections.up && !isLoading) {
            lopez.y -= LOPEZ_SPEED
        }
        if (currentKeys.includes("down") && isMoving && lopez.y < gameFrame.height-(backgroundImage.playerScaleFactor*SPRITE_HEIGHT) && movableDirections.down && !isLoading) {
            lopez.y += LOPEZ_SPEED
        }
        if (currentKeys.includes("left") && isMoving && lopez.x > 0 && movableDirections.left && !isLoading) {
            lopez.x -= LOPEZ_SPEED
        }
        if (currentKeys.includes("right") && isMoving && lopez.x < gameFrame.width-(backgroundImage.playerScaleFactor*SPRITE_WIDTH) && movableDirections.right && !isLoading) {
            lopez.x += LOPEZ_SPEED
        }

        if (isMoving) {
            lopez.currentDirection = currentKeys[currentKeys.length-1];
        }

        ctx.clearRect(0, 0, gameFrame.width, gameFrame.height);

        // Draws Background
        backgroundImage.draw(ctx)
        // Draws the current frame of the sprite.
        if (!isLoading) {
            lopez.draw(ctx);
        }
        
        for (let i = 0; i < document.getElementsByClassName("backgroundImage").length; i++) {
            const backgroundImage = document.getElementsByClassName("backgroundImage")[i]
            if (backgroundImage.getAttribute("showBoxes") === "true") {
                document.querySelectorAll("div[is='hit-box']").forEach((hitbox) => {
                    if (hitbox.getAttribute("backgroundId") == backgroundImage.getAttribute("id")) {
                        hitbox.draw(ctx)
                    }
                })
                document.querySelectorAll("div[is='collider-zone']").forEach((zone) => {
                    if (zone.getAttribute("backgroundId") == backgroundImage.getAttribute("id")) {
                        zone.draw(ctx)
                    }
                })
            }
        }

        setTimeout(() => {requestAnimationFrame(moveLopez);}, LOPEZ_SPEED)
    }

    function animate() {
        switch (lopez.currentDirection) {
            case "up": 
                lopez.frameY = 3;
                break;
            case "left":
                lopez.frameY = 1;
                break;
            case "right":
                lopez.frameY = 2;
                break;
            case "down":
                lopez.frameY = 0;
                break;
            default: 
                break;
        }

        if (isMoving) {
            lopez.updateFrame();
        }

        if (!isMoving) {
            lopez.frameX = 0;
        }

        if (isLoading) {
            lopez.frameX = 0;
        }

        setTimeout(() => {requestAnimationFrame(animate);}, ANIMATION_SPEED);
    }

    document.querySelectorAll("div[is='hit-box']").forEach((hitbox) => {
        if (hitbox.background == backgroundImage.image) {
            hitbox.active = true;
        }
    })
    const speedValues = {
        1.7: 4,
        0.6: 2,
        0.9: 2
    }

    animate()
    moveLopez()
});