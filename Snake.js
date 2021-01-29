const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");
const reset = document.querySelector(".reset");
//create unit
const box = 32;

//images
const ground = new Image();
ground.src = "img/Background.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

//snake
let snake = [];
snake[0] = {
    x : 9*box,
    y: 10*box
}

//food
let food = {
    x : Math.floor(Math.random() *17 +1) *box,
    y : Math.floor(Math.random() *15 +3) *box,
}


let score = 0;
let hi = 0;
let d;

document.addEventListener("keydown", direction);
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function direction(event){
    if(event.keyCode == 37 && d != "RIGHT"){
        d="LEFT";
    }else if(event.keyCode == 38 && d != "DOWN"){
        d="UP";
    }else if(event.keyCode == 39 && d != "LEFT"){
        d="RIGHT";
    }else if(event.keyCode == 40 && d != "UP"){
        d="DOWN";
    }
}

//check collision

function handleCollision(head){
    
    for(let i = 0; i < snake.length; i++){
        if(head.x == snake[i].x && head.y == snake[i].y){
            
            return true;
        }
    }
    return false;
}

//draw everything to canvas
function draw(){
    ctx.drawImage(ground,0,0);  //to draw the background image

    //to draw the snake
    for(let i=0; i<snake.length; i++){
        ctx.fillStyle = (i == 0)? "black" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    //draw the food img
    ctx.drawImage(foodImg, food.x, food.y);

    //old snake position
    let snakeX= snake[0].x;
    let snakeY= snake[0].y;

    //which direction
    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    
    //if the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;

        food = {
            x : Math.floor(Math.random() *17 +1) *box,
            y : Math.floor(Math.random() *15 +3) *box,
        }

        //to check if food does not spawn on the snake
        let snakeOnFood = false;
        let snakeNotOnFood = false;

        while(!snakeNotOnFood){
            for(let i = 0; i < snake.length; i++){
                if(food.x == snake[i].x && food.y == snake[i].y){
                    snakeOnFood = true;
                    break;
                }
            }

            if(snakeOnFood){
                snakeOnFood = false;
                snakeNotOnFood = false;
                food = {
                    x : Math.floor(Math.random() *17 +1) *box,
                    y : Math.floor(Math.random() *15 +3) *box,
                }
            }
            else{
                snakeNotOnFood = true;
            }
            
        }
        //dont remove the tail
    }else{
        //remove tail
        snake.pop();
    }

    //new head position
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    
    //game over rules

    if(snakeX < box || snakeX > 17*box || snakeY < 3*box || snakeY > 17*box || handleCollision(newHead)){
        //clear the interval set by setInterval()
        clearInterval(game);
    }


    //here unshift() is used to actually draw the new head
    snake.unshift(newHead);    //unshift is like enqueue i.e. adds element at the front of an array

    if(score > hi){
        hi = score;
    }

    ctx.fillStyle = "white";
    ctx.font ="35px ChangaOne";
    ctx.fillText("Score : "+score, 1.3*box, 1.3*box);
    ctx.fillText("Hi : "+hi, 14.5*box, 1.3*box);
}

//handle the reset button
function handleReset(){
    clearInterval(game);
    score = 0;
    snake = [];
    snake[0] = {
        x : 9*box,
        y: 10*box
    }
    food = {
        x : Math.floor(Math.random() *17 +1) *box,
        y : Math.floor(Math.random() *15 +3) *box,
    }
    d = undefined;
    game = setInterval(draw, 140);
}


//call draw function every 1000 milli sec.
let game = setInterval(draw, 140);