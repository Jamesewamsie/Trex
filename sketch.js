var trex,trex_image;

var ground,ground_image;

var collideGround;

var cloud_image;

var obstacle, obstacle_image_1, obstacle_image_2, obstacle_image_3, obstacle_image_4, obstacle_image_5, obstacle_image_6;

var obstacleGroup;

var cloudGroup;

var trexCollided;

var score;

var gameState;

var gameOver,gameOverImage;

var resetButton, resetButtonImage;

var dieSound, jumpSound, checkpointSound;

var scoreChecker;

function preload(){
  
  trex_image= loadAnimation("trex1.png","trex3.png","trex4.png");
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  obstacle_image_1 = loadImage("obstacle1.png");
  obstacle_image_2 = loadImage("obstacle2.png");
  obstacle_image_3 = loadImage("obstacle3.png");
  obstacle_image_4 = loadImage("obstacle4.png");
  obstacle_image_5 = loadImage("obstacle5.png");
  obstacle_image_6 = loadImage("obstacle6.png");
  trexCollided = loadAnimation("trex_collided.png");
  resetButtonImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
  
  
} 

function setup(){
  createCanvas(600,200);
  
 var j = Math.round(random(1,6)); 
  
 trex = createSprite(100,160,10,10);
  trex.addAnimation("running", trex_image);
  trex.scale=0.5;
  trex.addAnimation("collided", trexCollided);
  trex.setCollider("circle",0,0,35);
  trex.debug = false;
  
 ground = createSprite(150,175,600,5);
  ground.addImage("floor", ground_image);
  
  
  collideGround = createSprite(300,185,600,5);
  collideGround.visible = false;
  
  gameOver = createSprite(300,75);
  gameOver.addImage("gameOver", gameOverImage);

  resetButton = createSprite(300,120);
  resetButton.addImage("reset", resetButtonImage);
  resetButton.scale = 0.5;
  
 obstacleGroup = createGroup();
  
 cloudGroup = createGroup();
  
  score = 1;
  
  scoreChecker = 1;
  
  gameState = "running";
}

function draw(){
  
  trex.collide(collideGround);
  
  trex.velocityY += 1;
  
   if((score %300 === 0) && (score > 1)){
     scoreChecker += 1;
   }
  
  if(scoreChecker %2 === 0){
     background("black");
   } else{
     background(180);
     
   }
  
  fill("white");  
  text("Score: " + score, 300,20);
  
  if(gameState === "running"){
  
  
    
  trex.changeAnimation("running", trex_image);
  
   if(keyDown("space") && (trex.y > 158)){
     trex.velocityY = -14;
     jumpSound.play();
   }
  
    ground.velocityX = -4 - score/200;
    
  if(ground.x < 0){
    ground.x = ground.width/2;
  }
    
    score += 1;
    
    gameOver.visible = false;
    resetButton.visible = false;
    
  if((score %300 === 0) && (score > 1)){
    checkpointSound.play();
  }
    
  if(trex.isTouching(obstacleGroup)){
    gameState = "hit";
    dieSound.play();
  }
  }  
  
randomObstacle();
createClouds();
stopAll();
drawSprites();
}

function createClouds(){
  if(frameCount %100 === 0){
  var clouds = createSprite(650,random(25,125),10,10);
  clouds.addImage("clouds", cloud_image);
  clouds.velocityX = -2;
  clouds.scale = random(0.8,1.2);
  trex.depth = clouds.depth + 1;
  gameOver.depth = clouds.depth + 1;
  resetButton.depth = clouds.depth + 1;
  clouds.lifetime = 400;
  cloudGroup.add(clouds);
  }
  
}

function randomObstacle(){
  if(frameCount %100 === 0){
    obstacle = createSprite(625,160);
    obstacle.scale = 0.5;
    obstacle.velocityX = -5 - score/200;
    obstacle.lifetime = 400;
    var randomImage = Math.round(random(1,6));
    
    obstacleGroup.add(obstacle);
    
    switch(randomImage){
      case 1: obstacle.addImage("obstaleImage1", obstacle_image_1);
      break;
      case 2: obstacle.addImage("obstaleImage2", obstacle_image_2);
      break;
      case 3: obstacle.addImage("obstaleImage3", obstacle_image_3);
      break;
      case 4: obstacle.addImage("obstaleImage4", obstacle_image_4);
      break;
      case 5: obstacle.addImage("obstaleImage5", obstacle_image_5);
      break;
      case 6: obstacle.addImage("obstaleImage6", obstacle_image_6);
      break;
      default: break;
    }
    
    
  }
  
}

function stopAll(){
  if(gameState === "hit"){
    obstacleGroup.setVelocityXEach(0);
    trex.changeAnimation("collided", trexCollided);
    ground.velocityX = 0;
    cloudGroup.setVelocityXEach(0);
    trex.velocityY = 0;
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
    gameOver.visible = true;
    resetButton.visible = true;
    if(mousePressedOver(resetButton)){
      gameState = "running";
      score = 0;
      obstacleGroup.destroyEach();
      cloudGroup.destroyEach();
    }
  }
}