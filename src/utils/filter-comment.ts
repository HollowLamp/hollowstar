import * as fs from 'fs';
import * as path from 'path';

export function loadBannedWords(): string[] {
  const filePath = path.join(
    __dirname,
    '../modules/comment/block-keywords.json',
  );
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContent);
  return data || [];
}

export function containsBannedWords(
  text: string,
  bannedWords: string[],
): boolean {
  const lowerText = text.toLowerCase();

  for (const word of bannedWords) {
    if (lowerText.includes(word.toLowerCase())) {
      return true;
    }
  }

  return false;
}
