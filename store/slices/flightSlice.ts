import { mockFlights } from '@/data/mockFlights';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface FlightData {
  id: string;
  airline: string;
  price: number;
  currency: string;
  departure: {
    airport: string;
    city: string;
    time: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
  };
  duration: string;
  stops: number;
  aircraft: string;
}

interface SearchParams {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

interface FlightState {
  flights: FlightData[];
  isLoading: boolean;
  error: string | null;
  searchParams: SearchParams | null;
}

const initialState: FlightState = {
  flights: [],
  isLoading: false,
  error: null,
  searchParams: null,
};

// Helper function to format airport codes
const formatAirportCode = (input: string): string => {
  // Extract airport code if it's in format "LAX, Los Angeles" or just "LAX"
  const match = input.match(/^([A-Z]{3})/i);
  return match ? match[1].toUpperCase() : input.toUpperCase().slice(0, 3);
};

// Helper function to format city names for Sky Scrapper API
const formatCityForAPI = (input: string): string => {
  // Common city mappings for Sky Scrapper API
  const cityMappings: { [key: string]: string } = {
    LAX: 'LAXA',
    'LOS ANGELES': 'LAXA',
    JFK: 'NYCA',
    'NEW YORK': 'NYCA',
    NYC: 'NYCA',
    LHR: 'LOND',
    LONDON: 'LOND',
    CDG: 'PARI',
    PARIS: 'PARI',
    NRT: 'TYOA',
    TOKYO: 'TYOA',
    SFO: 'SFOA',
    'SAN FRANCISCO': 'SFOA',
    ORD: 'CHIA',
    CHICAGO: 'CHIA',
    MIA: 'MIAM',
    MIAMI: 'MIAM',
    DXB: 'DUBA',
    DUBAI: 'DUBA',
    SYD: 'SYDA',
    SYDNEY: 'SYDA',
    HOU: 'HOUA',
    HOUSTON: 'HOUA',
    IAH: 'IAHA',
  };

  const upperInput = input.toUpperCase().trim();

  // Check if it's a direct mapping
  if (cityMappings[upperInput]) {
    return cityMappings[upperInput];
  }

  // Check if input contains a mapped city
  for (const [key, value] of Object.entries(cityMappings)) {
    if (upperInput.includes(key)) {
      return value;
    }
  }

  // Default fallback - try to extract first 4 characters and add 'A'
  const code = formatAirportCode(input);
  return code + 'A';
};

// Helper function to parse Sky Scrapper API response
const parseFlightData = (apiResponse: any): FlightData[] => {
  console.log('Parsing flight data:', apiResponse);
  try {
    if (!apiResponse?.data?.itineraries) {
      return [];
    }

    return apiResponse.data.itineraries.map((itinerary: any, index: number) => {
      const leg = itinerary.legs?.[0];
      const segments = leg?.segments || [];
      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];

      // Calculate total duration
      const durationMinutes = leg?.durationInMinutes || 0;
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      const duration = `${hours}h ${minutes}m`;

      // Format times
      const departureTime = firstSegment?.departure
        ? new Date(firstSegment.departure).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
        : 'N/A';

      const arrivalTime = lastSegment?.arrival
        ? new Date(lastSegment.arrival).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
        : 'N/A';

      return {
        id: `flight-${index}-${Date.now()}`,
        airline: firstSegment?.marketingCarrier?.name || 'Unknown Airline',
        price: Math.round(itinerary.price?.raw || 0),
        currency: itinerary.price?.formatted?.split(' ')[0] || 'USD',
        departure: {
          airport: firstSegment?.origin?.id || 'N/A',
          city: firstSegment?.origin?.name || 'Unknown',
          time: departureTime,
        },
        arrival: {
          airport: lastSegment?.destination?.id || 'N/A',
          city: lastSegment?.destination?.name || 'Unknown',
          time: arrivalTime,
        },
        duration,
        stops: Math.max(0, segments.length - 1),
        aircraft: firstSegment?.flightNumber
          ? `${firstSegment.marketingCarrier?.alternateId || ''} ${
              firstSegment.flightNumber
            }`
          : 'N/A',
      };
    });
  } catch (error) {
    console.error('Error parsing flight data:', error);
    return [];
  }
};

export const searchFlights = createAsyncThunk(
  'flight/searchFlights',
  async (params: SearchParams) => {
    try {
      const rapidApiKey = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;

      if (!rapidApiKey) {
        throw new Error('RapidAPI key not configured.');
      }

      const origin = formatCityForAPI(params.origin);
      const destination = formatCityForAPI(params.destination);

      let formattedDate = params.date;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(params.date)) {
        const dateObj = new Date(params.date);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      }

      const legs = JSON.stringify([
        {
          origin,
          destination,
          date: formattedDate,
        },
      ]);

      // STEP 1: Call searchFlights to get sessionId
      const searchResponse = await axios.get(
        'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
        {
          params: {
            legs,
            adults: params.passengers.toString(),
            currency: 'USD',
            locale: 'en-US',
            market: 'US',
            cabinClass: 'economy',
            countryCode: 'US',
          },
          headers: {
            'x-rapidapi-key': rapidApiKey,
            'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
          },
        }
      );

      const sessionId = searchResponse.data?.sessionId;
      if (!sessionId) {
        throw new Error('Session ID not returned. Check search parameters.');
      }

      // STEP 2: Call getFlightDetails using sessionId
      const detailResponse = await axios.get(
        'https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails',
        {
          params: {
            sessionId,
          },
          headers: {
            'x-rapidapi-key': rapidApiKey,
            'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
          },
        }
      );

      const flights = parseFlightData(detailResponse.data);

      if (flights.length === 0) {
        throw new Error('No flights found. Try different search criteria.');
      }

      return flights;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Check your internet.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid API key.');
        }
        if (error.response?.status === 429) {
          console.warn('Rate limit hit. Returning mock data for demo.');
          return mockFlights;
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid API key.');
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }

      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Flight search failed. Try again.');
    }
  }
);

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    clearFlights: (state) => {
      state.flights = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.searchParams = action.meta.arg;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.flights = action.payload ?? [];
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to search flights';
      });
  },
});

export const { clearFlights, clearError } = flightSlice.actions;
export default flightSlice;
