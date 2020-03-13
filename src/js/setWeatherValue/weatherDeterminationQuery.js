import ResponseParseSetValue from './responseParseSetValue';
import constants from './../constants';
import BrowserLocalStorage from './../browserLocalStorage';

export default class WeatherDeterminationQuery {
    constructor() {
        this.responseParseSetValue = new ResponseParseSetValue();
        this.browserLocalStorage = new BrowserLocalStorage();
    }

    geolocation() {
        navigator.geolocation.getCurrentPosition(
            (...args) => this.success(...args),
            (...args) => this.error(...args)
        );
    }

    success(pos) {
        let crd = pos.coords;
        this.query(crd.latitude, crd.longitude).then(res => this.responseParseSetValue.responseParse(res));
    }

    error() {
        this.query().then(res => this.responseParseSetValue.responseParse(res));
    }

    async query() {
        try {
            const ipInfoResult = await this.queryCity();

            const weatherJsonParsed = await this.queryWeather(ipInfoResult.lat, ipInfoResult.lon);

            return { ipInfoResult, weatherJsonParsed };
        } catch (error) {
            this.queryError(error);
        }
    }

    async queryCity() {
        try {
            const ipInfo = await fetch('https://api.sypexgeo.net/json');
            const ipInfoJson = await ipInfo.json();

            const currentCityName = ipInfoJson.city[`name_${this.browserLocalStorage.getItem(constants.USER_LANGUAGE)}`];
            const currentCountryName = ipInfoJson.country[`name_${this.browserLocalStorage.getItem(constants.USER_LANGUAGE)}`];

            const ipInfoResult = {
                cityAndCountry: this.getCityAndCountryValue(currentCityName, currentCountryName),
                lat: ipInfoJson.city.lat,
                lon: ipInfoJson.city.lon
            };

            const currentLocation = {};
            constants.EXISTING_LANGUAGE.forEach(item => {
                currentLocation[item] = this.getCityAndCountryValue(ipInfoJson.city[`name_${item}`], ipInfoJson.country[`name_${item}`]);
            });

            this.browserLocalStorage.setItem(constants.CURRENT_CITY, JSON.stringify(currentLocation));

            return ipInfoResult;
        } catch (error) {
            this.queryError(error);
        }
    }

    getCityAndCountryValue(city, country) {
        if (typeof city === 'undefined' || city === '' || typeof country === 'undefined' || country === '') {
            return `${city || ''}${country || ''}`;
        } else {
            return `${city}, ${country}`;
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
}