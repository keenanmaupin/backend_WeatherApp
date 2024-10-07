import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request,_res: Response) => {
  const { city } = req.body;
});

  // TODO: GET weather data from city name
router.get('/weather', (_req: Request, _res: Response) => {
  
});
  

  

  // TODO: Parse weather data and send it as a response
  router.get('/weather', (_req: Request, res: Response) => {
    return res.json 
  });

  

  // TODO: save city to search history
  router.put('/weather', (req: Request, res: Response) => {
    const { city } = req.body;
  HistoryService.addCity(city);
    res.status(201).json({ message: 'City added to search history' });
  
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  const cities = await HistoryService.getCities()
  res.json(cities)
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, _res: Response) => {

  
});

export default router;
