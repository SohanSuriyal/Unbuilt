import { Idea } from '../types';

export function generateIdeaMarkdown(idea: Idea): string {
  const skillsList = idea.skillsNeeded
    .map(s => `- **${s.skill}** (${s.filledCount}/${s.targetCount} claimed): ${s.roleDescription}`)
    .join('\n');

  const stackList = idea.feasibility.suggestedStack.map(s => `\`${s}\``).join(', ');

  const alternativesList = idea.existingSolutions.alternatives
    .map(a => `- **${a.name}**: ${a.description}${a.url ? ` ([link](${a.url}))` : ''}`)
    .join('\n');

  const prereqsList = idea.prerequisites.length > 0
    ? idea.prerequisites.map(p => `- Relates to \`${p.targetId}\` (${p.relationship})${p.note ? `: ${p.note}` : ''}`).join('\n')
    : '_None specified yet._';

  const teamList = idea.team.members.length > 0
    ? idea.team.members.map(m => `- **${m.name}** (${m.handle}) — *${m.role}* (${m.skill})`).join('\n')
    : '_No builders committed yet. Open for contributors._';

  return `# RFC: ${idea.title}

> **Tagline:** ${idea.tagline}  
> **Type:** ${idea.type.toUpperCase()} | **Category:** ${idea.category} | **Complexity:** ${idea.complexity}  
> **Status:** ${idea.team.status} | **Proposed by:** ${idea.author.name} (${idea.author.handle}) on ${idea.createdAt}

---

## 1. Motivation & Problem Statement

### The Real-World Friction
${idea.motivation.problemStatement}

### The Opportunity Gap
${idea.motivation.theGap}

### Who It Affects
${idea.motivation.whoItAffects}

### Impact If Solved
${idea.motivation.impactIfSolved}

---

## 2. Feasibility & Architecture Blueprint

### Feasibility Assessment
${idea.feasibility.assessment}

### Suggested Technical Stack
${stackList}

### Immediate First Step
${idea.feasibility.firstStep}

### Anticipated Pitfalls & Challenges
${idea.feasibility.pitfallsAndChallenges}

---

## 3. Existing Solutions & Why They Fall Short

### Current Alternatives
${alternativesList}

### Core Flaws & Why A Dedicated Solution Is Needed
${idea.existingSolutions.whyTheyFallShort}

---

## 4. Roles & Skills Needed to Build

${skillsList}

---

## 5. Prerequisites & Dependency Graph

${prereqsList}

---

## 6. Team & Contributors

${teamList}

---
*Exported from Unbuilt Commons (Open Problem & Idea Repository)*
`;
}
