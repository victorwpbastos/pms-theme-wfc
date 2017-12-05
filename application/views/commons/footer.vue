<template>
	<footer class="flex v-center">
		<span>{{ $store.pkg.organization }}</span>
		<span>Versão {{ $store.pkg.version }}</span>
	</footer>
</template>

<style scoped>
	footer {
		justify-content: space-between;
		min-height: 50px;
		max-height: 50px;
	}
</style>