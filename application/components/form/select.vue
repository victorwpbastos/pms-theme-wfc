<template>
	<select
		class="form-control"
		@change="emitChange"
		v-model="model"
	>
		<slot></slot>
	</select>
</template>

<script>
	export default {
		props: {
			value: { default: '' }
		},

		data() {
			return {
				model: ''
			};
		},

		watch: {
			value(value) {
				this.model = value;
			}
		},

		created() {
			this.model = this.value;
		},

		methods: {
			emitChange() {
				this.$emit('input', this.model);
			}
		}
	};
</script>