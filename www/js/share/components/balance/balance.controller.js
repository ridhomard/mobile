/**
 * @name balance controller
 * @author Morteza Tavnarad
 * @contributors []
 * @since 08/15/2016
 * @copyright Binary Ltd
 */

(function() {
    angular.module("binary.share.components.balance.controllers").controller("BalanceController", Balance);

    Balance.$inject = ["$scope", "websocketService"];

    function Balance($scope, websocketService) {
        const vm = this;
        vm.balance = null;

        $scope.$on("authorize", (e, response, requestId, pathtrough) => {
            $scope.$applyAsync(() => {
                vm.balance = {
                    currency: response.currency,
                    balance : response.balance,
                    loginid : response.loginid
                };
                sessionStorage.setItem("balance", vm.balance.balance);

                changeProposalCurrency();
            });
        });

        $scope.$on("balance", (e, response) => {
            $scope.$applyAsync(() => {
                vm.balance = response;
                changeProposalCurrency();
            });
        });

        $scope.$on("language:updated", e => {
            websocketService.sendRequestFor.forgetAll("balance");
            vm.balance = null;
            getBalance();
        });

        function getBalance() {
            websocketService.sendRequestFor.balance();
        }

        function changeProposalCurrency() {
            $scope.$broadcast("currency:changed", vm.balance.currency);
        }

        getBalance();
    }
})();
