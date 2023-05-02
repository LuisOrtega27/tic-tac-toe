'use strict'


const GAME_BOARD = document.querySelector('.board')
const BOX_LIST = document.querySelectorAll(".box")

const fadeDot = document.querySelector('.fade-dot')

const CONFIG_BTNS = document.querySelectorAll('.config-btn')

const SCORE_INTERFACE = document.querySelectorAll('.score')

const SCORE_WINS = document.querySelector('#score-wins')
const SCORE_LOSES = document.querySelector('#score-loses')
const SCORE_DRAWS = document.querySelector('#score-draws')


const MODAL = document.querySelector('.modal')
const MODAL_MSG = document.querySelector('.modal-msg')

// modal // modal-msg


// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------


let mousePosition = {}

let turnCounter = 0

let loopCounter = 0

let gameModality = ''


// en medida de lo posible, evitar las "magic words"
const DICTIONARY = {
    turn:{
        user: "user",
        userIcon: "O",
		user2: 'user2',
        user2Icon: "X",
        computer: "computer",
        computerIcon: "X",
    } ,
    classes: {
        selected: "selected",
        Oicon: "Oicon",
        Xicon: "Xicon"
    },
	buttons:{
		reset: 'reset',
		pvp: 'pvp',
		pvc: 'pvc'
	},
	modality: {
		pvp: 'pvp',
		pvc: 'pvc'
	}
}

// lista de posiciones para ganar
const CHULETA = [
    // 0 | 1 | 2
    // 3 | 4 | 5
    // 6 | 7 | 8 
    
    // horizontales
    [0,1,2],
    [3,4,5],
    [6,7,8],

    // verticales
    [0,3,6],
    [1,4,7],
    [2,5,8],

    // diagonales
    [0,4,8],
    [2,4,6]

]

let defaultPlayerScore = [
	// horizontales
	[null,null,null],
	[null,null,null],
	[null,null,null],

	// verticales
	[null,null,null],
	[null,null,null],
	[null,null,null],

	// diagonales
	[null,null,null],
	[null,null,null]
]

const PLAYERS_SCORE = {   
    
	user: [
		// horizontales
		[null,null,null],
		[null,null,null],
		[null,null,null],

		// verticales
		[null,null,null],
		[null,null,null],
		[null,null,null],

		// diagonales
		[null,null,null],
		[null,null,null]
	],
	
	user2: [
		// horizontales
		[null,null,null],
		[null,null,null],
		[null,null,null],

		// verticales
		[null,null,null],
		[null,null,null],
		[null,null,null],

		// diagonales
		[null,null,null],
		[null,null,null]
	],

    computer: [
		// horizontales
		[null,null,null],
		[null,null,null],
		[null,null,null],

		// verticales
		[null,null,null],
		[null,null,null],
		[null,null,null],

		// diagonales
		[null,null,null],
		[null,null,null]
	]

}


// --------------------------------------------------------------------------------------------------
// ------------------------------------------ MOUSE TRAKER ------------------------------------------
// --------------------------------------------------------------------------------------------------


const handleMouseOver = ()=> {
	GAME_BOARD.addEventListener('mousemove', handleMouseMove )
}



const handleMouseMove = (event)=>{
	fadeDot.style.background = '#fff8'
	

	// calc mouse position ---------------------------------------------------------------
	mousePosition = { 
		y: (event.clientY - GAME_BOARD.getBoundingClientRect().y - (fadeDot.offsetHeight / 2)),
		x: (event.clientX - GAME_BOARD.getBoundingClientRect().x - (fadeDot.offsetWidth  / 2))
	}

	fadeDot.style.left = `${mousePosition.x}px`
	fadeDot.style.top = `${mousePosition.y}px`
	//---------------------------------------------------------------------------------------

}



const handleMouseLeave = ()=>{
	fadeDot.style.background = 'none'
}



GAME_BOARD.addEventListener('mouseover', handleMouseOver )
GAME_BOARD.addEventListener('mouseleave', handleMouseLeave )



// --------------------------------------------------------------------------------------------------
// ---------------------------------------- ANIMATIONS ----------------------------------------------
// --------------------------------------------------------------------------------------------------


const modalHandler = (msg)=>{

	if(msg === DICTIONARY.turn.user) msg = 'player_1 <br> ha ganado!'
	if(msg === DICTIONARY.turn.user2) msg = 'player_2 <br> ha ganado!'
	if(msg === DICTIONARY.turn.computer) msg = 'haz perdido!'

	MODAL_MSG.innerHTML = msg
	

	MODAL.classList.add('fade-in')
	
	MODAL.addEventListener('animationend', ()=> MODAL.classList.remove('fade-in') )
	
}


