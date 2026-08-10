// =========================
// SCREENS
// =========================

const titleScreen =
  document.getElementById("title-screen");

const introScreen =
  document.getElementById("intro-screen");

const selectionScreen =
  document.getElementById("selection-screen");

const day1Screen =
  document.getElementById("day1-screen");

const day2Screen =
  document.getElementById("day2-screen");

const day3Screen =
  document.getElementById("day3-screen");

const resultsScreen =
  document.getElementById("results-screen");



// =========================
// BUTTONS
// =========================

const playButton =
  document.getElementById("play-button");

const startButton =
  document.getElementById("start-button");

const confirmButton =
  document.getElementById("confirm-selection");



// =========================
// ITEM SELECTION
// =========================

const itemButtons =
  document.querySelectorAll(".item");

const selectionCount =
  document.getElementById("selection-count");


// FIRST SELECTION

let initialSelection = [];


// FINAL SELECTION

let finalSelection = [];


// "initial" OR "final"

let selectionMode =
  "initial";


// ITEMS ALREADY USED DURING GAME

let usedItems = [];



// =========================
// RANDOMISE ITEM GRID
// =========================

function shuffleItemGrid() {

  const grid =
    document.getElementById("item-grid");

  const items =
    Array.from(
      grid.querySelectorAll(".item")
    );


  // FISHER-YATES SHUFFLE

  for (
    let i = items.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );


    [
      items[i],
      items[j]
    ] =
    [
      items[j],
      items[i]
    ];

  }


  items.forEach(function (item) {

    grid.appendChild(item);

  });

}



// =========================
// TITLE → INTRO
// =========================

playButton.addEventListener(
  "click",
  function () {

    titleScreen.classList.remove(
      "active"
    );

    introScreen.classList.add(
      "active"
    );

  }
);



// =========================
// CONTENT WARNING
// =========================

const contentWarningPopup =
  document.getElementById(
    "content-warning-popup"
  );

const contentWarningContinue =
  document.getElementById(
    "content-warning-continue"
  );

const closeContentWarning =
  document.getElementById(
    "close-content-warning"
  );



// =========================
// INTRO → CONTENT WARNING
// =========================

startButton.addEventListener(
  "click",
  function () {

    contentWarningPopup.classList.add(
      "active"
    );

  }
);



// =========================
// CLOSE CONTENT WARNING
// =========================

closeContentWarning.addEventListener(
  "click",
  function () {

    contentWarningPopup.classList.remove(
      "active"
    );

  }
);



// =========================
// CONTENT WARNING
// → INITIAL SELECTION
// =========================

contentWarningContinue.addEventListener(
  "click",
  function () {

    contentWarningPopup.classList.remove(
      "active"
    );

    introScreen.classList.remove(
      "active"
    );


    selectionMode =
      "initial";


    shuffleItemGrid();


    selectionScreen.classList.add(
      "active"
    );

  }
);



// =========================
// SELECT / DESELECT ITEMS
// =========================

itemButtons.forEach(function (button) {

  button.addEventListener(
    "click",
    function () {

      const itemName =
        button.dataset.item;


      const currentSelection =
        selectionMode === "initial"
          ? initialSelection
          : finalSelection;



      // =========================
      // DESELECT
      // =========================

      if (
        currentSelection.includes(
          itemName
        )
      ) {

        const index =
          currentSelection.indexOf(
            itemName
          );


        currentSelection.splice(
          index,
          1
        );


        button.classList.remove(
          "selected"
        );

      }



      // =========================
      // SELECT
      // =========================

      else {

        if (
          currentSelection.length < 9
        ) {

          currentSelection.push(
            itemName
          );


          button.classList.add(
            "selected"
          );

        }

      }



      // =========================
      // UPDATE COUNTER
      // =========================

      selectionCount.textContent =
        currentSelection.length +
        " / 9 selected";



      // =========================
      // ENABLE CONFIRM
      // =========================

      confirmButton.disabled =
        currentSelection.length !== 9;

    }
  );

});



// =========================
// CONFIRM ITEM SELECTION
// =========================

