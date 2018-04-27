require('./bootstrap');

window.Vue = require('vue');

import Buefy from 'buefy';
Vue.use(Buefy);

// Vue.component('example', require('./components/Example.vue'));

//Vue object creation to work in blade templates.
// const app = new Vue({
// 	el: '#app',
// 	data: {
// 		auto_password: true
// 	}
// });

$(document).ready(function(){
	//Dropdowns
	$('button.dropdown').hover(function(e){
		$(this).toggleClass('is-open');
	})
});