import BrowserLocalStorage from './../../browserLocalStorage';

export default class Switcher {
    constructor(currentElement) {
        this.browserLocalStorage = new BrowserLocalStorage();

        this.select = currentElement.querySelector('.select');
        
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

        // click on main/top item
        this.viewListMain.addEventListener('click', e => {
            e.stopPropagation();

            e.currentTarget.classList.toggle('active');
            this.viewListWrap.classList.toggle('active');
        });

        this.select.querySelectorAll('option').forEach((item, index) => {
            this.viewListItems.push(document.createElement('li'));
            this.viewListItems[index].setAttribute('rel', item.getAttribute('value'));
            this.viewListItems[index].textContent = item.textContent;

            this.viewListWrap.append(this.viewListItems[index]);
        });

        // this.setValueInMainSelect();

        window.addEventListener('click', this.closeSelect.bind(this));
    }

    setValueInMainSelect() {
        this.viewListMain.textContent = this.select.querySelector(`[value="${this.select.value}"]`).textContent;
    }

    closeSelect() {
        this.viewListMain.classList.remove('active');
        this.viewListWrap.classList.remove('active');
    }
}