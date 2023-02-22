import axios from "axios";

export function getWeather(lat, lon, timezone) {
    return axios.get(
        "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime",
        {
            params: {
                latitude: lat,
                longitude: lon,
                timezone,
            },
        }
    )
        .then(({ data }) => {
            return {
                current: parseCurrentWeather(data),
                // daily: parseDailyWeather(data),
                // hourly: parseHourlyWeather(data)

            }
        })
}

// parses through data to give me clean readable objects  
function parseCurrentWeather({ current_weather, daily, hourly }) {
    const { temperature: currentTemp, windspeed: windSpeed,
        weathercode: iconCode } = current_weather

    const {
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFeelslike],
        apparent_temperature_min: [minFeelslike],
        precipitation_sum: [precip],


    } = daily


    return {
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        highRealFeel: Math.round(maxFeelslike),
        lowRealFeel: Math.round(minFeelslike),
        windSpeed: Math.round(windSpeed),
        precip: Math.round(precip * 100) / 100,
        iconCode,
    }
}
