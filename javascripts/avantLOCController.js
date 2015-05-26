

var app = angular.module('avantLOCapp', []);
app.controller('avantLOCCtrl', function($scope) {
    round_currency = function(value) {
        return Math.round(value * 100) / 100;
    }

    // Used to silo the input form from the account variables - so a user can't arbitrarily change something
    $scope.inputs = {
        credit_limit: 1000,
        APR: 35,
        initial_balance: 500,
        payment_amount: 0,
        withdrawal_amount: 0
    }

    $scope.account = {
        credit_limit: 0,
        APR: 0,
        balance: 0,
        accrued_interest_balance: 0,
        ledger: []
    },
    $scope.day_count = 1;
    $scope.account_initiated = false;

    $scope.reset_account_balances = function() {
        $scope.account.balance = 0;
        $scope.account.accrued_interest_balance = 0;
    }

    // Amount should be negative if crediting the customers account (decreasing the loan balance)
    $scope.create_journal_entry = function(day, action, amount, accrued_interest) {
        var amount = round_currency(amount);
        var accrued_interest = accrued_interest;
        var new_balance = round_currency($scope.account.balance + amount);
        var new_accrued_interest_balance = $scope.account.accrued_interest_balance + accrued_interest;

        $scope.account.ledger.push({
            day: day,
            action: action,
            amount: amount,
            balance: new_balance,
            accrued_interest: accrued_interest
        });

        $scope.account.balance = new_balance;
        $scope.account.accrued_interest_balance = new_accrued_interest_balance;
    }

    $scope.initiate_account = function() {
        var initial_balance = round_currency(Number($scope.inputs.initial_balance));
        var credit_limit = round_currency($scope.inputs.credit_limit);
        var APR = $scope.inputs.APR / 100;

        console.log('initial balance: ' + initial_balance.toString());
        console.log('credit limit: ' + credit_limit.toString());

        $scope.day_count = 1;
        $scope.account.credit_limit = credit_limit;
        $scope.account.APR = APR;
        $scope.account.ledger = [];
        $scope.reset_account_balances();
        $scope.create_journal_entry(
            $scope.day_count, "Create LOC", initial_balance, 0
        );

        $scope.account_initiated=true;
    }

    $scope.bill_accrued_interest = function() {
       $scope.create_journal_entry(
           $scope.day_count, "Bill Interest", $scope.account.accrued_interest_balance, -1 * $scope.account.accrued_interest_balance
       );

    }

    $scope.close_day = function() {
        var accrued_interest = $scope.account.balance * $scope.account.APR / 365;
        var billing_day = ($scope.day_count % 30) == 0;

        $scope.create_journal_entry($scope.day_count, "Interest Accrual", 0, accrued_interest);

        // Bill for interest if we are on a 30-day interval.
        if(billing_day) {
          $scope.bill_accrued_interest();
        }

        $scope.day_count++;
    }

    $scope.make_payment = function() {
        var payment_amount = round_currency($scope.inputs.payment_amount);

        if($scope.payment_field_valid()) {
            $scope.create_journal_entry($scope.day_count, "Payment", -1 * payment_amount, 0);
        }
    }

    $scope.make_withdrawal = function() {
        var withdrawal_amount = round_currency($scope.inputs.withdrawal_amount);

        if($scope.withdraw_field_valid()) {
            $scope.create_journal_entry($scope.day_count, "Withdrawal", withdrawal_amount, 0);
        }
    }

    // There is probably a more preferred design pattern for validations using Angular's validation directives/classes
    // but I will need more time to get more familiar with it.
    $scope.payment_field_valid = function() {
        return $scope.inputs.payment_amount >= 0 && $scope.inputs.payment_amount <= $scope.account.balance;
    }

    $scope.withdraw_field_valid = function() {
        return $scope.inputs.withdrawal_amount >= 0 && ($scope.inputs.withdrawal_amount <= $scope.account.credit_limit - $scope.account.balance);
    }

    $scope.exceed_credit_limit = function() {
        return $scope.account.balance > $scope.account.credit_limit;
    }

});
