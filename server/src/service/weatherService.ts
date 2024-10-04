import dotenv from 'dotenv';
import { application } from 'express';
import { basename } from 'path';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
lat:number,
lon:number,

};
// TODO: Define a class for the Weather object
class Weather{
city: string;
date:string;
temprature: number;
windSpeed: number;
humidity:number;
icon: string;
iconDescription:string;

constructor(city:string, date:string, temprature:number,windSpeed:number,humidity:number,icon:string,iconDescription:string){
this.city = city;
this.date = date;
this.temprature = temprature;
this.windSpeed = windSpeed;
this.humidity = humidity;
this.icon = icon;
this.iconDescription = iconDescription

};


}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;
  city: string;

  constructor(baseURL:string, apiKey:string,city:string){
  this.baseURL = baseURL;
  this.apiKey = apiKey;
  this.city = city;
}

  // TODO: Create fetchLocationData method
private async fetchLocationData(query: string) {
const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`

const response = await fetch(requestUrl);
const data = await response.json();
console.log(data)
}
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const params = new URLSearchParams({
      city: this.city,
      key: this.apiKey
    });
    return `${this.baseURL}?${params.toString()}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
  const { lat, lon } = coordinates;
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  }
  // *MAKE SURE TO ASK WHATS GOIN ON ABOVE^^ WITH THE RETURN ONLINE 72 AND ROUTES 
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const geocodeQuery = this.buildGeocodeQuery();
    const response = await fetch(geocodeQuery);
    const locationData = await response.json();
    return this.destructureLocationData(locationData.results[0].geometry.location);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const weatherData = await response.json();
    return weatherData.list.map((data: { dt: number; main: { temp: number; humidity: number; }; wind: { speed: number; }; weather: { description: string; }[]; }) => new Weather(
      this.city,
      new Date(data.dt * 1000).toLocaleString(),
      data.main.temp - 273.15,
      data.wind.speed,
      data.main.humidity,
      `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      data.weather[0].description
    ));
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { name, dt, weather, main } = response.data;
    const date = new Date(dt * 1000).toLocaleString();
    const icon = weather[0].icon;
    const iconDescription = weather[0].description;
    const tempF = Math.round(main.temp - 273.15);
    const windSpeed = main.wind.speed;
    const humidity = main.humidity;
    return { city: this.city, date, icon, iconDescription, tempF, windSpeed, humidity };
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    return [currentWeather,...weatherData];

  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(await fetch(`${this.baseURL}/weather?q=${city}&appid=${this.apiKey}`));
    return this.buildForecastArray(new Weather(
      currentWeather.city,
      currentWeather.date,
      currentWeather.tempF,
      currentWeather.windSpeed,
      currentWeather.humidity,
      currentWeather.icon,
      currentWeather.iconDescription
    ), weatherData);
  }
}

export default new WeatherService();