confirmButton.addEventListener(
  "click",
  function () {

    selectionScreen.classList.remove(
      "active"
    );



    // =========================
    // FIRST SELECTION
    // → START DAY 1
    // =========================

    if (
      selectionMode === "initial"
    ) {

      day1Screen.classList.add(
        "active"
      );

    }



    // =========================
    // FINAL SELECTION
    // → RESULTS
    // =========================

    else {

      showFinalResults();


      resultsScreen.classList.add(
        "active"
      );

    }

  }
);



// =========================
// ITEM IMAGE FILES
// =========================

const itemImages = {

  "Water":
    "water.png",

  "Torch":
    "torch.png",

  "Canned tuna":
    "canned_tuna.png",

  "Radio":
    "radio.png",

  "Spare batteries":
    "spare_batteries.png",

  "Power bank":
    "power_bank.png",

  "First aid kit":
    "first_aid_kit.png",

  "Walking shoes":
    "walking_shoes.png",

  "Warm clothing":
    "warm_clothes.png",

  "Laptop":
    "laptop2.png",

  "Book":
    "book.png",

  "Umbrella":
    "umbrella.png",

  "Slippers":
    "slippers.png",

  "Milk":
    "milk.png",

  "Desk lamp":
    "desk_lamp.png",

  "Cushion":
    "cushion.png",

  "Electric kettle":
    "electric_kettle.png",

  "Candle":
    "candle.png",

  "Eggs":
    "eggs.png",

  "Original documents":
    "original_documents.png"

};



// =========================
// ESSENTIAL ITEMS
// =========================

const essentialItems = [

  "Water",
  "Torch",
  "Canned tuna",

  "Radio",
  "Spare batteries",
  "Power bank",

  "Walking shoes",
  "Warm clothing",
  "First aid kit"

];



// =========================
// ITEM FEEDBACK
// =========================

const itemFeedback = {

  "Water":
    "Provides drinking water when normal water supplies are disrupted.",

  "Torch":
    "Provides light when electricity is unavailable.",

  "Canned tuna":
    "Provides long-lasting food that does not need cooking or refrigeration.",

  "Radio":
    "Provides important updates when internet or mobile networks are unavailable.",

  "Spare batteries":
    "Keep battery-powered emergency items working during a power outage.",

  "Power bank":
    "Helps keep your phone charged when mains power is unavailable.",

  "Walking shoes":
    "Protect your feet from broken glass and debris.",

  "Warm clothing":
    "Helps keep you warm when heating or shelter conditions are disrupted.",

  "First aid kit":
    "Provides essential supplies for first aid during an emergency.",


  "Laptop":
    "Depends on battery power and is less reliable for essential communication during an outage.",

  "Book":
    "May provide comfort or entertainment, but it is not a priority for immediate emergency needs.",

  "Umbrella":
    "May help in wet weather, but essential safety and survival items take priority.",

  "Slippers":
    "Do not provide enough protection from broken glass or debris.",

  "Milk":
    "Requires refrigeration and may spoil when electricity is unavailable.",

  "Desk lamp":
    "Usually depends on mains electricity, which may be unavailable after an earthquake.",

  "Cushion":
    "Provides comfort, but does not address an essential emergency need.",

  "Electric kettle":
    "Requires electricity and may not work during a power outage.",

  "Candle":
    "Can create a fire risk and is less suitable than a battery-powered torch.",

  "Eggs":
    "Are perishable and may require refrigeration and cooking.",

  "Original documents":
    "Keep copies of important documents and photo ID in your grab bag rather than the originals."

};



// =========================
// DAY 1 CLUES
// =========================

const day1Clues = {

  light: {

    objectSelector:
      ".light",

    popupImage:
      "popup_light.png",

    requiredItem:
      "Torch",

    resultItemImage:
      "torch.png",

    clueImage:
      "light.png",

    completed:
      false

  },


  bottle: {

    objectSelector:
      ".bottle",

    popupImage:
      "popup_bottle.png",

    requiredItem:
      "Water",

    resultItemImage:
      "water.png",

    clueImage:
      "bottle.png",

    completed:
      false

  },


  banana: {

    objectSelector:
      ".banana",

    popupImage:
      "popup_banana.png",

    requiredItem:
      "Canned tuna",

    resultItemImage:
      "canned_tuna.png",

    clueImage:
      "banana.png",

    completed:
      false

  }

};



