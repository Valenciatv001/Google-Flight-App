import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlightData } from '@/store/slices/flightSlice';
import { Plane, Clock, MapPin } from 'lucide-react-native';

interface FlightCardProps {
  flight: FlightData;
}

export function FlightCard({ flight }: FlightCardProps) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.header}>
        <View style={styles.airlineInfo}>
          <Plane size={20} color="#1976D2" />
          <Text style={styles.airline}>{flight.airline}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${flight.price}</Text>
          <Text style={styles.currency}>{flight.currency}</Text>
        </View>
      </View>
      
      <View style={styles.flightInfo}>
        <View style={styles.timeInfo}>
          <View style={styles.location}>
            <Text style={styles.time}>{flight.departure.time}</Text>
            <Text style={styles.airport}>{flight.departure.airport}</Text>
            <Text style={styles.city}>{flight.departure.city}</Text>
          </View>
          
          <View style={styles.flightPath}>
            <View style={styles.line} />
            <View style={styles.planeDot}>
              <Plane size={12} color="#666" />
            </View>
            <View style={styles.line} />
          </View>
          
          <View style={styles.location}>
            <Text style={styles.time}>{flight.arrival.time}</Text>
            <Text style={styles.airport}>{flight.arrival.airport}</Text>
            <Text style={styles.city}>{flight.arrival.city}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Clock size={16} color="#666" />
            <Text style={styles.detailText}>{flight.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin size={16} color="#666" />
            <Text style={styles.detailText}>
              {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </Text>
          </View>
        </View>
        <Text style={styles.aircraft}>{flight.aircraft}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  airline: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1976D2',
  },
  currency: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  flightInfo: {
    marginBottom: 16,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: {
    alignItems: 'center',
    flex: 1,
  },
  time: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  airport: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginBottom: 2,
  },
  city: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  flightPath: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    paddingHorizontal: 20,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  planeDot: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 6,
    marginHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  details: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  aircraft: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
});