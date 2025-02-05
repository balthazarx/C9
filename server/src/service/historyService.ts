import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface City {
  id: string;
  name: string;
}

class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'searchHistory.json');
  }

  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist, return an empty array
      return [];
    }
  }

  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    const newCity = { id: uuidv4(), name: cityName };
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();