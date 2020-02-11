import ResponseParseSetValue from './responseParseSetValue';
import constants from './../constants';
import BrowserLocalStorage from './../browserLocalStorage';

export default class WeatherDeterminationQuery {
    constructor() {
        this.responseParseSetValue = new ResponseParseSetValue();
        this.browserLocalStorage = new BrowserLocalStorage();

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

    async query(lat, lon) {
        try {
            const ipInfo = await fetch('https://api.sypexgeo.net/json');
            const ipInfoJson = await ipInfo.json();

            const weather = await fetch(`https://api.allorigins.win/get?url=https://api.darksky.net/forecast/23927c2ea3d64eff20642e6125e3bc20/${lat ? lat : ipInfoJson.city.lat},${lon ? lon : ipInfoJson.city.lon}?lang=${this.browserLocalStorage.getItem(constants.USER_LANGUAGE)}`)
            const weatherJson = await weather.json();
            const weatherJsonParsed = await JSON.parse(weatherJson.contents);

            return { ipInfoJson, weatherJsonParsed };
        } catch (error) {
            console.log('Error: ', error)
        }
    }
}