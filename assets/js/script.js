$(document).ready(function () {

  // Header section
  // Dark mode button that changes the page to darker version with 3 classes dark-background, white-background and grey-background.
  $('.toggler').click(function () {
    $(this).toggleClass('toggler-on white-background');
    $('body').toggleClass('dark-background');
    $('.dark-mode-button').toggleClass('grey-background');
    $('.back-face').toggleClass('grey-backface');
    $('.front-face').toggleClass('grey-frontface');
    $('.how-to, #reset-btn').toggleClass('grey-background');
    switchSound.play()
  })

  // Main content
  // Card grid functionality for when user selects a card and how cards should responds when users get a match.
  // Game variables
  const deckOfCards = document.querySelectorAll('.card-item');
  let cardFlipped = false;
  let cardBoardLocked = false;
  let cardOne, cardTwo;
  let startingScore = document.getElementById('score').innerHTML;
  let playerScore = parseInt(startingScore);
  let previousScores = []
  let previousScoresEl = document.getElementById('previousScores')
  let resetBtn = document.getElementById('reset-btn')
  let cardGrid = document.getElementById('card-grid')
  let cardBoard = document.getElementById('card-board')
  let allCardsMatched = document.getElementsByClassName('flip')

  // Game Sounds
  const cardFlipSound = new Audio("assets/sounds/card-flip.wav")
  const correctSound = new Audio("assets/sounds/correct.wav")
  const wrongSound = new Audio("assets/sounds/wrong.mp3")
  const switchSound = new Audio("assets/sounds/switch.wav")
  const winSound = new Audio("assets/sounds/game-won.wav")

  function cardFlip() {
    if (cardBoardLocked) return;
    if (this === cardOne) return;

    this.classList.add('flip');
    cardFlipSound.play();

    if (!cardFlipped) {
      // First card selection
      cardFlipped = true;
      cardOne = this;

      return;
    }

    // Second card selection
    cardTwo = this;

    matchCheck();
  }

  // matchCheck() function will compare the values of data-framework attribute using strict equality and if it is true or false using the ternary operator it will either cardsDisabled() function or lockCard() function
  function matchCheck() {
    let matchFind = cardOne.dataset.framework === cardTwo.dataset.framework;

    matchFind ? cardsDisabled() : lockCard();
  }

  // cardsDisabled() function locks the cards at front face and remove the click event listener when the player has found a match.
  function cardsDisabled() {
    correctSound.play()
    cardOne.removeEventListener('click', cardFlip);
    cardTwo.removeEventListener('click', cardFlip);
    playerScore += 5;
    document.getElementById('score').innerHTML = String(playerScore);

    if (allCardsMatched.length === 12) {
      gameComplete()
    }

    gameReset();
  }

  // If the player is wrong and doesn't get match lockCard() function flips the cards back to the back card face but doesn't flip card for few seconds.
  function lockCard() {
    cardBoardLocked = true;
    wrongSound.play()

    setTimeout(() => {
      cardOne.classList.remove('flip');
      cardTwo.classList.remove('flip');
      if (playerScore <= 1) {
        playerScore = 0
        document.getElementById('score').innerHTML = String(playerScore);
      } else {
        playerScore -= 2
        document.getElementById('score').innerHTML = String(playerScore);
      }
      gameReset();
    }, 1500);
  }

  // When the user hasn't found a match its stop the player from selecting any other cards until setTimeout() function has flipped the cards back to its normal state.
  function gameReset() {
    [cardFlipped, cardBoardLocked] = [false, false];
    [cardOne, cardTwo] = [null, null];
  }

  // cardShuffle() function Will shuffle the cards in the next round that player plays.
  (function cardShuffle() {
    deckOfCards.forEach(card => {
      let mixCards = Math.floor(Math.random() * 12);
      card.style.order = mixCards;
    });
  })();

  deckOfCards.forEach(card => card.addEventListener('click', cardFlip));

  // gameRestart() will restart the game for the user.
  function gameRestart(){
    cardFlipSound.play();

    // Cardshuffle function will reshuffle the cards
    (function cardShuffle() {
      deckOfCards.forEach(card => {
        let mixCards = Math.floor(Math.random() * 12);
        card.style.order = mixCards;
      });
    })();

    // Re-adds the event listeners to the cards
    deckOfCards.forEach(card => card.addEventListener('click', cardFlip));

    // Removes flip class from card item divs so thats cards go back to showing the back face
    for (let i = 0; i < deckOfCards.length; i++) {
      deckOfCards[i].classList.remove('flip')
    }

    // Resets player score to 0
    playerScore = 0
    document.getElementById('score').innerHTML = String(playerScore);
    previousScoresEl.innerHTML = ""
  }
  

  // The reset button
  resetBtn.addEventListener('click', gameRestart)
  
  // Sweet alert pop up box that shows user previous scores and let the user play again.
  function gameComplete() {
    previousScores.unshift(playerScore)

    let score = JSON.stringify(previousScores)
    localStorage.setItem('scores', score)
    let getScores = localStorage.getItem('scores')
    score = JSON.parse(getScores)

    if(score.length > 5){
      previousScores.pop()
    }

    for(let i = 0; i < score.length; i++){
      previousScoresEl.innerHTML += `<li>Score: ${score[i]}</li>`
    }

    winSound.play()
    Swal.fire({
      icon: 'success',
      title: 'YOU FOUND ALL MATCHES',
      confirmButtonText: 'PLAY AGAIN',
      position: 'top',
    }).then((result) => {
      if (result.isConfirmed) {
        gameRestart()
      }
    })
  }
})