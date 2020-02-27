# Weather app

Project structure:

* `/src/index.js` – main file in project. Here include all files (`js`, `css` and `scss`);
* `/src/static/` – all files which should be in root directory production version;
* `/src/assets/` – `css`, `scss`, `fonts` and `image`;
* `/src/js/` – all js files.


## `SCSS`:

All preprocessor files located in `/src/assets/scss/` folder. We divided into parts my project and here we have main `main.scss` file with imports all another files (or we can say "project parts"). And we have special files whitch don't denote project (`_mixins.scss`, `_variables.scss` and other). In `hamburger` folder we have main file whitch called `_hamburger-menu.scss`.


## `CSS`:

Inside `/src/assets/css/` we have only one file which contains css variables and he needs for several application themes. In future I will take each node, which should have another decoration for a specific theme and set specific variables. After this we will write another variables for text color, background and for other UI elements.


## `JS`:

Inside `/src/js/` we have all js files and all application logic. Here we have main `index.js` file, witch launch another application part.

    Note: in `index.html` file we have part with preloader.

    <script>
        const preloaderTitle = document.querySelector('.preloader__title');
        if (localStorage.getItem('user_language') === 'ru') {
            preloaderTitle.textContent = 'Что с погодой?';
        } else {
            preloaderTitle.textContent = 'What\'s the weather?';
        }
    </script>

    This part needed that we canned very fast set content (title) to preloader. If we don't do it, content doesn't set fast. In future want write two (or more) output files in webpack config.

Inside `/constants/` folder we have some constants, whitch we use for set property to local storage, for some calculate and etc.

Inside `/browserLocalStorage/` folder we have file, which set default values in local storage (if user visit site to the first time) and few methods, which thems we work if us needed set or get something in/from local storage (want write something like setter and getter, but now understand, that this bad way).

Inside `/preloader/` folder we work with preload screen, which users see until site doesn't completely load. Here we set title (this my old implementation, now we set title with use script inside html file) and hide preloader.

Inside `/setTargetLanguage/` folder we have files with content for few language and main `index.js` file, which get all nodes, who should have different content.

In `/setWeatherValue/` we have two files: `weatherDeterminationQuery.js` and `responseParseSetValue.js`. If user visit our site we, first of all, tru get his coorginats in file `weatherDeterminationQuery.js` with use `geolocation`. If user doesn't give us coordinats, we get them with use ip.

> Now I don't correct use ajax calls, but in future I will fix all it (for example if user give coordinates, we don't use them).

After we parse response with use `responseParseSetValue.js` file.

In `/hamburgerMenu/switcher/index.js` we have code for switchers (switch themes, kanguage ang something else). And we extends this file in `languageSwitcher.js` and Lhemethemeswitcher.js'.

If I want search city we use another api (you can see this in `/hamburgerMenu/citySearch.js`)