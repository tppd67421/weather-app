import WeatherDeterminationQuery from './../setWeatherValue/weatherDeterminationQuery';
import ResponseParseSetValue from './../setWeatherValue/responseParseSetValue';
import BrowserLocalStorage from '../browserLocalStorage';

export default class CitySearch {
    constructor() {
        this.citySearch = document.querySelector('.hamburger-menu .search__input');

        this.dropdownList = document.querySelector('.hamburger-menu .search__dropdown-list');

        this.weatherDeterminationQuery = new WeatherDeterminationQuery();
        this.responseParseSetValue = new ResponseParseSetValue();
        this.browserLocalStorage = new BrowserLocalStorage();
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
        this.weatherDeterminationQuery.getUserLocation(value)
            .then(res => this.parseCitySearch(res.responseResult));
    }

    parseCitySearch(res) {
        this.removeCityResultList();

        res.results.forEach(item => {
            if (item.components._category !== 'place') return;

            const element = document.createElement('li');
            element.classList.add('dropdown-list__item');
            element.setAttribute('data-lat', item.geometry.lat);
            element.setAttribute('data-lon', item.geometry.lng);

            const city = this.getCityValue(item.components);
            const country = item.components.country;
            const cityAndCountryValue = this.weatherDeterminationQuery.getCityAndCountryValue(city, country);

            element.textContent = cityAndCountryValue;
            element.setAttribute('data-value', cityAndCountryValue);
            element.setAttribute('data-city', city);
            element.setAttribute('data-country', country);
            element.setAttribute('title', item.formatted);
            this.dropdownList.append(element);

            element.addEventListener('click', () => {
                const cityAndCountry = element.getAttribute('data-value');
                this.citySearch.value = cityAndCountry;

                const lat = element.getAttribute('data-lat');
                const lon = element.getAttribute('data-lon');
                this.weatherDeterminationQuery.setCurrentLatAndLonInLocalStorage(lat, lon);

                this.weatherDeterminationQuery
                    .queryWeather(lat, lon)
                    .then(weatherResult => this.responseParseSetValue.responseParse({
                        userLocation: { cityAndCountry, lat: Number(lat), lon: Number(lon) },
                        weatherJsonParsed: weatherResult
                    }));
            });
        });
    }

    // attempts get city
    getCityValue(value) {
        const { city, town, county, state } = value;
        return city || town || county || state || '';
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