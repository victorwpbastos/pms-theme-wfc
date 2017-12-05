import { req, withParams } from 'vuelidate/lib/validators/common';
import _required from 'vuelidate/lib/validators/required';

let defaultErrorMessage = 'Erro no campo.';

let errorMessages = {
	greaterThan: params => `O valor deve ser maior que "${params.min}".`,
	lessThan: params => `O valor deve ser menor que "${params.max}".`,
	required: 'Campo obrigatório.'
};

export let bindErrorMessage = (validator, errorMessage, type) => {
	return withParams(
		{ type, errorMessage: errorMessage || defaultErrorMessage }, validator
	);
};

export let extractErrorMessage = validation => {
	if (validation.$invalid) {
		for (let key in validation) {
			if (key[0] !== '$') {
				if (validation[key] === false) {
					let errorMessage = validation.$params && validation.$params[key] && validation.$params[key].errorMessage;

					if (errorMessage) {
						if (typeof errorMessage === 'string') {
							return errorMessage;
						} else {
							return errorMessage(validation.$params[key]);
						}
					} else {
						return defaultErrorMessage;
					}
				}
			}
		}

		return defaultErrorMessage;
	} else {
		return null;
	}
};

export let createIfValidator = predicate => {
	return(validator => {
		return (value => {
			return !predicate(this) || validator.call(this, value);
		});
	});
};

export let required = bindErrorMessage(_required, errorMessages['required'], 'required');

export let lessThan = max => withParams(
	{ type: 'lessThan', errorMessage: errorMessages['lessThan'], max },
	value => !req(value) || value < max
);

export let greaterThan = min => withParams(
	{ type: 'greaterThan', errorMessage: errorMessages['greaterThan'], min },
	value => !req(value) || value > min
);