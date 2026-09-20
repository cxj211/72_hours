// =====================================================
// 72 HOURS — REVIEW MINI-GAME
// Current clean version
// =====================================================
//
// Later, when merged with the main game, call:
//
//   startReviewGame(finalSelection);
//
// This game never blocks because of a wrong final selection.
// Every drop resolves one situation and consumes one item.
// Correct  -> image changes to AFTER image.
// Incorrect -> BEFORE image stays and a red X is shown.
//
// Timer:
// - 60 seconds total
// - Full-screen brick-wall background
// - 36 horizontal wall rows
// - every 5 seconds: 3 rows collapse (all 36 rows by 60 sec)
// - wrong choice: 3 additional rows collapse immediately + 5 seconds penalty
// - wall collapses from TOP to BOTTOM
// - the right-side timer is a thin numeric strip only
//
// Retry is unlimited.
// =====================================================


// -------------------------
// ITEM IMAGE FILES
// Same names as the main game
// -------------------------
const reviewItemImages = {
  "Water": "water.png",
  "Torch": "torch.png",
  "Canned food": "canned_tuna.png",
  "Radio": "radio.png",
  "Spare batteries": "spare_batteries.png",
  "Power bank": "power_bank.png",
  "First aid kit": "first_aid_kit.png",
  "Walking shoes": "walking_shoes.png",
  "Warm clothing": "warm_clothes.png",

  "Laptop": "laptop2.png",
  "Book": "book.png",
  "Umbrella": "umbrella.png",
  "Slippers": "slippers.png",
  "Milk": "milk.png",
  "Desk lamp": "desk_lamp.png",
  "Cushion": "cushion.png",
  "Electric kettle": "electric_kettle.png",
  "Candle": "candle.png",
  "Eggs": "eggs.png",
  "Original documents": "original_documents.png",
"Rope": "rope.png",
"Toolbox": "toolbox.png",
"Lighter": "lighter.png",
"Thermos": "thermos.png"
};


// -------------------------
// NINE SITUATIONS
// -------------------------
const reviewSteps = [
  {
    key: "light",
    correctItem: "Torch",
    before: "review_light_before.png",
    after: "review_light_after.png",
    beforeText: "Room is dark",
    afterText: "Light available"
  },

  {
    key: "bottle",
    correctItem: "Water",
    before: "review_bottle_before.png",
    after: "review_bottle_after.png",
    beforeText: "No drinking water",
    afterText: "Enough water stored"
  },

  {
    key: "banana",
    correctItem: "Canned food",
    before: "review_banana_before.png",
    after: "review_banana_after.png",
    beforeText: "Food is spoiled",
    afterText: "Food that lasts"
  },

  {
    key: "laptop",
    correctItem: "Radio",
    before: "review_laptop_before.png",
    after: "review_laptop_after.png",
    beforeText: "Need news updates",
    afterText: "News available"
  },

  {
    key: "phone",
    correctItem: "Power bank",
    before: "review_phone_before.png",
    after: "review_phone_after.png",
    beforeText: "Phone is running low",
    afterText: "Phone stays charged"
  },

  {
    key: "powerOutlet",
    correctItem: "Spare batteries",
    before: "review_power_outlet_before.png",
    after: "review_power_outlet_after.png",
    beforeText: "No electricity",
    afterText: "Power for devices"
  },

  {
    key: "glass",
    correctItem: "Walking shoes",
    before: "review_glass_before.png",
    after: "review_glass_after.png",
    beforeText: "Glass on the floor",
    afterText: "Feet are protected"
  },

  {
    key: "tree",
    correctItem: "Warm clothing",
    before: "review_tree_before.png",
    after: "review_tree_after.png",
    beforeText: "Cold and windy",
    afterText: "Warm and protected"
  },

  {
    key: "neighbour",
    correctItem: "First aid kit",
    before: "review_neighbour_before.png",
    after: "review_neighbour_after.png",
    beforeText: "Neighbour is injured",
    afterText: "Injuries treated"
  }
];


// -------------------------
// STANDALONE TEST KIT
// Change items here to test wrong answers.
// -------------------------
const testSelection = [
  "Torch",
  "Water",
  "Canned food",
  "Radio",
  "Power bank",
  "Spare batteries",
  "Walking shoes",
  "Warm clothing",
  "First aid kit"
];

