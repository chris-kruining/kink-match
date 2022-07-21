import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import { getColorScheme } from './cookies.js';
import { darkTheme, globalStyles, styled } from './stiches.config.js';
import { json } from '@remix-run/cloudflare';
import { match } from 'ts-pattern';

export const meta: MetaFunction = () => (
    {
        charset: 'utf-8',
        title: 'New Remix App',
        viewport: 'width=device-width,initial-scale=1',
    }
);

export const loader: LoaderFunction = async ({ request }) => {
    return json({
        colorScheme: await getColorScheme(request),
    });
};

export default function App()
{
    const { colorScheme } = useLoaderData();

    const theme = match(colorScheme)
        .with('dark', () => darkTheme.toString())
        .otherwise(() => '');

    globalStyles();

    return <html lang="en" className={theme}>
        <head>
            <Meta />
            <Links />
        </head>
        <body>
            <Root>
                <Outlet />
            </Root>
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
        </body>
    </html>;
}

const Root = styled('div', {
    backgroundColor: '$surface1',
});