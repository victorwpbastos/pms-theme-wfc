export default [
	{
		path: '/',
		component: () => import('views/commons/home' /* webpackChunkName: 'home' */)
	},
	{
		path: '/recuperarsenha',
		component: () => import('views/permisys/recuperar-senha' /* webpackChunkName: 'recuperar-senha' */)
	},
	{
		path: '*',
		component: () => import('views/commons/page404' /* webpackChunkName: 'page404' */)
	}
];