// =========================
// DAY 2 CLUES
// =========================

const day2Clues = {

  laptop: {

    objectSelector:
      ".day2-laptop",

    popupImage:
      "popup_laptop.png",

    requiredItem:
      "Radio",

    resultItemImage:
      "radio.png",

    clueImage:
      "laptop.png",

    completed:
      false

  },


  phone: {

    objectSelector:
      ".day2-phone",

    popupImage:
      "popup_phone.png",

    requiredItem:
      "Power bank",

    resultItemImage:
      "power_bank.png",

    clueImage:
      "phone.png",

    completed:
      false

  },


  powerOutlet: {

    objectSelector:
      ".day2-power-outlet",

    popupImage:
      "popup_power_outlet.png",

    requiredItem:
      "Spare batteries",

    resultItemImage:
      "spare_batteries.png",

    clueImage:
      "power_outlet.png",

    completed:
      false

  }

};



// =========================
// DAY 3 CLUES
// =========================

const day3Clues = {

  glass: {

    objectSelector:
      ".day3-glass",

    popupImage:
      "popup_glass.png",

    requiredItem:
      "Walking shoes",

    resultItemImage:
      "walking_shoes.png",

    clueImage:
      "glass.png",

    completed:
      false

  },


  tree: {

    objectSelector:
      ".day3-tree",

    popupImage:
      "popup_tree.png",

    requiredItem:
      "Warm clothing",

    resultItemImage:
      "warm_clothes.png",

    clueImage:
      "tree.png",

    completed:
      false

  },


  neighbour: {

    objectSelector:
      ".day3-neighbour",

    popupImage:
      "popup_neighbour.png",

    requiredItem:
      "First aid kit",

    resultItemImage:
      "first_aid_kit.png",

    clueImage:
      "neighbour.png",

    completed:
      false

  }

};



// =========================
// CURRENT CLUE
// =========================

let currentClueName =
  null;

let currentClueGroup =
  null;



// =========================
// CLUE POPUP
// =========================

const cluePopup =
  document.getElementById(
    "clue-popup"
  );

const cluePopupImage =
  document.getElementById(
    "clue-popup-image"
  );

const closeCluePopup =
  document.getElementById(
    "close-clue-popup"
  );

const checkKitButton =
  document.getElementById(
    "check-kit-button"
  );



// =========================
// KIT POPUP
// =========================

const kitPopup =
  document.getElementById(
    "kit-popup"
  );

const kitItemGrid =
  document.getElementById(
    "kit-item-grid"
  );

const closeKitPopup =
  document.getElementById(
    "close-kit-popup"
  );

const notInKitButton =
  document.getElementById(
    "not-in-kit-button"
  );

const kitTargetItem =
  document.getElementById(
    "kit-target-item"
  );



// =========================
// RESULT POPUP
// =========================

const resultPopup =
  document.getElementById(
    "result-popup"
  );

const resultText =
  document.getElementById(
    "result-text"
  );

const resultItemImage =
  document.getElementById(
    "result-item-image"
  );

const resultContinueButton =
  document.getElementById(
    "result-continue-button"
  );



// =========================
// DAY COMPLETE POPUPS
// =========================

const day1CompletePopup =
  document.getElementById(
    "day1-complete-popup"
  );

const day2Button =
  document.getElementById(
    "day2-button"
  );


const day2CompletePopup =
  document.getElementById(
    "day2-complete-popup"
  );

const day3Button =
  document.getElementById(
    "day3-button"
  );


const day3CompletePopup =
  document.getElementById(
    "day3-complete-popup"
  );

const finalSelectButton =
  document.getElementById(
    "final-select-button"
  );



// =========================
// FINAL RESULTS ELEMENTS
// =========================

const beforeResults =
  document.getElementById(
    "before-results"
  );

const afterResults =
  document.getElementById(
    "after-results"
  );

const beforeScore =
  document.getElementById(
    "before-score"
  );

const afterScore =
  document.getElementById(
    "after-score"
  );

