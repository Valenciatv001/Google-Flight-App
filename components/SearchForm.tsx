import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchFlights } from '@/store/slices/flightSlice';
import { MapPin, Calendar, Users, Search } from 'lucide-react-native';
import { AppDispatch } from '@/store';

export function SearchForm() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [passengers, setPassengers] = useState('1');
  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = () => {
    if (!origin || !destination || !date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const searchParams = {
      origin,
      destination,
      date,
      passengers: parseInt(passengers),
    };

    dispatch(searchFlights(searchParams));
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Search Flights</Text>

        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="From (e.g., LAX, Los Angeles)"
              value={origin}
              onChangeText={setOrigin}
            />
          </View>

          <View style={styles.inputContainer}>
            <MapPin size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="To (e.g., JFK, New York)"
              value={destination}
              onChangeText={setDestination}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.flex]}>
              <Calendar size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Date (e.g., 2025-12-20)"
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={[styles.inputContainer, styles.passengersInput]}>
              <Users size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Passengers"
                value={passengers}
                onChangeText={setPassengers}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Search size={20} color="#fff" />
          <Text style={styles.searchButtonText}>Search Flights</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  passengersInput: {
    minWidth: 100,
  },
  searchButton: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  searchButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
});
