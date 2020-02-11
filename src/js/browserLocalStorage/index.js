import constants from './../constants';

export default class BrowserLocalStorage {
    constructor() {
        this.userLanguage = localStorage.getItem(constants.USER_LANGUAGE);
        this.temperatureScale = localStorage.getItem(constants.TEMPERATURE_SCALE);
    }

    setDefaultValue() {
        if (this.userLanguage === null) {
            localStorage.setItem(constants.USER_LANGUAGE, constants.BROWSER_LANGUAGE);
        }
        
        if (this.temperatureScale === null) {
            localStorage.setItem(constants.TEMPERATURE_SCALE, constants.CELSIUS);
        }
    }

    setItem(itemName, itemValue) {
        localStorage.setItem(itemName, itemValue);
    }

    getItem(itemName) {
        return localStorage.getItem(itemName);
    }
}
