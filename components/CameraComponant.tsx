import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import * as FileSystem from 'expo-file-system';
import { identifyPlant } from "../services/plantIdService";

export default function CameraComponent() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);  // État pour stocker l'URI de la photo
  const cameraRef = useRef<CameraView>(null);

  // Vérification des permissions
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fonction pour sauvegarder l'image dans un dossier "imgs"
  const savePicture = async (uri: string) => {
    try {
      // Créer un dossier "imgs" s'il n'existe pas
      const imgsDirectory = FileSystem.documentDirectory + 'imgs/';
      const directoryInfo = await FileSystem.getInfoAsync(imgsDirectory);

      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgsDirectory);
      }

      // Créer un nom de fichier unique pour la photo (par exemple, timestamp)
      const fileName = `photo_${Date.now()}.jpg`;
      const fileUri = imgsDirectory + fileName;

      // Copier la photo dans le dossier "imgs"
      await FileSystem.copyAsync({ from: uri, to: fileUri });

      console.log('Photo sauvegardée à :', fileUri);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la photo:', error);
    }
  };

  // Fonction pour prendre une photo et envoyer à l'API
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const pictureData = await cameraRef.current.takePictureAsync();

        if (!pictureData || !pictureData.uri) {
          console.error("Aucune photo n'a été prise.");
          return;
        }

        console.log("Photo prise:", pictureData.uri);

        // Sauvegarde locale
        await savePicture(pictureData.uri);

        // Identification avec PlantID
        const result = await identifyPlant(pictureData.uri);
        console.log("Résultat de l'identification :", result);
      } catch (error) {
        console.error("Erreur lors de la prise de photo :", error);
      }
    }
  };

  // Fonction pour changer de caméra (avant/arrière)
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      {/* Affichage de la caméra */}
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      {/* Boutons */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleCameraFacing} style={styles.button}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePicture} style={styles.button}>
          <Text style={styles.text}>Take Picture</Text>
        </TouchableOpacity>
      </View>

      {/* Affichage de la photo prise (si disponible) */}
      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.photo} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { textAlign: "center", paddingBottom: 10 },
  camera: { width: 300, height: 300 }, // Ajuste la taille pour bien afficher la caméra
  controls: { flexDirection: "row", justifyContent: "space-around", width: "100%", padding: 20 },
  button: { backgroundColor: "blue", padding: 10, borderRadius: 5 },
  text: { fontSize: 18, color: "white" },
  photo: {
    marginTop: 20, // Un petit espace entre la caméra et l'image
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
  },
});