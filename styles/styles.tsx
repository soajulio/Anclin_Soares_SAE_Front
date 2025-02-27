import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0ebeb', 
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  containerCH: {
    flex: 1,
    backgroundColor: '#e0ebeb',
    alignItems: 'center',
    justifyContent: 'center', // Centre verticalement
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 22,
    color: '#555',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '80%',
  },
  input: {
    height: 45,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  alertText: {
    marginTop: 20,
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    width: "90%",
    alignSelf: 'center',
    marginTop: 20,
  },
  nomPlante: {
    fontSize: 24,
    fontWeight: "bold", 
    color: "#222",
    marginBottom: 5,
  },
  dateHeure: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
    fontWeight: "normal", 
  },
  details: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    borderBottomColor: '#444', 
    borderBottomWidth: 2,
    paddingTop: 50,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  urlText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginTop: 10,
  }
});