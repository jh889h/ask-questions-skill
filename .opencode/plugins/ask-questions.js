import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };
  
  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};
  
  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }
  
  return { frontmatter, content: body };
};

export const AskQuestionsPlugin = async ({ client, directory }) => {
  const skillsDir = path.resolve(__dirname, '../../skills');
  
  const getBootstrapContent = () => {
    const skillPath = path.join(skillsDir, 'ask-questions', 'SKILL.md');
    if (!fs.existsSync(skillPath)) return null;
    
    const fullContent = fs.readFileSync(skillPath, 'utf8');
    const { content } = extractAndStripFrontmatter(fullContent);
    
    return `<EXTREMELY_IMPORTANT>
You have the ask-questions skill loaded. Follow its instructions for ALL code-affecting work.

**IMPORTANT: The ask-questions skill is ALREADY LOADED. Do NOT use the skill tool to load it again.**

${content}
</EXTREMELY_IMPORTANT>`;
  };
  
  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },
    
    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (!bootstrap || !output.messages.length) return;
      const firstUser = output.messages.find(m => m.info.role === 'user');
      if (!firstUser || !firstUser.parts.length) return;
      if (firstUser.parts.some(p => p.type === 'text' && p.text.includes('EXTREMELY_IMPORTANT'))) return;
      const ref = firstUser.parts[0];
      firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap });
    }
  };
};