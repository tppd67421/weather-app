import constants from './../../constants';
import SetTargetLanguage from './../../setTargetLanguage';
import Switcher from ".";
import BrowserLocalStorage from '../../browserLocalStorage';

export default class ThemeSwitcher extends Switcher {
    constructor(currentElement) {
        super(currentElement);
        this.setTargetLanguage = new SetTargetLanguage();
        this.browserLocalStorage = new BrowserLocalStorage();

        this.htmlElement = document.querySelector('html');
    }

    activateSelect() {
        super.activateSelect();

        this.select.value = this.browserLocalStorage.getItem(constants.THEME);
        super.setValueInMainSelect();

        this.htmlElement.setAttribute(constants.THEME_ATTR, this.browserLocalStorage.getItem(constants.THEME));

        // click on item and change language
        this.viewListItems.forEach(item => item.addEventListener('click', e => {
            e.stopPropagation();

            this.changeTheme(e.currentTarget.getAttribute('rel'));

            super.closeSelect();
        }));
    }

    changeTheme(targetValue) {
        this.select.value = targetValue;
        super.setValueInMainSelect();

        if (this.htmlElement.getAttribute(constants.THEME_ATTR) === targetValue) return;
        else this.htmlElement.setAttribute(constants.THEME_ATTR, targetValue);

        this.browserLocalStorage.setItem(constants.THEME, targetValue);
    }
}