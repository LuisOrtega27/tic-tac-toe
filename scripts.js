'use strict'

const sqrs = document.querySelectorAll(".sqr")

const wraper = document.querySelector('.wraper')
const board = document.querySelector('.board')
const fadeDot = document.querySelector('.fade-dot')


let posi = {}
let currentTarget



window.addEventListener('mousemove', (eve)=>{
	currentTarget = eve.target
	posi = { // mouse position
		y: (eve.clientY - (fadeDot.offsetHeight / 2) - board.getBoundingClientRect().y),
		x: (eve.clientX - (fadeDot.offsetWidth  / 2) - board.getBoundingClientRect().x)
	}

	// always get te window position
	if(currentTarget.className === 'sqr'){
		// parent board
		currentTarget = currentTarget.parentElement
		// parent wraper
		currentTarget = currentTarget.parentElement

	}else if(currentTarget.className === 'board'){
		// parent wraper
		currentTarget = currentTarget.parentElement
	}

	// set dot to mouse position
	fadeDot.style.top = `${posi.y}px`
	fadeDot.style.left = `${posi.x}px`
})



const createSpan = (turn)=>{
	let content = ''

	if(turn === 'user') content = "O"  
	if(turn === 'computer') content = "X"  

	const spanElement = document.createElement('SPAN')

	spanElement.textContent = content
	
	return spanElement
}



const verifyWin = (turn)=>{

	/* patrones para ganar
	
		1 | 2 | 3
		4 | 5 | 6
		7 | 8 | 9 

	*/
	
	const patterns = [
		// horizontales
		[1,2,3],
		[4,5,6],
		[7,8,9],

		// verticales
		[1,4,7],
		[2,5,8],
		[3,6,9],

		// diagonales
		[1,5,9],
		[7,5,3]
	]
	
	let currentTurn


	for(let pos of patterns){
	
		// console.log(`>>${pos}`)

		let thisTurn = []
	
		for(let id of pos){
			id-=1

			let value = sqrs[id].classList.contains('userSelection') 

			if(turn === 'user' && value === false){
				value = null
			}

			if(turn === 'computer' && value === false){
				value = null 
			}


			thisTurn.push(value)

			console.log(thisTurn)

			if(thisTurn.length===3 && thisTurn.every( sec => sec === true)){ 
				return currentTurn = true
			}else if(thisTurn.length===3 && thisTurn.every( sec => sec === false)){
				 return currentTurn = false
			}
		}
		
		if(thisTurn.every( sec => sec === true)) return		
	}
	
	if(currentTurn) return currentTurn
}


const endAnimation = ()=>{
	console.log('Fin.')
	board.style.pointerEvents = "none";
}


const pcMove = ()=>{

	let randomNum = Math.floor(Math.random() * sqrs.length)
	let limit = 0

	while(sqrs[randomNum].classList.contains('sectedSqr')){

		randomNum = Math.floor(Math.random() * sqrs.length)

		limit++
		if(limit === 9) return

	}

	const currentTarget = sqrs[randomNum]

	currentTarget.innerHTML = null

	const spanElement = createSpan('computer')

	currentTarget.appendChild(spanElement)

	
	currentTarget.classList.add('sectedSqr')
	currentTarget.classList.add('pcSelection')
	
	board.style.pointerEvents = "all";

	let currentTurn = verifyWin('computer')
	
	if(currentTurn === false ) return endAnimation('computer')
}



const userMove = (eve)=>{
	let currentTarget = eve.target
	
	currentTarget.innerHTML = null
	
	const spanElement = createSpan('user')
	
	currentTarget.appendChild(spanElement) 

	currentTarget.classList.add('sectedSqr')
	currentTarget.classList.add('userSelection')

	
	let currentTurn = verifyWin('user')
	

	if(currentTurn === true ) return endAnimation('user')
	// console.log( currentTurn) 
	
	board.style.pointerEvents = "none";
	setTimeout( ()=>pcMove(), 1000)	
}



sqrs.forEach( sqr => sqr.addEventListener('click', userMove) )