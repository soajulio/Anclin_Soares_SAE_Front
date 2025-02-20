import { Button, Text, View, TouchableOpacity } from "react-native";
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
            {isConnected && (
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.title}>HomeScreen</Text>
            <Text style={styles.subtitle}>
                Vous êtes {isConnected ? "connecté" : "pas connecté"}
            </Text>
            <CameraComponent/>
        </View>
    );
}

export default HomeScreen;
