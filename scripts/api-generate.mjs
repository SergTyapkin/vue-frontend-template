import openapiTS, { astToString } from 'openapi-typescript';
import { mkdir, writeFile } from 'node:fs/promises';
const source = process.env.OPENAPI_SOURCE || 'shared/api/openapi.json';
const url = /^https?:/.test(source) ? new URL(source) : new URL(`../${source}`, import.meta.url);
await mkdir('shared/api/generated', { recursive: true });
await writeFile('shared/api/generated/schema.d.ts', astToString(await openapiTS(url)));
console.log('Generated API types from', source);
