<template>
	<header class="flex v-center">
		<router-link to="/" class="flex v-center">
			<img class="m-right-10" src="../../../assets/img/brasao.png">
			<h4 class="thin">
				{{ $store.pkg.name.toUpperCase() }}
				<span style="color:tomato;">{{ $store.pkg.name.toUpperCase() }}</span>
			</h4>
		</router-link>

		<transition name="fade">
			<span
				v-if="$store.pendingRequests"
				class="fa fa-cog fa-spin fa-2x fa-fw"
				style="font-size: 19px; color:tomato;"
			>
			</span>
		</transition>

		<span class="env-label" v-if="$store.config.ENV">{{ $store.config.ENV }}</span>

		<template v-if="$store.usuario && Object.keys($store.usuario).length > 0">
			<span class="flex v-center m-left-auto">
				<span class="thin m-right-10" style="font-size:16px;">{{ $store.usuario.nome.toUpperCase() }}</span>
				<a href="#" class="logout-button" @click.prevent="logout">
					<template v-if="loading">
						<span class="fa fa-spinner fa-spin"></span> Processando
					</template>
					<template v-else>
						SAIR
					</template>
				</a>
			</span>
		</template>
	</header>
</template>

<script>
	import PermisysModel from 'models/permisys';

	export default {
		data() {
			return {
				loading: false
			};
		},

		methods: {
			async logout() {
				this.loading = true;

				try {
					await new PermisysModel().remove();

					this.$store.usuario = null;
					this.$router.push('/');
				} catch ({ responseJSON }) {
					this.$store.messages.push({ text: responseJSON, type: 'danger', limit: 0 });
				} finally {
					this.loading = false;
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	header {
		min-height: 70px;
		max-height: 70px;
		padding: 15px;
		background: #ffffff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
        z-index: 100;
		position: relative;

		a,
		a:active,
		a:focus,
		a:hover {
			text-decoration: none;
			color: #777;
		}

		img {
			filter: opacity(70%);
		}

		.logout-button {
			padding: 5px;
			border: solid 1px lighten(tomato, 10%);
			border-radius: 3px;
			color: lighten(tomato, 10%);
			font-size: 12px;

			&:hover {
				border-color: tomato;
				color: tomato;
			}
		}

		.env-label {
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			background: tomato;
			color: #ffffff;
			padding: 1px 5px;
			z-index: 9999;
		}

		.fade-leave-active {
			transition: opacity 1s
		}

		.fade-leave-to {
			opacity: 0
		}
	}
</style>