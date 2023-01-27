//so right away i started with defining what i feel like i need, the grid for the game, the results for points and win/loss, where my ship is on the grid, creature id, what happens when we hit the wall, something to remove creatures//
const grid = document.querySelector('.grid')
const ship = document.querySelector('.ship')
const resultsDisplay = document.querySelector('.results')
let currentShipIndex = 202
let width = 15
let direction = 1
let creatureId
let goingRight = true
let creaturesRemoved = []
let results = 0

for (let i = 0; i < 225; i++) {
  const salmon = document.createElement('div')
  grid.appendChild(salmon)
}

const salmons = Array.from(document.querySelectorAll('.grid div'))

//here is the creatures, pretty much numbered them on the grid// 

const oceanCreature = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

function draw() {
  for (let i = 0; i < oceanCreature.length; i++) {
    if(!creaturesRemoved.includes(i)) {
      salmons[oceanCreature[i]].classList.add('creature')
    }
  }
}

draw()

function remove() {
  for (let i = 0; i < oceanCreature.length; i++) {
    salmons[oceanCreature[i]].classList.remove('creature')
  }
}
//creation of my ship! still trying to figure out how to turn this into an image//

salmons[currentShipIndex].classList.add('ship')



//now that the ship is here it makes sense to let the player move the ship right//
//i went with arrow keys instead of 'a', 'd' because those werent working for me//

function moveShip(e) {
  salmons[currentShipIndex].classList.remove('ship')
  switch(e.key) {
    case 'ArrowLeft':
      if (currentShipIndex % width !== 0) currentShipIndex -=1
      break
    case 'ArrowRight' :
      if (currentShipIndex % width < width -1) currentShipIndex +=1
      break
  }
  salmons[currentShipIndex].classList.add('ship')
}

//need the event listener for the ships movements as well

document.addEventListener('keydown', moveShip)

//now i have to make the creatures move on their onw just like in space invaders, a simple linear path down to the player//
//the if statements keep the creature from ending up passing the 'wall' and disappearing into the void//

function moveCreature() {
  const leftEdge = oceanCreature[0] % width === 0
  const rightEdge = oceanCreature[oceanCreature.length - 1] % width === width -1
  remove()

  if (rightEdge && goingRight) {
    for (let i = 0; i < oceanCreature.length; i++) {
      oceanCreature[i] += width +1
      direction = -1
      goingRight = false
    }
  }

  if(leftEdge && !goingRight) {
    for (let i = 0; i < oceanCreature.length; i++) {
      oceanCreature[i] += width -1
      direction = 1
      goingRight = true
    }
  }

  for (let i = 0; i < oceanCreature.length; i++) {
    oceanCreature[i] += direction
  }

  draw()

//now to utilize the results header and give the player a counter and messages for when they win or lose//

  if (salmons[currentShipIndex].classList.contains('creature', 'ship')) {
    resultsDisplay.innerHTML = 'YOU DIED'
    clearInterval(creatureId)
  }

  for (let i = 0; i < oceanCreature.length; i++) {
    if(oceanCreature[i] > (salmons.length)) {
      resultsDisplay.innerHTML = 'YOU DIED'
      clearInterval(creatureId)
    }
  }
  if (creaturesRemoved.length === oceanCreature.length) {
    resultsDisplay.innerHTML = 'YOU WON!!WOOO!!'
    clearInterval(creatureId)
  }
}
creatureId = setInterval(moveCreature, 600)

//and now we have to code a weapon! torpedoes since we are underwater, and i should add a simple animation for the explosion and to keep the creatures gone until the round is over//
//i used class list to pretty much create and remove the objects and while i did make it sorta weird for myself to turn them into images, this was good practice for me to get more comfortable with JS//

function shoot(e) {
  let torpedoId
  let currentTorpedoIndex = currentShipIndex

  function moveTorpedo() {
    salmons[currentTorpedoIndex].classList.remove('torpedo')
    currentTorpedoIndex -= width

    if (currentTorpedoIndex < 0) {
      currentTorpedoIndex = 0;
    } else {
    salmons[currentTorpedoIndex].classList.add('torpedo')
    }
    
    if (salmons[currentTorpedoIndex].classList.contains('creature')) {
      salmons[currentTorpedoIndex].classList.remove('torpedo')
      salmons[currentTorpedoIndex].classList.remove('creature')
      salmons[currentTorpedoIndex].classList.add('boom')

      setTimeout(()=> salmons[currentTorpedoIndex].classList.remove('boom'), 400)
      clearInterval(torpedoId)

      const oceanRemoved = oceanCreature.indexOf(currentTorpedoIndex)
      creaturesRemoved.push(oceanRemoved)
      results++
      resultsDisplay.innerHTML = results
      console.log(creaturesRemoved)

    }

  }
  //keyboard command for shooting//
  switch(e.key) {
    case 's':
      torpedoId = setInterval(moveTorpedo, 100)
  }
}
//need to add the event listener for they key being pushed//
document.addEventListener('keydown', shoot)