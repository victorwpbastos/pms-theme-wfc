<template>
	<div id="application-container" class="flex">
		<template v-if="loading">
			<div style="text-align:center;margin:auto;">
				<img src="../../../assets/img/brasao.png">
				<br>
				Inicializando aplicação
			</div>
		</template>

		<template v-else>
			<div class="sidebar">
				<v-menu></v-menu>
			</div>

			<div class="content flex flex-column">
				<v-header></v-header>

				<main class="flex flex-column">
					<v-toasts></v-toasts>
					<v-error-message></v-error-message>

					<div class="overlay" v-if="showLogin">
						<v-login @success="handleLoginSuccess"></v-login>
					</div>

					<transition name="fade">
						<router-view v-show="showLogin === false"></router-view>
					</transition>

					<v-footer style="margin-top:auto;"></v-footer>
				</main>
			</div>
		</template>
	</div>
</template>

<script>
	import $ from 'jquery';
	import VHeader from 'views/commons/header';
	import VMenu from 'views/commons/menu';
	import VFooter from 'views/commons/footer';
	import VLogin from 'views/permisys/login';
	import VToasts from 'components/toast';
	import VErrorMessage from 'components/errorMessage/index';
	import PermisysModel from 'models/permisys';

	export default {
		components: { VHeader, VMenu, VFooter, VLogin, VToasts, VErrorMessage },

		data() {
			return {
				showLogin: false,
				lastFailedAjaxRequest: '',
				loading: true
			};
		},

		watch: {
			'$store.usuario'(value) {
				if (value !== undefined) {
					this.showLogin = Object.keys(value || {}).length === 0;
				}
			},

			async $route() {
				if (this.$route.path === '/recuperarsenha') {
					this.showLogin = false;
				}
			}
		},

		async created() {
			await this.setupAjaxFilter();
			await this.getUsuarioLogado();
		},

		methods: {
			async getUsuarioLogado() {
				let timeout = setTimeout(() => {
					this.loading = true;
				}, 1000);

				try {
					this.$store.usuario = await PermisysModel.find();
				} catch ({ status }) {
					if (status === 401) {
						this.$store.usuario = null;
						this.showLogin = true;
					}
				} finally {
					clearTimeout(timeout);

					this.loading = false;
				}
			},

			setupAjaxFilter() {
				$.ajaxPrefilter((options, originalOptions, jqXHR) => {
					let dfd = $.Deferred();

					jqXHR.done(dfd.resolve);

					jqXHR.fail(() => {
						if (jqXHR.status === 401) {
							if (options.url.indexOf('api/permisys') !== -1) {
								dfd.reject(jqXHR);
							}

							this.$store.usuario = null;

							if (options.type === 'GET') {
								this.lastFailedAjaxRequest = { promise: dfd, options: originalOptions };
							} else {
								this.lastFailedAjaxRequest = '';

								dfd.reject(jqXHR);
							}
						} else {
							dfd.reject(jqXHR);
						}
					});

					return dfd.promise(jqXHR);
				});
			},

			handleLoginSuccess(usuario) {
				this.$store.usuario = usuario;

				if (this.lastFailedAjaxRequest) {
					let { options, promise } = this.lastFailedAjaxRequest;

					$.ajax(options).then(promise.resolve, promise.reject);
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	.sidebar {
		background: #286b86;
	}

	.content {
		flex: 1;
		justify-content: space-between;

		main {
			position: relative;
			flex: 1;
			height: calc(100vh - 70px);
			overflow-y: scroll;
			padding: 15px 15px 0;
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: all 150ms ease-in-out;
		opacity: 0;
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	@keyframes fade {
		0%, 100% {
			opacity: 1;
		}

		50% {
			opacity: 0.3;
		}
	}

	img {
		filter: opacity(70%);
		animation: fade 1.5s ease-in-out infinite;
	}
</style>