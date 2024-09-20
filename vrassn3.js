try {var keysdown = {};

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }
  
  keysdown[event.key] = true;

  event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {
  if (event.defaultPrevented) {
    return;
  }
  
  keysdown[event.key] = false;

  event.preventDefault();
}, true);

window.onload = function() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
			
  var ball = {x:0, //the x location of the ball
        y:0, //the y location of the ball
			  radius:10, //the radius of the ball
			  fillColor:"red", //what color should the ball be
			  strokeColor:"grey", //what color should the outline of the ball be
			  velocity_x:15, //how fast the ball will move in the x direction
			  velocity_y:3,
        hit: 0}; //how fast the ball will move in the y direction
  var player1 = {x:0, //the x location of the ball
        y:0, //the y location of the ball
			  height: 150,
        width: 10,//the radius of the ball
			  fillColor:"blue", //what color should the ball be
			  strokeColor:"cyan", //what color should the outline of the ball be
			  velocity_y:0}; //how fast the ball will move in the y direction
  var player2 = {x:canvas.width, //the x location of the ball
        y:0, //the y location of the ball
			  height: 150,
        width: 10,//the radius of the ball
			  fillColor:"green", //what color should the ball be
			  strokeColor:"#42e347", //what color should the outline of the ball be
			  velocity_y:0}; //how fast the ball will move in the y direction
  var player_increment = 1;
  var players = [player1, player2];
  var lastFrameTimeMs = Date.now();
  var timestamp = Date.now();
  var lag = 0.0;
  const MS_PER_UPDATE = 50;
  requestAnimationFrame(mainLoop);
			
  function mainLoop() {
    timestamp = Date.now();
    delta = timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;
    lag += delta;
    processInput();
	  draw(lag / MS_PER_UPDATE);
    while (lag >= MS_PER_UPDATE)
    {
      update();
      lag -= MS_PER_UPDATE;
    }
				
	  requestAnimationFrame(mainLoop);
  }
  
  function processInput()
  {
    if(keysdown.w) {
      player1.velocity_y -= player_increment;
    }else if(keysdown.s) {
      player1.velocity_y += player_increment;
    }else{
      if (player1.velocity_y > player_increment*5){
        player1.velocity_y -= player_increment;
      }else if (player1.velocity_x < -player_increment*5){
        player1.velocity_y += player_increment;
      }else{
        player1.velocity_y = 0;
      }
    }
    
    if(keysdown.ArrowUp){
		  player2.velocity_y -= player_increment;
	  }else if (keysdown.ArrowDown) {
		  player2.velocity_y += player_increment;
    }else{
      if (player2.velocity_y > player_increment*5){
        player2.velocity_y -= player_increment;
      }else if (player2.velocity_y < -player_increment*5){
        player2.velocity_y += player_increment;
      }else{
        player2.velocity_y = 0;
      }
    }
  }
  
  function update() {
    //update position based on velocity
    player1.y += player1.velocity_y;
    player2.y += player2.velocity_y;
    ball.x += ball.velocity_x;
    ball.y += ball.velocity_y;

    if(ball.x < ball.radius){
      if(ball.y < player1.y || ball.y > player1.y+player1.height){
        window.alert("Game over, Player 1 lost!");
      }
    }
    if(ball.x > canvas.width - ball.radius/2){
      if(ball.y < player2.y || ball.y > player2.y+player2.height){
        window.alert("Game over, Player 2 lost!");
      }
    }
    
    //make the ball bounce off the walls
    if (ball.x > canvas.width) {
       ball.velocity_x *= -1;
       ball.x = canvas.width;
    }
				
    if (ball.x < 0) {
        ball.velocity_x *= -1;
        ball.x = 0;
    }
				
    if (ball.y > canvas.height) {
        ball.velocity_y *= -1;
        ball.y = canvas.height;
    }
				
    if (ball.y < 0) {
        ball.velocity_y *= -1;
        ball.y = 0;
    }
    	
    //make players stop short at walls
    for(var i = 0; i < players.length; i++){

      var player = players[i];
      if (player.y > canvas.height-player.height) {
        player.velocity_y = 0;
        player.y = canvas.height-player.height;
      }
				
      if (player.y < 0) {
        player.velocity_y = 0;
        player.y = 0;
      }
    }
    	
  }
  
  function draw(interp) {			
    //clear our drawing
	  context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(ball.x + ball.velocity_x*interp, ball.y+ ball.velocity_y*interp);
    context.beginPath();
    context.arc(0, 0, ball.radius, 0, 2 * Math.PI, false);
    context.fillStyle = ball.fillColor;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = ball.strokeColor;
    context.stroke();
    context.restore();
    context.save();
    context.translate(player1.x, player1.y + player1.velocity_y*interp);
    context.beginPath();
    context.rect(0, 0, player1.width, player1.height);
    context.fillStyle = player1.fillColor;
	  context.fill();
	  context.lineWidth = 1;
	  context.strokeStyle = player1.strokeColor;
	  context.stroke();
    context.restore();
    context.save();
    context.translate(player2.x-player2.width, player2.y + player2.velocity_y*interp);
    context.beginPath();
    context.rect(0, 0, player2.width, player2.height);
    context.fillStyle = player2.fillColor;
	  context.fill();
	  context.lineWidth = 1;
	  context.strokeStyle = player2.strokeColor;
	  context.stroke();
    context.restore();
  }

}
} catch (error) { throw error; }
