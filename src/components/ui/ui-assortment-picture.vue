<script setup lang="ts">
import { ref } from 'vue';

import UiIcon from '@/components/ui/ui-icon.vue';

interface IUiAssortmentPictureProps {
	src?: string | null;
	alt?: string;
	width?: number;
	height?: number;
	altWidth?: number;
	altHeight?: number;
}

const props = withDefaults(defineProps<IUiAssortmentPictureProps>(), {
	alt: '',
});

const broken = ref(false);
</script>

<template>
	<div
		class="assortment-picture"
		:style="{ width: `${props.width}px`, height: `${props.height}px` }"
	>
		<img
			v-if="props.src && !broken"
			class="assortment-picture__img"
			:style="{ width: `${props.width}px`, height: `${props.height}px` }"
			:src="props.src"
			:alt="props.alt"
			@error="broken = true"
		/>
		<ui-icon
			v-else
			id="icon-no-photo"
			:style="{ width: `${props.altWidth}px`, height: `${props.altWidth}px` }"
			class="assortment-picture__no-photo-svg"
		/>
	</div>
</template>

<style lang="scss" scoped>
.assortment-picture {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	background-color: $smm-color-neutral-100;
	border-radius: 8px;

	&__img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	&__no-photo-svg {
		position: absolute;
		width: 24px;
		height: 24px;
		fill: $smm-color-neutral-250;
	}
}
</style>
