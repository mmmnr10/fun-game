import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

  function startTimer() {
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t === 0) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  // Starta nytt spel
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
    startTimer();
  }

  // Körs en gång när komponenten mountas - starta spel och timer
  useEffect(() => {
    resetGame();
    return () => clearInterval(timerRef.current);
  }, []);

  // När tiden tar slut, sätt gameOver till true
  useEffect(() => {
    if (time === 0) {
      setGameOver(true);
    }
  }, [time]);

  function flipCard(index) {
    if (time === 0 || gameOver) return;
    if (
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
        setMatched([...matched, ...newFlipped]);
        setScore(score + 1);
      }

      setTimeout(() => setFlipped([]), 1000);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Tid kvar: {time} sek</Text>
      <Text style={styles.score}>Poäng: {score}</Text>
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <TouchableOpacity
              key={card.key}
              style={[styles.card, isFlipped && styles.flipped]}
              onPress={() => flipCard(index)}
              activeOpacity={0.8}
              disabled={time === 0 || gameOver}
            >
              <Text style={styles.cardText}>
                {isFlipped ? card.value : "?"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {gameOver && (
        <>
          <Text style={styles.gameOver}>
            Spelet är slut! Din poäng: {score}
          </Text>
          <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Starta om spelet</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: "center",
    flex: 1,
  },
  timer: {
    fontSize: 22,
    marginBottom: 10,
  },
  score: {
    fontSize: 22,
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#61dafb",
    width: 70,
    height: 70,
    margin: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  flipped: {
    backgroundColor: "#21a1f1",
  },
  cardText: {
    fontSize: 32,
  },
  gameOver: {
    marginTop: 30,
    fontSize: 24,
    color: "red",
    textAlign: "center",
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#21a1f1",
    borderRadius: 8,
  },
  resetButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