// -------------------------
// SOUND EFFECTS
// -------------------------
const sounds = {
  button: new Audio("sound/button.mp3"),
  doorSlide: new Audio("sound/door_slide.mp3"),
  rightItem: new Audio("sound/right_item.mp3"),
  wrongItem: new Audio("sound/wrong_item.mp3"),
  wallCrumble: new Audio("sound/wall_crumble.mp3"),
  prepared: new Audio("sound/prepared.mp3"),
  unprepared: new Audio("sound/unprepared.mp3")
};

sounds.button.volume = 0.5;
sounds.doorSlide.volume = 0.4;
sounds.rightItem.volume = 0.3;
sounds.wrongItem.volume = 0.1;
sounds.wallCrumble.volume = 0.25;
sounds.prepared.volume = 0.15;
sounds.unprepared.volume = 0.1;


function playReviewSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}


// -------------------------
// SETTINGS
// -------------------------
const TOTAL_SECONDS = 60;
const WALL_STRIPS = 12;
const NATURAL_COLLAPSE_EVERY_MS = 5000;


// -------------------------
// STATE
// -------------------------
let currentStep = 0;
let reviewSelection = [];
let reviewResults = [];

let locked = false;
let reviewFinished = false;

let timerStartedAt = null;
let timerAnimationFrame = null;
let naturalCollapseInterval = null;

let collapsedStrips = 0;
let naturallyCollapsedStrips = 0;
let penaltySeconds = 0;


// -------------------------
// ELEMENTS
// -------------------------
const inventory =
  document.getElementById("inventory");

const scenarioCards =
  [...document.querySelectorAll(".scenario-card")];

const routeArrows =
  [...document.querySelectorAll(".route-arrow, .turn-arrow")];

const clockHand =
  document.getElementById("clock-hand");

const storyHours =
  document.getElementById("story-hours");

const dayPassed =
  document.getElementById("day-passed");

const backgroundBricks =
  document.getElementById("background-bricks");

const backgroundWall =
  document.getElementById("background-wall");

const backgroundWallDust =
  document.querySelector(".background-wall-dust");

const numericTimer =
  document.getElementById("numeric-timer");

const endStatusCard =
  document.getElementById("end-status-card");

const resultScrollClosed =
  document.getElementById("result-scroll-closed");

const endStatusIcon =
  document.getElementById("end-status-icon");

const endStatusTitle =
  document.getElementById("end-status-title");

const endStatusText =
  document.getElementById("end-status-text");

const introPopup =
  document.getElementById("intro-popup");

const reviewStartButton =
  document.getElementById("review-start-button");

const retryButton =
  document.getElementById("retry-button");

const endSecondaryButton =
  document.getElementById("end-secondary-button");


// =====================================================
// START / RESET
// =====================================================

function startReviewGame(selection, showIntro = true) {

  stopTimer();

  currentStep = 0;
  reviewResults = [];
  reviewSelection = [...selection];

  locked = showIntro;
  reviewFinished = false;

  collapsedStrips = 0;
naturallyCollapsedStrips = 0;
penaltySeconds = 0;

endStatusCard.classList.remove(
  "show",
  "success",
  "timeout",
  "zero",
  "flash"
);
  resultScrollClosed.style.display = "block";
  endStatusIcon.textContent = "";
  endStatusTitle.textContent = "";
  endStatusText.textContent = "";
  endSecondaryButton.textContent = "SEE MY RESULTS";
  endSecondaryButton.dataset.action = "results";

  resetScenarioCards();
  buildInventory(reviewSelection);
  buildWall();

  resetStoryClock();
  activateCurrentCard();

  if (showIntro) {
    introPopup.classList.add("active");
  }
  else {
    introPopup.classList.remove("active");
    startTimer();
  }
}


// =====================================================
// RESET SCENARIOS
// =====================================================

function resetScenarioCards() {

  scenarioCards.forEach((card) => {

    const index =
      Number(card.dataset.step);

    const data =
      reviewSteps[index];

    const image =
  card.querySelector("img");

const caption =
  card.querySelector(".scenario-caption");

image.src =
  "images/" + data.before;

image.style.opacity = "1";

caption.textContent =
  data.beforeText;

caption.style.color = "";  

    card.classList.remove(
      "active",
      "drag-over",
      "resolved",
      "success",
      "failure"
    );

    card.dataset.attempted = "";
card.dataset.placedInventoryIndex = "";

  });

  

  routeArrows.forEach((arrow) => {
    arrow.classList.remove("active-arrow");
  });
}


