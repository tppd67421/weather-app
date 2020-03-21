import constants from './../constants';
import contentEn from './../setTargetLanguage/contentEn';
import contentRu from './../setTargetLanguage/contentRu';
import BrowserLocalStorage from './../browserLocalStorage';
import Preloader from './../preloader';
import SetTargetLanguage from '../setTargetLanguage';

export default class ResponseParseSetValue {
    constructor() {
        this.browserLocalStorage = new BrowserLocalStorage();
        this.preloader = new Preloader();

        this.setTargetLanguage = new SetTargetLanguage();

        this.bgImage = document.querySelector('.wrap');
        this.temperature = document.querySelector('.description__temperature');
        this.descriptionText = document.querySelector('.description__text');
        this.cloudy = document.querySelector('.hamburger-menu .details .cloudy__value');
        this.humidity = document.querySelector('.hamburger-menu .details .humidity__value');
        this.windSpeed = document.querySelector('.hamburger-menu .details .wind-speed__value');
        this.dayTemperature = document.querySelector('.hamburger-menu .slider .day');
        this.hoursTemperature = document.querySelector('.hamburger-menu .slider .hours');
        this.cityAndCountryName = document.querySelector('.city__name');
        this.time = document.querySelector('.time');
        this.date = document.querySelector('.date');
    }

    responseParse(res) {
        if (res) {
            if (this.browserLocalStorage.getItem(constants.TEMPERATURE_SCALE) === constants.CELSIUS) {
                this.browserLocalStorage.setItem(
                    constants.CURRENT_TEMPERATURE,
                    Math.trunc(res.weatherJsonParsed.currently.temperature) - constants.TEMPERATURE_DELTA
                );
            } else {
                this.browserLocalStorage.setItem(
                    constants.CURRENT_TEMPERATURE,
                    Math.trunc(res.weatherJsonParsed.currently.temperature)
                );
            }

            this.temperature.textContent =
                this.setTemperatureScale(
                    this.browserLocalStorage.getItem(constants.CURRENT_TEMPERATURE),
                    this.browserLocalStorage.getItem(constants.TEMPERATURE_SCALE)
                );
            this.descriptionText.textContent = res.weatherJsonParsed.currently.summary;
            this.cloudy.textContent = `${Math.floor(res.weatherJsonParsed.currently.cloudCover * 100)}%`;
            this.humidity.textContent = `${Math.floor(res.weatherJsonParsed.currently.humidity * 100)}%`;

            // round number
            this.windSpeed.textContent = `${Math.floor(res.weatherJsonParsed.currently.windSpeed * constants.KILOMETRES_PER_HOUR * 10) / 10}km/h`;

            this.dailyParseSetData(res.weatherJsonParsed.daily.data);
            this.hourlyParseSetData(res.weatherJsonParsed.hourly.data);
            
            this.cityAndCountryName.textContent = res.userLocation.cityAndCountry;

            this.bgParseSetData(res.weatherJsonParsed.currently.icon);

            this.setTargetLanguage.setLanguage(this.browserLocalStorage.getItem(constants.USER_LANGUAGE));

            this.setTime();
            this.preloader.remove();
        }
    }

    dailyParseSetData(data) {
        data.forEach(item => {
            if (new Date().getTime() < item.time * 1000) {
                const daysTemperatureContent =
                    this.browserLocalStorage.getItem(constants.USER_LANGUAGE) === constants.RUSSIAN ?
                        contentRu : contentEn;
                const element = `
                    <li class="day__item">
                        <div class="day__day-week">${daysTemperatureContent}</div>
                        <div class="day__icon">icon</div>
                        <div class="day__temperature">${
                    this.setTemperatureScale(
                        (this.browserLocalStorage.getItem(constants.TEMPERATURE_SCALE) === constants.CELSIUS
                            ? Math.round((item.temperatureHigh + item.temperatureLow) / 2) - constants.TEMPERATURE_DELTA
                            : Math.round((item.temperatureHigh + item.temperatureLow) / 2)
                        ),
                        this.browserLocalStorage.getItem(constants.TEMPERATURE_SCALE)
                    )}</div>
                    </li>`;

                this.dayTemperature.insertAdjacentHTML('beforeend', element);
            }
        });
    }