const changeScoreHandler = (index)=>{

	SCORE_INTERFACE[index].classList.add('appear-animation')
		
	SCORE_INTERFACE[index].addEventListener('animationend',()=>{
		SCORE_INTERFACE[index].classList.remove('appear-animation')
	})

}


// --------------------------------------------------------------------------------------------------
// ---------------------------------------------- GAME ----------------------------------------------
// --------------------------------------------------------------------------------------------------


const blockGameboard = (block)=>{
	BOX_LIST.forEach( box => box.style.pointerEvents = block? "none" : 'all' )
}
blockGameboard(true)



const detectDrawGame = ()=>{
	blockGameboard(true)
	console.log('IS A DRAW GAME!!!')

	changeScoreHandler(2)
	SCORE_DRAWS.textContent = parseInt(SCORE_DRAWS.textContent) + 1

	setTimeout(resetGame, 2000)

	modalHandler('es un empate!')

}



const endGame = (turn)=>{

	blockGameboard(true)

	// console.log(`'${turn}' HA GANADO!!!`)


	if(turn === DICTIONARY.turn.user){
		
		changeScoreHandler(0)
		SCORE_WINS.textContent = parseInt(SCORE_WINS.textContent) + 1

		modalHandler(turn)

	}
	
	if(turn === DICTIONARY.turn.user2 || turn === DICTIONARY.turn.computer){ 

		changeScoreHandler(1)
		SCORE_LOSES.textContent = parseInt(SCORE_LOSES.textContent) + 1 

		modalHandler(turn)

	}

	
	setTimeout(resetGame, 2000)

}



const updatePlayerScore = (PLAYER, patternIndex, id, PIndex)=>{
	
	patternIndex.forEach( (index_Y, index_X) => {	
		if( index_Y === id ) PLAYER[PIndex][index_X] = true
	})

}



const verifyPatternMatch = (turn, id)=>{
	
	const PLAYER = PLAYERS_SCORE[turn]
    
	let winner = null
    
    CHULETA.forEach((patternIndex, PIndex)=>{
		

		updatePlayerScore(PLAYER, patternIndex, id, PIndex)
		

		// en realidad esto es lo que verifica el match con los patrones
		PLAYER.forEach( index_Y =>{

			let result = index_Y.every( i => i===true )
			
			// si el patron coincide hay que hacer que el player gane
			if(result) return winner = result 
			
		})
		
    })

	// esto es solo para mostrat los posibles movimientos por consola

	console.log('------------------------------')
	console.log(`%c>>> ${turn}`, 'color: yellow; text-transform: uppercase; ')
	PLAYER.forEach( pack =>console.log(pack) )
	console.log('------------------------------\n')

	
	// retornar el valor para que el player gane o pierda.
	return winner 

}



const insertTurnIcon = (turn, selectedBox)=>{
	
	const SPAN_ELEMENT = document.createElement("SPAN")
	
    let content
    let icon
	
    if(turn === DICTIONARY.turn.user ){
		
		content = DICTIONARY.turn.userIcon
        icon = DICTIONARY.classes.Oicon

    }else if(turn === DICTIONARY.turn.user2){
		
		content = DICTIONARY.turn.user2Icon
        icon = DICTIONARY.classes.Xicon

	}else if(turn === DICTIONARY.turn.computer){
		
		content = DICTIONARY.turn.computerIcon
        icon = DICTIONARY.classes.Xicon

    }
	
    SPAN_ELEMENT.textContent = content
    
	
    selectedBox.innerHTML = null
    
    selectedBox.classList.add(DICTIONARY.classes.selected, icon)
    // console.log(content)
    selectedBox.appendChild(SPAN_ELEMENT)
    
}


// --------------------------------------------------------------------------------------------------
// ---------------------------------------- GAME TURNS ----------------------------------------------
// --------------------------------------------------------------------------------------------------


const computerTurn = ()=>{

    let randomInt = Math.floor( Math.random() * 8 )

    let selectedBox = BOX_LIST[randomInt]

    // si la caja elejida al azar ya fue seleccionada, elige otra
    while( selectedBox.classList.contains(DICTIONARY.classes.selected) ){    

		// esto es solo para evitar el bucle infinito (sin esto literal se tranca al empatar)
		loopCounter++
		if(loopCounter > 20) return
		
        randomInt = Math.floor( Math.random() * 8 )

        selectedBox = BOX_LIST[randomInt]
        
    }

    insertTurnIcon(DICTIONARY.turn.computer, selectedBox)

	// verificar que los patrones sean los correctos
	let winner = verifyPatternMatch(DICTIONARY.turn.computer, parseInt(selectedBox.id))
    if(winner) return endGame(DICTIONARY.turn.computer)

	blockGameboard(false)


	turnCounter ++
	if(turnCounter === 9) detectDrawGame()
}



