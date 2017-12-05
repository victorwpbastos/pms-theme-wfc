<template>
	<fieldset :disabled="active">
		<slot></slot>
		<div class="wrapper" v-if="active">
			<span class="fa fa-spinner fa-spin" style="margin-right:10px;"></span>
			<div v-html="message"></div>
		</div>
	</fieldset>
</template>

<script>
	export default {
		props: {
			message: { default: 'Carregando...' },
			active: { default: false }
		}
	};
</script>

<style lang="less" scoped>
	fieldset {
		position: relative;

		.wrapper {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(255, 255, 255, 0.80);
			user-select: none;
		}
	}
</style>