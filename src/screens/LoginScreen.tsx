import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveUser } from '../database';

export const LoginScreen = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Ensuring both name and PIN are at least 3 characters
    if (username.length < 3 || password.length < 3) {
      Alert.alert("Error", "Please enter at least 3 characters for both.");
      return;
    }
    
    // Saves user locally in SQLite
    saveUser(username, password);
    Alert.alert("Success", "User details saved offline!");
    onLoginSuccess();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BharatQuest Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Enter PIN"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        // Forces numeric keyboard and removes any non-number characters
        keyboardType="number-pad"
        maxLength={6} 
        onChangeText={(text) => setPassword(text.replace(/[^0-9]/g, ''))}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Enter App</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
 });