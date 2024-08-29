import axios from 'axios';
import { apikey } from '../constants';

// Corrected string interpolation using backticks
const forecastEndpoint = params => `http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationsEndpoint = params => `http://api.weatherapi.com/v1/search.json?key=${apikey}&q=${params.cityName}`;

// General API call function
const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    };
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (err) {
        console.error('Error fetching data:', err); // Use console.error for error logging
        return null;
    }
};

// Exported functions for fetching weather forecast and locations
export const fetchWeatherForecast = (params) => {
    return apiCall(forecastEndpoint(params));
};

export const fetchLocations = (params) => {
    return apiCall(locationsEndpoint(params));
};
