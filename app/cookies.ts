import { createCookie } from '@remix-run/cloudflare';
import { darkTheme } from './stiches.config.js';

export const colorSchemeCookie = createCookie('color-scheme')
export const getColorSchemeToken = (request: Request): Promise<any> => colorSchemeCookie.parse(request.headers.get('Cookie'))

export const getColorScheme = async (request: Request) => {
    const userSelectedColorScheme = await getColorSchemeToken(request);
    const systemPreferredColorScheme = request.headers.get('Sec-CH-Prefers-Color-Scheme');

    return userSelectedColorScheme ?? systemPreferredColorScheme ?? 'dark';
}