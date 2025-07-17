import { useEffect, useRef, useState } from "react";

const cardsArray = [
  { id: 1, value: "🐶" },
  { id: 2, value: "🐱" },
  { id: 3, value: "🦊" },
  { id: 4, value: "🐰" },
  { id: 5, value: "🐼" },
  { id: 6, value: "🐸" },
];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (time === 0) {
      setGameOver(true);
      clearInterval(timerRef.current);
    }
  }, [time]);

  function resetGame() {
    const doubled = [...cardsArray, ...cardsArray]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, key: index }));
    setCards(doubled);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setTime(60);
    setGameOver(false);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
  }

  function flipCard(index) {
    if (
      time === 0 ||
      flipped.length === 2 ||
      flipped.includes(index) ||
      matched.includes(index)
    )
      return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];
      if (firstCard.value === secondCard.value) {
        setMatched((prev) => [...prev, ...newFlipped]);
        setScore((prev) => prev + 1);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: 30 }}>
      <h1>Memory Game 🧠</h1>
      <p>Time left: {time} seconds</p>
      <p>Score: {score}</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 400,
          margin: "auto",
        }}
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <div
              key={card.key}
              onClick={() => flipCard(index)}
              style={{
                width: 70,
                height: 70,
                margin: 10,
                borderRadius: 8,
                backgroundColor: isFlipped ? "#21a1f1" : "#61dafb",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
                cursor: time === 0 ? "not-allowed" : "pointer",
                userSelect: "none",
              }}
            >
              {isFlipped ? card.value : "?"}
            </div>
          );
        })}
      </div>
      {gameOver && (
        <>
          <h2 style={{ color: "red" }}>Game Over! Your score: {score}</h2>
          <button
            onClick={resetGame}
            style={{ fontSize: 18, padding: "10px 20px" }}
          >
            Play Again
          </button>
        </>
      )}
    </div>
  );
}
