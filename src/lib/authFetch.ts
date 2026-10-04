const CLIENT_BASE = process.env.NEXT_PUBLIC_CLIENT_API;
const SSR_BASE = process.env.NEXT_PUBLIC_SSR_API;

import { getClientTokenCookie, setClientTokenCookie } from "./authClient";

export async function clientFetch(path: string, options={}) {
const url=`${CLIENT_BASE}${path}`;
const token=getClientTokenCookie();
const response = await fetch(url, {
    
})
}