/**
 * @name currency filter decorator
 * @author Morteza Tavanarad
 * @contributors []
 * @since 10/21/2016
 * @copyright Binary Ltd
 */

(function() {
    angular.module("binary").config(Currency);

    Currency.$inject = ["$provide"];

    function Currency($provide) {
        $provide.decorator("currencyFilter", [
            "$delegate",
            function(/* $delegate */) {
                // const srcFilter = $delegate;

                const extendsFilter = function() {
                    const locale = (localStorage.language || "en").replace("_", "-").slice(0, 2);
                    const currency = arguments[1] || "USD";

                    if (isNaN(arguments[0])) {
                        return '--';
                    }
                    return formatMoney(locale, currency, arguments[0]);
                };

                function formatMoney(locale, currency, value) {
                    const options = {
                        style   : "currency",
                        currency: currency || "USD"
                    };

                    if (/btc|xbt/i.test(currency)) {
                        options.minimumFractionDigits = 2;
                        options.maximumFractionDigits = 8;
                    }

                    return Intl.NumberFormat(locale, options).format(value);
                }
                /*
                const moneySigns = {
                    USD: "$",
                    GBP: "£",
                    AUD: "A$",
                    EUR: "€",
                    JPY: "¥"
                };
                */
                return extendsFilter;
            }
        ]);
    }
})();
