import ResponseParseSetValue from './responseParseSetValue';
import constants from './../constants';
import BrowserLocalStorage from './../browserLocalStorage';
import CitySearch from '../hamburgerMenu/citySearch';

export default class WeatherDeterminationQuery {
    constructor() {
        this.responseParseSetValue = new ResponseParseSetValue();
        this.browserLocalStorage = new BrowserLocalStorage();
    }

    geolocation() {
        navigator.geolocation.getCurrentPosition(
            (...args) => this.getWeatherByGeolocation(...args),
            (...args) => this.getWeatherByIp(...args)
        );
    }

    getWeatherByGeolocation(pos) {
        let crd = pos.coords;
        this.query(crd.latitude, crd.longitude).then(res => this.responseParseSetValue.responseParse(res));
    }

    getWeatherByIp() {
        this.query().then(res => this.responseParseSetValue.responseParse(res));
    }

    async query(lat = null, lon = null) {
        try {
            let dataWithLocation;
            if (lat && lon) {
                dataWithLocation = await this.getUserLocation(`${lat},${lon}`);
            } else {
                dataWithLocation = await this.queryCity();
            }

            const weatherJsonParsed = await this.queryWeather(dataWithLocation.lat, dataWithLocation.lon);
            return { userLocation: dataWithLocation, weatherJsonParsed };
        } catch (error) {
            this.queryError(error);
        }
    }

    async getUserLocation(value) {
        try {
            const currentLanguage = this.browserLocalStorage.getItem(constants.USER_LANGUAGE);

            const getUserInfo = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=fbc7e3dd63424abaae8705672d4d729d&q=${value}&language=${currentLanguage}`);
            const getUserInfoJson = await getUserInfo.json();

            const citySearch = new CitySearch();
            const cityValue = citySearch.getCityValue(getUserInfoJson.results[0].components);
            const countryValue = getUserInfoJson.results[0].components.country;

            let currentLocation = JSON.parse(this.browserLocalStorage.getItem(constants.CURRENT_CITY));

            if (currentLocation === null) {
                currentLocation = { [currentLanguage]: this.getCityAndCountryValue(cityValue, countryValue) };
            } else if (typeof Object.keys(currentLocation).filter(item => item === currentLanguage)[0] === 'undefined') {
                // if we don't have target language in local storage...
                currentLocation[currentLanguage] = this.getCityAndCountryValue(cityValue, countryValue);
            }

            this.browserLocalStorage.setItem(constants.CURRENT_CITY, JSON.stringify(currentLocation));

            const lat = getUserInfoJson.results[0].geometry.lat;
            const lon = getUserInfoJson.results[0].geometry.lng;

            this.setCurrentLatAndLonInLocalStorage(lat, lon);

            return {
                lat: lat,
                lon: lon,
                cityAndCountry: this.getCityAndCountryValue(cityValue, countryValue),
                responseResult: getUserInfoJson
            };
        } catch (error) {
            this.queryError(error);
        }
    }

    async queryCity() {
        try {
            const currentLanguage = this.browserLocalStorage.getItem(constants.USER_LANGUAGE);

            const ipInfo = await fetch('https://api.sypexgeo.net/json');
            const ipInfoJson = await ipInfo.json();

            const currentCityName = ipInfoJson.city[`name_${currentLanguage}`];
            const currentCountryName = ipInfoJson.country[`name_${currentLanguage}`];

            const currentLocation = {};
            constants.EXISTING_LANGUAGE.forEach(item => {
                currentLocation[item] = this.getCityAndCountryValue(ipInfoJson.city[`name_${item}`], ipInfoJson.country[`name_${item}`]);
            });
            this.browserLocalStorage.setItem(constants.CURRENT_CITY, JSON.stringify(currentLocation));

            this.setCurrentLatAndLonInLocalStorage(ipInfoJson.city.lat, ipInfoJson.city.lon);

            return {
                cityAndCountry: this.getCityAndCountryValue(currentCityName, currentCountryName),
                lat: ipInfoJson.city.lat,
                lon: ipInfoJson.city.lon
            };
        } catch (error) {
            this.queryError(error);
        }
    }

    async queryWeather(lat, lon) {
        try {
            const weather = await fetch(`https://api.allorigins.win/get?url=https://api.darksky.net/forecast/23927c2ea3d64eff20642e6125e3bc20/${lat},${lon}?lang=${this.browserLocalStorage.getItem(constants.USER_LANGUAGE)}`);
            const weatherJson = await weather.json();
            return await JSON.parse(weatherJson.contents);
        } catch (error) {
            this.queryError(error);
        }
    }

    queryError(error) {
        console.log('Error: ', error);
    }

    getCityAndCountryValue(city, country) {
        if (typeof city === 'undefined' || city === '' || typeof country === 'undefined' || country === '') {
            return `${city || ''}${country || ''}`;
        } else {
            return `${city}, ${country}`;
        }
    }

    setCurrentLatAndLonInLocalStorage(lat, lon) {
        this.browserLocalStorage.setItem(constants.CURRENT_COORDINATES, JSON.stringify({
            lat: Number(lat),
            lon: Number(lon)
        }));
    }

}