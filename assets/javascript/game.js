var images = [
  "assets/images/redgem.png",
  "assets/images/bluegem.png",
  "assets/images/yellowgem.png",
  "assets/images/purplegem.png",
  "assets/images/greengem.png"
]

var sounds = [
  "assets/sounds/steelsword.mp3",
  "assets/sounds/sword1.mp3",
  "assets/sounds/swordecho.mp3",
  "assets/sounds/swordraw.mp3",
  "assets/sounds/wv_sword.mp3"
]
// This is another way the single song can be added.
// var audio1 = new Audio("assets/sounds/steelsword.mp3");

var targetScore; //gets Random number from function newTargetScore()
var randomCystals; //gets Random numbers from function getCrystalNum () and pass as Argument to generate_New_Game(randomCystals)
var totalScore;
var wins = 0;
$('#wins').html("<b>Wins:</b>  " + wins);
var loses = 0;
$('#loses').html("<b>Loses:</b> " + loses);
var alert;
$('#alert').html("<b>Well, these Gems ain't gone click themselves!</b>");
var audioWin = new Audio("assets/sounds/win.mp3");
var audioLose = new Audio("assets/sounds/failure.mp3");
var number = 40; //number of Seconds user has to reach targetScore
$('#show-number').html(number + " <h5><b>seconds Left to reach the Target Score!</b></h5>");
var intervalId; //var for the second decrement
var isTimerRunning = false;


//                   FUNCTION MAP/FLOWCHART
//
// generate_New_Game() set isTimerRunning back to False and invokes
//       generate_New_Crystal_Imgs()  & onClickRunAgain()
//
// onClickRunAgain() sets isTimerRunning to true and invokes
//        runTimer(), gemsToGo() and win() || lose()
//
// Win() || lose() invokes
//         noClick_After_Win_Lose() && resetGame()
//
// resetGame()  listens for Keycode 32 (Spacebar) and invokes
//       generate_New_Game()  and the cycle continues
//
// runTimer invokes
// decrement() and stopClock()



//First function that starts new game as well as updates calls
//generate_New_Crystal_Imgs() and onClickRunAgain()
generate_New_Game(randomCystals)

////////////////////The game itself/////////////////////////////

///function generate_New_Crystal_Imgs empties the DOM each game and recreates
// the imageCrystals to be added back.  It is called by the generate_New_Game ()
// that passes in randomCystals as in 5 position array of random numbeer between 1-12
function generate_New_Crystal_Imgs() {
  $("#crystals").empty();
  for (var i = 0; i < randomCystals.length; i++) {
    var imageCrystal = $("<img>");
    imageCrystal.addClass("crystal-image");
    imageCrystal.attr("src", images[i]);
    imageCrystal.attr("data-crystalValue", randomCystals[i]);
    imageCrystal.attr("data-soundValue", sounds[i]);
    $("#crystals").append(imageCrystal);

  }
}

// onClickRunAgain () is an anonymous fuction wrapped in a fuction
// this was done becuase as the DOM is empty the .on"Click" needs to be Added
//back to imageCrystal.  This function is called by generate_New_Game()
function onClickRunAgain() {
  $(".crystal-image").on("click", function() {
    // another way this could have be written Event Delegation
    // on( events [, selector ] [, data ], handler )
    // $("#crystals").on("click", ".crystal-image", function(){

    var crystalValue = ($(this).attr("data-crystalValue"));
    crystalValue = parseInt(crystalValue);
    totalScore += crystalValue;
    $('#total_score').html("<b>Total Score:</b>  " + totalScore);

    var audio1 = new Audio($(this).attr("data-soundValue"));

    audio1.play();

    gemsToGo()

    if (isTimerRunning === false) {
      runTimer()
    }

    if (totalScore === targetScore) {
      wins++
      $('#wins').html("<b>Wins:</b>  " + wins);
      noClick_After_Win_Lose()
      winGame()
    } else if (totalScore > targetScore) {
      loses++
      $('#loses').html("<b>Loses:</b> " + loses);
      noClick_After_Win_Lose()
      loseGame()
    }
  });
}


//generate_New_Game() resets all the orginal Vars
//invokes generate_New_Crystal_Imgs() and the onClickRunAgain()
function generate_New_Game() {
  targetScore = newTargetScore()
  $('#target_score').html("<b>Target Score:</b> " + targetScore);
  totalScore = 0;
  $('#total_score').html("<b>Score:</b>  " + totalScore);
  number = 40;
  $('#show-number').html(number + " <h5><b>seconds Left to reach the Target Score!</b></h5>");
  randomCystals = getCrystalNum();
  // console.log(randomCystals);
  isTimerRunning = false
  generate_New_Crystal_Imgs()
  onClickRunAgain()
  $("#playAgain").removeClass('showPlayAgainButton blink');
  $("#playAgain").addClass('hidePlayAgainButton');
  $('#show-number').removeClass("blink1");
}

