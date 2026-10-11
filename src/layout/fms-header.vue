<script setup lang="ts">
import { useRouter } from 'vue-router';
import { EnterIcon } from 'ui-icons';

import { isClickWithoutSpecialKeys } from '@/utils';
import { RouteNames } from '@/router';
import useAuthentication from '@/composable/auth';

const router = useRouter();
const { getUserName, logout } = useAuthentication();

function onClick(e: MouseEvent): void {
	if (isClickWithoutSpecialKeys(e)) {
		e.preventDefault();
		router.push({ name: RouteNames.Restrictions });
	}
}
</script>

<template>
	<header class="fms-header">
		<div class="fms-header__body">
			<a
				class="fms-header__logo"
				href="/"
				@click="onClick"
			>
				<img
					class="fms-header__logo-image"
					src="@/assets/images/logo.svg?url"
				/>
			</a>
			<div class="fms-header__user">{{ getUserName() }}</div>
			<enter-icon
				class="fms-header__logout-icon"
				@click="logout"
			/>
		</div>
	</header>
</template>

<style scoped lang="scss">
.fms-header {
	display: flex;
	width: 100%;
	height: 100%;
	background: $smm-color-white;
	box-shadow: 0 8px 40px rgb(32 32 32 / 8%);

	&__body {
		display: flex;
		align-items: center;
		width: 100%;
		max-width: 1740px;
		margin: 0 auto;
		padding: 0 16px 0 12px;
	}

	&__logo {
		display: block;
		margin: 0 24px 0 0;
		cursor: pointer;
	}

	&__logo-image {
		display: block;
		width: 172px;
		height: 40px;
		user-select: none;
		pointer-events: none;
	}

	&__user {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 0 0 0 auto;
	}

	&__logout-icon {
		margin-left: 12px;
		color: $smm-color-neutral-500;
		cursor: pointer;
	}
}
</style>