// =====================================================
// INVENTORY
// =====================================================

function buildInventory(selection) {

  inventory.innerHTML = "";


  // Make a copy so the original selection order is not changed.
  const shuffledSelection =
    [...selection];


  // Fisher-Yates shuffle.
  for (
    let i = shuffledSelection.length - 1;
    i > 0;
    i -= 1
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );


    [
      shuffledSelection[i],
      shuffledSelection[j]
    ] = [
      shuffledSelection[j],
      shuffledSelection[i]
    ];
  }


  shuffledSelection.forEach(
    function (itemName, index) {

      const item =
        document.createElement("div");

      item.className =
        "inventory-item";

      item.draggable =
        true;

      item.dataset.item =
        itemName;

      item.dataset.inventoryIndex =
        index;


      const image =
        document.createElement("img");

      image.src =
        "images/" +
        reviewItemImages[itemName];

      image.alt =
        itemName;

      image.draggable =
        false;


      const label =
        document.createElement("span");

      label.textContent =
        itemName;


      item.appendChild(image);
      item.appendChild(label);

      inventory.appendChild(item);


      item.addEventListener(
        "dragstart",
        handleDragStart
      );

      item.addEventListener(
        "dragend",
        handleDragEnd
      );
    }
  );
}


// =====================================================
// CURRENT BOX + OUTGOING ARROW
// =====================================================

function activateCurrentCard() {

  if (
    currentStep >=
    reviewSteps.length
  ) {

    finishReview();

    return;
  }
}


// =====================================================
// DRAG
// =====================================================

function handleDragStart(event) {

  if (
    locked ||
    reviewFinished ||
    event.currentTarget
      .classList
      .contains("used")
  ) {

    event.preventDefault();

    return;
  }


  const item =
    event.currentTarget;


  event.dataTransfer.setData(
    "text/plain",
    item.dataset.inventoryIndex
  );


  event.dataTransfer.effectAllowed =
    "move";


  item.classList.add(
    "dragging"
  );
}


function handleDragEnd(event) {

  event.currentTarget
    .classList
    .remove("dragging");


  scenarioCards.forEach(
    function (card) {

      card.classList.remove(
        "drag-over"
      );
    }
  );
}


// =====================================================
// DROP ZONE EVENTS
// =====================================================

scenarioCards.forEach(
  function (card) {

    card.addEventListener(
      "dragover",
      function (event) {

        if (
  locked ||
  reviewFinished ||
  card.classList.contains(
    "success"
  )
) {

  return;
}


        event.preventDefault();

        event.dataTransfer.dropEffect =
          "move";


        card.classList.add(
          "drag-over"
        );
      }
    );


    card.addEventListener(
      "dragleave",
      function () {

        card.classList.remove(
          "drag-over"
        );
      }
    );


    card.addEventListener(
      "drop",
      handleDrop
    );
  }
);


// =====================================================
// HANDLE DROP
// =====================================================

