import React from "react";
import { Button, Text, View, TouchableOpacity, Image } from "react-native";
import { AppNavigationProp } from "./types";
import { styles } from "../styles/styles";
import CameraComponent from "../components/CameraComponant";
import { useAuth } from "../components/AuthContext";

type Props = {
    navigation: AppNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { isConnected, setIsConnected } = useAuth();

    const handleLogout = () => {
        setIsConnected(false);
    };

    return (
        <View style={styles.container}>
            {/* Display the logo */}
            <Image
                source={require('../assets/logo.png')} 
                style={{ width: 100, height: 100 }} 
            />

            {isConnected && (
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>
                {isConnected ? "Vous êtes connecté" : "Vous n'êtes pas connecté"}
            </Text>
            <CameraComponent />
        </View>
    );
}

export default HomeScreen;