// resetGame() waits and listens for the spacebar to be depressed
// when depressed it removes any classes added during the win() || lose()
// invokes generate_New_Game()
//
// UPDATE For users to play on mobile, resetGame() waits and listens for click button defined in
// winGame() || loseGame() and it removes any classes added during the win() || lose()
// invokes generate_New_Game()

function resetGame() {
  // $("#playAgain").addEventListener("click", function() {
  // if (event.keyCode === 32) {
  targetScore = newTargetScore();
  $('#target_score').html("<b>Target Score:</b> " + targetScore);
  totalScore = 0;
  $('#total_score').html("<b>Total Score:</b>  " + totalScore);
  $('#crystals').removeClass("blink2");
  $('#alert').removeClass("blink");
  $('#alert').html("<b>Well, these Gems ain't gone click themselves!</b>");
  generate_New_Game()
  // }
  // });
}

// getCrystalNum() creates an array of 5 random numbers betweeen 1-12 that will
// not match each other.  getCrystalNum is set each to randomCystals in the
// generate_New_Game ()
function getCrystalNum() {
  var crystalValues = [];
  while (crystalValues.length < 5) {
    var randNum = Math.floor(Math.random() * 12) + 1;
    if (crystalValues.includes(randNum)) continue;
    crystalValues.push(randNum);
  }
  return crystalValues;
}


//generates new random Target Score
function newTargetScore() {
  var target = Math.floor(Math.random() * 101) + 19;
  return target
}

// Win a user wins the game winGame() is invoked
// classes to add animation are called and the clicking of
// crystals is turned off by invoking the noClick_After_Win_Lose()
// resetGame() is invoked

// Update  instead of adding a addEventListener for the spacebar in resetGame()
// I added a on.click fuction to a button the was hidden but revealed after a win or
// lose.  This was added becuase some  users play on mobile devices and there is no
// spacebar.  After the button is clicked the reset function is called and the button is
// hidden again at the start of a new game.

function winGame() {
  $('#crystals').addClass("blink2");
  $('#alert').addClass("blink");
  $('#alert').html("You Win!!! Click Play Again to play more.");
  audioWin.play();
  noClick_After_Win_Lose()
  $("#playAgain").removeClass('hidePlayAgainButton');
  $("#playAgain").addClass('showPlayAgainButton blink');
  $("#playAgain").on("click", function() {
    resetGame()
  });
}

// Win a user loses the game winGame() is invoked
// classes to add animation are called and the clicking of
// crystals is turned off by invoking the noClick_After_Win_Lose()
// resetGame() is invoked

// Update  instead of adding a addEventListener for the spacebar in resetGame()
// I added a on.click fuction to a button the was hidden but revealed after a win or
// lose.  This was added becuase some  users play on mobile devices and there is no
// spacebar.  After the button is clicked the reset function is called and the button is
// hidden again at the start of a new game.

function loseGame() {
  $('#crystals').addClass("blink2");
  $('#alert').addClass("blink");
  $('#alert').html("You Lose, Click Play Again to try once more");
  audioLose.play();
  noClick_After_Win_Lose()
  $("#playAgain").removeClass('hidePlayAgainButton');
  $("#playAgain").addClass('showPlayAgainButton blink');
  $("#playAgain").on("click", function() {
    resetGame()
  });

}

//Turns of the .onClick is reset by generate_New_Game()
function noClick_After_Win_Lose() {
  $(".crystal-image").click(function() {
    $(".crystal-image").off("click");
  });
}

//notifies the user of number of gems left  to reach targetScore
// invoked by the onClickRunAgain() each click updates the number of gems left
function gemsToGo() {
  var gemsLeft = targetScore - totalScore;
  $('#alert').html(gemsLeft + " <b>Gems to Go...Keep Clicking!!!</b>");
}

// runTimer() runs count down timer only if isTimerRunning =true
function runTimer() {
  isTimerRunning = true;
  intervalId = setInterval(decrement, 1000);
}

// decrement() decreases clock timer by -1. And sets if statment for if times runs out
function decrement() {
  number--;
  $("#show-number").html(number + " <h6><b>Seconds Left to reach the Target Score!</b></h6>");

  if (number < 10) {
    $('#show-number').addClass("blink1");
  }

  if (totalScore < targetScore && number === 0) {
    loses++
    $('#loses').html("<b>Loses:</b> " + loses);
    loseGame()
    stopClock()

  } else if (totalScore === targetScore && number !== 0) {
    winGame()
    stopClock()
  } else if (totalScore > targetScore && number !== 0) {
    stopClock()
  }
}

//stopClock clears the clock timer
function stopClock() {
  clearInterval(intervalId)
}