function handleDrop(event) {

  event.preventDefault();

  const card =
    event.currentTarget;


  // Correct cards are final.
  // Wrong/unanswered cards can still receive another item.
  if (
    locked ||
    reviewFinished ||
    card.classList.contains("success")
  ) {
    return;
  }


  const inventoryIndex =
    event.dataTransfer.getData(
      "text/plain"
    );


  const item =
    inventory.querySelector(
      '.inventory-item[data-inventory-index="' +
      inventoryIndex +
      '"]'
    );


  if (
    !item ||
    item.classList.contains("used")
  ) {
    return;
  }


  locked = true;

  card.classList.remove(
    "active",
    "drag-over"
  );


  const itemName =
    item.dataset.item;


  const stepIndex =
    Number(card.dataset.step);

  const step =
    reviewSteps[stepIndex];


  const isCorrect =
    itemName ===
    step.correctItem;


  // -------------------------------------------------
  // Has this box already had an item placed in it?
  // -------------------------------------------------

  const wasAlreadyAttempted =
    card.dataset.attempted === "true";


  // -------------------------------------------------
  // If this box already contains a WRONG item,
  // return that old item to YOUR KIT.
  // -------------------------------------------------

  const previousInventoryIndex =
    card.dataset.placedInventoryIndex;


  if (
    previousInventoryIndex !== undefined &&
    previousInventoryIndex !== ""
  ) {

    const previousItem =
      inventory.querySelector(
        '.inventory-item[data-inventory-index="' +
        previousInventoryIndex +
        '"]'
      );


    if (previousItem) {

      previousItem.classList.remove(
        "used"
      );

      previousItem.draggable =
        true;
    }
  }


  // -------------------------------------------------
  // New item is now placed in this box.
  // -------------------------------------------------

  item.classList.add(
    "used"
  );

  item.draggable =
    false;


  card.dataset.placedInventoryIndex =
    inventoryIndex;

  card.dataset.attempted =
    "true";


  // Remove previous result appearance before
  // showing the new result.
  card.classList.remove(
    "resolved",
    "success",
    "failure"
  );


  // -------------------------------------------------
  // Record this attempt
  // -------------------------------------------------

  reviewResults.push({
    step:
      step.key,

    itemUsed:
      itemName,

    correctItem:
      step.correctItem,

    correct:
      isCorrect,

    retry:
      wasAlreadyAttempted
  });


  // -------------------------------------------------
  // CORRECT
  // -------------------------------------------------

  if (isCorrect) {

    resolveCorrect(
      card,
      step
    );
  }


  // -------------------------------------------------
  // WRONG
  // -------------------------------------------------

  else {

    resolveIncorrect(
      card
    );


    // Wrong choice =
    // 3 extra wall rows + 5-second penalty.
    collapseExtraBrick();
  }


  // -------------------------------------------------
  // STORY CLOCK
  //
  // IMPORTANT:
  // The clock advances ONLY the first time
  // a situation receives an item.
  //
  // Example:
  // 3 boxes attempted = 24 hours.
  // Re-dropping on one of those boxes
  // keeps the clock at 24 hours.
  // -------------------------------------------------

  if (!wasAlreadyAttempted) {

    currentStep += 1;

    updateStoryClock(
      currentStep
    );
  }


  window.setTimeout(
  function () {

    locked = false;


    // Finish as soon as all 9 situations
    // have received an item.
    if (
      currentStep >= reviewSteps.length
    ) {

      finishReview();

      return;
    }

  },
  620
);
}


// =====================================================
// CORRECT
// =====================================================

function resolveCorrect(
  card,
  step
) {

  playReviewSound(sounds.rightItem);

  const image =
    card.querySelector(
      "img"
    );

  const text =
  card.querySelector(
    ".scenario-caption"
  );


  card.classList.add(
    "resolved",
    "success"
  );


  image.style.opacity =
    "0.36";


  window.setTimeout(
    function () {

      image.src =
        "images/" +
        step.after;

      image.style.opacity =
        "1";

      if (text) {
  text.textContent =
    step.afterText;

  text.style.color =
    "#2836D9";
}

    },
    130
  );
}


// =====================================================
// INCORRECT
// =====================================================

function resolveIncorrect(
  card
) {

  playReviewSound(sounds.wrongItem);

  card.classList.remove(
    "resolved",
    "success"
  );

  card.classList.add(
    "failure"
  );
}


// =====================================================
// 72-HOUR STORY CLOCK
// 3 boxes = one full revolution = one day
// =====================================================

function resetStoryClock() {

  clockHand.style.transition =
    "none";

  clockHand.style.transform =
    "rotate(0deg)";


  // Force reflow so transition returns cleanly.
  void clockHand.offsetWidth;


  clockHand.style.transition = "";


  storyHours.textContent =
  "";


  dayPassed.textContent =
    "";

  dayPassed.classList.remove(
    "pop"
  );
}


