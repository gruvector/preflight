import userAgents from 'top-user-agents';

export function randomUserAgent() {
  const randomIndex = Math.floor(Math.random() * (userAgents.length - 1));
  return userAgents[randomIndex]!;
}
