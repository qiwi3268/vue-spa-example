<script setup lang="ts">
import { toRefs, defineAsyncComponent } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
	id: {
		type: String as PropType<string>,
		required: true,
	},
	width: {
		type: String as PropType<string>,
		default: '16px',
	},
	height: {
		type: String as PropType<string>,
		default: '16px',
	},
});

const { width, height } = toRefs(props);

const icon = defineAsyncComponent({
	loader: () => import(`../../assets/icons/${props.id}.svg`),
});
</script>

<template>
	<component
		:is="icon"
		class="ui-icon"
		data-test-id="ui-icon"
	/>
</template>

<style lang="scss" scoped>
.ui-icon {
	width: v-bind(width);
	height: v-bind(height);
	overflow: hidden;
	fill: currentcolor;
}
</style>
