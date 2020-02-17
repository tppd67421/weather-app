import contentEn from './contentEn';
import contentRu from './contentRu';

export default class SetTargetLanguage {
    constructor() {
        this.nextDayDate = new Date().getDay() + 1;
        
        this.preloaderTitle = document.querySelector('.preloader__title');

        this.weatherDetails = document.querySelector('.details');
        this.weatherDetailsTitle = this.weatherDetails.querySelector('.menu__title');
        this.weatherDetailsCloudy = this.weatherDetails.querySelector('.cloudy__title');
        this.weatherDetailsHumidity = this.weatherDetails.querySelector('.humidity__title');
        this.weatherDetailsWind = this.weatherDetails.querySelector('.wind-speed__title');

        this.weatherTemperature = document.querySelector('.menu__temperature');
        this.weatherTemperatureListsTitle = this.weatherTemperature.querySelector('.menu__title');
        this.weatherTemperatureDays = this.weatherTemperature.querySelector('.slider-button__days');
        this.weatherTemperatureHours = this.weatherTemperature.querySelector('.slider-button__hours');

        this.selectEnglish = document.querySelector('.language__item .english');
        this.selectRussian = document.querySelector('.language__item .russian');
    }


    setLanguage(language) {
        switch (language) {
            case 'ru':
                this.languageContent = contentRu;
                break;

            default:
                this.languageContent = contentEn;
                break;
        }

        this.weatherTemperatureDaysList = this.weatherTemperature.querySelectorAll('.day__item');

        this.preloaderTitle.textContent = this.languageContent.preloaderText;

        this.weatherDetailsTitle.textContent = this.languageContent.weatherDetailsTitle;
        this.weatherDetailsCloudy.textContent = this.languageContent.weatherDetailsCloudy;
        this.weatherDetailsHumidity.textContent = this.languageContent.weatherDetailsHumidity;
        this.weatherDetailsWind.textContent = this.languageContent.weatherDetailsWind;

        this.weatherTemperatureListsTitle.textContent = this.languageContent.weatherTemperature;
        this.weatherTemperatureDays.textContent = this.languageContent.daysTemperature;
        this.weatherTemperatureHours.textContent = this.languageContent.hoursTemperature;
        this.weatherTemperatureDaysList.forEach((weatherItem, counter) => {
            // create looped array
            const index = (counter + this.nextDayDate) % this.languageContent.daysOfTheWeek.length;
            weatherItem.querySelector('.day__day-week').textContent = this.languageContent.daysOfTheWeek[index];
        });

        this.selectEnglish.textContent = this.languageContent.languageSwitcherEn;
        this.selectRussian.textContent = this.languageContent.languageSwitcherRu;
    }
}