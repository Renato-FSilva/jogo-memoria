const imageCards = [
  { pair: "drones", content: "📸 Drone" },
  { pair: "sondagem", content: "🛠️ Sondagem" },
  { pair: "pavimentacao", content: "🚧 Pavimentação" },
];

const textCards = [
  { pair: "sondagem", content: "Processo para analisar o solo da obra." },
  { pair: "pavimentacao", content: "Camada de asfalto aplicada sobre a via." },
  { pair: "drones", content: "Uso de drones para monitoramento da obra." },
];

let firstCard = null;
let lockBoard = false;
let matches = 0;
let attempts = 0;

let shuffledImages = [];
let shuffledTexts = [];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createCards(containerId, cards) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  cards.forEach((cardData) => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.pair = cardData.pair;

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-face", "card-front");

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-face", "card-back");

    if (containerId === "text-column") {
      cardBack.innerText = cardData.content;
      const iconCard = imageCards.find(
        (imgCard) => imgCard.pair === cardData.pair
      );
      cardFront.innerText = iconCard ? iconCard.content : "Clique";
    } else {
      cardBack.innerText = "Clique";
      cardFront.innerText = cardData.content;
    }

    card.appendChild(cardFront);
    card.appendChild(cardBack);
    cardContainer.appendChild(card);
    container.appendChild(cardContainer);

    // Adiciona suporte a toques
    card.addEventListener("click", () => handleCardClick(card));
    card.addEventListener("touchstart", (e) => {
      e.preventDefault(); // Evita comportamentos padrão do toque
      handleCardClick(card);
    });
  });
}

function addCards(newImageCard, newTextCard) {
  const imageExists = imageCards.some(
    (card) => card.pair === newImageCard.pair
  );
  const textExists = textCards.some((card) => card.pair === newTextCard.pair);

  if (!imageExists && !textExists) {
    imageCards.push(newImageCard);
    textCards.push(newTextCard);
    initGame();
  } else {
    alert("Um dos pares já existe no jogo.");
  }
}

function handleCardClick(card) {
  if (lockBoard || card.classList.contains("correct")) return;

  if (card === firstCard) {
    card.classList.remove("flipped");
    firstCard = null;
    return;
  }

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    lockBoard = true;
    attempts++;
    document.getElementById("attempt-count").textContent = attempts;

    if (firstCard.dataset.pair === card.dataset.pair) {
      firstCard.classList.add("correct");
      card.classList.add("correct");
      updateScore();
      resetSelection();
    } else {
      firstCard.classList.add("wrong");
      card.classList.add("wrong");
      card.classList.add("shake"); // Adiciona efeito de shake
      setTimeout(() => {
        firstCard.classList.remove("flipped", "wrong", "shake");
        card.classList.remove("flipped", "wrong", "shake");
        resetSelection();
      }, 1000);
    }
  }
}

function resetSelection() {
  firstCard = null;
  lockBoard = false;
}

function updateScore() {
  matches++;
  document.getElementById("match-count").textContent = matches;
  document.getElementById("total-pairs").textContent = imageCards.length;

  if (matches === imageCards.length) {
    document.getElementById("message").classList.remove("hidden");
  }
}

function initGame() {
  matches = 0;
  attempts = 0;
  document.getElementById("match-count").textContent = "0";
  document.getElementById("attempt-count").textContent = "0";
  document.getElementById("total-pairs").textContent = imageCards.length;
  document.getElementById("message").classList.add("hidden");

  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    card.classList.add("fade-out");
  });

  setTimeout(() => {
    document.getElementById("images-column").innerHTML = "";
    document.getElementById("text-column").innerHTML = "";

    shuffledImages = shuffle([...imageCards]);
    shuffledTexts = shuffle([...textCards]);

    createCards("images-column", shuffledImages);
    createCards("text-column", shuffledTexts);
  }, 500);
}

// Formulário para adicionar cartas
const addCardButton = document.getElementById("add-card-button");
const addCardForm = document.getElementById("add-card-form");
const imageInput = document.getElementById("image-input");
const textInput = document.getElementById("text-input");
const submitCardButton = document.getElementById("submit-card-button");
const cancelCardButton = document.getElementById("cancel-card-button");

addCardButton.addEventListener("click", () => {
  addCardForm.classList.remove("hidden");
});

cancelCardButton.addEventListener("click", () => {
  addCardForm.classList.add("hidden");
  imageInput.value = "";
  textInput.value = "";
});

submitCardButton.addEventListener("click", () => {
  const newImage = imageInput.value.trim();
  const newText = textInput.value.trim();

  if (newImage && newText) {
    const newPair = `new-${Date.now()}`;
    addCards(
      { pair: newPair, content: newImage },
      { pair: newPair, content: newText }
    );
    imageInput.value = "";
    textInput.value = "";
    addCardForm.classList.add("hidden");
  } else {
    alert("Por favor, preencha ambos os campos.");
  }
});

window.onload = initGame;
