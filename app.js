
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
