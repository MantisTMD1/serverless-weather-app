import "./style.css";
import { getWeather } from "./weather.js";
import { ICON_MAP } from "./iconMap.js";

// function gets user location using geo location api
navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({ coords }) {
    getWeather(coords.latitude, coords.longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone)
        .then(renderWeather)
        .catch((e) => {
            console.log(e);
            alert("Error retrieving weather data.");
        });
}

function positionError(){
    "There was an error finding your location. Please allow us to use your location and refresh the page. "
}
getWeather(44, 93, Intl.DateTimeFormat().resolvedOptions().timeZone)
    .then(renderWeather)
    .catch((e) => {
        console.log(e);
        alert("Error retrieving weather data.");
    });

// calls rendered data
function renderWeather({ current, daily, hourly }) {
    renderCurrentWeather(current);
    renderDailyWeather(daily);
    renderHourlyWeather(hourly)
    document.body.classList.remove("blurred");
}

// html attribute selector
function setValue(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value;
}

// current weather icon
function getIconUrl(iconCode) {
    return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

// render current weather data in header
const currentIcon = document.querySelector("[data-current-icon]");
function renderCurrentWeather(current) {
    currentIcon.src = getIconUrl(current.iconCode);
    setValue("current-temp", current.currentTemp);
    setValue("current-high", current.highTemp);
    setValue("current-low", current.lowTemp);
    setValue("current-rf-high", current.highRealFeel);
    setValue("current-rf-low", current.lowRealFeel);
    setValue("current-wind", current.windSpeed);
    setValue("current-precip", current.precip);
}

const DAY_FORMATTTER = new Intl.DateTimeFormat(undefined, { weekday: "short" })
const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");
function renderDailyWeather(daily) {
    dailySection.innerHTML = ""
    daily.forEach(day => {
        const element = dayCardTemplate.content.cloneNode(true)
        setValue("temp", day.maxTemp, { parent: element })
        setValue("date", DAY_FORMATTTER.format(day.timestamp), { parent: element })
        element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
        dailySection.append(element)
    })
}

const HOUR_FORMATTTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" })
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");
function renderHourlyWeather(hourly) {
    hourlySection.innerHTML = ""
    hourly.forEach(hour => {
        const element = hourRowTemplate.content.cloneNode(true)
        setValue("temp", hour.temp, { parent: element })
        setValue("rf-temp", hour.feelslike, { parent: element })
        setValue("wind", hour.windspeed, { parent: element })
        setValue("precip", hour.precip, { parent: element })
        setValue("day", DAY_FORMATTTER.format(hour.timestamp), { parent: element })
        setValue("time", HOUR_FORMATTTER.format(hour.timestamp), { parent: element })
        element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
        hourlySection.append(element)

    })
}