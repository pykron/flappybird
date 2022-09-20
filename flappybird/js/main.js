//import class
//automactically init class

//vars
let canvas, ctxPlayer, ctxPipe, ctxPipe2, gravity, pipeAccel, ball, pipetop, pipebot, pipeChoice, friction,
PIPE_WIDTH, PIPE_HEIGHT, PIPECAP_WIDTH, PIPECAP_HEIGHT, PIPE_GAP, PIPE_GAP2,
MAX_PIPE_ACCEL, PIPE_ACCEL,
BALL_RADIUS, BALL_X,
JUMP_HEIGHT, JUMP_VELY,
SPAWN_PIPE_X, PIPE_RANDOM_HEIGHT,
currentScore, topScore = 0,
antiGravity=false,
isDead=false

//viewport
const  vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
	vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)	

function init(){
	canvas = document.getElementById('canvasEl')
	canvas.addEventListener("click", jumpClick);
	ctxPlayer = canvas.getContext('2d')
	ctxPipe = canvas.getContext('2d')
	ctxPipe2 = canvas.getContext('2d')

	canvas.height = vh - vh*0.05
	canvas.width = vw - vw*0.02
	//default config
	gravity = canvas.height*0.000497
	friction = 0.98
	PIPE_ACCEL=0.0001011
	MAX_PIPE_ACCEL = 3*(canvas.width*PIPE_ACCEL)
	pipeAccel = canvas.width*PIPE_ACCEL
	currentScore = 0

	PIPE_RANDOM_HEIGHT = ((Math.floor(Math.random() * 30)) * (canvas.height/34) - 2*PIPE_GAP)
	PIPE_WIDTH =  canvas.width*0.1282,
	PIPE_HEIGHT = PIPE_RANDOM_HEIGHT
	PIPECAP_WIDTH = PIPE_WIDTH*1.67,
	PIPECAP_HEIGHT = PIPE_WIDTH*0.8125,
	BALL_RADIUS = (canvas.width+canvas.height)*0.0097,
	BALL_X = canvas.width/12,
	SPAWN_PIPE_X = 2*canvas.width/3,
	JUMP_HEIGHT = canvas.height*0.010559,
	JUMP_VELY = JUMP_HEIGHT*0.00425,
	PIPE_GAP = JUMP_HEIGHT*7.235,
	PIPE_GAP2 = PIPE_GAP*1.333
	SPAWN_PIPE_X = 2*canvas.width/3

	ball = {
		x: BALL_X,
		y: canvas.height/2,
		radius: BALL_RADIUS,
		color: ballColor(),
		bounce: 0.85,
		velX: 0,
		velY: 0
	}
	pipetop = {
		x: canvas.width,
		y: 0,
		velX: 0,
		width: PIPE_WIDTH,
		height: PIPE_HEIGHT,
		color: ballColor()
	}
	pipebot = {
		x: canvas.width,
		y: canvas.height, 
		velX: 0,
		width: PIPE_WIDTH,
		height: canvas.height,
		color: "green"
	}

	//loop update
	window.requestAnimationFrame(update)
}
//main loop, calc before draw
function update(){
	//queue next update
	window.requestAnimationFrame(update)

	//bottom bound
	if (ball.y + ball.radius >= canvas.height) {
		ball.y = canvas.height-ball.radius
		ball.velY *= -ball.bounce
		gravity *= -1
		ball.color = ballColor()
		antiGravity=true
	}
	//top bound
	if (ball.y - ball.radius <= 0) {
		ball.velY *= -ball.bounce
		ball.y = ball.radius
		ball.velX *= friction
		gravity *= -1
		ball.color = ballColor()
		antiGravity=false
	}
	//left bound
	if (ball.x - ball.radius <= 0) {
		ball.velX *= -ball.bounce
		ball.x = ball.radius
		ball.color = ballColor()
	}
	//right bound
	if (ball.x + ball.radius >= canvas.width) {
		ball.velX *= -ball.bounce
		ball.x = canvas.width - ball.radius
		ball.color = ballColor()
	}
	//reset insignificant amounts to 0 
	if(ball.velX < 0.01 && ball.velX > -0.01) {
		ball.velX = 0
	}
	if(ball.velY < 0.01 && ball.velY > -0.01) {
		ball.velY = 0
	}

	//add gravity 
	ball.velY += gravity 

	//update ball position
	ball.x += ball.velX 
	ball.y += ball.velY 

	//update pipes moves
	//pipetop write
	pipetop.velX += pipeAccel
	pipetop.x -= pipetop.velX
	pipebot.velX += pipeAccel
	pipebot.x -= pipebot.velX

	//pipe draw
	if(pipebot.x < -PIPE_WIDTH && pipetop.x < -PIPE_WIDTH){
		pipeChooser()
		//pipetop draw
		if(pipeChoice==0){
			if(pipetop.x < -PIPE_WIDTH){
				pipetop.x = canvas.width + PIPE_WIDTH
				if(pipeAccel < MAX_PIPE_ACCEL){
					pipeAccel += pipeAccel*0.015215
				}
				pipetop.velX = .1
				pipetop.height = pipeRandomHeight()
				if(pipetop.height <= canvas.height/2){
					pipetop.height = pipetop.height + 3*PIPE_GAP
				}
			}
		}
		//pipebot draw
		if(pipeChoice==1){ 
			if(pipebot.x < -PIPE_WIDTH){
				pipebot.x = canvas.width + PIPE_WIDTH
				if(pipeAccel < MAX_PIPE_ACCEL){
					pipeAccel += pipeAccel*0.015215
				}
				else{
					pipeAccel = MAX_PIPE_ACCEL
				}
				pipebot.velX = .1
				//pipebot.height
				pipebot.height = pipeRandomHeight()
				if(pipebot.height <= canvas.height/2){
					pipebot.height = pipebot.height + 3*PIPE_GAP
				}
				pipebot.y = (canvas.height - pipebot.height)
			}
		}
		//pipetop & pipebot draw
		if(pipeChoice==2){ 
			if(pipebot.x < -PIPE_WIDTH || pipetop.x <= -PIPE_WIDTH){
				pipebot.x = canvas.width + PIPE_WIDTH
				pipetop.x = canvas. width + PIPE_WIDTH	
				if(pipeAccel < MAX_PIPE_ACCEL){
					pipeAccel += pipeAccel*0.015215
				}
				else{
					pipeAccel = MAX_PIPE_ACCEL
				}
				pipebot.velX = .1
				pipetop.velX = .1
				pipebot.height = pipeRandomHeight()
				pipetop.height = pipeRandomHeight()
				pipebot.y = (canvas.height - pipebot.height)
			}
			while((pipetop.height + pipebot.height) >= (canvas.height)){
				if((Math.floor(Math.random()*2)==0)){
					pipetop.height = pipetop.height - 2*PIPE_GAP
				}
				else{
					pipebot.height = pipebot.height - 2*PIPE_GAP
				}
			}
			if((Math.floor(Math.random()*2)==0)){
				pipetop.height = pipetop.height - 2*PIPE_GAP
			}
			else{
				pipebot.height = pipebot.height - 2*PIPE_GAP
			}
			//adjust pipebot y from pipebot.height after calc
			pipebot.y = Math.abs(canvas.height - pipebot.height)
		}
	}
	if
	(
		(
			(ball.x <= pipebot.x + PIPE_WIDTH && ball.x >= pipebot.x) && (ball.y >= pipebot.y && ball.y)
		) 
		|| 
		(
			((ball.x <= pipetop.x + PIPE_WIDTH && ball.x >= pipetop.x) && ball.y <= pipetop.height)
		)
	)
	{
		isDead = true
		if(currentScore >= topScore && currentScore == currentScore)
		{
			topScore = currentScore
			document.getElementById("topscore").innerHTML = "High score: " + topScore
		}
		ball.y = canvas.height/2
		ball.velY = 0
		pipebot.x = -PIPE_WIDTH
		pipetop.x = -PIPE_WIDTH
		antiGravity = false
		pipeAccel = canvas.width*PIPE_ACCEL
		currentScore = 0
	}
	if(isDead==true){
			isDead=false
	}	
	//update score
		currentScore += 1
		document.getElementById("currentscore").innerHTML = "Score: " + currentScore

	//draw after logic/calculations 
	draw()
}
	//drawing
