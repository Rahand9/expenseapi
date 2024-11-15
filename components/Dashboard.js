import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('/api/dashboard', {
        headers: { Authorization: token },
      });
      setData(response.data);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to your Dashboard</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Expenses: ${data.expenses}</Text>
        <Text style={styles.summaryText}>Revenue: ${data.revenue}</Text>
      </View>
      {/* Add more components here for data visualization */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  summaryText: {
    color: '#0ff1ce',
    fontSize: 18,
  },
});

export default Dashboard;
