import userAgents from 'top-user-agents';

export default function randomUserAgent() {
  const randomIndex = Math.random() * (userAgents.length - 1);
  return userAgents[randomIndex];
}
