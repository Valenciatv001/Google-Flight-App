import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, MapPin } from 'lucide-react-native';

export default function BookingsScreen() {
  const mockBookings = [
    {
      id: '1',
      airline: 'American Airlines',
      route: 'LAX → JFK',
      date: '2024-01-15',
      time: '08:30 AM',
      status: 'Confirmed',
    },
    {
      id: '2',
      airline: 'Delta Air Lines',
      route: 'SFO → ORD',
      date: '2024-01-22',
      time: '02:15 PM',
      status: 'Pending',
    },
  ];

  return (
    <LinearGradient
      colors={['#E3F2FD', '#FFFFFF']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Bookings</Text>
          <Text style={styles.subtitle}>Track your flight reservations</Text>
        </View>
        
        <View style={styles.bookingsList}>
          {mockBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.airlineName}>{booking.airline}</Text>
                <View style={[
                  styles.statusBadge,
                  booking.status === 'Confirmed' ? styles.confirmedBadge : styles.pendingBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    booking.status === 'Confirmed' ? styles.confirmedText : styles.pendingText
                  ]}>
                    {booking.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.bookingInfo}>
                <View style={styles.infoRow}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.infoText}>{booking.route}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Calendar size={16} color="#666" />
                  <Text style={styles.infoText}>{booking.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Clock size={16} color="#666" />
                  <Text style={styles.infoText}>{booking.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  bookingsList: {
    paddingHorizontal: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  airlineName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confirmedBadge: {
    backgroundColor: '#E8F5E8',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  confirmedText: {
    color: '#4CAF50',
  },
  pendingText: {
    color: '#FF9800',
  },
  bookingInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});