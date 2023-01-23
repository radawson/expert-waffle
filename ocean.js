const grid = document.querySelector('.grid')
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

salmons[currentShipIndex].classList.add('ship')




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
document.addEventListener('keydown', moveShip)

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
    resultsDisplay.innerHTML = 'YOU WIN'
    clearInterval(creatureId)
  }
}
creatureId = setInterval(moveCreature, 600)

function shoot(e) {
  let torpedoId
  let currentTorpedoIndex = currentShipIndex
  function moveTorpedo() {
    salmons[currentTorpedoIndex].classList.remove('torpedo')
    currentTorpedoIndex -= width
    salmons[currentTorpedoIndex].classList.add('torpedo')

    if (salmons[currentTorpedoIndex].classList.contains('creature')) {
      salmons[currentTorpedoIndex].classList.remove('torpedo')
      salmons[currentTorpedoIndex].classList.remove('creature')
      salmons[currentTorpedoIndex].classList.add('boom')

      setTimeout(()=> salmons[currentTorpedoIndex].classList.remove('boom'), 300)
      clearInterval(torpedoId)

      const oceanRemoved = oceanCreature.indexOf(currentTorpedoIndex)
      creaturesRemoved.push(oceanRemoved)
      results++
      resultsDisplay.innerHTML = results
      console.log(creaturesRemoved)

    }

  }
  switch(e.key) {
    case 'ArrowUp':
      torpedoId = setInterval(moveTorpedo, 100)
  }
}

document.addEventListener('keydown', shoot)