<template>
	<div class="menu" :class="{ 'toggled': toggled }">
		<div class="handler" @click="toggled = !toggled">
			<span class="fa fa-fw fa-bars"></span>
		</div>

		<router-link to="/" exact>
			<span class="fa fa-fw fa-home"></span>
			<span v-show="!toggled" :class="toggled ? 'tooltip' : 'm-left-5'">Home</span>
		</router-link>

		<router-link to="/usuarios" exact>
			<span class="fa fa-fw fa-users"></span>
			<span v-show="!toggled" :class="toggled ? 'tooltip' : 'm-left-5'">Usuários</span>
		</router-link>

		<router-link to="/documentos" exact>
			<span class="fa fa-fw fa-files-o"></span>
			<span v-show="!toggled" :class="toggled ? 'tooltip' : 'm-left-5'">Documentos</span>
		</router-link>

		<router-link to="/items" exact>
			<span class="fa fa-fw fa-table"></span>
			<span v-show="!toggled" :class="toggled ? 'tooltip' : 'm-left-5'">Items</span>
		</router-link>

		<router-link to="/configuracoes" exact>
			<span class="fa fa-fw fa-cog"></span>
			<span v-show="!toggled" :class="toggled ? 'tooltip' : 'm-left-5'">Configurações</span>
		</router-link>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				toggled: false
			};
		},

		watch: {
			toggled() {
				let appName = this.$store.pkg.name.toUpperCase().replace(/\s/g, '_');
				localStorage.setItem(`${appName}-menu-toggled`, this.toggled);
			}
		},

		created() {
			let appName = this.$store.pkg.name.toUpperCase().replace(/\s/g, '_');
			let value = localStorage.getItem(`${appName}-menu-toggled`);

			if (value) {
				this.toggled = JSON.parse(value);
			}
		}
	};
</script>

<style lang="less" scoped>
	.menu {
		position: relative;

		&.toggled {
			a:not(.handle):hover {
				.tooltip {
					display: inline-block !important;
				}
			}
		}

		.handler {
			height: 70px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #ffffff;
			font-size: 18px;
			cursor: pointer;
		}

		a {
			display: flex;
			align-items: center;
			text-decoration: none;
			color: darken(#ffffff, 0.5);
			transition: all 300ms;
			padding: 10px 15px;
			position: relative;

			.fa {
				font-size: 20px;
			}

			&:hover,
			&.active {
				color: lighten(#5bc0de, 10);
			}

			&.active:after {
				content: '';
				position: absolute;
				right: -15px;
				border: 6px solid transparent;
				border-right-color: #e7e7e7;
				cursor: default;
			}

			.tooltip {
				display: none;
				position: absolute;
				white-space: nowrap;
				left: 45px;
				z-index: 99;
				padding: 2px 4px;
				border-radius: 3px;
				background: lighten(#5bc0de, 10);
				color: #286b86;
			}
		}
	}
</style>