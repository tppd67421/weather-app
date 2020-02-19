import constants from './../constants';

export default class BrowserLocalStorage {
    constructor() {
        this.userLanguage = localStorage.getItem(constants.USER_LANGUAGE);
        this.theme = localStorage.getItem(constants.THEME);
        this.temperatureScale = localStorage.getItem(constants.TEMPERATURE_SCALE);
        this.hamburgerMenu = localStorage.getItem(constants.HAMBURGER_MENU);
    }

    setDefaultValue() {
        if (this.userLanguage === null) {
            localStorage.setItem(constants.USER_LANGUAGE, constants.BROWSER_LANGUAGE);
        }

        if (this.theme === null) {
            localStorage.setItem(constants.THEME, constants.THEME_AUTO);
        }
        
        if (this.temperatureScale === null) {
            localStorage.setItem(constants.TEMPERATURE_SCALE, constants.CELSIUS);
        }

        if (this.hamburgerMenu === null) {
            localStorage.setItem(constants.HAMBURGER_MENU, constants.HAMBURGER_MENU_CLOSE);
        }
    }

    setItem(itemName, itemValue) {
        localStorage.setItem(itemName, itemValue);
    }

    getItem(itemName) {
        return localStorage.getItem(itemName);
    }
}
