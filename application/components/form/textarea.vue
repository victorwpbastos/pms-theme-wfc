<template>
	<textarea
		class="form-control"
		:value="value"
		@input="emitInput"
	></textarea>
</template>

<script>
	export default {
		props: {
			value: { default: '' },
			autoResize: { default: true }
		},

		mounted() {
			if (this.autoResize) {
				this.resize();
			}
		},

		methods: {
			emitInput(e) {
				this.$emit('input', e.target.value);
			},

			resize() {
				if (this.$el.scrollHeight > 0) {
					this.$el.style.overflow = 'hidden';
					this.$el.style.height = 'auto';
					this.$el.style.height = (this.$el.scrollHeight) + 'px';
				}
			}
		},

		watch: {
			value() {
				if (this.$el && this.autoResize) {
					this.resize();
				}
			}
		}
	};
</script>
