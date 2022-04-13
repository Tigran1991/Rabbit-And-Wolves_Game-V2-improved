const reloadBtn = document.querySelector(".reload-btn");
const newBoardBtn = document.querySelector('.new-board-btn');
const container = document.getElementById("container");
const boardField = document.querySelector('.board-field');
const footer = document.querySelector('.footer');
const main = document.querySelector('.main');

let cellWidth = 60;

let currentMatrix;
let playfieldSize;
let playfield;
let characterStorage = new Array(0);
let characterCoordinateStorage = new Array(0);
let posX;
let posY;
let rabbitNewPositionX;
let rabbitNewPositionY;
let distanceByX;
let distanceByY;
let wolfNewPositionX;
let wolfNewPositionY;
let moveButtons;
let board;
let matrixStorage = new Array(0);
let boardStorage = new Array(0);
let playfieldStorage = new Array(0);
let moveButtonStorage = new Array(0);
let currentElementsIndex;
let serialNumber = 0;
let currentBoard;
let currentPlayfieldName;
let currentButtonElement;
let points = 0;
let rabbitMoveDirection;
let currentButtonClassName;
let currentButtonListElement;
let currentPlayfieldSize;
let playfieldWidth;
let playfieldHeight;

const characters = {
  freeCell: 0,
  rabbitCell: 1,
  wolfCell: 2,
  houseCell: 3,
  fenceCell: 4,
  carrotCell: 5,
};

const characterItems = {
  0: "freeCell",
  1: "rabbitCell",
  2: "wolfCell",
  3: "houseCell",
  4: "fenceCell",
  5: "carrotCell",
};

reloadBtn.addEventListener('click', function (){
  location.reload();
})

newBoardBtn.addEventListener("click", function () {
  newBoard();
});

const newBoard = () => {
  serialNumber++;
  createCurrentMatrix();
  makeCharacterStorage();
  setCharacters();
  drawPlayfield();
  makeBoardStorage();
  makePlayfieldStorage();
}

function makeBoardStorage(){
  boardStorage.push(board.id);
}

function makePlayfieldStorage(){
  playfieldStorage.push(playfield.id);
}

function findCurrentElementIndex(){
  currentElementsIndex = playfieldStorage.indexOf(currentPlayfieldName);
}

function determineCharacterCounts() {
  wolfCount = (playfieldSize * 40) / 100;
  fenceCount = (playfieldSize * 40) / 100;
  carrotCount = (playfieldSize * 40) / 100;
}

function makeCharacterStorage() {
  determineCharacterCounts();
  characterStorage.push(characters.rabbitCell);
  characterStorage.push(characters.houseCell);
  for (let m = 0; m < wolfCount; m++) {
    characterStorage.push(characters.wolfCell);
  }
  for (let n = 0; n < fenceCount; n++) {
    characterStorage.push(characters.fenceCell);
  }
  for (let n = 0; n < carrotCount; n++) {
    characterStorage.push(characters.carrotCell);
  }
}

function setCharacters() {
  const characterStorageLength = characterStorage.length;
  let k = 0;
  do {
    setRandomPositionForCharacters();
    k++;
  } while (k < characterStorageLength);
}

function createCurrentMatrix() {
  playfieldSize = parseInt(document.getElementById("select-size").value);
  currentMatrix = new Array(playfieldSize)
    .fill(0)
    .map(() => new Array(playfieldSize).fill(0));
  matrixStorage.push(currentMatrix);
  return matrixStorage;
}

function random() {
  return Math.floor(Math.random() * playfieldSize);
}

function randomCharacter() {
  return characterStorage.shift();
}

function setRandomPositionForCharacters(){
  const i = random();
  const j = random();
  if (currentMatrix[i][j] === characters.freeCell) {
    currentMatrix[i][j] = randomCharacter();
  } else {
    return setRandomPositionForCharacters();
  }
}

