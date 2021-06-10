$(document).ready(function () {

  // Header section
  // Dark mode button that changes the page to darker version with 3 classes dark-background, white-background and grey-background.
  $('.toggler').click(function () {
    $(this).toggleClass('toggler-on white-background');
    $('body').toggleClass('dark-background');
    $('.dark-mode-button').toggleClass('grey-background');
    $('.back-face').toggleClass('grey-backface');
    $('.front-face').toggleClass('grey-frontface');
    $('.how-to, .reset, .no-reset').toggleClass('grey-background');
  })

  // Main content
  // Card grid functionality for when user selects a card and how cards should responds when users get a match.
  const deckOfCards = document.querySelectorAll('.card-item');
  let cardFlipped = false;
  let cardBoardLocked = false;
  let cardOne, cardTwo;
  let startingScore = document.getElementById('score').innerHTML;
  let playerScore = parseInt(startingScore);
  let allMatchesFound = document.querySelectorAll('.flip').length;
  

  function cardFlip() {
    if (cardBoardLocked) return;
    if (this === cardOne) return;

    this.classList.add('flip');

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
    cardOne.removeEventListener('click', cardFlip);
    cardTwo.removeEventListener('click', cardFlip);
    playerScore += 5;
    document.getElementById('score').innerHTML = String(playerScore);
    gameReset();
  }

  // If the player is wrong and doesn't get match lockCard() function flips the cards back to the back card face but doesn't flip card for few seconds.
  function lockCard() {
    cardBoardLocked = true;

    setTimeout(() => {
      cardOne.classList.remove('flip');
      cardTwo.classList.remove('flip');
      if (playerScore <= 0) {
        playerScore = 0
        document.getElementById('score').innerHTML = String(playerScore);
      } else {
        playerScore -= 2
        document.getElementById('score').innerHTML = String(playerScore);
      }
      gameReset();
    }, 1500);
  }

  // When the user has found match that doesn't match its stop the player from selecting any other cards until setTimeout() function has flipped the cards back to its normal state.
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

  // When the game ends give the user sweetalert to tell them that they've won.
  let allCardsFlipped = document.getElementsByClassName('card-item flip').length
  
  if(allCardsFlipped === 12){
    // Show alert
  } else{
    // Do nothing
  }
})