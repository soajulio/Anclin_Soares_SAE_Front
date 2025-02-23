import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Image, TouchableOpacity, Alert, LayoutAnimation, UIManager, Platform } from "react-native";
import { styles } from "../styles/styles";
import axios from "axios";
import Collapsible from 'react-native-collapsible';

// Images locales avec require()
const images = {
  rose: require("../assets/images/rose.jpg"),
  orchidee: require("../assets/images/orchidee.jpg"),
  tulipe: require("../assets/images/tulipe.jpg"),
};

const Historique: React.FC = () => {
  const [dataHistorique, setDataHistorique] = useState<any[]>([]);
  const [activeSections, setActiveSections] = useState<number[]>([]);

  // Charger l'historique lors de l'ouverture de l'écran
  useEffect(() => {
    chargerHistorique();
  }, []);

  const chargerHistorique = async () => {
    try {
      const response = await axios.get("http://192.168.1.162:5000/get_historique");
      if (response.status === 200) {
        setDataHistorique(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique : ", error);
    }
  };

  const ajouterDansLaBase = async (plante_nom: string, image: any) => {
    try {
      // Convertir l'image en base64 via require()
      const base64Image = await convertRequireToBase64(image);

      const nouvelleEntree = {
        plante_nom: plante_nom,
        latitude: 48.8566,
        longitude: 2.3522,
        prediction_score: 0.95,
        image: base64Image,
        url: `https://example.com/${plante_nom.toLowerCase()}`
      };

      const response = await axios.post(
        "http://192.168.1.162:5000/add_historique",
        nouvelleEntree
      );

      if (response.status === 201) {
        Alert.alert("Succès", `${plante_nom} ajoutée à l'historique !`);
        chargerHistorique(); // Recharger l'historique après ajout
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout : ", error);
      Alert.alert("Erreur", "Impossible d'ajouter la donnée.");
    }
  };

  const convertRequireToBase64 = async (image: any) => {
    return Image.resolveAssetSource(image).uri;
  };

  const toggleSection = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSections((prevSections) => 
      prevSections.includes(index) 
      ? prevSections.filter((i) => i !== index) 
      : [...prevSections, index]
    );
  };

  const renderItem = ({ item, index }: any) => {
  console.log("Image Base64 : ", item.image?.substring(0, 50));

  // Détection du type d'image
  const imageUri = item.image
    ? item.image.startsWith("/9j/")  // JPEG commence  par /9j/
      ? `data:image/jpeg;base64,${item.image}`
      : `data:image/png;base64,${item.image}`
    : null;

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleSection(index)}>
        <Text style={styles.nomPlante}>{item.plante_nom}</Text>
      </TouchableOpacity>
      <Collapsible collapsed={!activeSections.includes(index)}>
        <Text style={styles.details}>Latitude : {item.latitude}</Text>
        <Text style={styles.details}>Longitude : {item.longitude}</Text>
        <Text style={styles.details}>Score : {item.prediction_score}</Text>
        <Text style={styles.details}>URL : {item.url}</Text>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.alertText}>Image non disponible</Text>
        )}
      </Collapsible>
    </View>
  );
};


  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Ajouter dans la base de données</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => ajouterDansLaBase("Rose", images.rose)}
      >
        <Text style={styles.buttonText}>Ajouter Rose</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => ajouterDansLaBase("Orchidée", images.orchidee)}
      >
        <Text style={styles.buttonText}>Ajouter Orchidée</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => ajouterDansLaBase("Tulipe", images.tulipe)}
      >
        <Text style={styles.buttonText}>Ajouter Tulipe</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Historique des identifications</Text>
    </View>
  );

  return (
    <FlatList
      data={dataHistorique}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader} 
      contentContainerStyle={styles.container}
    />
  );
};

export default Historique;