function drawPlayfield() {
  let moveingToRight;
  let moveingToDown;
  let moveingToLeft;
  let moveingToUp;
  makeBoard();
  makePlayfield();
  makeMoveButtonsDiv();
  board.appendChild(playfield);
  board.appendChild(moveButtons);
  makeMoveButtons(moveingToRight, "move-right", rabbitMove);
  makeMoveButtons(moveingToDown, "move-bottom", rabbitMove);
  makeMoveButtons(moveingToLeft, "move-left", rabbitMove);
  makeMoveButtons(moveingToUp, "move-top", rabbitMove);
  currentMatrix.forEach((element) => {
    element.forEach((item) => {
      addCharacters(element, item);
    });
  });
}

function drawPlayfieldAfterMove(){
  isThereAPlayfield();
  makePlayfieldAfterMove();
  currentMatrix.forEach((element) => {
    element.forEach((item) => {
      addCharacters(element, item);
    });
  });
}

function makeBoard(){
  board = document.createElement("div");
  board.classList.add('board');
  board.style.width = `${(playfieldSize + 1) * cellWidth}px`;
  board.style.height = `${((playfieldSize  + 1) * cellWidth) + (cellWidth / 2)}px`;
  board.setAttribute('id', `board${serialNumber}`);
  boardField.appendChild(board);
}

function makePlayfield(){
  playfield = document.createElement("div");
  playfield.classList.add('playfield');
  playfield.setAttribute('id', `playfield${serialNumber}`);
  playfieldWidth = playfield.style.width = `${playfieldSize * cellWidth}px`;
  playfieldHeight = playfield.style.height = `${playfieldSize * cellWidth}px`;
}

function makePlayfieldAfterMove(){
  playfield = document.createElement("div");
  playfield.classList.add('playfield');
  playfield.setAttribute('id', currentPlayfieldName);
  playfieldWidth = playfield.style.width = `${currentPlayfieldSize * cellWidth}px`;
  playfieldHeight = playfield.style.height = `${currentPlayfieldSize * cellWidth}px`;
  document.getElementById(currentBoard).appendChild(playfield);
}

function makeMoveButtonsDiv(){
  moveButtons = document.createElement("div");
  moveButtons.classList.add('side-buttons');
  moveButtons.setAttribute('id', `moveButton${serialNumber}`);
  moveButtons.style.height = `${cellWidth}px`;
  moveButtons.style.top = `${(playfieldSize * cellWidth) + (cellWidth / 2)}px`;
}

function makeMoveButtons(sideOfButton, moveSide, rabbitMoveSide){
  sideOfButton = document.createElement("button");
  sideOfButton.setAttribute('class', `moveSide${serialNumber}`);
  sideOfButton.setAttribute('id', moveSide);
  sideOfButton.addEventListener('click', rabbitMoveSide);
  sideOfButton.setAttribute('name', `playfield${serialNumber}`);
  moveButtons.appendChild(sideOfButton);
}

function addCharacters(element, item, characterItem) {
  createCurrentElement(element, item, characterItem);
}

function createCurrentElement(element, item, characterItem) {
  characterItem = item;
  createElement(characterItems[characterItem], characterItems[characterItem]);
}

function isThereAPlayfield() {
  if (document.getElementById(currentPlayfieldName) !== null) {
    document.getElementById(currentPlayfieldName).remove();
  }
}

function createElement(itemName, className) {
  itemName = document.createElement("div");
  itemName.classList.add(className);
  playfield.appendChild(itemName);
}

function characterCurrentCoordinate(character) {
  characterCoordinateStorage = new Array(0);
  for (let i = 0; i < currentMatrix.length; i++) {
    if (currentMatrix[i].includes(character)) {  
      for(let j = 0; j < currentMatrix[i].length; j++){
        if(currentMatrix[i][j] === character){
          posX = i;
          posY = j;
          characterCoordinateStorage.push([posX, posY]);
        }
      }
    }    
  }
}

