export const AUTH_STORAGE_KEY = 'token';

export interface AuthState {
	accessToken: string;
	refreshToken?: string;
	expiresAt?: number | null;
}

export function decodeJwtExp(token: string): number | null {
	try {
		const payloadPart = token.split('.')[1];
		if (!payloadPart) return null;
		const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
		const payload = JSON.parse(atob(base64)) as { exp?: number };
		return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
	} catch {
		return null;
	}
}

export function getAuthState(): AuthState | null {
	try {
		const raw = localStorage.getItem(AUTH_STORAGE_KEY);
		if (!raw) return null;
		const state = JSON.parse(raw) as Partial<AuthState> | null;
		return state?.accessToken ? (state as AuthState) : null;
	} catch {
		return null;
	}
}

export function saveAuthTokens(accessToken: string, refreshToken?: string): void {
	const prev = getAuthState();
	const state: AuthState = {
		accessToken,
		refreshToken: refreshToken ?? prev?.refreshToken,
		expiresAt: decodeJwtExp(accessToken)
	};
	localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

export function clearAuthTokens(): void {
	localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function hasValidSession(): boolean {
	const state = getAuthState();
	if (!state?.accessToken) return false;

	// С refresh-токеном сессия жива, пока жив он: access обновится на 401
	if (state.refreshToken) {
		const refreshExp = decodeJwtExp(state.refreshToken);
		return refreshExp === null || Date.now() < refreshExp;
	}

	// Старый формат хранения: только access-токен с expiresAt
	if (state.expiresAt) return Date.now() < state.expiresAt;
	return true;
}
