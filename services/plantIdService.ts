import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { PLANT_ID_API_KEY } from "@env";

const PLANT_ID_URL = "https://plant.id/api/v3/identification";

export const identifyPlant = async (imageUri: string) => {
  try {
    // Demander l'autorisation d'accéder à la localisation
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission de localisation refusée");
      return null;
    }

    // Obtenir la localisation actuelle
    const location = await Location.getCurrentPositionAsync({});
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    console.log(`Localisation récupérée : ${latitude}, ${longitude}`);

    // Convertir l'image en base64
    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const requestBody = {
      images: [`data:image/jpeg;base64,${imageBase64}`], // Image encodée
      latitude: latitude,
      longitude: longitude,
      similar_images: true,
    };

    const response = await axios.post(PLANT_ID_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "Api-Key": PLANT_ID_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'identification de la plante :", error);
    return null;
  }
};
