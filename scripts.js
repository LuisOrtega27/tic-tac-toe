
let sqrs = document.querySelectorAll(".sqr")
console.log(sqrs)


let isUserTurn = true 

const handleComputerTurn = ()=>{
	
}



const handleUserTurn= (e)=>{

	let currentSqr

	if(isUserTurn == true){
		currentSqr =  e.target
	}

	else{

		hasBeenSelected = true

		while(hasBeenSelected){

			let randomNum = Math.round(Math.random()*8)

			currentSqr = sqrs[randomNum]
	    	
	    	
	    	// if(currentSqr.classList.contains("selected")){

	    	// }

	    	console.log(currentSqr, randomNum)
	    	console.log(currentSqr.classList.contains("selected"))

	    	currentSqr.classList.add("selected")

	    	console.log(currentSqr.classList.contains("selected"))

	    	if(currentSqr.classList.contains("selected")){
			
				hasBeenSelected = false	    	

	    	}
		}



	}


    const spanElement = document.createElement("SPAN")
    spanElement.textContent= isUserTurn? "O" : "X" // esto tiene que cambiar con cada turno
    currentSqr.innerHTML=null
    currentSqr.appendChild(spanElement)
    currentSqr.classList.add("selected", isUserTurn? "userSelection" : "ComputerSelection")
    
    isUserTurn = !isUserTurn
    // console.log(`box-${currentSqr.id}`)
}



sqrs.forEach( sqr => {
    sqr.addEventListener("click", handleUserTurn)
})




