function rabbitMove(eventName){
  setCurrentPlayfield(eventName);
  findCurrentElementIndex();
  currentMatrix = matrixStorage[currentElementsIndex];
  currentPlayfieldSize = currentMatrix.length;
  setCurrentButtonElement(eventName);
  points++;
  determineRabbitMoveDirection(eventName);
  currentBoard = boardStorage[currentElementsIndex];
  currentButtonClassName = '.' + currentButtonElement;
  currentButtonListElement = document.querySelectorAll(currentButtonClassName);
  characterCurrentCoordinate(characters.rabbitCell);
  switch(rabbitMoveDirection){
    case 'move-right':
      rabbitMoveRight();
      break;
    case 'move-bottom':
      rabbitMoveBottom();
      break;
    case 'move-left':
      rabbitMoveLeft();
      break;
    case 'move-top':
      rabbitMoveTop();
      break;
  }
  if(rabbitCanMove(rabbitNewPositionX, rabbitNewPositionY, points)){
    moveCharacter(characters.rabbitCell, rabbitNewPositionX, rabbitNewPositionY);
  }
  updateWolvesPositions();
  drawPlayfieldAfterMove(eventName);
}

function determineRabbitMoveDirection(event){
  rabbitMoveDirection = event.target.id;
}

function rabbitMoveRight(){
  if(posY === (currentPlayfieldSize - 1)){
    rabbitNewPositionX = posX, rabbitNewPositionY = 0;
  }else{
    rabbitNewPositionX = posX, rabbitNewPositionY = (posY + 1);
  }
}

function rabbitMoveBottom(){
  if(posX === (currentPlayfieldSize - 1)){
    rabbitNewPositionX = 0, rabbitNewPositionY = posY;
  }
  else{
    rabbitNewPositionX = (posX + 1), rabbitNewPositionY = posY;
  }
}

function rabbitMoveLeft(){
  if(posY === 0){
    rabbitNewPositionX = posX, rabbitNewPositionY = (currentPlayfieldSize - 1);
  }else{
    rabbitNewPositionX = posX, rabbitNewPositionY = (posY - 1);
  }
}

function rabbitMoveTop(){
  if(posX === 0){
    rabbitNewPositionX = (currentPlayfieldSize - 1), rabbitNewPositionY = posY;
  }else{
    rabbitNewPositionX = (posX - 1), rabbitNewPositionY = posY;
  }
}

function setCurrentPlayfield(event){
  currentPlayfieldName = event.target.name;
}

function setCurrentButtonElement(event){
  currentButtonElement = event.target.className;
}

function updateWolvesPositions() {
  characterCurrentCoordinate(characters.wolfCell);
  while(characterCoordinateStorage.length !== 0){
    currentWolf();
    wolfNewPosition();
    if(wolfCanMove(wolfNewPositionX, wolfNewPositionY)){
    moveCharacter(characters.wolfCell, wolfNewPositionX, wolfNewPositionY);
    }  
  }
}

function moveCharacter(character, characterPositionX, characterPositionY){
  currentMatrix[posX].splice(posY, 1, characters.freeCell);
  currentMatrix[characterPositionX].splice(characterPositionY, 1, character);
}

function rabbitCanMove(characterPositionX, characterPositionY, sumPoints){
  let rabbitNextPosition = currentMatrix[characterPositionX][characterPositionY];
  if(rabbitNextPosition == characters.fenceCell){
    return false;
  }
  if(rabbitNextPosition == characters.wolfCell){
    gameStatusBoard(characters.wolfCell);
    return false;
  }
  if(rabbitNextPosition == characters.houseCell){
    gameStatusBoard(characters.rabbitCell, sumPoints);
    return false;
  }
  if(rabbitNextPosition == characters.carrotCell){
    points += 2;
  }
  return true;
}

function currentWolf(){
  for(let m = 0; m < characterCoordinateStorage.length; m++){
    posX = characterCoordinateStorage[m][0];
    posY = characterCoordinateStorage[m][1];
    characterCoordinateStorage.shift();
    return posX, posY;
  }
}

function wolfNewPosition(){
  determineClosestDistance(posX, posY);
}