const recommendedSelected =
  document.getElementById(
    "recommended-selected"
  );

const recommendedMissed =
  document.getElementById(
    "recommended-missed"
  );

const otherSelected =
  document.getElementById(
    "other-selected"
  );

const finishButton =
  document.getElementById(
    "finish-button"
  );



// =========================
// POPUP THEME
// =========================

function setPopupTheme(popup) {

  popup.classList.remove(
    "day2-popup"
  );

  popup.classList.remove(
    "day3-popup"
  );


  // DAY 2 = PINK

  if (
    currentClueGroup ===
    day2Clues
  ) {

    popup.classList.add(
      "day2-popup"
    );

  }


  // DAY 3 = BLUE

  else if (
    currentClueGroup ===
    day3Clues
  ) {

    popup.classList.add(
      "day3-popup"
    );

  }

}



// =========================
// SET UP DAY 1 CLUES
// =========================

Object.keys(
  day1Clues
).forEach(function (clueName) {

  const clue =
    day1Clues[clueName];


  const clueObject =
    document.querySelector(
      clue.objectSelector
    );


  clueObject.addEventListener(
    "click",
    function () {

      if (
        clue.completed
      ) {

        return;

      }


      currentClueName =
        clueName;


      currentClueGroup =
        day1Clues;


      cluePopupImage.src =
        "images/" +
        clue.popupImage;


      setPopupTheme(
        cluePopup
      );


      cluePopup.classList.add(
        "active"
      );

    }
  );

});



// =========================
// SET UP DAY 2 CLUES
// =========================

Object.keys(
  day2Clues
).forEach(function (clueName) {

  const clue =
    day2Clues[clueName];


  const clueObject =
    document.querySelector(
      clue.objectSelector
    );


  clueObject.addEventListener(
    "click",
    function () {

      if (
        clue.completed
      ) {

        return;

      }


      currentClueName =
        clueName;


      currentClueGroup =
        day2Clues;


      cluePopupImage.src =
        "images/" +
        clue.popupImage;


      setPopupTheme(
        cluePopup
      );


      cluePopup.classList.add(
        "active"
      );

    }
  );

});



// =========================
// SET UP DAY 3 CLUES
// =========================

Object.keys(
  day3Clues
).forEach(function (clueName) {

  const clue =
    day3Clues[clueName];


  const clueObject =
    document.querySelector(
      clue.objectSelector
    );


  clueObject.addEventListener(
    "click",
    function () {

      if (
        clue.completed
      ) {

        return;

      }


      currentClueName =
        clueName;


      currentClueGroup =
        day3Clues;


      cluePopupImage.src =
        "images/" +
        clue.popupImage;


      setPopupTheme(
        cluePopup
      );


      cluePopup.classList.add(
        "active"
      );

    }
  );

});



// =========================
// CLOSE CLUE POPUP
// =========================

closeCluePopup.addEventListener(
  "click",
  function () {

    cluePopup.classList.remove(
      "active"
    );

  }
);



// =========================
// CHECK MY KIT
// =========================

checkKitButton.addEventListener(
  "click",
  function () {

    const clue =
      currentClueGroup[
        currentClueName
      ];


    cluePopup.classList.remove(
      "active"
    );


    setPopupTheme(
      kitPopup
    );


    kitTargetItem.textContent =
      clue.requiredItem
        .toLowerCase();


    kitItemGrid.innerHTML =
      "";


    // GAME ALWAYS USES
    // THE FIRST SELECTION

    initialSelection.forEach(
      function (itemName) {

        const itemButton =
          document.createElement(
            "button"
          );


        itemButton.classList.add(
          "kit-item"
        );


        itemButton.dataset.item =
          itemName;


        // ALREADY USED

        if (
          usedItems.includes(
            itemName
          )
        ) {

          itemButton.classList.add(
            "used"
          );


          itemButton.disabled =
            true;

        }


        const itemImage =
          document.createElement(
            "img"
          );


        itemImage.src =
          "images/" +
          itemImages[itemName];


        itemImage.alt =
          itemName;


        itemButton.appendChild(
          itemImage
        );


        kitItemGrid.appendChild(
          itemButton
        );

      }
    );


    kitPopup.classList.add(
      "active"
    );

  }
);



