export default {
    ENGLISH: 'en',
    RUSSIAN: 'ru',
    
    BROWSER_LANGUAGE: (navigator.language || navigator.userLanguage).slice(0, 2),
    USER_LANGUAGE: 'user_language',

    THEME: 'theme',
    THEME_AUTO: 'auto',
    THEME_DARK: 'dark',
    THEME_LIGHT: 'light',
    THEME_ATTR: 'data-theme',

    TEMPERATURE_SCALE: 'temperature_scale',
    CELSIUS: 'celsius',
    FARENHEIT: 'farenheit',

    CELSIUS_DEGREES: '°C',
    FARENHEIT_DEGREES: '°F',

    HAMBURGER_MENU: 'hamburger_menu',
    HAMBURGER_MENU_OPEN: 'open',
    HAMBURGER_MENU_CLOSE: 'close',

    CURRENT_TEMPERATURE: 'current_temperature',

    KILOMETRES_PER_HOUR: 3.6,

    TEMPERATURE_DELTA: 32,
}
