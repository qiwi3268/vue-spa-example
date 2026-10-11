<script setup lang="ts">
import { SmmTitle } from 'ui';

import MarkList from '@/components/digital-mark/mark-list/mark-list.vue';
</script>

<template>
	<div class="mark-list-page">
		<div class="mark-list-page__header">
			<smm-title
				class="mark-list-page__title"
				:level="1"
			>
				Коды маркировки
			</smm-title>
		</div>

		<mark-list />
	</div>
</template>

<style scoped lang="scss">
.mark-list-page {
	position: relative;

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	&__title {
		margin-bottom: 32px;
	}
}
</style>
