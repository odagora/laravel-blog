require('./bootstrap');

window.Vue = require('vue');
window.Slug = require('slug');
Slug.defaults.mode = 'rfc3986';

import Buefy from 'buefy';
Vue.use(Buefy);

Vue.component('slugWidget', require('./components/slugWidget.vue'));

//Vue object creation to work in blade templates.
// const app = new Vue({
// 	el: '#app',
// 	data: {
// 		auto_password: true
// 	}
// });

require('./main');
require('./manage');