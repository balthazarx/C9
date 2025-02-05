import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config(); // Load environment variables early

interface WeatherData {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('Missing API key! Set OPENWEATHER_API_KEY in your .env file.');
    }
  }

  private formatDate(dt: number): string {
    return new Date(dt * 1000).toLocaleDateString();
  }

  async getWeatherForCity(city: string): Promise<WeatherData[]> {
    try {
      const url = `${this.baseURL}/forecast?q=${city}&units=imperial&appid=${this.apiKey}`;
      const response = await axios.get(url);
      const data = response.data;

      if (!data || !data.list) {
        throw new Error('Invalid weather data received.');
      }

      // Transform data for frontend
      const weatherData: WeatherData[] = data.list.slice(0, 6).map((item: any) => ({
        city: data.city.name,
        date: this.formatDate(item.dt),
        icon: item.weather?.[0]?.icon || '',
        iconDescription: item.weather?.[0]?.description || '',
        tempF: Math.round(item.main.temp),
        windSpeed: Math.round(item.wind.speed),
        humidity: item.main.humidity,
      }));

      console.log('Transformed weather data:', weatherData); // Debug log
      return weatherData;
    } catch (error: any) {
      console.error(
        'Error fetching weather data:',
        error.response?.data || error.message
      );
      throw new Error('Failed to fetch weather data');
    }
  }
}

export default new WeatherService();
