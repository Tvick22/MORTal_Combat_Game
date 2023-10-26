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

    const START_X = 0
    const START_Y = 0

    let isMoving = false;

    gameFrame.width = BACKGROUND_WIDTH
    gameFrame.height = BACKGROUND_HEIGHT

    class Lopez {
        constructor() {
            this.image = document.getElementById("lopezSprite");
            this.x = START_X;
            this.y = START_Y;
            this.minFrame = 0;
            this.maxFrame = FRAME_LIMIT -1;
            this.frameX = 0;
            this.frameY = 0;
            this.currentDirection = 'down'; 
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
                SPRITE_WIDTH*SCALE_FACTOR,
                SPRITE_HEIGHT*SCALE_FACTOR
            );
        }
        getOutlineAxis() {
            const x = Number(this.x);
            const y = Number(this.y);

            function makeCoordPair(x, y) {
                return {'x': x, 'y': y}
            }

            const xVals = [...Array(Math.floor(SPRITE_WIDTH*SCALE_FACTOR)+1).keys()].map((number) => {
                return x+number
            })
            const yVals = [...Array(Math.floor(SPRITE_HEIGHT*SCALE_FACTOR)+1).keys()].map((number) => {
                return y+number
            })
            
            return {'x': xVals, 'y': yVals};
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
            this.height = BACKGROUND_HEIGHT;
            this.width = BACKGROUND_WIDTH;
        }
        draw(context) {
            context.drawImage(
                this.image,
                0,
                0,
                BACKGROUND_WIDTH,
                BACKGROUND_HEIGHT
            );
        }
    }

    class HitBox extends HTMLDivElement {
    static observedAttributes = ["width", "height", "x", "y"]
    constructor() {
        super()
        if (!this.getAttribute("width") || !this.getAttribute("height") || !this.getAttribute("x") || !this.getAttribute("y")) {
            throw new Error("Needs required attributes (height, width, x, and y)")
        }
        this.height = this.getAttribute("height")
        this.width = this.getAttribute("width")
        this.x = this.getAttribute("x")
        this.y =  this.getAttribute("y")
        this.style.backgroundColor = 'red'
        this.xVals = this.getOutlineAxis().x
        this.yVals = this.getOutlineAxis().y
    }
    getOutlineAxis() {
        const x = Number(this.x);
            const y = Number(this.y);

            function makeCoordPair(x, y) {
                return {'x': x, 'y': y}
            }

            const xVals = [...Array(Math.floor(this.width)+1).keys()].map((number) => {
                return x+number 
            })
            const yVals = [...Array(Math.floor(this.height)+1).keys()].map((number) => {
                return y+number
            })

            return {'x': xVals, 'y': yVals};
    }
    getNonCollidingDirections(coordValues) {
        const playerXVals = coordValues.x
        const playerYVals = coordValues.y

        const moveableDirections = {
                'left': true,
                'right': true,
                'up': true,
                'down': true
            }

        const possibleXVals = playerXVals.filter((xVal) => {
            if (this.xVals.includes(xVal)) {
                return true;
            }
            return false;
        })

        if (!possibleXVals.length) {
            return moveableDirections;
        }

        const possibleYVals = playerYVals.filter((yVal) => {
            if (this.yVals.includes(yVal)) {
                return true;
            }
            return false;
        })


        if (possibleYVals.length && possibleXVals.length) {
            if (possibleYVals[0] === Number(this.yVals[0]) && possibleYVals.length <= 3) {
                moveableDirections.down = false;
            }
            if (possibleYVals[possibleYVals.length-1] === Number(this.yVals[this.yVals.length-1]) && possibleYVals.length <= 3) {
                moveableDirections.up = false
            }
            if (possibleXVals[0] === Number(this.xVals[0]) && possibleXVals.length <= 3) {
                moveableDirections.right = false;
            }
            if (possibleXVals[possibleXVals.length-1] === Number(this.xVals[this.xVals.length-1]) && possibleXVals.length <= 3) {
                moveableDirections.left = false
            }
            return moveableDirections;
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
        if (!this.getAttribute("width") || !this.getAttribute("height") || !this.getAttribute("x") || !this.getAttribute("y") || !this.getAttribute("newBackground")) {
            throw new Error("Needs required attributes (height, width, x, and y)")
        }
        this.height = this.getAttribute("height")
        this.width = this.getAttribute("width")
        this.x = this.getAttribute("x")
        this.y =  this.getAttribute("y")
        this.newBackground = this.getAttribute("newBackground")
        this.style.backgroundColor = 'red'
        this.xVals = this.getOutlineAxis().x
        this.yVals = this.getOutlineAxis().y
    }
    getOutlineAxis() {
        const x = Number(this.x);
            const y = Number(this.y);

            function makeCoordPair(x, y) {
                return {'x': x, 'y': y}
            }

            const xVals = [...Array(Math.floor(this.width)+1).keys()].map((number) => {
                return x+number 
            })
            const yVals = [...Array(Math.floor(this.height)+1).keys()].map((number) => {
                return y+number
            })

            return {'x': xVals, 'y': yVals};
    }
    isColliding(coordValues) {
        const playerXVals = coordValues.x
        const playerYVals = coordValues.y


        const possibleXVals = playerXVals.filter((xVal) => {
            if (this.xVals.includes(xVal)) {
                return true;
            }
            return false;
        })

        if (!possibleXVals.length) {
            return false;
        }

        const possibleYVals = playerYVals.filter((yVal) => {
            if (this.yVals.includes(yVal)) {
                return true;
            }
            return false;
        })


        if (possibleYVals.length && possibleXVals.length) {
            return true;
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

    function getAllCollisionsmovableDirections () {
        let hitBoxes = document.querySelectorAll("div[is='hit-box']")
        let colliderZones = document.querySelectorAll("div[is='collider-zone']")

        colliderZones.forEach((zone) => {
            if (zone.isColliding(lopez.getOutlineAxis())) {
                console.log('hello')
                backgroundImage.image = document.getElementById(zone.newBackground)

            }
        })

        let allPossibleDirections = {
                'left': true,
                'right': true,
                'up': true,
                'down': true
        }

        hitBoxes.forEach((hitbox) => {
            const hitboxDirections = hitbox.getNonCollidingDirections(lopez.getOutlineAxis());

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

        if (currentKeys.includes("up") && isMoving && lopez.y > 0 && movableDirections.up) {
            lopez.y -= LOPEZ_SPEED
        }
        if (currentKeys.includes("down") && isMoving && lopez.y < gameFrame.height-(SCALE_FACTOR*SPRITE_HEIGHT) && movableDirections.down) {
            lopez.y += LOPEZ_SPEED
        }
        if (currentKeys.includes("left") && isMoving && lopez.x > 0 && movableDirections.left) {
            lopez.x -= LOPEZ_SPEED
        }
        if (currentKeys.includes("right") && isMoving && lopez.x < gameFrame.width-(SCALE_FACTOR*SPRITE_WIDTH) && movableDirections.right) {
            lopez.x += LOPEZ_SPEED
        }

        if (isMoving) {
            lopez.currentDirection = currentKeys[currentKeys.length-1];
        }

        ctx.clearRect(0, 0, gameFrame.width, gameFrame.height);

        // Draws Background
        backgroundImage.draw(ctx)
        // Draws the current frame of the sprite.
        lopez.draw(ctx);

        document.querySelectorAll("div[is='hit-box']").forEach((hitbox) => {
            hitbox.draw(ctx)
        })

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

        setTimeout(() => {requestAnimationFrame(animate);}, ANIMATION_SPEED);
    }

    animate()
    moveLopez(getAllCollisionsmovableDirections(), currentKeys, lopez, isMoving, ctx, gameFrame, backgroundImage, LOPEZ_SPEED)
});