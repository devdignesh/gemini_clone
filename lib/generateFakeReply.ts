export function generateFakeReply(): string {
  const replies = [
    "That's interesting!",
    "Can you tell me more?",
    "I'm here to help.",
    "Got it.",
    "Sure, let's do that!"
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}