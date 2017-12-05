<template>
	<div class="messages-container">
		<transition name="fade">
			<div v-if="message || error" class="panel panel-danger" style="margin-bottom: 15px;">
				<div class="panel-heading">
					<strong><span v-html="message"></span></strong>
					<button type="button" class="close" @click="$errorMessage.clear()">&times;</button>
				</div>
				<div v-if="error" class="panel-body">
					<div>
						<strong class="text-danger">Erro:</strong> {{error.message}}
					</div>
					<div v-if="error.message != error.errorMessage">
						<strong class="text-danger">Detalhes:</strong> {{error.errorMessage}}
					</div>
					<div>
						<strong class="text-danger">Tipo de Erro:</strong> {{error.errorType}}
					</div>
					<div v-if="error.errorData">
						<strong class="text-danger">Dados Adicionais:</strong>
						<pre style="margin-bottom: 0;">{{error.errorData}}</pre>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import './register';

	export default {

		computed: {
			message() {
				return this.$errorMessage.message;
			},

			error() {
				return this.$errorMessage.error;
			}
		},

		watch: {
			'message'(value) {
				if (value) {
					document.querySelector('main').scrollTo(0, 0);
				}
			},

			'error'(value) {
				if (value) {
					document.querySelector('main').scrollTo(0, 0);
				}
			}
		}
	};
</script>

<style scoped>
	.fade-enter-active, .fade-leave-active {
		transition: all 200ms ease-in-out;
	}

	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
</style>