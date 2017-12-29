import BaseModel from 'models/base';
import { required } from 'helpers/validation';

export default class Permisys extends BaseModel {
	constructor(recuperandoSenha = false) {
		super(`${Config.BASE_URL}/permisys`, { recuperandoSenha, usuario: '',	senha: '', email: '', hash: '', novaSenha: '' });
	}

	validations() {
		if (this._originalAttrs.recuperandoSenha) {
			return {
				usuario: { required },
				email: { required },
				hash: { required },
				senha: { required },
				novaSenha: { required }
			};
		} else {
			return {
				usuario: { required },
				senha: { required }
			};
		}
	}

	recuperarSenha() {
		return new Promise(resolve => {
			setTimeout(resolve, 3000);
		});
	}
}