function draw() {
	//clear then redraw later
	ctxPlayer.clearRect(0, 0, canvas.width, canvas.height)
	//draw the ball 
	drawBall()
	//draw pipes
	pipeChoice = 2
	if(pipeChoice==0){
		drawPipeTop()
	}
	else if(pipeChoice==1){
		drawPipeBot()
	}
	else if(pipeChoice==2){
		drawPipeBot()
		drawPipeTop()
	}
}

function drawBall(){
	if(ball.velY >= 0){
	ctxPlayer.beginPath()
	ctxPlayer.arc(
		ball.x, ball.y, 
		ball.radius,
		(Math.PI/2), (2*Math.PI)
	)
	ctxPlayer.closePath()
	ctxPlayer.fill()
	ctxPlayer.fillStyle = ball.color
	ctxPlayer.stroke()
	}
	else{
	ctxPlayer.beginPath()
	ctxPlayer.arc(
		ball.x, ball.y, 
		ball.radius,
		Math.PI, (Math.PI)/2
	)
	ctxPlayer.closePath()
	ctxPlayer.fill()
	ctxPlayer.fillStyle = ball.color
	ctxPlayer.stroke()
	}
}
function drawPipeTop(){
	ctxPipe.shadowColor = "#f5f"
	ctxPipe.shadowBlur = 20
	ctxPipe.lineJoin = "bevel"
	ctxPipe.fill()
	ctxPipe.fillStyle = ball.color
	/*else if((pipetop.height + pipebot.height) <= (PIPE_GAP)){
		pipetop.height += (PIPE_GAP)
	}
	*/
	ctxPipe.fillRect(pipetop.x, pipetop.y, pipetop.width, pipetop.height)
	ctxPipe.fillRect(
		pipetop.x - (PIPE_WIDTH * 0.33), pipetop.height - (PIPE_WIDTH * 0.67) + 1,
		PIPECAP_WIDTH, PIPECAP_HEIGHT
	)
}
function drawPipeBot(){
	ctxPipe2.shadowColor = "#f5f"
	ctxPipe2.shadowBlur = 20
	ctxPipe2.lineJoin = "bevel"
	ctxPipe2.fill()
	ctxPipe2.fillStyle = ball.color
	/*if((pipetop.height + pipebot.height) <= (PIPE_GAP)){
		pipebot.height += (PIPE_GAP)
		pipebot.y = canvas.height - pipebot.height
	}
	*/
	ctxPipe2.fillRect(pipebot.x, pipebot.y, pipebot.width, pipebot.height)
	ctxPipe2.fillRect(
		pipebot.x - (pipebot.width*0.33), pipebot.y-1,
		PIPECAP_WIDTH, PIPECAP_HEIGHT
	)
}
function pipeChooser(){
	if(Math.floor(Math.random() * 2) == 0){
		pipeChoice = 2
	}
	else{
		if(Math.floor(Math.random()*2) == 0){
			pipeChoice = 0
		}
		else{
			pipeChoice = 1
		}
	}
}
function pipeRandomHeight(){
	return ((Math.floor(Math.random() * 30) + 1) * (canvas.height/34) - 2*PIPE_GAP) 
}
	
function ballColor(){
	let colors = ["darkred","darkblue", "blueviolet", "mediumaquamarine","cornflowerblue", "cadetblue", "steelblue", "gainsboro", "forestgreen", "firebrick", "ghostwhite", "whitesmoke", "ivory", "indigo", "darkorchid", "purple"]
	let color = colors[Math.floor(Math.random()*colors.length)] 
	return color
}
function jumpClick(){
	if(antiGravity==false){
		ball.velY = JUMP_VELY;
		ball.velY -= JUMP_HEIGHT;
		draw();
	}
	else if(antiGravity==true){
		ball.velY = -JUMP_VELY;
		ball.velY += JUMP_HEIGHT;
		draw();
	}
}

document.addEventListener("DOMContentLoaded", init);

