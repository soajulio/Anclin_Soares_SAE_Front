import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { PLANT_ID_API_KEY } from "@env";

const PLANT_ID_URL = "https://plant.id/api/v3/identification";
const HISTORIQUE_API_URL = "http://192.168.1.6:5000/add_historique";

export const identifyPlant = async (imageUri: string) => {
  try {
    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Location permission denied");
      return null;
    }

    // Get GPS location safely
    let latitude = null;
    let longitude = null;

    try {
      const location = await Location.getCurrentPositionAsync({});
      latitude = location.coords.latitude;
      longitude = location.coords.longitude;
      console.log(`Location retrieved: ${latitude}, ${longitude}`);
    } catch (locationError) {
      console.warn("Unable to retrieve location:", locationError);
    }

    // Convert image to base64
    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Send to Plant ID API
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

    console.log("Identification result:", response.data);

    // Check if it's a plant
    const isPlant = response.data?.result?.is_plant?.binary ?? false;

    // Determine the best match
    let planteNom = "Plante inconnue";
    let predictionScore = 0;
    let imageUrl = null;

    const suggestions = response.data?.result?.classification?.suggestions || [];

    if (suggestions.length > 0) {
      const bestMatch = suggestions[0]; // Always take the highest match

      planteNom = bestMatch.name || "Plante inconnue"; // Use 'name' instead of 'plant_name'
      predictionScore = typeof bestMatch.probability === "number" ? bestMatch.probability : 0;
      imageUrl = bestMatch?.similar_images?.[0]?.url || null;
    }

    console.log(`Identified plant: ${planteNom} (${(predictionScore * 100).toFixed(2)}%)`);

    // Save to database only if prediction score is greater than 45%
    if (predictionScore > 0.45) {
      try {
        await axios.post(HISTORIQUE_API_URL, {
          plante_nom: planteNom,
          latitude,
          longitude,
          prediction_score: predictionScore,
          image: imageBase64,
          url: imageUrl,
        });

        console.log("Successfully added to history.");
      } catch (historyError) {
        console.error("Error adding to history:", historyError);
      }
    } else {
      console.log("Prediction score too low to save to history.");
    }

    return response.data;
  } catch (error) {
    console.error("Error identifying plant:", error);
    return null;
  }
};
