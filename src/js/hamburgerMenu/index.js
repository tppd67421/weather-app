import CitySearch from './citySearch';
import DailyHourlyForecast from './dailyHourlyForecast';
import TemperatureScale from './temperatureScale';
import BrowserLocalStorage from './../browserLocalStorage';
import constants from './../constants';
import ThemeSwitcher from './switcher/themeSwitcher';
import LanguageSwitcher from './switcher/languageSwither';

export default class HamburgerMenu {
    constructor() {
        this.browserLocalStorage = new BrowserLocalStorage();
        
        this.hamburger = document.querySelector('.hamburger-menu-wrap .hamburger-menu .button');
        this.hamburgerMenu = document.querySelector('.hamburger-menu-wrap .hamburger-menu');
        this.checkOpenedAndAddEvent();

        this.citySearch = new CitySearch();
        this.citySearch.setKeyboardEvent();
        this.citySearch.clickHideShowDropdownList();
        
        this.dailyHourlyForecast = new DailyHourlyForecast();
        this.temperatureScale = new TemperatureScale();
        
        this.languageSwitcher = new LanguageSwitcher(document.querySelector('.menu .language'));
        this.languageSwitcher.activateSelect()
        this.themeSwitcher = new ThemeSwitcher(document.querySelector('.menu .theme'));
        this.themeSwitcher.activateSelect();
    }

    checkOpenedAndAddEvent() {
        if (this.browserLocalStorage.getItem(constants.HAMBURGER_MENU) === constants.HAMBURGER_MENU_OPEN) {
            this.hamburgerMenu.classList.add('active');
        } else {
            this.hamburgerMenu.classList.remove('active');
        }
        
        this.hamburger.addEventListener('click', () => {
            if (this.browserLocalStorage.getItem(constants.HAMBURGER_MENU) === constants.HAMBURGER_MENU_CLOSE) {
                this.hamburgerMenu.classList.add('active');
                this.browserLocalStorage.setItem(constants.HAMBURGER_MENU, constants.HAMBURGER_MENU_OPEN);
            } else {
                this.hamburgerMenu.classList.remove('active');
                this.browserLocalStorage.setItem(constants.HAMBURGER_MENU, constants.HAMBURGER_MENU_CLOSE);
            }
        })
    }
}