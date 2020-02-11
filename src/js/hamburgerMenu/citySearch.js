import WeatherDeterminationQuery from './../setWeatherValue/weatherDeterminationQuery';
import ResponseParseSetValue from './../setWeatherValue/responseParseSetValue';

export default class CitySearch {
    constructor() {
        this.citySearch = document.querySelector('.hamburger-menu .search__input');
        this.dropdownList = document.querySelector('.hamburger-menu .search__dropdown-list');

        this.weatherDeterminationQuery = new WeatherDeterminationQuery();
        this.responseParseSetValue = new ResponseParseSetValue();

        this.setKeyboardEvent();
        this.clickHideShowDropdownList();
    }

    setKeyboardEvent() {
        let inputTimer;
        this.citySearch.addEventListener('keyup', e => {
            clearTimeout(inputTimer);
            if (e.key === 'Enter') {
                this.geoQuery(e.target.value);
            } else {
                inputTimer = setTimeout(() => this.geoQuery(e.target.value), 800);
            }
        })
    }

    geoQuery(value) {
        fetch(`https://api.opencagedata.com/geocode/v1/json?key=fbc7e3dd63424abaae8705672d4d729d&q=${value}`)
            .then(res => res.json())
            .then(res => this.parseCitySearch(res));
    }

    parseCitySearch(res) {
        this.dropdownList.querySelectorAll('li').forEach(item => {
            item.remove();
        })
        res.results.forEach(item => {
            let element = document.createElement('li');
            element.classList.add('dropdown-list__item');
            element.setAttribute('data-value', item.formatted);
            element.setAttribute('data-lat', item.geometry.lat);
            element.setAttribute('data-lng', item.geometry.lng);
            element.textContent = item.formatted;
            this.dropdownList.append(element);

            element.addEventListener('click', () => {
                this.citySearch.value = element.getAttribute('data-value');
                this.weatherDeterminationQuery
                    .query(element.getAttribute('data-lat'), element.getAttribute('data-lng'))
                    .then(res => this.responseParseSetValue.responseParse(res));
            })
        })
    }

    clickHideShowDropdownList() {
        window.addEventListener('click', e => {
            switch (e.target.getAttribute('id')) {
                case 'menu-search-input':
                    this.dropdownList.classList.add('active');
                    break;
                case 'dropdown-list':
                    this.dropdownList.classList.remove('active');
                    break;
                default:
                    this.dropdownList.classList.remove('active');
                    break;
            }
        })
    }
}