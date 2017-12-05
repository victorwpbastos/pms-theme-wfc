<template>
	<div class="form-group" :class="{ 'has-error has-feedback': invalid }">
		<label class="control-label" :for="slotId" v-if="label">
			<span v-html="label"></span>
		</label>
		<span @input="inputHandler">
			<slot></slot>
		</span>
		<span class="help-block">
			<template v-if="invalid">{{ errorMessage }}</template>
		</span>
	</div>
</template>

<script>
	import { extractErrorMessage } from 'helpers/validation';

	export default {
		props: {
			label: null,
			validation: null,
			validations: null
		},

		computed: {
			slotId() {
				return `field_${this._uid}`;
			},

			_validations() {
				let validations = [];

				if (this.validation) {
					validations.push(this.validation);
				}

				if (this.validations) {
					validations.push(...this.validations);
				}

				return validations;
			},

			invalid() {
				return this._validations.some(v => v.$error);
			},

			errorMessage() {
				for (let v of this._validations) {
					let errorMessage = extractErrorMessage(v);

					if (errorMessage) {
						return errorMessage;
					}
				}

				return null;
			}
		},

		methods: {
			inputHandler() {
				this._validations.forEach(v => v.$touch());
			}
		},

		mounted() {
			this._validations.forEach(v => v.$reset());

			let tags = ['SELECT', 'INPUT', 'TEXTAREA'];
			let slotElement = this.$slots.default && this.$slots.default[0].elm;

			if (slotElement && tags.indexOf(slotElement.tagName) === -1) {
				slotElement = [...slotElement.children].find(c => {
					return tags.indexOf(c.tagName) !== -1;
				});
			}

			if (slotElement) {
				if (slotElement.type && slotElement.type !== 'checkbox' && slotElement.type !== 'radio') {
					if (slotElement.id) {
						this.slotId = slotElement.id;
					} else {
						slotElement.id = this.slotId;
					}
				}
			}
		}
	};
</script>

<style scoped>
	.control-label {
		font-weight: 600;
	}

	.has-error .control-label,
	.has-error .help-block {
		color: salmon;
	}

	.has-error .form-control,
	.has-error .form-control:active,
	.has-error .form-control:focus,
	.has-error .form-control:hover {
		border-color: salmon;
	}

	.help-block {
		font-size: 12px;
		margin-top: 5px;
		margin-bottom: -15px;
		height: 20px;
	}
</style>