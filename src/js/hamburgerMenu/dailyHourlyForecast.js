export default class DailyHourlyForecast {
    constructor() {
        this.daySwitch = document.querySelector('.hamburger-menu .header .slider-button__day');
        this.hoursSwitch = document.querySelector('.hamburger-menu .header .slider-button__hours');
        this.slider = document.querySelector('.hamburger-menu .slider');
        this.slideDay = document.querySelector('.hamburger-menu .slider .day');
        this.slideHours = document.querySelector('.hamburger-menu .slider .hours');

        this.addEvent();
        this.dragAndDropSlideDay(this.slideDay);
        this.dragAndDropSlideDay(this.slideHours);
    }

    addEvent() {
        this.daySwitch.addEventListener('click', () => {
            this.slider.classList.remove('shift');
        })

        this.hoursSwitch.addEventListener('click', () => {
            this.slider.classList.add('shift');
        })
    }

    dragAndDropSlideDay(item) {
        let isDown = false;
        let startX;
        let scrollLeft;
        const body = document.querySelector('body');

        item.addEventListener('mousedown', e => {
            isDown = true;
            body.style.cursor = 'grabbing';
            startX = e.pageX - item.offsetLeft;
            scrollLeft = item.scrollLeft;
        });
        window.addEventListener('mouseup', () => {
            isDown = false;
            body.style.cursor = 'default';
        });
        window.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - item.offsetLeft;
            const walk = (x - startX) * 2;
            item.scrollLeft = scrollLeft - walk;
        });
    }
}