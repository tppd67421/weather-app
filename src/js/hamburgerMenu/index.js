import CitySearch from './citySearch';
import DailyHourlyForecast from './dailyHourlyForecast';
import TemperatureScale from './temperatureScale';

export default class HamburgerMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger-menu-wrap .hamburger-menu .button');
        this.hamburgerMenu = document.querySelector('.hamburger-menu-wrap .hamburger-menu');
        this.addEvent();

        this.citySearch = new CitySearch();
        this.dailyHourlyForecast = new DailyHourlyForecast();
        this.temperatureScale = new TemperatureScale();
    }

    addEvent() {
        this.hamburger.addEventListener('click', () => {
            this.hamburgerMenu.classList.toggle('active')
        })
    }
}