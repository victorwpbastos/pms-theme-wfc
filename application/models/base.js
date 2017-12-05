import Vue from 'vue';
import $ from 'jquery';

export default class Model {
	constructor(url, attrs) {
		this.url = url;
		this._originalAttrs = attrs;

		for (let key in attrs) {
			this[key] = attrs[key];
		}

		this._setupValidations();
	}

	validations() {
		return {};
	}

	save(options = {}) {
		let data = JSON.stringify(this._prepareData());

		options = Object.assign({ data, contentType: 'application/json; charset=UTF-8' }, options, { method: 'POST' });

		if (this.id) {
			return this.update(options);
		}

		return this.fetch(this.url, options);
	}

	update(options = {}) {
		let data = JSON.stringify(this._prepareData());

		options = Object.assign({ data, contentType: 'application/json; charset=UTF-8' }, options, { method: 'PUT' });

		if (!this.id) {
			return this.save(options);
		}

		return this.fetch(`${this.url}/${this.id}`, options);
	}

	remove(options = {}) {
		let url = this.id ? `${this.url}/${this.id}` : `${this.url}`;

		options = Object.assign(options, { method: 'DELETE' });

		return this.fetch(url, options);
	}

	static findAll(options = {}) {
		let instance = new this();

		options = Object.assign({ method: 'GET', contentType: 'application/json; charset=UTF-8' }, options);

		return instance.fetch(instance.url, options);
	}

	static async find(id, options = {}) {
		let instance = new this();
		let url = id ? `${instance.url}/${id}` : `${instance.url}`;

		options = Object.assign({ method: 'GET', contentType: 'application/json; charset=UTF-8' }, options);

		try {
			let response = await instance.fetch(url, options);

			if (response) {
				instance._originalAttrs = response;

				for (let key in response) {
					instance[key] = response[key];
				}

				return instance;
			}
		} catch (error) {
			throw error;
		}
	}

	fetch(url, options = {}) {
		options.url = url;

		return $.ajax(options);
	}

	reset() {
		Object.assign(this, this._originalAttrs);
	}

	clear() {
		for (let key in this._originalAttrs) {
			this[key] = '';
		}
	}

	_setupValidations() {
		let hasValidations = Object.keys(this.validations()).length > 0;

		if (hasValidations) {
			let self = this;
			let fakeView = new Vue({
				data() {
					return self;
				},

				created() {
					this.unwatch = this.$watch('$data', () => {
						this.$options.validations();
						self.$v = this.$v;
					}, { deep: true });
				},

				beforeDestroy() {
					this.unwatch();
				},

				validations() {
					return self.validations.apply(self, arguments);
				}
			});

			this.$v = fakeView.$v;
		}
	}

	_prepareData() {
		let data = {};

		for (let key in this._originalAttrs) {
			data[key] = this[key];
		}

		return data;
	}
}