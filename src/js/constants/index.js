export default {
    ENGLISH: 'en',
    RUSSIAN: 'ru',
    
    BROWSER_LANGUAGE: (navigator.language || navigator.userLanguage).slice(0, 2),
    USER_LANGUAGE: 'user_language',

    TEMPERATURE_SCALE: 'temperature_scale',
    CELSIUS: 'celsius',
    FARENHEIT: 'farenheit',

    CELSIUS_DEGREES: '°C',
    FARENHEIT_DEGREES: '°F',

    CURRENT_TEMPERATURE: 'current_temperature',

    KILOMETRES_PER_HOUR: 1.6,

    TEMPERATURE_DELTA: 32,

    DAYS_OF_THE_WEEK_RU: [
        'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'
    ],

    DAYS_OF_THE_WEEK_EN: [
        'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'
    ],
}
