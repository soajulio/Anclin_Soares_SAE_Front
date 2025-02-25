import React from "react";
import { View, Text, Switch } from "react-native";
import { styles } from "../styles/styles";

const ParametreScreen: React.FC = () => {
  const [isEnabled, setIsEnabled] = React.useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>
        <Text>Activer une option :</Text>
        <Switch value={isEnabled} onValueChange={toggleSwitch} />
    </View>
  );
};

export default ParametreScreen;
