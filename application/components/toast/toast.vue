<template>
	<div :class="['toast', toast.class]">
		<button type="button" class="close" @click="close">&times;</button>
		<div v-html="toast.title" style="font-weight: bold;"></div>
		<span v-html="toast.text"></span>
	</div>
</template>

<script>
	export default {
		props: ['toast'],

		methods: {
			close() {
				this.$toast.remove(this.toast.id);
			}
		}
	};
</script>

<style scoped>
	.close {
		position: absolute;
		top: 0px;
		right: 0px;
		padding: 20px !important;
		color: white;
		outline: none;
	}

	.toast {
		position: relative;
		min-width: 300px;
		min-height: 50px;
		padding: 10px;
		color: white;
		margin-bottom: 10px;
		border-radius: 5px;
		box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.25);
	}

	.toast-success {
		background-color: #47842ef2;
		border: 1px solid #cbe3bb;
	}

	.toast-warning {
		background-color: #a5a032f2;
		border: 1px solid #af9c26;
	}

	.toast-danger {
		background-color: #ad3530f2;
		border: 1px solid #c37c71;
	}
</style>