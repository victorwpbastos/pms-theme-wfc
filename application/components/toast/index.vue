<template>
	<div>
		<div v-for="(value, key) in toasts" :class="[key]" :key="key">
			<transition-group name="fade">
				<v-toast v-for="t in value" :key="t.id" :toast="t">
				</v-toast>
			</transition-group>
		</div>
	</div>
</template>

<script>
	import VToast from 'components/toast/toast';
	import 'components/toast/register';

	export default {
		components: { VToast },

		computed: {
			toasts() {
				return {
					'top-left': this.$toast.toasts.filter(t => t.position.toUpperCase() === 'TOP_LEFT'),
					'top-right': this.$toast.toasts.filter(t => t.position.toUpperCase() === 'TOP_RIGHT'),
					'bottom-left': this.$toast.toasts.filter(t => t.position.toUpperCase() === 'BOTTOM_LEFT'),
					'bottom-right': this.$toast.toasts.filter(t => t.position.toUpperCase() === 'BOTTOM_RIGHT')
				};
			}
		}
	};
</script>

<style scoped>
	.top-left {
		position: fixed;
		z-index: 99;
	}

	.top-right {
		position: fixed;
		right: 30px;
		z-index: 99;
	}

	.bottom-left {
		position: fixed;
		bottom: 0px;
		z-index: 99;
	}

	.bottom-right {
		position: fixed;
		right: 30px;
		bottom: 0px;
		z-index: 99;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 1.5s;
	}

	.fade-move {
  		transition: transform 1s;
	}

	.fade-leave-active {
		position: absolute !important;
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
</style>