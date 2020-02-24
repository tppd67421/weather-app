import WeatherDeterminationQuery from './../setWeatherValue/weatherDeterminationQuery';
import ResponseParseSetValue from './../setWeatherValue/responseParseSetValue';
import BrowserLocalStorage from '../browserLocalStorage';
import constants from './../constants';

export default class CitySearch {
    constructor() {
        this.citySearch = document.querySelector('.hamburger-menu .search__input');
        this.dropdownList = document.querySelector('.hamburger-menu .search__dropdown-list');

        this.weatherDeterminationQuery = new WeatherDeterminationQuery();
        this.responseParseSetValue = new ResponseParseSetValue();
        this.browserLocalStorage = new BrowserLocalStorage();

        this.setKeyboardEvent();
        this.clickHideShowDropdownList();
    }

    setKeyboardEvent() {
        let inputTimer;
        this.citySearch.addEventListener('keyup', e => {
            clearTimeout(inputTimer);

            if (e.target.value.length < 3) {
                this.removeCityResultList();
                return;
            }

            if (e.key === 'Enter') {
                this.geoQuery(e.target.value);
            } else {
                inputTimer = setTimeout(() => this.geoQuery(e.target.value), 800);
            }
        });
    }

    geoQuery(value) {
        fetch(`https://api.opencagedata.com/geocode/v1/json?key=fbc7e3dd63424abaae8705672d4d729d&q=${value}&language=${this.browserLocalStorage.getItem(constants.USER_LANGUAGE)}`)
            .then(res => res.json())
            .then(res => this.parseCitySearch(res));
    }

    parseCitySearch(res) {
        this.removeCityResultList();

        res.results.forEach(item => {
            if (item.components._category !== 'place') return;
            
            let element = document.createElement('li');
            element.classList.add('dropdown-list__item');
            element.setAttribute('data-lat', item.geometry.lat);
            element.setAttribute('data-lng', item.geometry.lng);

            // attempts get city
            let city = '';
            if (typeof item.components.city !== 'undefined') {
                city = item.components.city;
            } else if (typeof item.components.town !== 'undefined') {
                city = item.components.town;
            } else if (typeof item.components.county !== 'undefined') {
                city = item.components.county;
            } else if (typeof item.components.state !== 'undefined') {
                city = item.components.state;
            }

            const itemValue = city === '' ? item.components.country : `${city}, ${item.components.country}`;
            element.textContent = itemValue;
            element.setAttribute('data-value', itemValue);
            element.setAttribute('data-city', city);
            element.setAttribute('data-country', item.components.country);
            element.setAttribute('title', item.formatted);
            this.dropdownList.append(element);

            element.addEventListener('click', () => {
                this.citySearch.value = element.getAttribute('data-value');
                this.weatherDeterminationQuery
                    .query(element.getAttribute('data-lat'), element.getAttribute('data-lng'))
                    .then(res => this.responseParseSetValue.responseParse(res));
            });
        });
    }

    removeCityResultList() {
        this.dropdownList.querySelectorAll('li').forEach(item => {
            item.remove();
        });
    }

    clickHideShowDropdownList() {
        window.addEventListener('click', e => {
            switch (e.target.getAttribute('id')) {
                case 'menu-search-input':
                    this.dropdownList.classList.add('active');
                    break;
                default:
                    this.dropdownList.classList.remove('active');
                    break;
            };
        });
    }
}