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

// Mock flight data for development
const mockFlights: FlightData[] = [
  {
    id: '1',
    airline: 'American Airlines',
    price: 299,
    currency: 'USD',
    departure: {
      airport: 'LAX',
      city: 'Los Angeles',
      time: '08:30 AM'
    },
    arrival: {
      airport: 'JFK',
      city: 'New York',
      time: '04:45 PM'
    },
    duration: '5h 15m',
    stops: 0,
    aircraft: 'Boeing 737'
  },
  {
    id: '2',
    airline: 'Delta Air Lines',
    price: 325,
    currency: 'USD',
    departure: {
      airport: 'LAX',
      city: 'Los Angeles',
      time: '10:15 AM'
    },
    arrival: {
      airport: 'JFK',
      city: 'New York',
      time: '06:30 PM'
    },
    duration: '5h 15m',
    stops: 0,
    aircraft: 'Airbus A320'
  },
  {
    id: '3',
    airline: 'United Airlines',
    price: 280,
    currency: 'USD',
    departure: {
      airport: 'LAX',
      city: 'Los Angeles',
      time: '01:20 PM'
    },
    arrival: {
      airport: 'JFK',
      city: 'New York',
      time: '09:35 PM'
    },
    duration: '5h 15m',
    stops: 0,
    aircraft: 'Boeing 757'
  }
];

export const searchFlights = createAsyncThunk(
  'flight/searchFlights',
  async (params: SearchParams) => {
    try {
      // For now, we'll use mock data
      // In production, you would integrate with Sky Scrapper API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      return mockFlights;
    } catch (error) {
      throw new Error('Failed to fetch flights');
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
        state.flights = action.payload;
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to search flights';
      });
  },
});

export const { clearFlights, clearError } = flightSlice.actions;
export default flightSlice.reducer;