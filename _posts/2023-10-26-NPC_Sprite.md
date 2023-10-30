%%html

<html>
    <div id="gameWrapper" class="gameWrapper">
        <div id="frameWrapper" class="frameWrapper">
            <div id="topMenu">
                <button class="topMenuBtn" id="mainMenuBtn">Main Menu</button>
                <button class="topMenuBtn" id="inventoryBtn">Inventory</button>
                <button class="topMenuBtn" id="mapBtn">Map</button>
            </div>
            <canvas id="gameContainer">
                <img id="loadingScreen" src="../../../images/loadingscreen.png"/>
                <img class="backgroundImage" id="housefloor2" width="768" height="700" src="../../../images/housefloor2.png" showBoxes="true"/>
                <img class="backgroundImage" id="housefloor1" width="768" height="700" src="../../../images/housefloor1.png" showBoxes="false"/>

                <img id="lopezSprite" src="../../../images/lopezspritesheet3.png">

                <div id="downStairsCarpet" is="collider-zone" width="60" height="105" x="560" y="230" newBackground="housefloor1" newX="700" newY="144" backgroundId="housefloor2"></div>
                <div id="upStairsCarpet" is="collider-zone" width="20" height="100" x="616" y="124" newBackground="housefloor2" newX="436" newY="216" backgroundId="housefloor1"></div>

                <div is="hit-box" height="170" width="800" x="0" y="0" backgroundId="housefloor2"></div> <!--top bar-->
                <div is="hit-box" height="800" width="20" x="0" y="0" backgroundId="housefloor2"></div> <!--left bar-->
                <div is="hit-box" height="20" width="800" x="0" y="680" backgroundId="housefloor2"></div> <!--bottom bar-->
                <div is="hit-box" height="800" width="20" x="780" y="0" backgroundId="housefloor2"></div> <!--right bar-->
                <div is="hit-box" height="70" width="400" x="0" y="170" backgroundId="housefloor2"></div> <!--tv and desk-->
                <div is="hit-box" height="50" width="80" x="0" y="240" backgroundId="housefloor2"></div> <!--desk chair-->
                <div is="hit-box" height="120" width="70" x="20" y="501" backgroundId="housefloor2"></div> <!--house plant bottom left-->
                <div is="hit-box" height="121" width="120" x="600" y="471" backgroundId="housefloor2"></div> <!--bed-->
                <div is="hit-box" height="85" width="130" x="640" y="200" backgroundId="housefloor2"></div> <!--stairs-->

                <div is="hit-box" height="130" width="800" x="0" y="0" backgroundId="housefloor1"></div> <!--top bar-->
                <div is="hit-box" height="800" width="20" x="0" y="0" backgroundId="housefloor1"></div> <!--left bar-->
                <div is="hit-box" height="20" width="800" x="0" y="680" backgroundId="housefloor1"></div> <!--bottom bar-->
                <div is="hit-box" height="800" width="20" x="780" y="0" backgroundId="housefloor1"></div> <!--right bar-->
                <div is="hit-box" height="100" width="135" x="500" y="130" backgroundId="housefloor1"></div> <!--stairs-->
                <div is="hit-box" height="180" width="140" x="360" y="130" backgroundId="housefloor1"></div> <!--tv-->
                <div is="hit-box" height="44" width="60" x="300" y="130" backgroundId="housefloor1"></div> <!--fridge-->
                <div is="hit-box" height="34" width="149" x="0" y="130" backgroundId="housefloor1"></div> <!--sink-->
                <div is="hit-box" height="40" width="205" x="20" y="265" backgroundId="housefloor1"></div> <!--kitchen island-->
                <div is="hit-box" height="100" width="133" x="160" y="457" backgroundId="housefloor1"></div> <!--dinning table-->
                <div is="hit-box" height="20" width="50" x="97" y="492" backgroundId="housefloor1"></div> <!--dinning table chair-->
                <div is="hit-box" height="10" width="129" x="440" y="491" backgroundId="housefloor1"></div> <!--small carpet charis-->
                <div is="hit-box" height="170" width="70" x="710" y="509" backgroundId="housefloor1"></div> <!--bottom right plant-->
                <div is="hit-box" height="170" width="69" x="21" y="509" backgroundId="housefloor1"></div> <!--bottom left plant-->
            </canvas>
        </div>
    </div>
</html>

<script src="../../../scripts/app.js" type="module"></script>

<style>
    .frameWrapper {
        margin: auto;
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

    #gameWrapper {
        display: flex; 
        justify-content: center;
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

    #mortContainer {
        position: absolute;
        left: 500px;
        top: 500px;
    }

    #lopezContainer {
        position: absolute;
    }
</style>

<body>
    <div>
        <canvas id="spriteContainer"> <!-- Within the base div is a canvas. An HTML canvas is used only for graphics. It allows the user to access some basic functions related to the image created on the canvas (including animation) -->
            <img id="jerrySprite" src="{{ site.baseurl }}/images/transparentmortspritesheet.png">  // change sprite here
        </canvas>
        <div id="controls"> <!--basic radio buttons which can be used to check whether each individual animaiton works -->
            <input type="radio" name="animation" id="idle" checked>
            <label for="idle">Idle</label><br>
        </div>
    </div>
</body>

<script>
    // start on page load
    window.addEventListener('load', function () {
        const canvas = document.getElementById('spriteContainer');
        const ctx = canvas.getContext('2d');
        const SPRITE_WIDTH = 18;  
        const SPRITE_HEIGHT = 25; 
        const FRAME_LIMIT = 4;  

        const SCALE_FACTOR = 3;  // control size of sprite on canvas
        canvas.width = SPRITE_WIDTH * SCALE_FACTOR;
        canvas.height = SPRITE_HEIGHT * SCALE_FACTOR;

        class Jerry {
            constructor() {
                this.image = document.getElementById("jerrySprite");
                this.x = 0;
                this.y = 0;
                this.minFrame = 0;
                this.maxFrame = FRAME_LIMIT;
                this.frameX = 0;
                this.frameY = 0;
            }

            // draw dog object
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

        // dog object
        const jerry = new Jerry();

        // update frameY of dog object, action from idle, bark, walk radio control
        const controls = document.getElementById('controls');
        controls.addEventListener('click', function (event) {
            if (event.target.tagName === 'INPUT') {
                const selectedAnimation = event.target.id;
                switch (selectedAnimation) {
                    case 'idle':
                        jerry.frameY = 0;
                        break;
                    case 'barking':
                        jerry.frameY = 1;
                        break;
                    case 'walking':
                        jerry.frameY = 2;
                        break;
                    default:
                        break;
                }
     jerry.draw(ctx);

            }
        });
    });
</script>