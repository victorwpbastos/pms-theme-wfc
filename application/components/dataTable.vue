<template>
	<div>
		<!-- AVISO DE ERRO DURANTE A REQUISIÇÃO -->
		<div v-if="lastError" class="alert alert-danger">
			Ocorreu um erro durante a consulta aos dados.
			<button type="button" class="btn btn-danger btn-xs pull-right" @click="fetchData">
				<i class="fa fa-exclamation-triangle"></i> Tentar Novamente
			</button>
		</div>

		<!-- FULLSEARCH -->
		<template v-if="fullSearchFieldsAvailable">
			<div class="checkbox">
				Selecione os campos para pesquisa:
				<label v-for="fsf in fullSearchFields" class="checkbox-inline" :key="fsf.id">
					<input type="checkbox" :value="fsf.id" v-model="userFullSearchFields"> {{fsf.name}}
				</label>
			</div>
			<div class="form-group">
				<div class="input-group">
					<input
						type="text"
						class="form-control"
						placeholder="Pesquisa..."
						maxlength="100"
						v-model="userFullSearchValue"
						@keyup.enter="applyFullSearch"
					>
					<span class="input-group-btn">
						<button type="button" class="btn btn-default" @click="applyFullSearch">
							<i class="fa fa-search"></i>
						</button>
					</span>
				</div>
				<div v-if="currentFullSearch" class="help-block">
					Pesquisando por <i><u>{{currentFullSearch.value}}</u></i> no(s) campo(s) <i><u>{{currentFullSearch.fields}}</u></i>.
				</div>
				<div v-else class="help-block">Nenhuma pesquisa aplicada.</div>
			</div>
		</template>

		<!-- SLOT PARA FILTROS ADICIONAIS -->
		<slot name="filters"></slot>

		<!-- AVISO DE CARREGANDO DADOS -->
		<div v-if="loadingData" class="alert alert-warning text-center">
			<span class="fa fa-spinner fa-spin"></span>
			<strong v-html="loadingMessage"></strong>
		</div>

		<!-- AVISO DE NENHUM RESULTADO -->
		<div v-else-if="!loadingData && isEmpty" class="alert alert-warning">
			<strong>Nenhum registro disponível para exibição.</strong>
		</div>

		<template v-else>
			<!-- TABELA DE DADOS PAGINADOS -->
			<slot name="table" :fields="fields" :items="itemList">
				<table v-show="!isEmpty" class="v-datatable-table table table-bordered table-condensed table-hover">
					<!-- HEADER COM ORDENAÇÃO -->
					<thead class="v-datatable-header">
						<tr>
							<th
								v-for="field in fields"
								:key="field.id"
								class="text-center"
								:class="{ 'has-sort-field': userSortFields.has(field.id) }"
								style="white-space: nowrap;"
								:style="field.style"
								@click="applySort(field.id, $event)"
							>
								{{field.name}}
								<template v-if="userSortFields.has(field.id)">
									<i v-show="userSortFields.get(field.id).order=='asc'" class="fa fa-sort-alpha-asc"></i>
									<i v-show="userSortFields.get(field.id).order=='desc'" class="fa fa-sort-alpha-desc"></i>
									<sup>{{userSortFields.get(field.id).index}}</sup>
								</template>
							</th>
							<slot name="extraHeaders"></slot>
						</tr>
					</thead>

					<!-- DADOS DA PAGINAÇÃO -->
					<tbody class="v-datatable-body">
						<template v-for="item in itemList">
							<slot name="rows" :item="item">
								<tr @click="$emit('rowClick', item)">
									<td v-for="field in fields" class="text-center" :key="field.id">
										{{ getProperty(item, field.id) }}
									</td>
								</tr>
							</slot>
						</template>
					</tbody>
				</table>
			</slot>

			<!-- FOOTER COM CONTROLES DE PAGINAÇÃO -->
			<div class="v-datatable-footer">
				<div class="row">
					<div class="col-sm-12 col-md-3" style="margin-bottom: 5px;">
						<select class="form-control input-sm" v-model.number="userItemsPerPage" :disabled="isEmpty">
							<option value="10">10 por página</option>
							<option value="20">20 por página</option>
							<option value="25">25 por página</option>
							<option value="50">50 por página</option>
							<option value="100">100 por página</option>
							<option value="-1">Exibir todos</option>
						</select>
					</div>
					<div class="col-xs-6 col-sm-8 col-md-6">
						<p class="form-control-static text-center text-muted">
							<span class="hidden-xs">
								Página {{currentPage}} de {{pageCount}}
								/ Registro {{itemOffset}} à {{finalItemOffset}} de {{itemCount}}
							</span>
							<span class="visible-xs-inline">
								Pg. {{currentPage}} de {{pageCount}}
								({{itemOffset}}-{{finalItemOffset}}/{{itemCount}})
							</span>
						</p>
					</div>
					<div class="col-xs-6 col-sm-4 col-md-3">
						<div class="pull-right">
							<button type="button" class="btn btn-default btn-sm" :disabled="!canGoToPreviousPage" @click="goToFirstPage">
								<span class="hidden-xs">Primeira</span>
								<span class="visible-xs-inline"><i class="fa fa-angle-double-left"></i></span>
							</button>
							<button type="button" class="btn btn-default btn-sm" :disabled="!canGoToPreviousPage" @click="goToPreviousPage">
								<i class="fa fa-angle-left"></i>
							</button>
							<button type="button" class="btn btn-default btn-sm" :disabled="!canGoToNextPage" @click="goToNextPage">
								<i class="fa fa-angle-right"></i>
							</button>
							<button type="button" class="btn btn-default btn-sm" :disabled="!canGoToNextPage" @click="goToLastPage">
								<span class="hidden-xs">Última</span>
								<span class="visible-xs-inline"><i class="fa fa-angle-double-right"></i></span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	import $ from 'jquery';

	/* Expressões regulares para validação de expressões 'filter_fields'. */
	let ffOperator = String.raw`(=|!=|\*|%|>=|>|<=|<)`;
	let ffExpression = String.raw`(\w+\.)*(\w)+${ffOperator}.+`;
	let ffExpressionList = String.raw`^${ffExpression}(,${ffExpression})*$`;
	let ffOperatorReg = new RegExp(ffOperator);
	let ffExpressionReg = new RegExp(ffExpression);
	let ffExpressionListReg = new RegExp(ffExpressionList);

	/* Valores de itens por página permitidos. */
	let allowedItemsPerPage = ['10', '20', '25', '50', '100'];

	export default {
		props: {
			/*
				URL que retorna os dados paginados.
				Os dados devem estar no formato de paginação adequado.
				Ver https://github.com/tisorocaba-libs/NETCommons/tree/master/Sorocaba.Commons.Entity/Pagination.
			*/
			url: {
				type: String,
				required: true,
				default: null
			},

			/*
				Indica se o componente pode ler e escrever diretamente da URL.
				A URL será usada para armazenar os parâmetros de paginação.
			*/
			urlAccess: {
				type: Boolean,
				required: false,
				default: true
			},

			/*
				Caso 'urlAccess' seja falso, os dados serão armazenados nessa propriedade.
				Deve ser usado com o modificador '.sync' para permitir a 'escrita' pelo componente.
			*/
			parameters: {
				type: Object,
				required: false,
				default: null
			},

			/*
				Array com os objetos de configuração dos campos.
				Usados para exibição, busca e ordenação dos resultados.

				Exemplo de objeto de configuração de campo:
					{
						id: 'codigoProcesso',  // Nome do campo como retornado na paginação.
						name: 'PROCESSO',      // Nome de exibição do campo.
						sort: true,            // Indica se os resultados podem ser ordenados por este campo.
						fullSearch: true,      // Indica se buscas 'fullsearch' podem ser realizadas nesse campo.
						style: 'width: 250px;' // Estilo CSS que será aplicado no cabeçalho da tabela gerada na paginação.
					}
			*/
			fields: {
				type: Array,
				required: true,
				default: () => []
			},

			/*
				Objeto usado para filtrar os resultados no padrão 'filter_fields'.
				Cada vez que a propriedade for alterada, os filtros serão automaticamente aplicados.
				Cada propriedade do objeto corresponde a um filtro.

				Exemplo:
				{
					descricaoObjeto: { op: '*', value: 'AQUISIÇÃO DE SERVIÇO' }
				}
			*/
			filterFields: {
				type: Object,
				required: false,
				default: () => {}
			},

			/* Mensagem passada para avisar que os dados estão sendo carregados */
			loadingMessage: {
				type: String,
				required: false,
				default: 'Carregando dados.'
			}
		},

		data() {
			return {
				/* Campos internos. */
				userSortFields: new Map(), // Campos incluídos na ordenação atual e sua ordem ('asc' ou 'desc').
				userFullSearchFields: [],  // Campos marcados para serem incluídos na busca.
				userFullSearchValue: '',   // Valor atual do campo de busca.

				loadingParameters: false, // Indica se os parâmetros de paginação estão sendo carregados (da url ou propriedade).
				loadingData: false,       // Indica se uma requisição aos dados de paginação está em andamento.
				lastError: null,          // Armazena o erro da última requisição (se houve erro).

				/* Enviados ao Back-end */
				page: 1,               // Número da página requisitada.
				items_per_page: 10,    // Quantidade de itens por página requisitado.
				show_all_items: false, // Indica se todos os itens devem ser retornados, independente dos parâmeros anteriores.
				sort_fields: '',       // Lista de campos de ordenação. Define a ordem dos dados retornados.
				filter_fields: '',     // Lista de expressões para filtro no formato 'filter_fields'.
				fullsearch_fields: '', // Lista de campos que participarão da busca 'fullsearch'.
				fullsearch_value: '',  // Valor usado para a busca 'fullsearch'.

				/* Recebidos do Back-end */
				pageCount: 0,   // Total de páginas disponíveis (muda de acordo com o 'items_per_page');
				currentPage: 0, // Página atual retornada.
				itemCount: 0,   // Total de itens disponíveis.
				itemOffset: 0,  // Índice do primeiro item retornado.
				itemList: [],   // Lista com os itens da janela de paginação retornada.
			};
		},

		computed: {
			/*
				Mapa para facilitar o acesso aos campos utilizando o 'id'.
				Também cria uma cópia dos objetos para permitir a alteração.
			*/
			fieldsMap() {
				return new Map(this.fields.map(s => [s.id, s]));
			},

			/* Indica se a paginação atual não retornou nenhum resultado. */
			isEmpty() {
				return this.itemCount == 0;
			},

			/* Índice final da janela de paginação atual. Leva em conta o número de itens efetivos na página. */
			finalItemOffset() {
				if (this.show_all_items) {
					return this.itemCount;
				} else {
					let finalOffset = this.itemOffset + this.items_per_page - 1;
					return (finalOffset < this.itemCount) ? finalOffset : this.itemCount;
				}
			},

			/* Indica se é possível navegar para a página anterior. */
			canGoToPreviousPage() {
				return this.currentPage > 1;
			},

			/* Indica se é possível navegar para a próxima página. */
			canGoToNextPage() {
				return this.currentPage < this.pageCount;
			},

			/* Número de itens por página efetivo. Leva em consideração o campo 'show_all_items'. */
			userItemsPerPage: {
				get() {
					return (this.show_all_items) ? -1 : this.items_per_page;
				},

				set(newValue) {
					if (newValue == -1) {
						this.show_all_items = true;
					} else {
						this.show_all_items = false;
						this.items_per_page = newValue;
					}
				}
			},

			/* Somente os campos que podem fazer parte da ordenação. */
			sortFields() {
				return this.fields.filter(f => f.sort == true);
			},

			/* Somente os campos que podem fazer parte da busca 'fullsearch'. */
			fullSearchFields() {
				return this.fields.filter(f => f.fullSearch == true);
			},

			/* Indica se existe pelo menos um campo disponível para a busca 'fullsearch'. */
			fullSearchFieldsAvailable() {
				return this.fullSearchFields.length > 0;
			},

			/* Usando os campos de envio ao back-end, retorna a última busca 'fullsearch' aplicada. */
			currentFullSearch() {
				if (this.fullsearch_fields && this.fullsearch_value) {
					return {
						fields: this.fullsearch_fields.split(',').map(f => this.fieldsMap.get(f).name).join(', '),
						value: this.fullsearch_value
					};
				} else {
					return null;
				}
			}
		},

		watch: {
			page() {
				this.fetchData();
			},

			userItemsPerPage() {
				this.fetchData();
			},

			filterFields: {
				deep: true,
				handler: function() {
					this.filter_fields = this.filterFieldsToString(this.filterFields);
				}
			},

			filter_fields() {
				this.fetchData();
			},

			loadingData(value) {
				this.$emit('loading', value);
			}
		},

		methods: {
			/* Carrega e valida os parâmetros de paginação. */
			loadParameters() {
				let params = null;

				if (this.urlAccess) {
					params = this.$route.query;
				} else {
					params = this.parameters;
				}

				if (!params) {
					return;
				}

				this.loadingParameters = true;

				if (params.p && /^\d+$/.test(params.p)) {
					this.page = parseInt(params.p, 10);
				}

				if (params.ipp && allowedItemsPerPage.indexOf(params.ipp) >= 0) {
					this.items_per_page = parseInt(params.ipp, 10);
				}

				if (params.sai && (params.sai == 'true' || params.sai == 'false')) {
					this.show_all_items = (params.sai == 'true');
				}

				if (params.sf && /^\w+:(asc|desc)(,\w+:(asc|desc))*$/.test(params.sf)) {
					params.sf.split(',').forEach(s => {
						let sParts = s.split(':');
						let field = sParts[0];
						let order = sParts[1];

						if (this.fieldsMap.has(field)) {
							this.applySort(field);

							if (order == 'desc') {
								this.applySort(field);
							}
						}
					});
				}

				if (params.ff && ffExpressionListReg.test(params.ff)) {
					let ffObject = this.filterFieldsToObject(params.ff);

					this.filter_fields = this.filterFieldsToString(ffObject);
					this.$emit('update:filterFields', ffObject);
				}

				if (params.fsf && /^\w+(,\w+)*$/.test(params.fsf)) {
					this.userFullSearchFields = [];

					params.fsf.split(',').forEach(f => {
						if (this.fieldsMap.has(f)) {
							this.userFullSearchFields.push(f);
						}
					});
				}

				if (params.fsv) {
					this.userFullSearchValue = params.fsv.slice(0, 100);
				}

				this.applyFullSearch();

				/* Aguarda a execução dos watchers para desativar o estado de carregamento de parâmetros. */
				this.$nextTick(() => this.loadingParameters = false);
			},

			/* Armazena os parâmeros de paginação. */
			storeParameters() {
				let parameters = {
					p: this.page,
					ipp: this.items_per_page,
					sai: this.show_all_items,
					sf: this.sort_fields,
					ff: this.filter_fields,
					fsf: this.fullsearch_fields,
					fsv: this.fullsearch_value
				};


				if (this.urlAccess) {
					this.$router.replace({ query: parameters });
				} else {
					this.$emit('update:parameters', parameters);
				}
			},

			/* Aplica a busca 'fullsearch' com os parâmetros selecionados. */
			applyFullSearch() {
				if (this.userFullSearchFields.length > 0 && this.userFullSearchValue) {
					this.fullsearch_fields = this.userFullSearchFields.join(',');
					this.fullsearch_value = this.userFullSearchValue;
				} else {
					this.fullsearch_fields = '';
					this.fullsearch_value = '';
				}

				this.fetchData();
			},

			/*
				Aplica a ordenação ao campo informado.
				O parâmetro 'event' é usado para decidir se o campo vai substituir ou incrementar a ordenação atual.
			*/
			applySort(field, event) {
				/* Verifica se o campo é ordenável. */
				if (!this.fieldsMap.get(field).sort) {
					return;
				}

				/* Inverte a ordem do campo se ele já estiver na ordenação ou usa a ordem padrão. */
				let sort = this.userSortFields.get(field);
				let order = 'asc';

				if (sort) {
					order = (sort.order == 'asc') ? 'desc': 'asc';
				}

				/* Remove o campo da ordenação para adicioná-lo ao fim da mesma ... */
				if (!event || event.ctrlKey) {
					this.userSortFields.delete(field);
				}
				/* .. ou limpa todos os campos da ordenação: o campo informado será o único. */
				else {
					this.userSortFields.clear();
				}

				/* Adiciona o campo na ordenação. */
				let index = this.userSortFields.size + 1;

				this.userSortFields.set(field, { order, index });

				/* Atribui o filtro de ordenação do back-end. */
				this.sort_fields = [...this.userSortFields]
					.map(s => s[0] + ':' + s[1].order)
					.join(',');

				/* Atualiza os dados. */
				this.fetchData();
			},

			goToPage(n) {
				if (!n) {
					n = this.pageCount;
				}

				if (n < 1) {
					n = 1;
				}

				if (n > this.pageCount) {
					n = this.pageCount;
				}

				this.page = n;
			},

			goToFirstPage() {
				this.goToPage(1);
			},

			goToPreviousPage() {
				this.goToPage(this.page-1);
			},

			goToNextPage() {
				this.goToPage(this.page+1);
			},

			goToLastPage() {
				this.goToPage(null);
			},

			/* Obtém os dados de paginação através de uma requisição AJAX. */
			async fetchData() {
				/*
					Várias alterações são feitas durante o carregamento dos parâmetros.
					Evita requisições nesta etapa.
				*/
				if (this.loadingParameters) {
					return;
				}

				let parameters = {
					page: this.page,
					items_per_page: this.items_per_page,
					show_all_items: this.show_all_items
				};

				if (this.sort_fields) {
					parameters.sort_fields = this.sort_fields;
				}

				if (this.filter_fields) {
					parameters.filter_fields = this.filter_fields;
				}

				if (this.fullsearch_value) {
					parameters.fullsearch_fields = this.fullsearch_fields;
					parameters.fullsearch_value = this.fullsearch_value;
				}

				this.storeParameters();

				try {
					this.loadingData = true;

					let data = await $.get(this.url, parameters);

					if (data.itemCount > 0) {
						this.pageCount = data.pageCount;
						this.currentPage = data.currentPage;
						this.itemCount = data.itemCount;
						this.itemOffset = data.itemOffset;
						this.itemList = data.itemList;

						/* Em algumas situações o back-end retorna o "itemOffset" com valor "0". */
						if (this.itemOffset == 0) {
							this.itemOffset = 1;
						}
					}
					/* Ajusta os valores do back-end quando não há resultados. */
					else {
						this.pageCount = 0;
						this.currentPage = 0;
						this.itemCount = 0;
						this.itemOffset = 0;
						this.itemList = [];
					}

					this.lastError = null;
				} catch(e) {
					this.lastError = e;
				} finally {
					/* Ajusta a página atual solicitada, caso o número total de páginas tenha sido alterado. */
					if (this.page > this.pageCount) {
						this.page = (this.pageCount > 0) ? this.pageCount : 1;
					}

					this.loadingData = false;
				}
			},

			/* Converte uma string 'filter_field' em um objeto correspondente. */
			filterFieldsToObject(filterFieldsString) {
				let filterFields = {};

				filterFieldsString
					.split(',')
					.forEach(ff => {
						let parts = ff.split(ffOperatorReg);
						if (this.fieldsMap.has(parts[0])) {
							filterFields[parts[0]] = {
								op: parts[1],
								value: parts[2]
							};
						}
					});

				return filterFields;
			},

			/* Converte um objeto 'filter_field' em uma string correspondente. */
			filterFieldsToString(filterFieldsObject) {
				if (!filterFieldsObject) {
					return null;
				}

				return Object.keys(filterFieldsObject)
					.map(key => {
						let ff = filterFieldsObject[key];
						if (ff.op && ff.value != null && ff.value != undefined) {
							return `${key}${ff.op}${ff.value}`;
						} else {
							return '';
						}
					})
					.filter(ff => ffExpressionReg.test(ff))
					.join(',');
			},

			/* Navega por caminhos de propriedade separados por ponto ("."). */
			getProperty(object, property) {
				let data = object;

				property.split('.').forEach(p => data = data[p]);

				return data;
			}
		},

		created() {
			/* Marca todos os campos para serem incluídos na busca 'fullsearch'. */
			this.userFullSearchFields = this.fullSearchFields.map(s => s.id);

			/* Carrega os parâmetros de paginação. */
			this.loadParameters();

			/* Carrega os dado pela primeira vez. */
			this.$nextTick(() => this.fetchData());
		}
	};
</script>

<style scoped>
	.v-datatable-table + .v-datatable-footer {
		margin-top: -16px;
		padding: 15px;
		border-radius: 0 0 4px 4px;
		background-color: #ddd;
	}

	.v-datatable-header  {
		user-select: none;
		background-color: #ddd;
	}

	.has-sort-field {
		cursor: pointer;
	}

	.v-datatable-body {
		background-color: #fff
	}
</style>
