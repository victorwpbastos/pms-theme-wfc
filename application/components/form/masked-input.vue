<template>
	<v-text-mask
		class="form-control"
		v-model="model"
		:mask="innerMask"
		:placeholderChar="placeholderChar"
		:guide="guide"
		:keepCharPositions="keepCharPositions"
		:pipe="pipe"
		:showMask="showMask"
		@input="emitInput"
	/>
</template>

<script>
	import VTextMask from 'vue-text-mask';
	import { normalizeMask, unmask } from './mask';

	export default {
		components: { VTextMask },

		props: {
			value: { default: '' },
			mask: { default: '' },
			emitMasked: { default: true },
			emitPlaceholder: { default: false },
			placeholderChar: { default: '_' },
			guide: { default: true },
			keepCharPositions: { default: false },
			pipe: { type: Function },
			showMask: { default: false }
		},

		data() {
			return {
				model: '',
				innerMask: []
			};
		},

		watch: {
			value(value) {
				if (value) {
					this.innerMask = normalizeMask(this.mask, value);
					this.model = value;
					this.$children[0].updateValue(this.model);
				}
			}
		},

		created() {
			this.innerMask = normalizeMask(this.mask, this.value);
			this.model = this.value;
		},

		methods: {
			emitInput(value) {
				let rePlaceholderChar = new RegExp(this.placeholderChar, 'g');

				if (!this.emitMasked) {
					value = unmask(this.mask, value);
				}

				if (!this.emitPlaceholder) {
					value = value.replace(rePlaceholderChar, '');
				}

				this.$emit('input', value);
			}
		}
	};
</script>