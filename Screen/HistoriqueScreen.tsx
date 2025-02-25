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

  useEffect(() => {
    if (serverIp) {
      chargerHistorique();
    }
  }, [serverIp]);

  const chargerHistorique = async () => {
    try {
      const response = await axios.get("http://172.20.10.14:5000/get_historique");
      if (response.status === 200) {
        setDataHistorique(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique : ", error);
    } finally {
      setRefreshing(false);
    }
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
