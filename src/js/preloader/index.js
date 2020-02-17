import constants from './../constants';
import contentRu from '../setTargetLanguage/contentRu';
import contentEn from '../setTargetLanguage/contentEn';

export default class Preloader {
    constructor() {
        this.preloaderSection = document.querySelector('.preloader-wrap');
        this.preloaderTitle = document.querySelector('.preloader__title');
    }

    setTitle() {
        localStorage.getItem(constants.USER_LANGUAGE) === constants.ENGLISH
            ? this.preloaderTitle.textContent = contentEn.preloaderText
            : this.preloaderTitle.textContent = contentRu.preloaderText;
    }

    remove() {
        this.preloaderSection.classList.remove('active');
    }
}
