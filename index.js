let totalMatches = 2; // Define the number of matches needed
let cardsCount = 4; // Define the total number of cards

let firstCard = undefined;
let secondCard = undefined;
let clicks = 0;
let pairsMatched = 0;
let gameTimer = undefined;

const startGame = () => {
  $(".card").on("click", handleCardClick);
  $("#start-btn").prop("disabled", true);
  $("#reset-btn").prop("disabled", false);
  startTimer();
};

const resetGame = () => {
  $(".card").off("click");
  $(".card").removeClass("flip");
  $("#start-btn").prop("disabled", false);
  $("#reset-btn").prop("disabled", true);
  resetTimer();
  resetGameStats();
};

const handleCardClick = function () {
  if ($(this).hasClass("flip") || $(this).hasClass("matched")) {
    return;
  }

  if (firstCard && secondCard) {
    return;
  }

  $(this).toggleClass("flip");

  if (!firstCard) {
    firstCard = $(this);
  } else {
    secondCard = $(this);
    clicks++;
    updateGameStats();

    if (firstCard.data("pokemon") === secondCard.data("pokemon")) {
      handleMatchedCards();
    } else {
      setTimeout(() => {
        flipCards();
      }, 500);
    }
  }
};





const handleMatchedCards = () => {
  firstCard.addClass("matched");
  secondCard.addClass("matched");

  firstCard.off("click");
  secondCard.off("click");

  pairsMatched++;
  firstCard = undefined;
  secondCard = undefined;

  if (pairsMatched === totalMatches) {
    handleGameWin();
  } 
};

const flipCardsBack = () => {
  firstCard.toggleClass("flip");
  secondCard.toggleClass("flip");

  firstCard = undefined;
  secondCard = undefined;
};


const flipCards = () => {
  setTimeout(() => {
    firstCard.toggleClass("flip");
    secondCard.toggleClass("flip");

    firstCard = undefined;
    secondCard = undefined;
  }, 500);
};

const handleGameWin = () => {
  stopTimer();
  $(".card").off("click");
  $("#start-btn").prop("disabled", false);
  $("#reset-btn").prop("disabled", true);
  setTimeout(() => {
    alert("Congratulations! You've won the game!");
  }, 500);};

const updateGameStats = () => {
  $("#clicks").text("Clicks: " + clicks);
  $("#pairs-left").text("Pairs Left: " + (totalMatches - pairsMatched));
  $("#pairs-matched").text("Pairs Matched: " + pairsMatched);
  $("#total-pairs").text("Total Pairs: " + totalMatches);
};

const resetGameStats = () => {
  clicks = 0;
  pairsMatched = 0;
  updateGameStats();
};

const startTimer = () => {
  let startTime = Date.now();
  gameTimer = setInterval(() => {
    let elapsedTime = Date.now() - startTime;
    let seconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    $("#timer").text("Time: " + minutes + ":" + seconds);
  }, 1000);
};

const stopTimer = () => {
  clearInterval(gameTimer);
};

const resetTimer = () => {
  stopTimer();
  $("#timer").text("Time: 0:00");
};

const setup = () => {
  $(".card").on("click", function () {
    $(this).toggleClass("flip");

    if (!firstCard) {
      firstCard = $(this).find(".front_face");
    } else {
      secondCard = $(this).find(".front_face");
      console.log(firstCard, secondCard);
      if (firstCard.attr("src") === secondCard.attr("src")) {
        console.log("match");
        $(this).off("click");
        firstCard = undefined;
        secondCard = undefined;
      } else {
        console.log("no match");
        setTimeout(() => {
          $(this).toggleClass("flip");
          firstCard.parent().toggleClass("flip");
          firstCard = undefined;
          secondCard = undefined;
        }, 500);
      }
    }
  });
};

const generateCards = (count) => {
  // Remove all existing cards
  $(".card").remove();

  // Generate new cards
  for (let i = 0; i < count; i++) {
    const card = `
    <div class="card">
        <img class="front_face" alt="" src="">
        <img class="back_face" src="back.webp" alt="">
    </div>`;
    $('#game_grid').append(card);
  }
};




