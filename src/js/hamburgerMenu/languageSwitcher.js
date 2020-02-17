import constants from './../constants';
import BrowserLocalStorage from './../browserLocalStorage';
import SetTargetLanguage from '../setTargetLanguage';

export default class LanguageSwitcher {
    constructor() {
        this.browserLocalStorage = new BrowserLocalStorage();
        this.setTargetLanguage = new SetTargetLanguage();

        this.select = document.querySelector('.language__item');
        this.selectEnglish = this.select.querySelector('.english');
        this.selectRussian = this.select.querySelector('.russian');
        
        this.viewListMain;
        this.viewListWrap;
        this.viewListItems = [];
    }

    activateSelect() {
        this.viewListMain = document.createElement('div');
        this.viewListMain.classList.add('select-main');
        this.select.after(this.viewListMain);

        this.viewListWrap = document.createElement('ul');
        this.viewListWrap.classList.add('select-list-wrap');
        this.viewListMain.after(this.viewListWrap);

        // create elements with new or default language
        this.changeLanguage();

        // click on main/top item
        this.viewListMain.addEventListener('click', e => {
            e.stopPropagation();

            e.currentTarget.classList.toggle('active');
            this.viewListWrap.classList.toggle('active');
        });

        // click on item and change language
        this.viewListItems.forEach(item => item.addEventListener('click', e => {
            e.stopPropagation();

            this.changeLanguage(e.currentTarget.getAttribute('rel'));
        }));

        window.addEventListener('click', this.closeSelect.bind(this));
    }

    changeLanguage(lang = this.browserLocalStorage.getItem(constants.USER_LANGUAGE)) {
        // language for select tag
        this.select.value = lang;

        this.setTargetLanguage.setLanguage(lang);

        this.viewListMain.textContent = this.select.querySelector(`[value="${lang}"]`).textContent;

        this.viewListItems.forEach(item => item.remove());
        this.select.querySelectorAll('option').forEach((item, index) => {
            this.viewListItems.push(document.createElement('li'));
            this.viewListItems[index].setAttribute('rel', item.getAttribute('value'));
            this.viewListItems[index].textContent = item.textContent;

            this.viewListWrap.append(this.viewListItems[index]);
        });
        
        this.closeSelect();
        this.browserLocalStorage.setItem(constants.USER_LANGUAGE, lang);
    }

    closeSelect() {
        this.viewListMain.classList.remove('active');
        this.viewListWrap.classList.remove('active');
    }
}