import { Text, View } from "react-native";
import { Button, ButtonText } from '@/components/ui/button';

export default function Index() {

  const handleCallDB = async () => {
    try {
      let res = await fetch("http://10.18.207.184:8080/db");
      let data = await res.json();
      if (!res.ok) {
        console.error("Erreur serveur:", data);
        alert(`Erreur: ${data.message}\n\nTraceback:\n${data.traceback}`);
        return;
      }
      console.log("Réponse OK:", data);
    } catch (err) {
      console.error("Impossible de contacter le back", err);
    } finally {
      console.log("end");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button variant="solid" size="lg" action="primary" className="bg-red-400" onPress={handleCallDB}>
        <ButtonText>Click me</ButtonText>
      </Button>
    </View>
  );
}