const loadCards = () => {
  $.ajax({
    url: "https://pokeapi.co/api/v2/pokemon?limit=151",
    success: (response) => {
      const pokemon = response.results;

      // Pick random unique Pokémon
      const randomPokemon = [];
      while (randomPokemon.length < totalMatches) {
        const index = Math.floor(Math.random() * pokemon.length);
        const poke = pokemon[index];
        if (!randomPokemon.some(p => p.name === poke.name)) {
          randomPokemon.push(poke);
        }
      }

      // Duplicate the random Pokémon to have enough cards
      const cardPokemon = [];
      for (let i = 0; i < cardsCount; i++) {
        cardPokemon.push(randomPokemon[i % totalMatches]);
      }

      // Shuffle the card Pokémon array
      for (let i = cardPokemon.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPokemon[i], cardPokemon[j]] = [cardPokemon[j], cardPokemon[i]];
      }

      // Assign images to the front faces of the cards
      $(".card").each((index, element) => {
        const name = cardPokemon[index].name;
        const id = cardPokemon[index].url.split("/")[6];
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
      
        const frontFace = $(element).find(".front_face");
        frontFace.attr("src", imgUrl);
      
        // Add data-pokemon attribute
        $(element).data("pokemon", name);
      });
    }
  });
};

$("#easy-btn").on("click", function() {
  cardsCount = 4;
  totalMatches = 2;
  generateCards(cardsCount);
  loadCards();
});

$("#medium-btn").on("click", function() {
  cardsCount = 6;
  totalMatches = 3;
  generateCards(cardsCount);
  loadCards();
});

$("#hard-btn").on("click", function() {
  cardsCount = 12;
  totalMatches = 6;
  generateCards(cardsCount);  loadCards();

});


$(document).ready(() => {
  $.ajax({
    url: "https://pokeapi.co/api/v2/pokemon?limit=151",
    success: (response) => {
      const pokemon = response.results;

      // Pick random unique Pokémon
      const randomPokemon = [];
      while (randomPokemon.length < totalMatches) {
        const index = Math.floor(Math.random() * pokemon.length);
        const poke = pokemon[index];
        if (!randomPokemon.some(p => p.name === poke.name)) {
          randomPokemon.push(poke);
        }
      }

      // Duplicate the random Pokémon to have enough cards
      const cardPokemon = [];
      for (let i = 0; i < cardsCount; i++) {
        cardPokemon.push(randomPokemon[i % totalMatches]);
      }

      // Shuffle the card Pokémon array
      for (let i = cardPokemon.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPokemon[i], cardPokemon[j]] = [cardPokemon[j], cardPokemon[i]];
      }

      // Assign images to the front faces of the cards
      $(".card").each((index, element) => {
        const name = cardPokemon[index].name;
        const id = cardPokemon[index].url.split("/")[6];
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
      
        const frontFace = $(element).find(".front_face");
        frontFace.attr("src", imgUrl);
      
        // Add data-pokemon attribute
        $(element).data("pokemon", name);
      });
    }
  });

  $("#power-up-btn").on("click", function() {
    $(".card").addClass("flip");
  
    setTimeout(() => {
      $(".card").removeClass("flip");
    }, 2000);
  });

  
  function toggleDarkMode() {
    document.body.classList.toggle('dark');
  }
  

  const setup = () => {};

  $("#start-btn").on("click", startGame);
  $("#reset-btn").on("click", resetGame);

  $("#start-btn").on("click", function() {
    $("#easy-btn").prop("disabled", true);
    $("#medium-btn").prop("disabled", true);
    $("#hard-btn").prop("disabled", true);
  });
  
  
  // On Game Reset
  $("#reset-btn").on("click", function() {
    $("#easy-btn").prop("disabled", false);
    $("#medium-btn").prop("disabled", false);
    $("#hard-btn").prop("disabled", false);
  });

  $("#toggle-dark-mode-btn").on("click", toggleDarkMode);

});
