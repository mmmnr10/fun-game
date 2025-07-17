import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function About() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>About Screen</Text>
      <Link href="/" style={{ marginTop: 20, fontSize: 18, color: "blue" }}>
        Tillbaka till Home
      </Link>
    </View>
  );
}