function determineClosestDistance(posX, posY){
let closestDistanceStorage = new Array(0);
if(wolfProbablePositionY = posY + 1){
  distanceByX = Math.abs(posX - rabbitNewPositionX);
  distanceByY = Math.abs(wolfProbablePositionY - rabbitNewPositionY);
  calculateDistance(closestDistanceStorage);
}
if(wolfProbablePositionX = posX + 1){
  distanceByX = Math.abs(wolfProbablePositionX - rabbitNewPositionX);
  distanceByY = Math.abs(posY - rabbitNewPositionY);
  calculateDistance(closestDistanceStorage);
}
if(wolfProbablePositionY = posY - 1){
  distanceByX = Math.abs(posX - rabbitNewPositionX);
  distanceByY = Math.abs(wolfProbablePositionY - rabbitNewPositionY);
  calculateDistance(closestDistanceStorage);
}
if(wolfProbablePositionX = posX - 1){
  distanceByX = Math.abs(wolfProbablePositionX - rabbitNewPositionX);
  distanceByY = Math.abs(posY - rabbitNewPositionY);
  calculateDistance(closestDistanceStorage);
}
setWolfNewPositionCoordinates(closestDistanceStorage);
}

function calculateDistance(distanceStorage){
  let distance = Math.floor(Math.sqrt(Math.pow(distanceByX, 2) + Math.pow(distanceByY, 2)));
  distanceStorage.push(distance);
}

function setWolfNewPositionCoordinates(storage){
  if(storage.length !== 0){
    let minDistance = Math.min(...storage);
    if(minDistance === storage[0]){
      wolfNewPositionX = posX, wolfNewPositionY = posY + 1;
    }
    if(minDistance === storage[1]){
      wolfNewPositionX = posX + 1, wolfNewPositionY = posY;
    }
    if(minDistance === storage[2]){
      wolfNewPositionX = posX, wolfNewPositionY = posY - 1;
    }
    if(minDistance === storage[3]){
      wolfNewPositionX = posX - 1, wolfNewPositionY = posY;
    }
  }else{
    wolfNewPositionX = posX; wolfNewPositionY = posY;
  }
}

function wolfCanMove(characterPositionX, characterPositionY){
  let wolfNextPosition = currentMatrix[characterPositionX][characterPositionY];
  if(wolfNextPosition == characters.fenceCell
    || wolfNextPosition == characters.wolfCell
    || wolfNextPosition == characters.houseCell
    || wolfNextPosition == undefined){
    return false;
  }
  if(wolfNextPosition == characters.rabbitCell && rabbitIsWin){
    return false;
  }
  if(wolfNextPosition == characters.rabbitCell){
    gameStatusBoard(characters.wolfCell);
  }
  return true;
}

function gameStatusBoard(winnerCharacter, sumPoints){
  if(winnerCharacter == characters.wolfCell){
    makeWolvesWinBoard();
  }  
  if(winnerCharacter == characters.rabbitCell){
    makeRabbitWinBoard(sumPoints);
  }
}

function makeWolvesWinBoard(){
  let wolvesWinBoard = document.createElement('div');
  wolvesWinBoard.classList.add('wolvesWinAnnouncement');
  wolvesWinBoard.innerHTML = `
              <h2> Wolves Won ! </h2>`;
  document.getElementById(currentBoard).appendChild(wolvesWinBoard);
  points = 0;
  wolvesWinBoard.style.zIndex = 1;
  removeEvent(currentButtonListElement);
}

let rabbitIsWin;

function makeRabbitWinBoard(sumPoints){
  rabbitIsWin = true;
  let rabbitWinBoard = document.createElement('div');
  rabbitWinBoard.classList.add('rabbitWinAnnouncement');
  board.appendChild(rabbitWinBoard);
  rabbitWinBoard.innerHTML = `
              <h2> Congratulations ! </h2>
              <h2> Rabbit Win ! </h2>`;
  let rabbitWinAnnouncementPoints = document.createElement('h2');
  rabbitWinAnnouncementPoints.classList.add('rabbitWinAnnouncementPoints');
  rabbitWinAnnouncementPoints.innerText = `You scored ${sumPoints} points !`;
  rabbitWinBoard.appendChild(rabbitWinAnnouncementPoints);
  document.getElementById(currentBoard).appendChild(rabbitWinBoard);
  points = 0;
  rabbitWinBoard.style.zIndex = '1';
  removeEvent(currentButtonListElement);
}

function removeEvent(currentButtonsList){
  currentButtonsList.forEach(listElement => listElement.removeEventListener('click', rabbitMove));
}
