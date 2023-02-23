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
                daily: parseDailyWeather(data),
                hourly: parseHourlyWeather(data)

            }
        })
}

// parses through current weather data to give me clean readable objects  
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

// parses through daily weather data to give me clean readable objects  
function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index]),
        }
    })

}

// parses through hourly weather data to give me clean readable objects  
function parseHourlyWeather({ hourly, current_weather }) {
    return hourly.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: hourly.weathercode[index],
            temp: Math.round(hourly.apparent_temperature[index]),
            feelslike: Math.round(hourly.temperature_2m[index]),
            windspeed: Math.round(hourly.windspeed_10m[index]),
            precip: Math.round(hourly.precipitation[index] * 100) / 100,
        }
    }).filter(({ timestamp }) =>
        timestamp >= current_weather.time * 1000)
}