import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AppNavigationProp } from './types';
import { styles } from '../styles/styles';
import { useAuth } from '../components/AuthContext';

interface Props {
  navigation: AppNavigationProp;
}

const Connexion: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // État pour basculer entre Connexion et Inscription

  // Utilisation du contexte
  const { setIsConnected } = useAuth();

  // Gestion de la connexion
  const handleLogin = async () => {
    if (username === '' || password === '') {
      setAlertMessage('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setAlertMessage('');

    try {
      const response = await axios.post('http://172.20.10.6:5000/check_credentials', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        setAlertMessage('Connexion réussie !');
        setIsConnected(true); 
        navigation.navigate('Historique'); // Redirection vers HistoriqueScreen
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          setAlertMessage("Nom d'utilisateur ou mot de passe incorrect");
        } else {
          setAlertMessage('Erreur lors de la connexion. Veuillez réessayer.');
        }
      } else {
        setAlertMessage('Erreur inattendue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Gestion de l'inscription
  const handleSignup = async () => {
    if (username === '' || password === '' || email === '') {
      setAlertMessage('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setAlertMessage('');

    try {
      const response = await axios.post('http://172.20.10.6:5000/add_user', {
        username: username,
        password: password,
        email: email,
      });
    
      if (response.status === 201) {
        setAlertMessage('Utilisateur créé avec succès !');
        setTimeout(() => {
          setIsSignup(false); // Retour à la page de connexion
          setUsername('');
          setPassword('');
          setEmail('');
          setAlertMessage('');
        }, 2000); // Attendre 2 secondes avant de revenir à la connexion
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response ? error.response.data.error : error.message;
        setAlertMessage(`Erreur lors de l'inscription : ${errorMessage}`);
      } else {
        setAlertMessage('Erreur inattendue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignup ? 'Créer un compte' : 'Connexion'}</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          accessible
          accessibilityLabel="Nom d'utilisateur"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessible
          accessibilityLabel="Mot de passe"
        />
        {isSignup && (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            accessible
            accessibilityLabel="Email"
          />
        )}
        <Button title={isSignup ? "S'inscrire" : "Se connecter"} onPress={isSignup ? handleSignup : handleLogin} disabled={loading} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
      {alertMessage ? <Text style={styles.alertText}>{alertMessage}</Text> : null}

      <Button
        title={isSignup ? 'Déjà un compte ? Connexion' : 'Pas de compte ? Créer un compte'}
        onPress={() => setIsSignup(!isSignup)}
      />
    </View>
  );
};

export default Connexion;
