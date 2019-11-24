/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/



var scores, roundScore, activePlayer, prevDice, winningScore;
init();



document.querySelector('.btn-roll').addEventListener('click', function(){
	//1. Random number
	dice = Math.floor(Math.random() * 6) + 1;
	//2. Display the result
	var diceDOM = document.querySelector('.dice');
	diceDOM.style.display = 'block';
	diceDOM.src = 'dice-' + dice + '.png';
	//3. Update the round score IF the rolled number was NOT a 1
	if (prevDice === 6 && dice ===6){
		scores[activePlayer] = 0;
		document.getElementById('score-' + activePlayer).textContent = '0';
		nextPlayer();
	} else if (dice !== 1) {
		//Add score
		prevDice = dice;
		roundScore += dice;
		document.querySelector('#current-' + activePlayer).textContent = roundScore;
	} else {
		//Next player
		nextPlayer();
	}
});

document.querySelector('.btn-hold').addEventListener('click', function(){
	// Add CURRENT score to GLOBAL score
	scores[activePlayer] += roundScore;
	// Update the UI
	document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
	// Check if player won the game
	if (scores[activePlayer] >= winningScore){
		//alert('player' + (activePlayer + 1) + ' won!')
		document.getElementById('name-' + activePlayer).textContent = 'Winner!';
		var winner = document.querySelector('.player-' + activePlayer + '-panel');
		winner.classList.toggle('active');
		winner.classList.add('winner');
		document.querySelector('.dice').style.display = 'none';
		document.querySelector('.btn-roll').disabled = true;
		document.querySelector('.btn-hold').disabled = true;
	} else {
		// Next player
		nextPlayer();
	}	
});

document.querySelector('.btn-new').addEventListener('click', init);


function init(){
	scores = [0, 0];
	roundScore = 0;
	activePlayer = 0;
	prevDice = 0;
	winningScore = prompt('type winningScore');

	document.querySelector('.dice').style.display = 'none';

	document.getElementById('score-0').textContent = '0';
	document.getElementById('score-1').textContent = '0';
	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';
	document.getElementById('name-0').textContent = 'Player1';
	document.getElementById('name-1').textContent = 'Player2';
	document.querySelector('.player-0-panel').classList.remove('winner', 'active');
	document.querySelector('.player-1-panel').classList.remove('winner', 'active');
	document.querySelector('.player-0-panel').classList.add('active');
	document.querySelector('.btn-roll').disabled = false;
	document.querySelector('.btn-hold').disabled = false;
}

function nextPlayer(){
	prevDice = 0;
	roundScore = 0;
	document.querySelector('#current-' + activePlayer).textContent = roundScore;
	activePlayer = (activePlayer === 0) ? 1 : 0;
	for(var i = 0; i < 2; i++)
	{
		document.querySelector('.player-' + i + '-panel')
			.classList.toggle('active');
	}
}