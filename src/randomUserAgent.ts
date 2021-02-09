import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const userAgents = require('top-user-agents');

export default function randomUserAgent() {
  const randomIndex = Math.random() * (userAgents.length - 1);
  return userAgents[randomIndex];
}
