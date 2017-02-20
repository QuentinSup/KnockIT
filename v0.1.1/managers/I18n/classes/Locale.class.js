var fr;
(function (fr) {
    var fwk;
    (function (fwk) {
        var knockit;
        (function (knockit) {
            var manager;
            (function (manager) {
                var Locale = (function () {
                    function Locale(language, isoCode) {
                        this.language = language;
                        this.isoCode = isoCode;
                    }
                    Locale.prototype.getLang = function () {
                        return this.language;
                    };
                    Locale.prototype.getIsoCode = function () {
                        return this.isoCode;
                    };
                    return Locale;
                })();
                manager.Locale = Locale;
            })(manager = knockit.manager || (knockit.manager = {}));
        })(knockit = fwk.knockit || (fwk.knockit = {}));
    })(fwk = fr.fwk || (fr.fwk = {}));
})(fr || (fr = {}));
