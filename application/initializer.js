import Vue from 'vue';
import registerFormComponents from 'components/form/register';
import $ from 'jquery';
import pkg from 'package.json';

export default function() {
	// cria uma fake store
	Vue.prototype.$store = new Vue({
		data: {
			config: window.Config,
			pkg: pkg,
			messages: [],
			usuario: null,
			pendingRequests: 0
		}
	});

	/* rastreia a quantidade de requisições pendentes */
	let store = Vue.prototype.$store;
	$(document).ajaxSend(() => store.pendingRequests++);
	$(document).ajaxComplete(() => store.pendingRequests--);

	// registra os components de form
	registerFormComponents('v');
}