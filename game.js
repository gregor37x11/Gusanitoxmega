const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const size = 18;

let snake = [];
let food = {};

let direction = "right";

let score = 0;
let record = localStorage.getItem("record") || 0;

let gameLoop = null;

let paused = false;
let playing = false;

window.addEventListener("DOMContentLoaded", () => {
    const recordEl = document.getElementById("record");
    if (recordEl) {
        recordEl.innerHTML = "Récord: " + record;
    }
});

function startGame(){

document.getElementById("menu").classList.add("hidden");

document.getElementById("gameOver").classList.add("hidden");

document.getElementById("gameUI").classList.remove("hidden");


snake = [

{x:180,y:180},

{x:162,y:180},

{x:144,y:180}

];


direction="right";

score=0;

paused=false;

playing=true;


document.getElementById("score").innerHTML =
"Puntos: 0";


document.getElementById("pauseBtn").innerHTML="⏸";


food=createFood();



clearInterval(gameLoop);

gameLoop=setInterval(update,120);


}



function createFood(){

return{

x:Math.floor(Math.random()*18+1)*size,

y:Math.floor(Math.random()*18+1)*size

};

}




function pauseGame(){

if(!playing)return;


paused=!paused;


if(paused){

document.getElementById("pauseBtn").innerHTML="▶";

}else{

document.getElementById("pauseBtn").innerHTML="⏸";

}

}





function changeDir(newDir){


if(!playing)return;


if(newDir==="left" && direction!=="right")
direction="left";


if(newDir==="right" && direction!=="left")
direction="right";


if(newDir==="up" && direction!=="down")
direction="up";


if(newDir==="down" && direction!=="up")
direction="down";


}




function update(){


if(paused)return;



let head={...snake[0]};



if(direction==="right")
head.x+=size;


if(direction==="left")
head.x-=size;


if(direction==="up")
head.y-=size;


if(direction==="down")
head.y+=size;




if(

head.x<0 ||

head.y<0 ||

head.x>=360 ||

head.y>=360

){

gameOver();

return;

}




for(let part of snake){

if(head.x===part.x && head.y===part.y){

gameOver();

return;

}

}




snake.unshift(head);



if(head.x===food.x && head.y===food.y){

score++;

document.getElementById("score").innerHTML=
"Puntos: "+score;


food=createFood();


}else{


snake.pop();


}



draw();

}





function draw(){


ctx.clearRect(0,0,360,360);



ctx.fillStyle="#071015";

ctx.fillRect(0,0,360,360);





// FRUTA

ctx.beginPath();

ctx.arc(
food.x,
food.y,
9,
0,
Math.PI*2
);

ctx.fillStyle="red";

ctx.fill();




// GUSANO

snake.forEach((part,index)=>{


ctx.beginPath();


let radio;


if(index===0){

radio=10;

}else{

radio=8-index*0.1;

}


ctx.arc(

part.x,

part.y,

radio,

0,

Math.PI*2

);



if(index===0){

ctx.fillStyle="#9cff00";

}else{

ctx.fillStyle="#28d000";

}


ctx.fill();


});





// OJOS

let head=snake[0];


ctx.fillStyle="black";


let eye1;
let eye2;



if(direction==="right"){

eye1={x:head.x+5,y:head.y-5};
eye2={x:head.x+5,y:head.y+5};

}


if(direction==="left"){

eye1={x:head.x-5,y:head.y-5};
eye2={x:head.x-5,y:head.y+5};

}



if(direction==="up"){

eye1={x:head.x-5,y:head.y-5};
eye2={x:head.x+5,y:head.y-5};

}



if(direction==="down"){

eye1={x:head.x-5,y:head.y+5};
eye2={x:head.x+5,y:head.y+5};

}



ctx.beginPath();

ctx.arc(eye1.x,eye1.y,2.5,0,Math.PI*2);

ctx.arc(eye2.x,eye2.y,2.5,0,Math.PI*2);

ctx.fill();



}





function gameOver(){


clearInterval(gameLoop);

playing=false;


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
"Puntos: "+score;


}





document.addEventListener("keydown",e=>{


if(e.key==="ArrowUp")
changeDir("up");


if(e.key==="ArrowDown")
changeDir("down");


if(e.key==="ArrowLeft")
changeDir("left");


if(e.key==="ArrowRight")
changeDir("right");


});