// =========================
// CLOSE KIT POPUP
// =========================

closeKitPopup.addEventListener(
  "click",
  function () {

    kitPopup.classList.remove(
      "active"
    );


    setPopupTheme(
      cluePopup
    );


    cluePopup.classList.add(
      "active"
    );

  }
);



// =========================
// KIT ITEM CLICK
// =========================

kitItemGrid.addEventListener(
  "click",
  function (event) {

    const itemButton =
      event.target.closest(
        ".kit-item"
      );


    if (!itemButton) {

      return;

    }


    const selectedItem =
      itemButton.dataset.item;


    const clue =
      currentClueGroup[
        currentClueName
      ];



    // =========================
    // CORRECT ITEM
    // =========================

    if (
      selectedItem ===
      clue.requiredItem
    ) {


      if (
        !usedItems.includes(
          selectedItem
        )
      ) {

        usedItems.push(
          selectedItem
        );

      }


      kitPopup.classList.remove(
        "active"
      );


      resultItemImage.src =
        "images/" +
        clue.resultItemImage;


      resultText.textContent =
        "PREPARED";


      resultText.classList.remove(
        "not-prepared"
      );


      resultText.classList.add(
        "prepared"
      );


      completeClue(
        currentClueName,
        true
      );


      setPopupTheme(
        resultPopup
      );


      resultPopup.classList.add(
        "active"
      );

    }



    // =========================
    // WRONG ITEM
    // =========================

    else {

      showWrongBubble(
        itemButton
      );

    }

  }
);



// =========================
// NOT IN MY KIT
// =========================

notInKitButton.addEventListener(
  "click",
  function () {

    const clue =
      currentClueGroup[
        currentClueName
      ];


    kitPopup.classList.remove(
      "active"
    );


    resultItemImage.src =
      "images/" +
      clue.resultItemImage;


    resultText.textContent =
      "NOT PREPARED";


    resultText.classList.remove(
      "prepared"
    );


    resultText.classList.add(
      "not-prepared"
    );


    completeClue(
      currentClueName,
      false
    );


    setPopupTheme(
      resultPopup
    );


    resultPopup.classList.add(
      "active"
    );

  }
);



// =========================
// RESULT → CHECK DAY COMPLETE
// =========================

resultContinueButton.addEventListener(
  "click",
  function () {

    resultPopup.classList.remove(
      "active"
    );



    // DAY 1

    if (
      currentClueGroup ===
      day1Clues
    ) {

      if (
        checkDay1Complete()
      ) {

        day1CompletePopup
          .classList
          .add("active");

      }

    }



    // DAY 2

    else if (
      currentClueGroup ===
      day2Clues
    ) {

      if (
        checkDay2Complete()
      ) {

        day2CompletePopup
          .classList
          .add("active");

      }

    }



    // DAY 3

    else if (
      currentClueGroup ===
      day3Clues
    ) {

      if (
        checkDay3Complete()
      ) {

        day3CompletePopup
          .classList
          .add("active");

      }

    }

  }
);



// =========================
// DAY 1 → DAY 2
// =========================

day2Button.addEventListener(
  "click",
  function () {

    day1CompletePopup
      .classList
      .remove("active");


    day1Screen.classList.remove(
      "active"
    );


    day2Screen.classList.add(
      "active"
    );

  }
);



// =========================
// DAY 2 → DAY 3
// =========================

day3Button.addEventListener(
  "click",
  function () {

    day2CompletePopup
      .classList
      .remove("active");


    day2Screen.classList.remove(
      "active"
    );


    day3Screen.classList.add(
      "active"
    );

  }
);



// =========================
// DAY 3 COMPLETE
// → FINAL SELECTION
// =========================

