import type { EntryContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { getCssText } from './stiches.config.js';

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
)
{
    const markup = renderToString(<RemixServer context={remixContext} url={request.url} />)
        .replace(/<\/head>/, `<style>${getCssText()}</style></head>`);

    responseHeaders.set('Content-Type', 'text/html');

    return new Response('<!DOCTYPE html>' + markup, {
        status: responseStatusCode,
        headers: responseHeaders,
    });
}
