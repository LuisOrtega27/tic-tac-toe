'use strict'


const GAME_BOARD = document.querySelector('.board')
const BOX_LIST = document.querySelectorAll(".box")

const fadeDot = document.querySelector('.fade-dot')
fadeDot.style.transition= 'background 0.6s ease'


let mousePosition = {}

let turnCounter = 0

let loopCounter = 0



// en medida de lo posible, evitar las "magic words"
const DICTIONARY = {
    turn:{
        user: "user",
        userIcon: "O",
        computer: "computer",
        computerIcon: "X",
    } ,
    classes: {
        selected: "selected",
        Oicon: "Oicon",
        Xicon: "Xicon"
    },
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



const blockGameboard = (block)=>{
	BOX_LIST.forEach( box => box.style.pointerEvents = block? "none" : 'all' )
}



const detectDrawGame = ()=>{
	blockGameboard(true)
	console.log('IS A DRAW GAME!!!')
}


const endGame = (turn)=>{
	blockGameboard(true)
	console.log(`'${turn}' HA GANADO!!!`)
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


	turnCounter ++
	if(turnCounter === 9) detectDrawGame()
	
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

}



const userTurn = ({target})=>{
    
    insertTurnIcon(DICTIONARY.turn.user, target)


	// esto es solo para ver vien el resultado por consola	
    console.clear()
	// mientras no reciba un valor no hara nada
    let winner = verifyPatternMatch(DICTIONARY.turn.user, parseInt(target.id))
    if(winner) return endGame(DICTIONARY.turn.user)

	blockGameboard(true)
	
	// pasar al turno de la computadora
    setTimeout( computerTurn, 1000)
    
}



BOX_LIST.forEach( box=>box.addEventListener("click", userTurn) )