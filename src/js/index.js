import 'babel-polyfill';

const BROWSER_LANGUAGE = navigator.language || navigator.userLanguage;
const USER_LANGUAGE = 'user_language';
const CELSIUS_DEGREES = '°';

if (localStorage.getItem(USER_LANGUAGE) === null && localStorage.getItem(USER_LANGUAGE) !== BROWSER_LANGUAGE) {
    localStorage.setItem(USER_LANGUAGE, BROWSER_LANGUAGE.slice(0, 2));
}

const WELCOME_INSPIRATION_EN = 'Whats the weather?';
const WELCOME_INSPIRATION_RU = 'Какая сейчас погода?';

const KILOMETRES_PER_HOUR = 1.6;

const DAYS_OF_THE_WEEK = [
    'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'
];

const preloaderSection = document.querySelector('.preloader-wrap');
const preloaderTitle = document.querySelector('.preloader__title');

localStorage.getItem(USER_LANGUAGE) === 'en'
    ? preloaderTitle.textContent = WELCOME_INSPIRATION_EN
    : preloaderTitle.textContent = WELCOME_INSPIRATION_RU;

const bgImage = document.querySelector('.wrap');
const temperature = document.querySelector('.description__temperature');
const descriptionText = document.querySelector('.description__text');
const cloudy = document.querySelector('.gamburger-menu .details .cloudy__value');
const humidity = document.querySelector('.gamburger-menu .details .humidity__value');
const windSpeed = document.querySelector('.gamburger-menu .details .wind-speed__value');
const dayTemperature = document.querySelector('.gamburger-menu .slider .day');
const hoursTemperature = document.querySelector('.gamburger-menu .slider .hours');
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
        cloudy.textContent = `${res.weatherJsonParsed.currently.cloudCover * 100}%`;
        humidity.textContent = `${res.weatherJsonParsed.currently.humidity * 100}%`;
        // round number
        windSpeed.textContent = `${Math.floor(res.weatherJsonParsed.currently.windSpeed * KILOMETRES_PER_HOUR * 10) / 10}km/h`;
        // set daily weather
        res.weatherJsonParsed.daily.data.reduce((acc, item) => {
            if (new Date().getDay() < new Date(item.time * 1000).getDay() || acc !== 0) {
                let element = `
                    <li class="day__item">
                        <div class="day__day-week">${DAYS_OF_THE_WEEK[new Date(item.time * 1000).getDay()]}</div>
                        <div class="day__icon">icon</div>
                        <div class="day__temperature">${Math.round(((item.temperatureHigh + item.temperatureLow) / 2) - TEMPERATURE_DELTA)}${CELSIUS_DEGREES}</div>
                    </li>`;

                dayTemperature.insertAdjacentHTML('beforeend', element);

                return ++acc;
            } else {
                return acc;
            }
        }, 0);
        res.weatherJsonParsed.hourly.data.reduce((acc, item) => {
            let targetDate = new Date(item.time * 1000).getHours();
            if ((new Date().getHours() < targetDate || acc !== 0) && acc < 24) {
                let element = `
                    <li class="hours__item">
                        <div class="hours__hour">${targetDate < 10 ? '0' + targetDate : targetDate}:00</div>
                        <div class="hours__icon">icon</div>
                        <div class="hours__temperature">${Math.round(item.temperature) - TEMPERATURE_DELTA}${CELSIUS_DEGREES}</div>
                    </li>
                `;

                hoursTemperature.insertAdjacentHTML('beforeend', element);

                return ++acc;
            } else {
                return acc;
            }
        }, 0)
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


const citySearch = document.querySelector('.gamburger-menu .search__input');
const dropdownList = document.querySelector('.gamburger-menu .search__dropdown-list');
let inputTimer;
let citySearchResult;

citySearch.addEventListener('input', e => {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => {
        fetch(`https://api.opencagedata.com/geocode/v1/json?key=fbc7e3dd63424abaae8705672d4d729d&q=${e.target.value}`)
            .then(res => res.json())
            .then(res => parseCitySearch(res));
    }, 1000);
})

let parseCitySearch = res => {
    dropdownList.querySelectorAll('li').forEach(item => {
        item.remove();
    })
    res.results.forEach(item => {
        let element = document.createElement('li');
        element.classList.add('dropdown-list__item');
        element.setAttribute('data-value', item.formatted);
        element.setAttribute('data-lat', item.geometry.lat);
        element.setAttribute('data-lng', item.geometry.lng);
        element.textContent = item.formatted;
        dropdownList.append(element);

        element.addEventListener('click', () => {
            citySearch.value = element.getAttribute('data-value');
            query(element.getAttribute('data-lat'), element.getAttribute('data-lng')).then(res => responseParse(res));
        })
    })
}

window.addEventListener('click', e => {
    switch (e.target.getAttribute('id')) {
        case 'menu-search-input':
            dropdownList.classList.add('active');
            break;
        case 'dropdown-list':
            dropdownList.classList.remove('active');
            break;
        default:
            dropdownList.classList.remove('active');
            break;
    }
})


const daySwitch = document.querySelector('.gamburger-menu .header .slider-button__day');
const hoursSwitch = document.querySelector('.gamburger-menu .header .slider-button__hours');
const slider = document.querySelector('.gamburger-menu .slider');
const slideDay = document.querySelector('.gamburger-menu .slider .day');
const slideHours = document.querySelector('.gamburger-menu .slider .hours');

daySwitch.addEventListener('click', () => {
    slider.classList.remove('shift');
})

hoursSwitch.addEventListener('click', () => {
    slider.classList.add('shift');
})

let dragAndDropSlideDay = item => {
    let isDown = false;
    let startX;
    let scrollLeft;

    item.addEventListener('mousedown', e => {
            isDown = true;
            item.style.cursor = 'grabbing';
            startX = e.pageX - item.offsetLeft;
            scrollLeft = item.scrollLeft;
    });
    item.addEventListener('mouseup', e => {
            isDown = false;
            item.style.cursor = 'default';
    });
    item.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - item.offsetLeft;
            const walk = (x - startX) * 2;
            item.scrollLeft = scrollLeft - walk;
    });
}

dragAndDropSlideDay(slideDay);
dragAndDropSlideDay(slideHours);

