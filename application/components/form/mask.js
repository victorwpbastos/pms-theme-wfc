let charMap = {
	'#': /[0-9]/,
	'a': /[a-z]/,
	'A': /[A-Z]/,
	'@': /[a-zA-Z]/,
	'*': /./
};

export function normalizeMask (mask, value) {
	let normalizedMask = mask;

	if (typeof(mask) === 'string') {
		mask = mask.split('');

		normalizedMask = mask.map((char, index) => {
			let escaped = mask[index - 1] === '\\';

			if (char === '\\') {
				return null;
			} else if (escaped) {
				return char;
			} else {
				return charMap[char] || char;
			}
		}).filter(char => char !== null);
	}

	if (typeof(mask) === 'function' && value) {
		normalizedMask = mask(value);
	}

	return normalizedMask;
}

export function unmask (mask, value) {
	if (typeof(mask) === 'string') {
		mask =  mask.split('');
	}

	if (typeof(mask) === 'function') {
		mask = mask(value);
	}

	return mask.map((char, index) => {
		if (char instanceof RegExp) {
			return value[index];
		} else if (charMap[char] && charMap[char].test(value[index])) {
			return value[index];
		}
	}).join('');
}