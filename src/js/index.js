import 'babel-polyfill';

import constants from './constants';
import contentRu from './content/contentRu';
import contentEn from './content/contentEn';
import BrowserLocalStorage from './browserLocalStorage';
import Preloader from './preloader';
import WeatherDeterminationQuery from './setWeatherValue/weatherDeterminationQuery';
import ResponseParseSetValue from './setWeatherValue/responseParseSetValue';
import HamburgerMenu from './hamburgerMenu';


const browserLocalStorage = new BrowserLocalStorage();
browserLocalStorage.setDefaultValue();

const preloader = new Preloader();
preloader.setTitle();

const weatherDeterminationQuery = new WeatherDeterminationQuery();
const responseParseSetValue = new ResponseParseSetValue();

const hamburgerMenu = new HamburgerMenu();


