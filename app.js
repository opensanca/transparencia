
Vue.filter('currency', function (value) {
    if (typeof value !== "number") {
        return value;
    }
    var formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    });
    return formatter.format(value);
});

Vue.component('delta-indicator', {
    props: ['amount'],
    template: `<span>
        <span v-if="amount == 0" class="delta-indicator-no-change">(=)</span>
        <span v-if="amount < 0" class="delta-indicator-decrease">(-)</span>
        <span v-if="amount > 0" class="delta-indicator-increase">(+)</span>
    </span>`
});

fetch('data.json').then(resp => {
    resp.json().then(data => {

        // aggregate data with deltas and "previous balance"
        let previousMonth = null;
        for (const month of data.months) {

            const transactions = month.transactions;
            let income = 0;
            let expenses = 0;
            for (const transaction of transactions) {
                if (transaction.amount > 0) {
                    income += transaction.amount;
                } else {
                    expenses += transaction.amount;
                }
            }
            month.income = income;
            month.expenses = expenses;

            if (previousMonth) {
                month.balance = previousMonth.balance + month.income + month.expenses;
                month.previousBalance = previousMonth.balance;
                month.previousBalanceDelta = previousMonth.balanceDelta;
                month.incomeDelta = month.income - previousMonth.income;
                month.expensesDelta = -(month.expenses - previousMonth.expenses);
                month.balanceDelta = month.balance - previousMonth.balance;
            } else {
                month.balance = data.initialBalance + month.income + month.expenses;
                month.previousBalance = data.initialBalance;
                month.previousBalanceDelta = 0;
                month.incomeDelta = 0;
                month.expensesDelta = 0;
                month.balanceDelta = month.balance - data.initialBalance;
            }

            previousMonth = month;
        }

        // default value for expansion toggle state
        for (const month of data.months) {
            month.expanded = false;
        }

        new Vue({
            el: '#app',
            data: data
        });

        document.documentElement.className = '';
    });
});
