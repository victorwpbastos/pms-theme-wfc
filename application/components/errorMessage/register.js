import Vue from 'vue';

Vue.prototype.$errorMessage = new Vue({
	data() {
		return {
			message: null,
			error: null,
		};
	},

	methods: {
		set(message, error) {
			this.message = message || '<span class="fa fa-exclamation-triangle"></span> Erro';
			this.error = error;
		},

		clear() {
			this.message = null;
			this.error = null;
		}
	}
});