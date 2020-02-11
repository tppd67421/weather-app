import constants from './../constants';
import ResponseParseSetValue from './../setWeatherValue/responseParseSetValue';
import BrowserLocalStorage from './../browserLocalStorage'

export default class TemperatureScale {
    constructor() {
        this.browserLocalStorage = new BrowserLocalStorage();
        this.responseParseSetValue = new ResponseParseSetValue();

        this.temperatureScaleNode = document.querySelector('.hamburger-menu .menu .temperature-scale');
        this.temperature = document.querySelector('.description__temperature');

        this.changeTemperatureScale();
    }

    changeTemperatureScale() {
        this.temperatureScaleNode.addEventListener('click', e => {
            const temperatureScale = this.browserLocalStorage.getItem(constants.TEMPERATURE_SCALE);
            const dailyTemperature = document.querySelectorAll('.menu .menu__temperature .day .day__temperature');
            const hourlyTemperature = document.querySelectorAll('.menu .menu__temperature .hours .hours__temperature');

            switch (e.target.className) {
                case 'temperature-scale__celsius':
                    if (temperatureScale !== constants.CELSIUS) {
                        this.temperature.textContent = this.responseParseSetValue.setTemperatureScale(this.temperature.textContent.slice(0, -2), constants.CELSIUS);
                        dailyTemperature.forEach(item => {
                            item.textContent = this.responseParseSetValue.setTemperatureScale(item.textContent.slice(0, -2), constants.CELSIUS);
                        });
                        hourlyTemperature.forEach(item => {
                            item.textContent = this.responseParseSetValue.setTemperatureScale(item.textContent.slice(0, -2), constants.CELSIUS);
                        });
                        this.browserLocalStorage.setItem(constants.CURRENT_TEMPERATURE, this.temperature.textContent.slice(0, -2));
                        this.browserLocalStorage.setItem(constants.TEMPERATURE_SCALE, constants.CELSIUS);
                    }
                    break;

                case 'temperature-scale__fahrenheit':
                    if (temperatureScale !== constants.FARENHEIT) {
                        this.temperature.textContent = this.responseParseSetValue.setTemperatureScale(this.temperature.textContent.slice(0, -2), constants.FARENHEIT);
                        dailyTemperature.forEach(item => {
                            item.textContent = this.responseParseSetValue.setTemperatureScale(item.textContent.slice(0, -2), constants.FARENHEIT);
                        });
                        hourlyTemperature.forEach(item => {
                            item.textContent = this.responseParseSetValue.setTemperatureScale(item.textContent.slice(0, -2), constants.FARENHEIT);
                        });
                        this.browserLocalStorage.setItem(constants.CURRENT_TEMPERATURE, this.temperature.textContent.slice(0, -2));
                        this.browserLocalStorage.setItem(constants.TEMPERATURE_SCALE, constants.FARENHEIT);
                    }
                    break;
            }
        })
    }
}