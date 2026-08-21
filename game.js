const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


const size = 18;


let snake = [];
let food = {};

let direction = "right";

let score = 0;
let record = localStorage.getItem("record") || 0;

let speed = 120;

let gameLoop;

let paused = false;



document.getElementById("record").innerHTML =
"Récord: " + record;



function startGame(){


document.getElementById("menu").classList.add("hidden");

document.getElementById("gameOver").classList.add("hidden");

document.getElementById("gameUI").classList.remove("hidden");



snake=[

{x:180,y:180},

{x:162,y:180},

{x:144,y:180}

];


direction="right";

score=0;

speed=120;

paused=false;


document.getElementById("score").innerHTML=
"Puntos: 0";


food=createFood();



clearInterval(gameLoop);


gameLoop=setInterval(update,speed);


}



function createFood(){

return{

x:Math.floor(Math.random()*18+1)*size,

y:Math.floor(Math.random()*18+1)*size

};

}





function changeDir(newDir){


if(newDir==="left" && direction!=="right")
direction="left";


if(newDir==="right" && direction!=="left")
direction="right";


if(newDir==="up" && direction!=="down")
direction="up";


if(newDir==="down" && direction!=="up")
direction="down";


}




function pauseGame(){

paused=!paused;

}




function update(){


if(paused)
return;



let head={...snake[0]};



if(direction==="right")
head.x+=size;


if(direction==="left")
head.x-=size;


if(direction==="up")
head.y-=size;


if(direction==="down")
head.y+=size;



// choque paredes

if(

head.x<0 ||

head.y<0 ||

head.x>=360 ||

head.y>=360

){

endGame();

return;

}




// choque cuerpo

for(let part of snake){

if(head.x===part.x && head.y===part.y){

endGame();

return;

}

}



snake.unshift(head);



if(

head.x===food.x &&

head.y===food.y

){


score++;


document.getElementById("score").innerHTML=
"Puntos: "+score;



// subir nivel

if(score%5===0 && speed>50){

speed-=10;

clearInterval(gameLoop);

gameLoop=setInterval(update,speed);

}



food=createFood();



}else{


snake.pop();


}



draw();


}





function draw(){


ctx.clearRect(0,0,360,360);



// fondo

ctx.fillStyle="#071015";

ctx.fillRect(0,0,360,360);




// dibujar gusano

snake.forEach((part,index)=>{


ctx.beginPath();


ctx.arc(

part.x,

part.y,

size/2,

0,

Math.PI*2

);



if(index===0){

ctx.fillStyle="#9cff00";

}else{

ctx.fillStyle="#25d000";

}


ctx.fill();



});





// ojos de la cabeza


let head=snake[0];


ctx.fillStyle="black";


ctx.beginPath();


ctx.arc(
head.x-5,
head.y-5,
3,
0,
Math.PI*2
);


ctx.arc(
head.x+5,
head.y-5,
3,
0,
Math.PI*2
);


ctx.fill();





// fruta


ctx.fillStyle="red";


ctx.beginPath();


ctx.arc(

food.x,

food.y,

8,

0,

Math.PI*2

);


ctx.fill();



}





function endGame(){


clearInterval(gameLoop);



if(score>record){

record=score;

localStorage.setItem(
"record",
record
);

}



document.getElementById("record").innerHTML=
"Récord: "+record;


document.getElementById("gameUI").classList.add("hidden");


document.getElementById("gameOver").classList.remove("hidden");


document.getElementById("finalScore").innerHTML=

"Puntuación: "+score;



}




// teclado PC

document.addEventListener(

"keydown",

e=>{


if(e.key==="ArrowUp")
changeDir("up");


if(e.key==="ArrowDown")
changeDir("down");


if(e.key==="ArrowLeft")
changeDir("left");


if(e.key==="ArrowRight")
changeDir("right");


}

);





// controles por deslizar dedo

let startX=0;
let startY=0;


canvas.addEventListener(

"touchstart",

e=>{


startX=e.touches[0].clientX;

startY=e.touches[0].clientY;


}

);



canvas.addEventListener(

"touchend",

e=>{


let endX=e.changedTouches[0].clientX;

let endY=e.changedTouches[0].clientY;



let dx=endX-startX;

let dy=endY-startY;



if(Math.abs(dx)>Math.abs(dy)){


if(dx>0)
changeDir("right");

else
changeDir("left");


}else{


if(dy>0)
changeDir("down");

else
changeDir("up");


}



}

);
