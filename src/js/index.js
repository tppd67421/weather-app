import 'babel-polyfill';

const BROWSER_LANGUAGE = navigator.language || navigator.userLanguage;
const USER_LANGUAGE = 'user_language';
const CELSIUS_DEGREES = '°';

if (localStorage.getItem(USER_LANGUAGE) === null && localStorage.getItem(USER_LANGUAGE) !== BROWSER_LANGUAGE) {
    localStorage.setItem(USER_LANGUAGE, BROWSER_LANGUAGE.slice(0, 2));
}

const WELCOME_INSPIRATION_EN = 'Whats the weather?';
const WELCOME_INSPIRATION_RU = 'Какая сейчас погода?';

const preloaderSection = document.querySelector('.preloader-wrap');
const preloaderTitle = document.querySelector('.preloader__title');

localStorage.getItem(USER_LANGUAGE) === 'en'
    ? preloaderTitle.textContent = WELCOME_INSPIRATION_EN
    : preloaderTitle.textContent = WELCOME_INSPIRATION_RU;

const bgImage = document.querySelector('.wrap');
const temperature = document.querySelector('.description__temperature');
const descriptionText = document.querySelector('.description__text');
const cityName = document.querySelector('.city__name_city');
const countryName = document.querySelector('.city__name_country');
const time = document.querySelector('.time');
const date = document.querySelector('.date');

const TEMPERATURE_DELTA = 32;

let query = async (lat, lon) => {
    try {
        const ipInfo = await fetch('https://api.sypexgeo.net/json');
        const ipInfoJson = await ipInfo.json();

        const weather = await fetch(`https://api.allorigins.win/get?url=https://api.darksky.net/forecast/23927c2ea3d64eff20642e6125e3bc20/${lat ? lat : ipInfoJson.city.lat},${lon ? lon : ipInfoJson.city.lon}?lang=${localStorage.getItem(USER_LANGUAGE)}`)
        const weatherJson = await weather.json();
        const weatherJsonParsed = await JSON.parse(weatherJson.contents);

        return { ipInfoJson, weatherJsonParsed };
    } catch (error) {
        console.log('Error: ', error)
    }
}


let success = pos => {
    let crd = pos.coords;
    query(crd.latitude, crd.longitude).then(res => responseParse(res));
};
let error = () => {
    query().then(res => responseParse(res));
};
navigator.geolocation.getCurrentPosition(success, error);


let responseParse = res => {
    if (res) {
        temperature.textContent = `${Math.trunc(res.weatherJsonParsed.currently.temperature - TEMPERATURE_DELTA)}${CELSIUS_DEGREES}`;
        descriptionText.textContent = res.weatherJsonParsed.currently.summary;
        cityName.textContent = res.ipInfoJson.city[`name_${localStorage.getItem(USER_LANGUAGE)}`];
        countryName.textContent = res.ipInfoJson.country[`name_${localStorage.getItem(USER_LANGUAGE)}`];
        switch (res.weatherJsonParsed.currently.icon) {
            case 'clear-day':
                bgImage.style.backgroundImage = 'url(./assets/img/clear-day.jpg)';
                break;
            case 'clear-night':
                bgImage.style.backgroundImage = 'url(./assets/img/clear-night.jpg)';
                break;
            case 'rain':
                bgImage.style.backgroundImage = 'url(./assets/img/rain.jpg)';
                break;
            case 'snow':
                bgImage.style.backgroundImage = 'url(./assets/img/snow.jpg)';
                break;
            case 'sleet':
                bgImage.style.backgroundImage = 'url(./assets/img/sleet.jpg)';
                break;
            case 'wind':
                bgImage.style.backgroundImage = 'url(./assets/img/wind.jpg)';
                break;
            case 'fog':
                bgImage.style.backgroundImage = 'url(./assets/img/fog.jpg)';
                break;
            case 'cloudy':
                bgImage.style.backgroundImage = 'url(./assets/img/cloudy.jpg)';
                break;
            case 'partly-cloudy-day':
                bgImage.style.backgroundImage = 'url(./assets/img/partly-cloudy-day.jpg)';
                break;
            case 'partly-cloudy-night':
                bgImage.style.backgroundImage = 'url(./assets/img/partly-cloudy-night.jpg)';
                break;
            default:
                bgImage.style.backgroundImage = 'url(./assets/img/default.jpg)';
                break;
        }
        setTime();
        preloaderSection.classList.remove('active');
    }
};

let setTime = () => {
    let currentlyDate = new Date();

    window.formatDateTime = currentlyDateTimeItem => {
        return currentlyDateTimeItem < 10 ? `0${currentlyDateTimeItem}` : currentlyDateTimeItem;
    }

    let hours = formatDateTime(currentlyDate.getHours());
    let minutes = formatDateTime(currentlyDate.getMinutes());

    let day = formatDateTime(currentlyDate.getDate());
    let month = formatDateTime(currentlyDate.getMonth() + 1);

    time.textContent = `${hours}:${minutes}`;
    date.textContent = `${day}.${month}.${currentlyDate.getFullYear()}`;
};

