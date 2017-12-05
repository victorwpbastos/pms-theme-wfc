import Vue from 'vue';

let maxToastCount = 5;

Vue.prototype.$toast = new Vue({
	data() {
		return {
			toasts: []
		};
	},

	methods: {
		add(toast) {
			toast = Object.assign(
				{ position: 'BOTTOM_LEFT', class: 'success', limit: 5000 }, toast
			);

			toast.id = Date.now();
			toast.class = 'toast-' + toast.class;
			setTimeout(() => this.remove(toast.id), toast.limit);

			this.toasts.push(toast);
			if (this.toasts.length > maxToastCount) {
				this.toasts.splice(0, 1);
			}

			return toast.id;
		},

		remove(id) {
			let index = this.toasts.findIndex(t => t.id === id);
			if (index !== -1) {
				this.toasts.splice(index, 1);
			}
		}
	}
});