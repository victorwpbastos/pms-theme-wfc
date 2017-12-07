<template>
	<label class="checkbox-inline">
		<span class="checkbox-container">
			<input type="checkbox" :id="id" :value="value" :checked="isChecked" @change="emitChange">
			<label :for="id"></label>
		</span>
	</label>
</template>

<script>
	export default {
		props: {
			value: { default: '' },
			modelValue: { default: '' },
			id: { default() { return `field_${this._uid}`; } },
			rounded: { default: false }
		},

		model: {
			prop: 'modelValue',
			event: 'change'
		},

		computed: {
			isChecked() {
				if (Array.isArray(this.modelValue)) {
					return this.modelValue.includes(this.value);
				} else {
					return this.modelValue;
				}
			}
		},

		watch: {
			rounded() {
				this.toggleRounded();
			}
		},

		created() {
			if (Array.isArray(this.modelValue) && !this.value) {
				console.error('[Vue warn]: Missing required prop: "value"');
			}
		},

		mounted() {
			this.toggleRounded();
		},

		methods: {
			toggleRounded() {
				if (this.rounded) {
					this.$el.querySelector('.checkbox-container').classList.add('rounded');
				} else {
					this.$el.querySelector('.checkbox-container').classList.remove('rounded');
				}
			},

			emitChange(e) {
				let values = this.modelValue;

				if (Array.isArray(values)) {
					if (e.target.checked) {
						values.push(this.value);
					} else {
						values.splice(values.indexOf(this.value), 1);
					}
				} else {
					values = e.target.checked;
				}

				this.$emit('change', values);
			}
		}
	};
</script>

<style>
	.checkbox label,
	.checkbox-inline {
		padding-left: 0;
	}
</style>

<style scoped>
	.checkbox-container {
		position: relative;
		display: inline-block;
		width: 20px;
		height: 20px;
	}

	.checkbox-container label {
		display: inline-block;
		position: absolute;
		top: 0;
		left: 0;
		width: 20px;
		height: 20px;
		background: #ffffff;
		border: solid 1px #ccc;
		border-radius: 2px;
		user-select: none;
	}

	.checkbox-container input[type="checkbox"] {
		visibility: hidden;
	}

	.checkbox-container input[type="checkbox"]:checked + label:before {
		content: '';
		position: absolute;
		width: 13px;
		height: 7px;
		top: 4px;
		left: 3px;
		border: solid 3px #666;
		border-top: none;
		border-right: none;
		transform: rotate(-45deg);
	}

	.checkbox-container.rounded label {
		border-radius: 50px;
	}

	.checkbox-container.rounded input[type="checkbox"]:checked + label:before {
		width: 11px;
	}
</style>