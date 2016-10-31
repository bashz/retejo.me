// this file will mainly handle the translations
// the files in i18n are just translation files, nothing more
var english = require('./i18n/english.json');
var esperanto = require('./i18n/esperanto.json');

var i18n = {
    english: english,
    esperanto: esperanto,
    defaultLanguage: english,
    changeLanguage: function(session, language) {
        if (language == session.language) {
            if (session.language === esperanto) {
                return "Ĉi tiu lingvo estas uzata jam.";
            } else if (session.language === english) {
                return "This language is being used already.";
            }
        } else {
            if (language == esperanto.name) {
                session.language = esperanto;
                return "Lingvo ŝanĝiĝis sukcese.";
            } else if (language == english.name) {
                session.language = english;
                return "Language changed successfully.";
            }
        }
    }
}

module.exports = i18n;
