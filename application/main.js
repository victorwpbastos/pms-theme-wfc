import '@babel/polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from 'routes';
import Layout from 'views/commons/layout';
import initializer from 'initializer';
import Vuelidate from 'vuelidate';
import 'assets/css/main.less';

Vue.use(VueRouter);
Vue.use(Vuelidate);

let router = new VueRouter({ routes, linkActiveClass: 'active' });

initializer(router);

new Vue({
	el: '#application-container',
	router,
	render(h) {
		return h(Layout);
	}
});