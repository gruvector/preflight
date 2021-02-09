import userAgents from 'top-user-agents';

export default function randomUserAgent() {
  const randomIndex = Math.floor(Math.random() * (userAgents.length - 1));
  return userAgents[randomIndex];
}
