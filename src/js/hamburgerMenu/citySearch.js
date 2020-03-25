import WeatherDeterminationQuery from './../setWeatherValue/weatherDeterminationQuery';
import ResponseParseSetValue from './../setWeatherValue/responseParseSetValue';
import BrowserLocalStorage from '../browserLocalStorage';
import constants from '../constants';
import contentEn from '../setTargetLanguage/contentEn';
import contentRu from '../setTargetLanguage/contentRu';

export default class CitySearch {
    constructor() {
        this.citySearch = document.querySelector('.hamburger-menu .search__input');

        this.loader = document.querySelector('.search__loader');

        this.dropdownList = document.querySelector('.hamburger-menu .search__dropdown-list');
        this.dropdownListChildrenSelected = null;

        this.weatherDeterminationQuery = new WeatherDeterminationQuery();
        this.responseParseSetValue = new ResponseParseSetValue();
        this.browserLocalStorage = new BrowserLocalStorage();
    }

    setKeyboardEvent() {
        this.citySearch.addEventListener('keyup', e => {
            if (e.target.value.length < 3) {
                this.removeCityResultList();
                return;
            }
            
            const dropdownListResult = this.dropdownList.querySelectorAll('.dropdown-list__item');

            if (e.key === 'Enter' && this.dropdownListChildrenSelected !== null) {
                const currentItem = dropdownListResult[this.dropdownListChildrenSelected];
                this.chooseSelectedPlace(
                    currentItem.textContent,
                    Number(currentItem.getAttribute('data-lat')),
                    Number(currentItem.getAttribute('data-lon')),
                );
                this.removeCityResultList();
            } else if (e.key === 'Enter' && this.dropdownListChildrenSelected === null) {
                this.removeCityResultList();
                this.geoQuery(e.target.value);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                if (dropdownListResult.length) {
                    this.enableSelectingLocationByArrows(e);
                }
            } else if (e.key === 'Escape') {
                this.removeCityResultList();
            }
        });

        let inputTimer;
        this.citySearch.addEventListener('input', e => {
            clearTimeout(inputTimer);

            if (e.target.value.length < 3) {
                this.removeCityResultList();
                return;
            }

            this.dropdownListChildrenSelected = null;
            inputTimer = setTimeout(() => this.geoQuery(e.target.value), 800);
            this.removeCityResultList();
        });
    }

    geoQuery(value) {
        this.loader.classList.add('active');

        this.weatherDeterminationQuery.getUserLocation(value)
            .then(res => res ? this.parseCitySearch(res.responseResult) : this.setLabelFidnNothing())
            .then(() => this.loader.classList.remove('active'));
    }

    parseCitySearch(res) {
        this.removeCityResultList();

        res.results.forEach(item => {
            if (item.components._category !== 'place') return;
            
            const city = this.getCityValue(item.components);
            const country = item.components.country;
            const cityAndCountryValue = this.weatherDeterminationQuery.getCityAndCountryValue(city, country);

            // if we have duplicate, we skip current iteration and don't show current element
            if (this.dropdownList.querySelectorAll('.dropdown-list__item').length) {
                // transform NodeList to Array
                const dropdownListChildrensNodeList = this.dropdownList.querySelectorAll('.dropdown-list__item');
                const dropdownListChildrensArray = Array.prototype.slice.call(dropdownListChildrensNodeList);
                
                const dropdownListChildrensTextContent = dropdownListChildrensArray.map(item => {
                    return item.textContent;
                });

                // go to next loop iteration
                if (dropdownListChildrensTextContent.indexOf(cityAndCountryValue) !== -1) return;
            }

            const element = document.createElement('li');
            element.classList.add('dropdown-list__item');
            element.setAttribute('data-lat', item.geometry.lat);
            element.setAttribute('data-lon', item.geometry.lng);

            element.textContent = cityAndCountryValue;
            element.setAttribute('data-value', cityAndCountryValue);
            element.setAttribute('data-city', city);
            element.setAttribute('data-country', country);
            element.setAttribute('title', item.formatted);
            this.dropdownList.append(element);

            element.addEventListener('mousedown', this.chooseSelectedPlace.bind(
                this,
                element.getAttribute('data-value'),
                element.getAttribute('data-lat'),
                element.getAttribute('data-lon'),
            ));
        });

        if (!this.dropdownList.querySelectorAll('.dropdown-list__item').length) {
            this.setLabelFidnNothing();
        }
    }

    setLabelFidnNothing() {
        this.removeCityResultList();
        
        const currentLanguage = this.browserLocalStorage.getItem(constants.USER_LANGUAGE);

        const element = document.createElement('li');
        element.classList.add('dropdown-list__nothing-item');

        switch (currentLanguage) {
            case 'ru':
                element.textContent = contentRu.searchLocationFindNothing;
                break;
            default:
                element.textContent = contentEn.searchLocationFindNothing;
                break;
        }

        this.dropdownList.append(element);
    }

    chooseSelectedPlace(cityAndCountry, lat, lon) {
        this.citySearch.value = '';
        this.citySearch.setAttribute('placeholder', cityAndCountry);
        this.weatherDeterminationQuery.setCurrentLatAndLonInLocalStorage(lat, lon);

        this.weatherDeterminationQuery
            .queryWeather(lat, lon)
            .then(weatherResult => this.responseParseSetValue.responseParse({
                userLocation: { cityAndCountry, lat: Number(lat), lon: Number(lon) },
                weatherJsonParsed: weatherResult
            }));

        this.removeCityResultList();
    }

    // attempts get city
    getCityValue(value) {
        const { city, town, county, state } = value;
        return city || town || county || state || '';
    }

    enableSelectingLocationByArrows(e) {
        const dropdownListChildrens = this.dropdownList.querySelectorAll('.dropdown-list__item');
        const dropdownListChildrensLength = dropdownListChildrens.length - 1;

        switch (e.key) {
            case 'ArrowUp':
                if (this.dropdownListChildrenSelected === 0) {
                    this.dropdownListChildrenSelected = dropdownListChildrensLength;
                } else if (this.dropdownListChildrenSelected !== null) {
                    this.dropdownListChildrenSelected--;
                } else {
                    this.dropdownListChildrenSelected = dropdownListChildrensLength;
                }
                this.removeAndSetActiveOnDropdownListItem(dropdownListChildrens);
                break;

            case 'ArrowDown':
                if (this.dropdownListChildrenSelected === dropdownListChildrensLength) {
                    this.dropdownListChildrenSelected = 0;
                } else if (this.dropdownListChildrenSelected !== null) {
                    this.dropdownListChildrenSelected++;
                } else {
                    this.dropdownListChildrenSelected = 0;
                }
                this.removeAndSetActiveOnDropdownListItem(dropdownListChildrens);
                break;

            default:
                this.dropdownListChildrenSelected = null;
                break;
        }
    }

    removeCityResultList() {
        this.dropdownList.querySelectorAll('li').forEach(item => {
            item.remove();
        });
        this.dropdownListChildrenSelected = null;
    }

    removeAndSetActiveOnDropdownListItem(dropdownListChildrens) {
        dropdownListChildrens.forEach(item => {
            item.classList.remove('active');
        });

        dropdownListChildrens[this.dropdownListChildrenSelected].classList.add('active');
    }

    clickHideShowDropdownList() {
        window.addEventListener('mouseup', e => {
            switch (e.target.getAttribute('id')) {
                case 'menu-search-input':
                    break;
                default:
                    this.removeCityResultList();
                    break;
            };
        });
    }
}