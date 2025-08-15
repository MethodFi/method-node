import { MethodClient, Environments } from '../src';
// @ts-ignore
export const client = new MethodClient({ apiKey: process.env.TEST_CLIENT_KEY, env: Environments.dev });
// @ts-ignore
export const clientWithPreferAsync = new MethodClient({ apiKey: process.env.TEST_CLIENT_KEY, env: Environments.dev, prefer: 'respond-async' });
