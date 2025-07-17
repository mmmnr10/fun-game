import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Välkommen till FunGame!</Text>
      <Text style={styles.score}>Poäng: {score}</Text>
      <Button
        title="Tryck här för poäng!"
        onPress={() => setScore(score + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282c34",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    color: "#61dafb",
    marginBottom: 20,
  },
});
