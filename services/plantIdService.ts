import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { PLANT_ID_API_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PLANT_ID_URL = "https://plant.id/api/v3/identification";
const HISTORIQUE_API_URL = "http://192.168.1.6:5000/add_historique";

export const identifyPlant = async (imageUri: string) => {
  try {
    // Demander l'autorisation d'accéder à la localisation
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Location permission denied");
      return null;
    }

    // Obtenir la localisation actuelle
    const location = await Location.getCurrentPositionAsync({});
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    console.log(`Localisation récupérée : ${latitude}, ${longitude}`);

    // Convert image to base64
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
      params: {
        language: "fr", // Réponse en fr
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error identifying plant:", error);
    return null;
  }
};