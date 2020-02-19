import constants from './../../constants';
import SetTargetLanguage from './../../setTargetLanguage';
import Switcher from '.';

export default class LanguageSwitcher extends Switcher {
    constructor(currentElement) {
        super(currentElement);
        this.setTargetLanguage = new SetTargetLanguage();
    }

    activateSelect() {
        super.activateSelect();

        this.select.value = this.browserLocalStorage.getItem(constants.USER_LANGUAGE);
        
        super.setValueInMainSelect();

        // click on item and change language
        this.viewListItems.forEach(item => item.addEventListener('click', e => {
            e.stopPropagation();

            this.changeLanguage(e.currentTarget.getAttribute('rel'));

            super.closeSelect();
        }));
    }

    changeLanguage(lang) {
        // language for select tag
        this.select.value = lang;
        this.setTargetLanguage.setLanguage(lang);
        super.setValueInMainSelect();

        this.browserLocalStorage.setItem(constants.USER_LANGUAGE, lang);
    }
}