const user2Turn = ({target})=>{
	
    insertTurnIcon(DICTIONARY.turn.user2, target)


	// mientras no reciba un valor no hara nada
    let winner = verifyPatternMatch(DICTIONARY.turn.user2, parseInt(target.id))
    if(winner) return endGame(DICTIONARY.turn.user2)

	BOX_LIST.forEach( box=>box.removeEventListener("click", user2Turn) )

	BOX_LIST.forEach( box=>box.addEventListener("click", userTurn) )
	
    
	turnCounter ++
	if(turnCounter === 9) detectDrawGame()
}



const userTurn = ({target})=>{

	insertTurnIcon(DICTIONARY.turn.user, target)
	
	
	// esto es solo para ver vien el resultado por consola	
    // console.clear()
	// mientras no reciba un valor no hara nada
    let winner = verifyPatternMatch(DICTIONARY.turn.user, parseInt(target.id))
    if(winner) return endGame(DICTIONARY.turn.user)
	
	
	if(gameModality === DICTIONARY.modality.pvp){
		
		BOX_LIST.forEach( box=>box.removeEventListener("click", userTurn) )
		
		// pasar al turno del segundo player
		BOX_LIST.forEach( box=>box.addEventListener("click", user2Turn) )
		
	}
	
	
	// console.log(gameModality + '===' + DICTIONARY.modality.pvc)
	if(gameModality === DICTIONARY.modality.pvc){
		blockGameboard(true)
		// pasar al turno de la computadora
		setTimeout( computerTurn, 1000)
	}
    

	turnCounter ++
	if(turnCounter === 9) detectDrawGame()
}



BOX_LIST.forEach( box=>box.addEventListener("click", userTurn) )


// --------------------------------------------------------------------------------------------------
// ------------------------------------------- BUTTONS ----------------------------------------------
// --------------------------------------------------------------------------------------------------


const resetGame = (clearAll = false)=>{

	if(gameModality === '') return
	
	PLAYERS_SCORE.user = [
		// horizontales
		[null,null,null],
		[null,null,null],
		[null,null,null],
	
		// verticales
		[null,null,null],
		[null,null,null],
		[null,null,null],
	
		// diagonales
		[null,null,null],
		[null,null,null]
	]
	PLAYERS_SCORE.user2 = [
		// horizontales
		[null,null,null],
		[null,null,null],
		[null,null,null],

		// verticales
		[null,null,null],
		[null,null,null],
		[null,null,null],

		// diagonales
		[null,null,null],
		[null,null,null]
	]
	PLAYERS_SCORE.computer = [
		// horizontales
		[null,null,null],
		[null,null,null],
		[null,null,null],

		// verticales
		[null,null,null],
		[null,null,null],
		[null,null,null],

		// diagonales
		[null,null,null],
		[null,null,null]
	]
	
	BOX_LIST.forEach( box=>box.removeEventListener("click", user2Turn) )
	BOX_LIST.forEach( box=>box.addEventListener("click", userTurn) )


	BOX_LIST.forEach( box=>{
		box.innerHTML = '<span class="defaultSpan">N</span>' 
		box.className = 'box'
	})
	
	turnCounter = 0

	blockGameboard(false)
	
	if(clearAll){
		SCORE_WINS.textContent = 0
		SCORE_LOSES.textContent = 0
		SCORE_DRAWS.textContent = 0
	}
	
}



const playerVSPlayer = (event)=>{

	CONFIG_BTNS.forEach(btn=>btn.classList.remove('active-btn'))

	event.target.classList.add('active-btn')

	gameModality = DICTIONARY.modality.pvp
	console.log(gameModality)
	blockGameboard(false)

	resetGame(true)

}



const playerVSComputer = (event)=>{
	
	CONFIG_BTNS.forEach(btn=>btn.classList.remove('active-btn'))

	event.target.classList.add('active-btn')

	gameModality = DICTIONARY.modality.pvc
	console.log(gameModality)
	blockGameboard(false)

	resetGame(true)

}



// por alguna razon los botones no responden bien aveces.
// asi que lo hice manualmente por el momento
CONFIG_BTNS[0].addEventListener('click',  resetGame)
CONFIG_BTNS[1].addEventListener('click',  playerVSPlayer)
CONFIG_BTNS[2].addEventListener('click',  playerVSComputer)
