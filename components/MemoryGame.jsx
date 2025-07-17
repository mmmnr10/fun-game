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
  const [showScoreMsg, setShowScoreMsg] = useState(false);
  const [hovered, setHovered] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    startGame();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (time === 0) {
      setGameOver(true);
      clearInterval(timerRef.current);
    }
  }, [time]);

  function startGame() {
    const doubled = [...cardsArray, ...cardsArray]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, key: index }));
    setCards(doubled);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setTime(60);
    setGameOver(false);
    setShowScoreMsg(false);

    clearInterval(timerRef.current);
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
        setShowScoreMsg(true);
        setTimeout(() => setShowScoreMsg(false), 1000);
      }

      setTimeout(() => setFlipped([]), 1000);
    }
  }

  return (
    <View style={styles.appContainer}>
      <Text style={styles.title}>Memory Game</Text>
      <Text style={styles.timer}>Tid kvar: {time} sek</Text>
      <Text style={styles.score}>Poäng: {score}</Text>
      {showScoreMsg && <Text style={styles.scoreMsg}>Bra jobbat! 🎉</Text>}

      <View style={styles.cardsContainer}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <TouchableOpacity
              key={card.key}
              activeOpacity={0.8}
              onPress={() => flipCard(index)}
              disabled={time === 0}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              style={[
                styles.card,
                isFlipped && styles.cardFlipped,
                hovered === index && styles.cardHovered,
              ]}
            >
              <Text style={styles.cardText}>
                {isFlipped ? card.value : "?"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>
            Spelet är slut! Din poäng: {score}
          </Text>
          <TouchableOpacity onPress={startGame} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Spela igen</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#282c34",
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  timer: {
    fontSize: 20,
    color: "white",
    marginBottom: 8,
  },
  score: {
    fontSize: 20,
    color: "white",
  },
  scoreMsg: {
    color: "limegreen",
    fontWeight: "bold",
    marginVertical: 10,
    fontSize: 18,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#2196F3",
    width: 70,
    height: 70,
    margin: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    transform: [{ scale: 1 }],
    transitionDuration: "300ms",
  },
  cardFlipped: {
    backgroundColor: "#4CAF50",
    shadowColor: "#0f0",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 12,
  },
  cardHovered: {
    transform: [{ scale: 1.1 }],
  },
  cardText: {
    fontSize: 36,
    color: "white",
    userSelect: "none",
  },
  gameOverContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 24,
    color: "red",
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: "#61dafb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#282c34",
  },
});
