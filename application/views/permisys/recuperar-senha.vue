<template>
	<div class="box">
		<h3 class="thin" style="margin-bottom:15px;">Recuperação de Senha</h3>

		<!-- nova senha -->
		<template v-if="alterandoSenha">
			<form @submit.prevent="alterarSenha">
				<fieldset :disabled="loading">
					<v-group label="Usuário" :validation="model.$v.usuario">
						<v-input v-model="model.usuario" disabled></v-input>
					</v-group>
					<v-group label="Hash" :validation="model.$v.hash">
						<v-input v-model="model.hash" disabled></v-input>
					</v-group>
					<v-group label="Nova Senha" :validation="model.$v.senha">
						<v-input v-model="model.senha"></v-input>
					</v-group>
					<v-group label="Repita a Nova Senha" :validation="model.$v.novaSenha">
						<v-input v-model="model.novaSenha"></v-input>
					</v-group>

					<button type="submit" class="btn btn-info pull-right">
						<span class="fa fa-spinner fa-spin" v-if="loading"></span>
						{{ loading ? 'Processando' : 'Alterar Senha' }}
					</button>
				</fieldset>
			</form>
		</template>

		<!-- solicitação -->
		<template v-else>
			<form @submit.prevent="recuperarSenha">
				<fieldset :disabled="loading">
					<v-group label="Usuário" :validation="model.$v.usuario">
						<v-input v-model="model.usuario"></v-input>
					</v-group>
					<v-group label="E-mail" :validation="model.$v.email">
						<v-input v-model="model.email"></v-input>
					</v-group>

					<div class="flex v-center">
						<a href="#" @click.prevent="$router.go(-1)">Cancelar</a>

						<button type="submit" class="btn btn-info m-left-auto">
							<span class="fa fa-spinner fa-spin" v-if="loading"></span>
							{{ loading ? 'Processando' : 'Recuperar Senha' }}
						</button>
					</div>
				</fieldset>
			</form>
		</template>
	</div>
</template>

<script>
	import PermisysModel from 'models/permisys';

	export default {
		data() {
			return {
				model: new PermisysModel(true),

				loading: false
			};
		},

		computed: {
			alterandoSenha() {
				let query = this.$route.query;

				return query.hash !== undefined && query.idUsuario !== undefined;
			}
		},

		watch: {
			'$route': {
				handler() {
					let query = this.$route.query;

					this.model.clear();

					this.model.usuario = query.idUsuario;
					this.model.hash = query.hash;
				},

				immediate: true
			}
		},

		methods: {
			async recuperarSenha() {
				this.model.$v.$touch();

				if (!this.model.$v.$invalid) {
					this.loading = true;

					try {
						await this.model.recuperarSenha();

						this.$store.messages.push({ limit: 10000, text: 'Em instantes você receberá um e-mail com as instruções para recuperar a senha.' });
					} catch ({ responseJSON }) {
						this.$store.messages.push({ text: responseJSON.message, type: 'danger' });
					} finally {
						this.loading = false;
					}
				}
			},

			async alterarSenha() {
				this.model.$v.$touch();

				if (!this.model.$v.$invalid) {
					this.loading = true;

					try {
						await this.model.recuperarSenha();

						this.$store.messages.push({ limit: 10000, text: 'Em instantes você receberá um e-mail com as instruções para recuperar a senha.' });
					} catch ({ responseJSON }) {
						this.$store.messages.push({ text: responseJSON.message, type: 'danger' });
					} finally {
						this.loading = false;
					}
				}
			},
		}
	};
</script>

<style scoped>
	.box {
		width: 500px;
		padding: 15px;
		background: #ffffff;
		margin: 0 auto;
	}
</style>