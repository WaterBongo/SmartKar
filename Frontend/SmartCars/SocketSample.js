import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import io from "socket.io-client";

// Replace this URL with your own socket-io host, or start the backend locally
const socketEndpoint = "http://100.73.7.50:8000";

export default function App() {
  const [hasConnection, setConnection] = useState(false);

  useEffect(function didMount() {
    const socket = io(socketEndpoint, {
      transports: ["websocket"],
    });

    socket.io.on("open", () => setConnection(true));
    socket.io.on("close", () => setConnection(false));

    socket.on("message", (data) => {
      console.log(data)
    });

    return function didUnmount() {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      {!hasConnection && (
        <>
          <Text style={styles.paragraph}>
            Connecting to {socketEndpoint}...
          </Text>
          <Text style={styles.footnote}>
            Make sure the backend is started and reachable
          </Text>
        </>
      )}

      {hasConnection && (
        <>
          <Text style={[styles.paragraph, { fontWeight: "bold" }]}>
            Server time
          </Text>
          <Text style={styles.paragraph}>{time}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  paragraph: {
    fontSize: 16,
  },
  footnote: {
    fontSize: 14,
    fontStyle: "italic",
  },
});