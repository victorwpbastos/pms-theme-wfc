<template>
	<div class="wrapper">
		<img src="../../../assets/img/brasao-lg.png">
		<br>
		<br>
		<h2 class="thin">A página solicitada não foi encontrada</h2>
		<br>
		<router-link to="/">Clique aqui para retornar à página inicial</router-link>
	</div>
</template>

<style lang="less" scoped>
	.wrapper {
		margin-top: 100px;
		text-align: center;

		img {
			filter: opacity(70%);
		}

		a {
			color: #5bc0de;
			font-size: 18px;
		}
	}
</style>