finalSelectButton.addEventListener(
  "click",
  function () {


    selectionMode =
      "final";


    // CLEAR FINAL SELECTION

    finalSelection =
      [];


    // REMOVE OLD SELECTION STYLES

    itemButtons.forEach(
      function (button) {

        button.classList.remove(
          "selected"
        );

      }
    );


    // RESET COUNTER

    selectionCount.textContent =
      "0 / 9 selected";


    // DISABLE CONFIRM

    confirmButton.disabled =
      true;


    // RANDOMISE AGAIN

    shuffleItemGrid();


    // CLOSE COMPLETE POPUP

    day3CompletePopup
      .classList
      .remove("active");


    // HIDE DAY 3

    day3Screen.classList.remove(
      "active"
    );


    // SHOW SELECTION

    selectionScreen.classList.add(
      "active"
    );

  }
);



// =========================
// COMPLETE CLUE
// =========================

function completeClue(
  clueName,
  isPrepared
) {

  const clue =
    currentClueGroup[
      clueName
    ];


  clue.completed =
    true;


  let statusSlot;



  // DAY 1

  if (
    currentClueGroup ===
    day1Clues
  ) {

    statusSlot =
      document.querySelector(
        "#day1-screen .clue-slot:empty"
      );

  }



  // DAY 2

  else if (
    currentClueGroup ===
    day2Clues
  ) {

    statusSlot =
      document.querySelector(
        "#day2-screen .clue-slot:empty"
      );

  }



  // DAY 3

  else if (
    currentClueGroup ===
    day3Clues
  ) {

    statusSlot =
      document.querySelector(
        "#day3-screen .clue-slot:empty"
      );

  }


  if (!statusSlot) {

    return;

  }



  // RESULT CONTAINER

  const result =
    document.createElement(
      "div"
    );


  result.classList.add(
    "status-result"
  );



  // CLUE IMAGE

  const clueImage =
    document.createElement(
      "img"
    );


  clueImage.src =
    "images/" +
    clue.clueImage;


  clueImage.alt =
    clueName;



  // CHECK / X

  const mark =
    document.createElement(
      "div"
    );


  mark.classList.add(
    "status-mark"
  );


  if (isPrepared) {

    mark.textContent =
      "✓";


    mark.classList.add(
      "correct"
    );

  }

  else {

    mark.textContent =
      "✖";


    mark.classList.add(
      "incorrect"
    );

  }


  result.appendChild(
    clueImage
  );


  result.appendChild(
    mark
  );


  statusSlot.appendChild(
    result
  );

}



// =========================
// WRONG ITEM SPEECH BUBBLE
// =========================

function showWrongBubble(
  itemButton
) {

  const oldBubble =
    document.querySelector(
      ".wrong-bubble"
    );


  if (oldBubble) {

    oldBubble.remove();

  }


  const bubble =
    document.createElement(
      "div"
    );


  bubble.classList.add(
    "wrong-bubble"
  );


  bubble.textContent =
    "Not this one";


  itemButton.appendChild(
    bubble
  );


  setTimeout(
    function () {

      bubble.remove();

    },
    900
  );

}



// =========================
// CHECK DAY 1 COMPLETION
// =========================

function checkDay1Complete() {

  return Object
    .values(day1Clues)
    .every(
      function (clue) {

        return clue.completed;

      }
    );

}



// =========================
// CHECK DAY 2 COMPLETION
// =========================

function checkDay2Complete() {

  return Object
    .values(day2Clues)
    .every(
      function (clue) {

        return clue.completed;

      }
    );

}



// =========================
// CHECK DAY 3 COMPLETION
// =========================

function checkDay3Complete() {

  return Object
    .values(day3Clues)
    .every(
      function (clue) {

        return clue.completed;

      }
    );

}



// =====================================================
// FINAL RESULTS
// =====================================================


// =========================
// SHOW FINAL RESULTS
// =========================