function updateStoryClock(
  completedCount
) {

  const storyHour =
    completedCount * 8;


  // 8h -> 8 o'clock, 16h -> 4 o'clock, 24h -> 12 o'clock.
  // Keep the numeric angle cumulative so the hand always travels clockwise.
  const degrees =
    completedCount * 240;


  clockHand.style.transform =
    "rotate(" +
    degrees +
    "deg)";


  storyHours.textContent =
    storyHour +
    " HOURS PASSED";


  if (
    completedCount === 3
  ) {

    showDayMessage(
      "1 DAY PASSED"
    );
  }

  else if (
    completedCount === 6
  ) {

    showDayMessage(
      "2 DAYS PASSED"
    );
  }

  else if (
    completedCount === 9
  ) {

    showDayMessage(
      "3 DAYS PASSED"
    );
  }

  else {

    const fullDays =
      Math.floor(
        completedCount / 3
      );

    dayPassed.textContent =
      fullDays === 0
        ? ""
        : fullDays === 1
          ? "1 DAY PASSED"
          : fullDays + " DAYS PASSED";
  }
}


function showDayMessage(
  message
) {

  dayPassed.textContent =
    message;


  dayPassed.classList.remove(
    "pop"
  );


  void dayPassed.offsetWidth;


  dayPassed.classList.add(
    "pop"
  );
}


// =====================================================
// WALL TIMER
// =====================================================

function buildWall() {

  backgroundBricks.innerHTML = "";

  for (let i = 1; i <= WALL_STRIPS; i += 1) {

    const strip =
      document.createElement("img");

    strip.className =
      "brick-strip";

    strip.src =
      "images/brick_" +
      String(i).padStart(2, "0") +
      ".png";

    strip.alt = "";

    strip.draggable = false;

    strip.dataset.strip =
      i - 1;

    backgroundBricks.appendChild(strip);
  }

  numericTimer.classList.remove(
    "warning"
  );

  numericTimer.textContent =
    "01:00";
}


// =====================================================
// START 60 SECOND TIMER
// =====================================================

function startTimer() {

  stopTimer();


  timerStartedAt =
    performance.now();


  // Natural wall collapse every 5 seconds.
  naturalCollapseInterval =
    window.setInterval(
      function () {

        if (
          reviewFinished
        ) {

          return;
        }


        naturallyCollapsedStrips += 1;

collapseBrickStrip();

if (
  collapsedStrips >=
  WALL_STRIPS
) {

  timeoutReview();
}

      },
      NATURAL_COLLAPSE_EVERY_MS
    );


  updateTimerFrame();
}


// =====================================================
// VISUAL COUNTDOWN
// =====================================================

function updateTimerFrame() {

  if (
    reviewFinished ||
    timerStartedAt === null
  ) {

    return;
  }


  const elapsed =
    (
      performance.now() -
      timerStartedAt
    ) / 1000;


  const remaining =
    Math.max(
      0,
      TOTAL_SECONDS -
      elapsed -
      penaltySeconds
    );


  const wholeSeconds =
    Math.ceil(
      remaining
    );


  const minutes =
  Math.floor(
    wholeSeconds / 60
  );

const seconds =
  wholeSeconds % 60;


numericTimer.textContent =
  String(minutes).padStart(2, "0") +
  ":" +
  String(seconds).padStart(2, "0");


  if (
    remaining <= 10
  ) {

    numericTimer.classList.add(
      "warning"
    );
  }

  else {

    numericTimer.classList.remove(
      "warning"
    );
  }


  if (
    remaining <= 0
  ) {

    timeoutReview();

    return;
  }


  timerAnimationFrame =
    requestAnimationFrame(
      updateTimerFrame
    );
}


// =====================================================
// COLLAPSE
// =====================================================

function collapseBrickStrip() {

  const strips =
    [...backgroundBricks.querySelectorAll(
      ".brick-strip"
    )];

  const strip =
    strips[collapsedStrips];

  if (!strip) {
    return;
  }

  playReviewSound(sounds.wallCrumble);

  strip.classList.add(
    "collapsed-strip"
  );

  collapsedStrips += 1;

  triggerBackgroundWallDust();

  if (
    collapsedStrips > WALL_STRIPS
  ) {

    collapsedStrips =
      WALL_STRIPS;
  }
}


// Wrong answer = 3 additional rows immediately + 5 seconds.
function collapseExtraBrick() {

  penaltySeconds += 5;

  collapseBrickStrip();

  if (
    collapsedStrips >=
    WALL_STRIPS
  ) {

    timeoutReview();
  }
}


function triggerBackgroundWallDust() {

  backgroundWallDust.classList.remove(
    "burst"
  );

  void backgroundWallDust.offsetWidth;

  backgroundWallDust.classList.add(
    "burst"
  );
}


