var dog, happyDog, dogImage, happyDogImage;
var foodS, foodStock;
var addFood, feedFood; 
var fedTime, lastFed;
var gameState;
var foodObj;
var database;
var name;
var readState;
var bedRoomImage,deadDogImage,DogVaccinationImage,StockImage,GardenImage,InjectionImage,LivingRoomImage,MilkImage,runningImage,runningLeftImage,WashRoomImage
var LazyImage
function preload()
{
  dogImage = loadImage("images/Dog.png");
  happyDogImage = loadImage("images/happy dog.png");
  bedRoomImage = loadImage("images/Bed Room.png");
  deadDogImage = loadImage("images/deadDog.png");
  DogVaccinationImage = loadImage("images/dogVaccination.png");
  StockImage = loadImage("images/Food Stock.png");
  GardenImage = loadImage("images/Garden.png");
  InjectionImage = loadImage("images/Injection.png");
  LazyImage = loadImage("images/Lazy.png");
  LivingRoomImage = loadImage("images/Living Room.png");
  MilkImage = loadImage("images/milk.png");
  runningImage = loadImage("images/running.png");
  runningLeftImage = loadImage("images/runningLeft.png");
  WashRoomImage = loadImage("images/Wash Room.png");

}

function setup() {
  database = firebase.database();
  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value",foodObj.getFoodStock);
  fedTime =database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  readState =database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  createCanvas(1000, 500);
  inputname = createInput("Enter a name");
  inputname.position(860,95);

  button = createButton("Confirm Name");
  button.position(860,115);
  button.mousePressed(changeName);

  dog = createSprite(900,250,50,50);
  dog.scale = 0.2;
  dog.addImage(dogImage);
  feedFood = createButton("Feed the dog");
  feedFood.position(700,95);
  feedFood.mousePressed(feedDog);

  addFood = createButton("Add food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  

  background(46, 139, 87);
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 +" PM",350,30);
  } else if(lastFed === 0){
    text("Last Feed : 12 AM",350,30);
  } else {
    text("Last Feed : "+ lastFed + " AM",350,30);
  }
  currentTime=hour();
  if(currentTime ==(lastFed+1)){
    update("Playing");
    foodObj.garden();
    dog.visible = false;
  } else if(currentTime ==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
    dog.visible = false;
  } else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
    dog.visible = false;
  } else {
    update("Hungry");
    foodObj.display();
    dog.visible = true;
  }
  foodObj.display();
  drawSprites();
  textSize(20);
  stroke("white");
  fill("white");
  text("Name: "+name,800,100);
  text("Food remaining: "+foodS,1,100);



}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function feedDog(){
  dog.addImage(happyDogImage);

  foodObj.updateFoodStock(foodS-1);
  database.ref('/').update({
    Food:foodS,
    FeedTime:hour()
  })
  
}
function changeName(){
  name = inputname.value();
  database.ref('/').update({
    Name:name
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}