function showFinalResults() {

  // CLEAR OLD CONTENT

  beforeResults.innerHTML =
    "";

  afterResults.innerHTML =
    "";

  recommendedSelected.innerHTML =
    "";

  recommendedMissed.innerHTML =
    "";

  otherSelected.innerHTML =
    "";



  // =========================
  // BEFORE
  // =========================

  const initialRecommended =
    initialSelection.filter(
      function (itemName) {

        return essentialItems.includes(
          itemName
        );

      }
    );


  beforeScore.textContent =
    initialRecommended.length +
    " / 9 essential items selected";


  initialSelection.forEach(
    function (itemName) {

      createResultCard(
        beforeResults,
        itemName
      );

    }
  );



  // =========================
  // AFTER
  // =========================

  const finalRecommended =
    finalSelection.filter(
      function (itemName) {

        return essentialItems.includes(
          itemName
        );

      }
    );


  afterScore.textContent =
    finalRecommended.length +
    " / 9 recommended items selected";


  finalSelection.forEach(
    function (itemName) {

      createResultCard(
        afterResults,
        itemName
      );

    }
  );



  // =========================
  // RECOMMENDED ITEMS
  // YOU SELECTED
  // =========================

  finalRecommended.forEach(
    function (itemName) {

      createFeedbackItem(
        recommendedSelected,
        itemName
      );

    }
  );


  if (
    finalRecommended.length === 0
  ) {

    recommendedSelected.innerHTML =
      '<div class="feedback-empty">' +
      'No recommended items selected.' +
      '</div>';

  }



  // =========================
  // RECOMMENDED ITEMS
  // YOU MISSED
  // =========================

  const missedItems =
    essentialItems.filter(
      function (itemName) {

        return !finalSelection.includes(
          itemName
        );

      }
    );


  missedItems.forEach(
    function (itemName) {

      createFeedbackItem(
        recommendedMissed,
        itemName
      );

    }
  );


  if (
    missedItems.length === 0
  ) {

    recommendedMissed.innerHTML =
      '<div class="feedback-empty">' +
      'You selected all 9 recommended items.' +
      '</div>';

  }



  // =========================
  // OTHER ITEMS SELECTED
  // =========================

  const otherItems =
    finalSelection.filter(
      function (itemName) {

        return !essentialItems.includes(
          itemName
        );

      }
    );


  otherItems.forEach(
    function (itemName) {

      createFeedbackItem(
        otherSelected,
        itemName
      );

    }
  );


  if (
    otherItems.length === 0
  ) {

    otherSelected.innerHTML =
      '<div class="feedback-empty">' +
      'No other items selected.' +
      '</div>';

  }

}



// =========================
// CREATE BEFORE / AFTER CARD
// =========================

function createResultCard(
  container,
  itemName
) {

  const card =
    document.createElement(
      "div"
    );


  card.classList.add(
    "result-item-card"
  );


  // RECOMMENDED ITEM

  if (
    essentialItems.includes(
      itemName
    )
  ) {

    card.classList.add(
      "recommended"
    );


    const check =
      document.createElement(
        "div"
      );


    check.classList.add(
      "result-check"
    );


    check.textContent =
      "✓";


    card.appendChild(
      check
    );

  }



  // IMAGE

  const image =
    document.createElement(
      "img"
    );


  image.src =
    "images/" +
    itemImages[itemName];


  image.alt =
    itemName;



  // NAME

  const name =
    document.createElement(
      "span"
    );


  name.textContent =
    itemName;



  card.appendChild(
    image
  );


  card.appendChild(
    name
  );


  container.appendChild(
    card
  );

}



// =========================
// CREATE FEEDBACK ITEM
// =========================

function createFeedbackItem(
  container,
  itemName
) {

  const item =
    document.createElement(
      "div"
    );


  item.classList.add(
    "feedback-item"
  );



  // IMAGE

  const image =
    document.createElement(
      "img"
    );


  image.src =
    "images/" +
    itemImages[itemName];


  image.alt =
    itemName;



  // TEXT CONTAINER

  const text =
    document.createElement(
      "div"
    );


  text.classList.add(
    "feedback-item-text"
  );



  // ITEM NAME

  const name =
    document.createElement(
      "div"
    );


  name.classList.add(
    "feedback-item-name"
  );


  name.textContent =
    itemName;



  // REASON

  const reason =
    document.createElement(
      "div"
    );


  reason.classList.add(
    "feedback-item-reason"
  );


  reason.textContent =
    itemFeedback[itemName];



  text.appendChild(
    name
  );


  text.appendChild(
    reason
  );


  item.appendChild(
    image
  );


  item.appendChild(
    text
  );


  container.appendChild(
    item
  );

}