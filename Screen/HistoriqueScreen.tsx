import React, { useState, useEffect } from "react";
import { 
  Text, View, ScrollView, Image, TouchableOpacity, LayoutAnimation, Linking, RefreshControl 
} from "react-native";
import { styles } from "../styles/styles";
import axios from "axios";
import Collapsible from 'react-native-collapsible';

const Historique: React.FC = () => {
  const [dataHistorique, setDataHistorique] = useState<any[]>([]);
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    chargerHistorique();
  }, []);

  const chargerHistorique = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get("http://192.168.1.6:5000/get_historique");
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  };

  const handleUrlPress = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Erreur lors de l'ouverture de l'URL : ", err));
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={chargerHistorique} />
      }
      collapsable={false} 
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Historique des identifications</Text>
      </View>

      {dataHistorique.map((item, index) => {
        const imageUri = item.image
          ? item.image.startsWith("/9j/")  // Détecter JPEG (Base64 commence par /9j/)
            ? `data:image/jpeg;base64,${item.image}`
            : `data:image/png;base64,${item.image}`
          : null;

        const scorePercentage = (item.prediction_score * 100).toFixed(1);

        return (
          <View key={index} style={styles.itemContainer}>
            <TouchableOpacity onPress={() => toggleSection(index)}>
              <Text style={styles.nomPlante}>
                {`${formatDate(item.timestamp)} \n${item.plante_nom}`}
              </Text>
            </TouchableOpacity>

            <Collapsible collapsed={!activeSections.includes(index)}>
              <Text style={styles.details}>Latitude : {item.latitude}</Text>
              <Text style={styles.details}>Longitude : {item.longitude}</Text>
              <Text style={styles.details}>Score : {scorePercentage}%</Text>
              {imageUri ? (
                <>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </>
              ) : (
                <Text style={styles.alertText}>Image non disponible</Text>
              )}
              {item.url && item.url !== "None" && (
                <TouchableOpacity onPress={() => handleUrlPress(item.url)}>
                  <Text style={[styles.details, { color: 'blue', textDecorationLine: 'underline' }]}>
                    Voir image de la fleur prédite
                  </Text>
                </TouchableOpacity>
              )}
            </Collapsible>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Historique;
