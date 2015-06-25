/**
 * Created by rstuder on 25.06.15.
 */

var themeSwitcher = (function(){
    function toggleTheme() {
        var settings = appSettings.getSettings();
        if (settings.theme === 'style') {
            settings.theme = 'style2';
        } else {
            settings.theme = 'style';
        }
        appSettings.updateSettings(settings);
        loadTheme();
    }

    function loadTheme(){
        var settings = appSettings.getSettings();
        var themePath = "css/" + settings.theme + ".css";
        var linkThemeCss = $('head link[name="theme"]');
        if (linkThemeCss.attr('href') != themePath) { // only change path, if it is actually different, otherwise flashing occurs on every render
            linkThemeCss.attr('href', themePath)
        }
    }

    return {
        toggleTheme: toggleTheme,
        loadTheme: loadTheme
    }
})();
