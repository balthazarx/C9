import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    if (!cityName) {
      res.status(400).json({ error: 'City name is required' });
      return;
    }

    await HistoryService.addCity(cityName);
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    res.json(weatherData);
  } catch (error) {
    console.error('Error processing weather request:', error);
    res.status(500).json({ error: 'Failed to process weather request' });
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error removing city from search history:', error);
    res.status(500).json({ error: 'Failed to remove city from search history' });
  }
});

export default router;