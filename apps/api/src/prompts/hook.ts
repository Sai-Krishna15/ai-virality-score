export const hookPrompt = (caption: string) => `
HOOK ANALYSIS:
Analyze the first sentence/line of this caption: "${caption.split('\n')[0]}"
Rate it 0-100 on:
- Does it create immediate curiosity or emotion?
- Is it under 15 words?
- Does it avoid starting with "I" or the brand name?
- Does it tease without revealing everything?
`;
