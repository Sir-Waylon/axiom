/* Cloudflare Worker entry (Workers + static assets). Pages users can ignore this file: Pages uses /functions. */
import { onRequest } from './functions/api/[[route]].js';
export default {
  async fetch(request, env, ctx) {
    const u = new URL(request.url);
    if (u.pathname === '/api' || u.pathname.startsWith('/api/')) return onRequest({ request, env, ctx });
    return env.ASSETS.fetch(request);
  },
};
