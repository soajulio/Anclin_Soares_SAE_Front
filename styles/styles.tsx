import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22,
    color: '#555',
    marginBottom: 20,
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
  logoutText: {
    color: 'red',
    textDecorationLine: 'underline',
    marginBottom: 10,
    textAlign: 'center'
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
  },
  nomPlante: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  details: {
    color: "#666",
    fontSize: 16,
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
    backgroundColor: '#f9f9f9',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
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
