import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { PLANT_ID_API_KEY } from "@env";

const PLANT_ID_URL = "https://plant.id/api/v3/identification";
const HISTORIQUE_API_URL = "http://172.20.10.6:5000/add_historique";

export const identifyPlant = async (imageUri: string) => {
  try {
    // Demander l'autorisation de localisation
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission de localisation refusée");
      return null;
    }

    // Obtenir la position GPS en sécurité
    let latitude = null;
    let longitude = null;

    try {
      const location = await Location.getCurrentPositionAsync({});
      latitude = location.coords.latitude;
      longitude = location.coords.longitude;
      console.log(`Localisation récupérée : ${latitude}, ${longitude}`);
    } catch (locationError) {
      console.warn("Impossible d'obtenir la localisation :", locationError);
    }

    // Convertir l'image en base64
    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Envoi à l'API Plant ID
    const response = await axios.post(
      PLANT_ID_URL,
      {
        images: [`data:image/jpeg;base64,${imageBase64}`],
        latitude,
        longitude,
        similar_images: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": PLANT_ID_API_KEY,
        },
        params: { language: "fr" },
      }
    );

    console.log("Résultat de l'identification :", response.data);

    // Vérifier si c'est bien une plante
    const isPlant = response.data?.result?.is_plant?.binary ?? false;

    // Déterminer la meilleure correspondance (toujours prendre la plus haute)
    let planteNom = "Plante inconnue";
    let predictionScore = 0;
    let imageUrl = null;

    const suggestions = response.data?.result?.classification?.suggestions || [];

    if (suggestions.length > 0) {
      const bestMatch = suggestions[0]; // Prend la meilleure correspondance même si elle est faible

      planteNom = bestMatch.plant_name || "Plante inconnue";
      predictionScore = typeof bestMatch.probability === "number" ? bestMatch.probability : 0;
      imageUrl = bestMatch?.similar_images?.[0]?.url || null;
    }

    console.log(`Plante identifiée : ${planteNom} (${(predictionScore * 100).toFixed(2)}%)`);

    // Enregistrement dans la base de données
    try {
      await axios.post(HISTORIQUE_API_URL, {
        plante_nom: planteNom,
        latitude,
        longitude,
        prediction_score: predictionScore,
        image: imageBase64,
        url: imageUrl,
      });

      console.log("Historique ajouté avec succès.");
    } catch (historyError) {
      console.error("Erreur lors de l'ajout à l'historique :", historyError);
    }

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'identification de la plante :", error);
    return null;
  }
};
