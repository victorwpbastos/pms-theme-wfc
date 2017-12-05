<template>
	<input
		type="text"
		class="form-control"
		:value="value"
		@input="emitInput"
	>
</template>

<script>
	export default {
		props: {
			value: { default: '' }
		},

		methods: {
			emitInput(e) {
				this.$emit('input', e.target.value);
			}
		}
	};
</script>