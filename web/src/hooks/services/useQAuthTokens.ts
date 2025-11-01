'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export interface SpotifyTokens {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export interface GitHubTokens {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
    token_type: string;
    scope: string;
}

export type OAuthTokens = SpotifyTokens | GitHubTokens;

export function useOAuthTokens() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokensParam = searchParams.get('tokens');

        if (!tokensParam) return;

        try {
            const decodedTokens = decodeURIComponent(tokensParam);

            const jsonString = decodedTokens.replace(/'/g, '"');

            const tokens: OAuthTokens = JSON.parse(jsonString);

            if ('scope' in tokens && tokens.scope?.includes('user-read')) {
                storeSpotifyTokens(tokens as SpotifyTokens);
            } else {
                storeGitHubTokens(tokens as GitHubTokens);
            }
            window.history.replaceState({}, document.title, '/services');
        } catch (error) {
            console.error('Erreur lors du parsing des tokens:', error);
        }
    }, [searchParams]);
}

function storeSpotifyTokens(tokens: SpotifyTokens) {
    sessionStorage.setItem('spotify_access_token', tokens.access_token);
    sessionStorage.setItem('spotify_refresh_token', tokens.refresh_token);
    sessionStorage.setItem('spotify_token_type', tokens.token_type);
    sessionStorage.setItem('spotify_expires_in', tokens.expires_in.toString());

    const expiresAt = Date.now() + tokens.expires_in * 1000;
    sessionStorage.setItem('spotify_expires_at', expiresAt.toString());
}

function storeGitHubTokens(tokens: GitHubTokens) {
    sessionStorage.setItem('github_access_token', tokens.access_token);
    sessionStorage.setItem('github_refresh_token', tokens.refresh_token);
    sessionStorage.setItem('github_token_type', tokens.token_type);
    sessionStorage.setItem('github_expires_in', tokens.expires_in.toString());
    sessionStorage.setItem(
        'github_refresh_token_expires_in',
        tokens.refresh_token_expires_in.toString()
    );

    const accessTokenExpiresAt = Date.now() + tokens.expires_in * 1000;
    const refreshTokenExpiresAt =
        Date.now() + tokens.refresh_token_expires_in * 1000;

    sessionStorage.setItem(
        'github_access_token_expires_at',
        accessTokenExpiresAt.toString()
    );
    sessionStorage.setItem(
        'github_refresh_token_expires_at',
        refreshTokenExpiresAt.toString()
    );
}

export function getSpotifyToken() {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('spotify_access_token');
}

export function getGitHubToken() {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('github_access_token');
}

export function isSpotifyTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    const expiresAt = sessionStorage.getItem('spotify_expires_at');
    if (!expiresAt) return true;
    return Date.now() > parseInt(expiresAt);
}

export function isGitHubAccessTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    const expiresAt = sessionStorage.getItem('github_access_token_expires_at');
    if (!expiresAt) return true;
    return Date.now() > parseInt(expiresAt);
}