    hourlyParseSetData(data) {
        data.reduce((acc, item) => {
            const targetDate = new Date(item.time * 1000).getHours();
            if ((new Date().getTime() < item.time * 1000) && acc < 24) {
                const element = `
                    <li class="hours__item">
                        <div class="hours__hour">${targetDate < 10 ? '0' + targetDate : targetDate}:00</div>
                        <div class="hours__icon">icon</div>
                        <div class="hours__temperature">${
                    this.setTemperatureScale(
                        (this.browserLocalStorage.getItem(constants.TEMPERATURE_SCALE) === constants.CELSIUS
                            ? Math.round(item.temperature) - constants.TEMPERATURE_DELTA
                            : Math.round(item.temperature)
                        ),
                        this.browserLocalStorage.getItem(constants.TEMPERATURE_SCALE)
                    )}</div>
                    </li>
                `;

                this.hoursTemperature.insertAdjacentHTML('beforeend', element);

                return ++acc;
            } else {
                return acc;
            }
        }, 0)
    }

    bgParseSetData(data) {
        switch (data) {
            case 'clear-day':
                this.bgImage.style.backgroundImage = 'url(./assets/img/clear-day.jpg)';
                break;
            case 'clear-night':
                this.bgImage.style.backgroundImage = 'url(./assets/img/clear-night.jpg)';
                break;
            case 'rain':
                this.bgImage.style.backgroundImage = 'url(./assets/img/rain.jpg)';
                break;
            case 'snow':
                this.bgImage.style.backgroundImage = 'url(./assets/img/snow.jpg)';
                break;
            case 'sleet':
                this.bgImage.style.backgroundImage = 'url(./assets/img/sleet.jpg)';
                break;
            case 'wind':
                this.bgImage.style.backgroundImage = 'url(./assets/img/wind.jpg)';
                break;
            case 'fog':
                this.bgImage.style.backgroundImage = 'url(./assets/img/fog.jpg)';
                break;
            case 'cloudy':
                this.bgImage.style.backgroundImage = 'url(./assets/img/cloudy.jpg)';
                break;
            case 'partly-cloudy-day':
                this.bgImage.style.backgroundImage = 'url(./assets/img/partly-cloudy-day.jpg)';
                break;
            case 'partly-cloudy-night':
                this.bgImage.style.backgroundImage = 'url(./assets/img/partly-cloudy-night.jpg)';
                break;
            default:
                this.bgImage.style.backgroundImage = 'url(./assets/img/default.jpg)';
                break;
        }
    }

    setTemperatureScale(value, targetTemperatureScale) {
        if (targetTemperatureScale !== this.browserLocalStorage.getItem(constants.TEMPERATURE_SCALE)) {
            switch (targetTemperatureScale) {
                case constants.CELSIUS:
                    return `${+value - constants.TEMPERATURE_DELTA}${constants.CELSIUS_DEGREES}`;

                case constants.FARENHEIT:
                    return `${+value + constants.TEMPERATURE_DELTA}${constants.FARENHEIT_DEGREES}`;
            }
        } else {
            switch (targetTemperatureScale) {
                case constants.CELSIUS:
                    return `${value}${constants.CELSIUS_DEGREES}`;

                case constants.FARENHEIT:
                    return `${value}${constants.FARENHEIT_DEGREES}`;
            }
        }
    }

    setTime() {
        let currentlyDate = new Date(); // momentjs

        let formatDateTime = currentlyDateTimeItem => {
            return currentlyDateTimeItem < 10 ? `0${currentlyDateTimeItem}` : currentlyDateTimeItem;
        }

        let hours = formatDateTime(currentlyDate.getHours());
        let minutes = formatDateTime(currentlyDate.getMinutes());

        let day = formatDateTime(currentlyDate.getDate());
        let month = formatDateTime(currentlyDate.getMonth() + 1);

        this.time.textContent = `${hours}:${minutes}`;
        this.date.textContent = `${day}.${month}.${currentlyDate.getFullYear()}`;
    }
}