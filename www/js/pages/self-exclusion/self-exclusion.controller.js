/**
 * @name self-exclusion module
 * @author Morteza Tavnarad
 * @contributors []
 * @since 11/12/2016
 * @copyright Binary Ltd
 */

(function() {
    angular.module("binary.pages.self-exclusion.controllers").controller("SelfExclusionController", SelfExclusion);

    SelfExclusion.$inject = ["$scope", "$translate", "alertService", "websocketService"];

    function SelfExclusion($scope, $translate, alertService, websocketService) {
        const vm = this;
        vm.today = new Date();
        vm.minDate = vm.today.toISOString().slice(0, 10);
        vm.minDateTime = vm.today.toISOString();
        vm.nextSixWeeks = new Date(vm.today.getTime() + 7 * 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        vm.nextSixMonths = new Date(vm.today.getTime() + 30 * 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        vm.disableUpdateButton = true;
        vm.data = {};

        $scope.$on("get-self-exclusion", (e, response) => {
            $scope.$applyAsync(() => {
                vm.data = response;
                vm.limits = _.clone(response);
                vm.disableUpdateButton = false;
            });
        });

        $scope.$on("get-self-exclusion:error", (e, error) => {
            alertService.displayError(error);
            vm.disableUpdateButton = false;
        });

        $scope.$on("set-self-exclusion", (e, response) => {
            $translate(["self-exclusion.success", "self-exclusion.save-prompt"]).then(translation => {
                alertService.displayAlert(
                    translation["self-exclusion.success"],
                    translation["self-exclusion.save-prompt"]
                );
            });
            vm.limits = _.clone(vm.data);
            vm.disableUpdateButton = false;
            if (vm.data.exclude_until || vm.data.timeout_until) {
                websocketService.logout();
            }
        });

        $scope.$on("set-self-exclusion:error", (e, error) => {
            alertService.displayError(error);
            vm.disableUpdateButton = false;
        });

        vm.submit = function() {
            vm.disableUpdateButton = true;
            setSelfExclusion();
        };

        init();

        function getSelfExclusion() {
            websocketService.sendRequestFor.getSelfExclusion();
        }

        function setSelfExclusion() {
            const data = _.clone(vm.data);

            if (data.timeout_until) {
                data.timeout_until = new Date(data.timeout_until).getTime() / 1000;
            }

            if (data.exclude_until) {
                data.exclude_until = data.exclude_until.toISOString().slice(0, 10);
            }

            // Convert all numbers to string for supporting number with more than 15 digits
            let stringify = JSON.stringify(data);
            stringify = stringify.replace(/:(\d+)([,}])/g, ':"$1"$2');
            websocketService.sendRequestFor.setSelfExclusion(JSON.parse(stringify));
        }

        function init() {
            getSelfExclusion();
        }
    }
})();
