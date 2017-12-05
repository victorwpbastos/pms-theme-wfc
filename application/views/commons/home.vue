<template>
	<div class="box">
		<!-- LOADING -->
		<h3 class="thin" style="margin-bottom: 15px;">Loading</h3>
		<v-loading :active="loading" message="Salvando...">
			<input type="text" class="form-control">
		</v-loading>

		<!-- ERROR MESSAGE -->
		<h3 class="thin" style="margin-top: 30px; margin-bottom: 15px;">Error Message</h3>

		<div class="row">
			<div class="col-md-10">
				<input type="text" class="form-control" v-model="errorMessage"></input>
			</div>
			<div class="col-md-2">
				<button type="button" class="btn btn-danger btn-block" @click="setErrorMessage">
					Adicionar Mensagem
				</button>
			</div>
		</div>

		<!-- TOAST -->
		<h3 class="thin" style="margin-top: 30px; margin-bottom: 15px;">Toasts</h3>

		<div class="row">
			<div class="col-md-2">
				<select class="form-control" v-model="toastPosition">
					<option value="TOP_LEFT">TOP_LEFT</option>
					<option value="TOP_RIGHT">TOP_RIGHT</option>
					<option value="BOTTOM_LEFT">BOTTOM_LEFT</option>
					<option value="BOTTOM_RIGHT">BOTTOM_RIGHT</option>
				</select>
			</div>
			<div class="col-md-3">
				<input type="text" class="form-control" v-model="toastTitle"></input>
			</div>
			<div class="col-md-3">
				<input type="text" class="form-control" v-model="toastText"></input>
			</div>
			<div class="col-md-2">
				<select class="form-control" v-model="toastClass">
					<option value="success">Success</option>
					<option value="warning">Warning</option>
					<option value="danger">Danger</option>
				</select>
			</div>
			<div class="col-md-2">
				<button type="button" class="btn btn-primary btn-block" @click="addToast">
					Adicionar Toast
				</button>
			</div>
		</div>

		<!-- DATATABLE PADRÃO -->
		<h3 class="thin" style="margin-top: 30px; margin-bottom: 15px;">DataTable Padrão</h3>

		<v-data-table :url="url" :fields="fields"></v-data-table>

		<!-- DATATABLE PERSONALIZADA -->

		<h3 class="thin" style="margin-top: 30px; margin-bottom: 15px;">DataTable Personalizada</h3>

		<p><strong>Parâmetros</strong>: {{ parameters }}</p>
		<p><strong>Item Selecionado:</strong> {{currentItem}}</p>

		<v-data-table
			:url="url"
			:fields="fields"
			:urlAccess="false"
			:parameters.sync="parameters"
			:filterFields="filterFields"
		>
			<template slot="filters">
				<div style="padding: 5px; border: 1px solid #ddd;">
					<select class="form-control" v-model="filtroModalidade">
						<option :value="null">-- selecione uma modalidade --</option>
						<option value="Concorrência">Concorrência</option>
						<option value="Convite">Convite</option>
						<option value="Pregão Presencial">Pregão Presencial</option>
					</select>
				</div>
			</template>

			<template slot="table" slot-scope="{fields, items}">
				<div class="card" style="margin-bottom: 10px;" v-for="item in items" :key="item.id" @click="currentItem = item">
					<div><strong>Processo:</strong> {{item.codigoProcesso}}</div>
					<div><strong>Abertura:</strong> {{item.dataAbertura}}</div>
					<div><strong>Status:</strong> {{item.statusPublicacaoProcesso.nome}}</div>
					<div><strong>Modalidade:</strong> {{item.modalidade}}</div>
					<div><strong>Descrição:</strong> {{item.descricaoObjeto}}</div>
				</div>
			</template>
		</v-data-table>
	</div>
</template>

<script>
	import VDataTable from 'components/dataTable';
	import VLoading from 'components/loading';

	export default {
		components: { VDataTable, VLoading },

		data: function() {
			return {
				url: 'http://localhost:3000/api/publicacao',
				fields: [
					{ id: 'codigoProcesso',                name: 'PROCESSO',   sort: true, fullSearch: true, style: '' },
					{ id: 'dataAbertura',                  name: 'ABERTURA',   sort: true, fullSearch: true, style: '' },
					{ id: 'statusPublicacaoProcesso.nome', name: 'STATUS',     sort: true, fullSearch: true, style: '' },
					{ id: 'modalidade',                    name: 'MODALIDADE', sort: true, fullSearch: true, style: '' },
					{ id: 'descricaoObjeto',               name: 'OBJETO',     sort: true, fullSearch: true, style: '' }
				],
				parameters: null,
				currentItem: null,
				filtroModalidade: null,
				toastTitle: 'Título',
				toastText: 'Corpo do texto.',
				toastPosition: 'BOTTOM_LEFT',
				toastClass: 'success',
				errorMessage: 'Mensagem de erro.',
				loading: false
			};
		},

		computed: {
			filterFields: {
				get() {
					return {
						modalidade: { op: '=', value: this.filtroModalidade },
					};
				},
				set(value) {
					this.filtroModalidade = value.filtroModalidade && value.filtroModalidade.value;
				}
			}
		},

		created() {
			this.loading = true;

			setTimeout(() => {
				this.loading = false;
			}, 5000);
		},

		methods: {
			addToast() {
				this.$toast.add({
					title: this.toastTitle,
					text: this.toastText,
					position: this.toastPosition,
					class: this.toastClass
				});
			},

			setErrorMessage() {
				this.$errorMessage.set(this.errorMessage);
			}
		}
	};
</script>

<style scoped>
	.card {
		padding: 10px;
		border: 1px solid #ddd;
	}

	.card:hover {
		background-color: #ffffde;
	}
</style>