import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Image, TouchableOpacity, Alert, LayoutAnimation } from "react-native";
import { styles } from "../styles/styles";
import axios from "axios";
import Collapsible from 'react-native-collapsible';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Images locales avec require()
const images = {
  rose: require("../assets/images/rose.jpg"),
  orchidee: require("../assets/images/orchidee.jpg"),
  tulipe: require("../assets/images/tulipe.jpg"),
};

const Historique: React.FC = () => {
  const [dataHistorique, setDataHistorique] = useState<any[]>([]);
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [serverIp, setServerIp] = useState<string | null>(null);

  // Charger l'IP sauvegardée
  useEffect(() => {
    const chargerIP = async () => {
      try {
        const savedIP = await AsyncStorage.getItem("server_ip");
        if (savedIP) {
          setServerIp(savedIP);
        } else {
          Alert.alert("Erreur", "Aucune adresse IP enregistrée.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'IP :", error);
      }
    };
    chargerIP();
  }, []);

  // Charger l'historique lors de l'ouverture de l'écran
  useEffect(() => {
    if (serverIp) {
      chargerHistorique();
    }
  }, [serverIp]);

  const chargerHistorique = async () => {
    if (!serverIp) return;
    try {
      const response = await axios.get(`http://${serverIp}:5000/get_historique`);
      if (response.status === 200) {
        setDataHistorique(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique :", error);
    }
  };

  const ajouterDansLaBase = async (plante_nom: string, image: any) => {
    if (!serverIp) {
      Alert.alert("Erreur", "Adresse IP du serveur non définie.");
      return;
    }
    try {
      const base64Image = await convertRequireToBase64(image);
      const nouvelleEntree = {
        plante_nom,
        latitude: 48.8566,
        longitude: 2.3522,
        prediction_score: 0.95,
        image: base64Image,
        url: `https://example.com/${plante_nom.toLowerCase()}`
      };

      const response = await axios.post(`http://${serverIp}:5000/add_historique`, nouvelleEntree);
      if (response.status === 201) {
        Alert.alert("Succès", `${plante_nom} ajoutée à l'historique !`);
        chargerHistorique(); // Recharger l'historique après ajout
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
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
    const imageUri = item.image
      ? item.image.startsWith("/9j/")  // JPEG commence par /9j/
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
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
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
      {Object.entries(images).map(([name, img]) => (
        <TouchableOpacity key={name} style={styles.button} onPress={() => ajouterDansLaBase(name, img)}>
          <Text style={styles.buttonText}>Ajouter {name.charAt(0).toUpperCase() + name.slice(1)}</Text>
        </TouchableOpacity>
      ))}
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