// =====================================================
// STOP TIMER
// =====================================================

function stopTimer() {

  if (
    timerAnimationFrame
  ) {

    cancelAnimationFrame(
      timerAnimationFrame
    );


    timerAnimationFrame =
      null;
  }


  if (
    naturalCollapseInterval
  ) {

    clearInterval(
      naturalCollapseInterval
    );


    naturalCollapseInterval =
      null;
  }


  timerStartedAt =
    null;
}


// =====================================================
// TIME OUT
// =====================================================

function timeoutReview() {

  if (
    reviewFinished
  ) {

    return;
  }


  reviewFinished = true;
  locked = true;

  stopTimer();

  playReviewSound(sounds.unprepared);

  numericTimer.textContent = "00:00";


  scenarioCards.forEach(
    function (card) {
      card.classList.remove(
        "active",
        "drag-over"
      );
    }
  );

  routeArrows.forEach(
    function (arrow) {
      arrow.classList.remove(
        "active-arrow"
      );
    }
  );

  resultScrollClosed.style.display = "none";
  endStatusIcon.textContent = "!";
  endStatusTitle.textContent = "TIME'S UP";
  endStatusText.textContent = "The wall collapsed\nbefore you reached the end.";
  endSecondaryButton.textContent = "SEE MY RESULTS";
  endSecondaryButton.dataset.action = "results";
  endStatusCard.classList.remove("success");
  endStatusCard.classList.add("show", "timeout", "flash");
}


// =====================================================
// FINISH
// =====================================================

function finishReview() {

  if (
    reviewFinished
  ) {

    return;
  }


  reviewFinished = true;
  locked = true;

  stopTimer();


  const correctCards =
    scenarioCards.filter(
      function (card) {

        return card.classList.contains(
          "success"
        );
      }
    ).length;

    if (correctCards === 0) {
  playReviewSound(sounds.unprepared);
} else {
  playReviewSound(sounds.prepared);
}


  resultScrollClosed.style.display =
    "none";

  endStatusIcon.textContent =
    "✓";

  endStatusTitle.textContent =
    "COMPLETE";


  // -----------------------------------------
  // RESULT MESSAGE
  // -----------------------------------------

  if (
    correctCards === 0
  ) {

    endStatusText.textContent =
      "But none of the situations were matched correctly.";
  }

  else if (
  correctCards === reviewSteps.length
) {

  endStatusText.innerHTML =
    "You matched all 9<br>situations correctly.";
}

else {

  endStatusText.innerHTML =
    "You matched " +
    correctCards +
    " of 9<br>situations correctly.";
}


  endSecondaryButton.textContent =
    "SEE MY RESULTS";

  endSecondaryButton.dataset.action =
    "results";


  // -----------------------------------------
  // RESULT COLOUR
  // -----------------------------------------

  endStatusCard.classList.remove(
    "timeout",
    "success",
    "zero"
  );


  if (
    correctCards === 0
  ) {

    endStatusCard.classList.add(
      "show",
      "zero",
      "flash"
    );
  }

  else {

    endStatusCard.classList.add(
      "show",
      "success",
      "flash"
    );
  }


  console.log(
    "Review results:",
    reviewResults
  );
}


reviewStartButton.addEventListener(
  "click",
  function () {

    if (
      introPopup.classList.contains("opening")
    ) {
      return;
    }

    playReviewSound(sounds.button);
playReviewSound(sounds.doorSlide);

    introPopup.classList.add("opening");

    reviewStartButton.disabled = true;


    window.setTimeout(
      function () {

        introPopup.classList.remove(
          "active",
          "opening"
        );

        reviewStartButton.disabled = false;

        locked = false;

        startTimer();

      },
      1000
    );
  }
);

// =====================================================
// BUTTONS
// =====================================================

// Unlimited retry from either success or time-up state.
retryButton.addEventListener(
  "click",
  function () {

    playReviewSound(sounds.button);

    startReviewGame(
      reviewSelection,
      false
    );
  }
);

function onReviewComplete() {

  stopTimer();

  openFinalResults();

}

endSecondaryButton.addEventListener(
  "click",
  function () {

    playReviewSound(sounds.button);

    onReviewComplete();
  }
);



