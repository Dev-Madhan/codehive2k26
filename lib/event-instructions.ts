/**
 * Event Instructions & Guidelines Registry
 * Keyed by event slug for clean, modular management.
 */

export interface EventRoundSummary {
  roundNumber: number;
  name: string;
  day: string;
  marks: number;
  summary: string;
}

export interface EventRuleDirective {
  title: string;
  iconType: "ai" | "security" | "defense" | "rules";
  description: string;
  highlights: string[];
}

export interface CleanEventInstructions {
  slug: string;
  title: string;
  format: string;
  totalRounds: number;
  totalMarks: number;
  brief: string;
  corePrinciple: string;
  rounds: EventRoundSummary[];
  directives: EventRuleDirective[];
}

const INSTRUCTIONS_MAP: Record<string, CleanEventInstructions> = {
  "techforge-2026": {
    slug: "techforge-2026",
    title: "TECHFORGE",
    format: "2-Day Technical Competition (4 Progressive Rounds)",
    totalRounds: 4,
    totalMarks: 200,
    brief:
      "A progressive team-based technical challenge where participants build, evolve, and defend a real-world enterprise application across two days. Day 1 builds the core architecture; qualifying teams advance to Day 2 for real-time stream integration and live technical defense.",
    corePrinciple:
      "AI-allowed, tool-flexible, and technology-independent — but integrity, technical ownership, and the ability to defend your solution are mandatory.",
    rounds: [
      {
        roundNumber: 1,
        name: "Analyze & Design",
        day: "Day 1 (Morning)",
        marks: 40,
        summary:
          "Convert requirements into practical system architecture, normalized database schemas, API specs, and user workflows.",
      },
      {
        roundNumber: 2,
        name: "Core Implementation",
        day: "Day 1 (Afternoon)",
        marks: 60,
        summary:
          "Build a working core application with persistent database storage, role-based workflows, and defensive validation. (Day 1 total: 100 Marks — Qualifying teams advance to Day 2).",
      },
      {
        roundNumber: 3,
        name: "Advanced Integration",
        day: "Day 2 (Morning)",
        marks: 40,
        summary:
          "Extend your existing codebase with live data stream ingestion, dynamic priority calculation, and duplicate/anomaly detection.",
      },
      {
        roundNumber: 4,
        name: "Grand Final & Defense",
        day: "Day 2 (Afternoon)",
        marks: 60,
        summary:
          "Live system stress testing under competition conditions, demonstration, and technical viva cross-examination before jury.",
      },
    ],
    directives: [
      {
        title: "AI Tools & Coding Agents Allowed",
        iconType: "ai",
        description:
          "Teams may use AI assistants (ChatGPT, Copilot, Cursor, Claude, etc.), IDEs, and open-source libraries to code, debug, and design faster.",
        highlights: [
          "Use of AI is fully permitted and welcomed.",
          "Teams must thoroughly understand all generated code.",
          "Judges will evaluate your comprehension during the viva.",
        ],
      },
      {
        title: "Codebase Continuity & Integrity",
        iconType: "security",
        description:
          "Teams build and evolve one continuous codebase across both days. Zero tolerance for plagiarism, attacking infrastructure, or code-sharing between teams.",
        highlights: [
          "Single continuous codebase across all 4 rounds.",
          "Strictly no copying another team's solution or sharing tokens.",
          "Attacking or scanning competition infrastructure is prohibited.",
        ],
      },
      {
        title: "Live Demo & Technical Defense",
        iconType: "defense",
        description:
          "Evaluation is based on working real-world functionality, database integrity, and your team's ability to explain architectural decisions.",
        highlights: [
          "The solution must actually function live under test inputs.",
          "Be ready to defend architecture, database schema, and trade-offs.",
          "Any team member may be questioned by the judges.",
        ],
      },
    ],
  },
  "agentvibe-2026": {
    slug: "agentvibe-2026",
    title: "AGENTVIBE",
    format: "2-Day AI Agent Building Challenge (4 Progressive Rounds)",
    totalRounds: 4,
    totalMarks: 200,
    brief:
      "A flagship AI agent engineering competition where teams design, build, integrate, and test an intelligent autonomous productivity agent. Day 1 focuses on core agent understanding, classification, and drafting; qualifying teams advance to Day 2 for surprise context linking and live technical defense.",
    corePrinciple:
      "From ideas to intelligent agents — prompt, build, and automate safely while maintaining total technical ownership.",
    rounds: [
      {
        roundNumber: 1,
        name: "Agent Blueprint",
        day: "Day 1 (Morning)",
        marks: 40,
        summary:
          "Architect the agent decision logic, tool execution flow, safety boundaries, and prompt/RAG pipeline design.",
      },
      {
        roundNumber: 2,
        name: "Vibe Build",
        day: "Day 1 (Afternoon)",
        marks: 60,
        summary:
          "Build the working core agent capable of intent classification, entity extraction, summaries, and human-in-the-loop approval drafts. (Day 1: 100 Marks — Top 25 qualify).",
      },
      {
        roundNumber: 3,
        name: "Agent Connect",
        day: "Day 2 (Morning)",
        marks: 40,
        summary:
          "Integrate multi-source context linking, detect changing information/deadlines, identify schedule conflicts, and propose safe actions.",
      },
      {
        roundNumber: 4,
        name: "Agent Evolution Final",
        day: "Day 2 (Afternoon)",
        marks: 60,
        summary:
          "End-to-end live testing against surprise evaluation scenarios, safe action verification, and jury technical viva defense.",
      },
    ],
    directives: [
      {
        title: "AI Tools & Framework Freedom",
        iconType: "ai",
        description:
          "Teams may use any modern LLM API, local models, LangChain, LlamaIndex, or agentic frameworks to power their solution.",
        highlights: [
          "All modern AI developer tools and APIs permitted.",
          "Agent must separate verified facts from uncertainties.",
          "Never fabricate missing dates or critical details.",
        ],
      },
      {
        title: "Human Approval & Safety",
        iconType: "security",
        description:
          "Autonomous actions that modify external state (sending messages, editing calendars) must mandate explicit user confirmation.",
        highlights: [
          "Safe, human-in-the-loop action execution.",
          "Ask for clarification when details are ambiguous.",
          "Single continuous codebase across all 4 rounds.",
        ],
      },
      {
        title: "Live Testing & Technical Viva",
        iconType: "defense",
        description:
          "Teams must demonstrate working agent reasoning and defend their prompt engineering, tool choice, and reliability before the judges.",
        highlights: [
          "Evaluation is based on verified live agent execution.",
          "Defend decision logic and error recovery.",
          "Every team member should be prepared for questioning.",
        ],
      },
    ],
  },
};

/**
 * Get instructions for any event by slug.
 * Returns custom instructions if registered, or a clean professional fallback for any new slug.
 */
export function getEventInstructions(slug: string, eventName?: string): CleanEventInstructions {
  if (INSTRUCTIONS_MAP[slug]) {
    return INSTRUCTIONS_MAP[slug];
  }

  const cleanTitle = eventName || slug.replace(/-/g, " ").toUpperCase();

  return {
    slug,
    title: cleanTitle,
    format: "Multi-Round Technical Challenge",
    totalRounds: 3,
    totalMarks: 100,
    brief: `${cleanTitle} is a team-based technical competition where participants design, build, and demonstrate a working real-world application under structured evaluation.`,
    corePrinciple:
      "Build with precision, solve real-world problems, and be prepared to defend your implementation.",
    rounds: [
      {
        roundNumber: 1,
        name: "Analyze & Design",
        day: "Phase 1",
        marks: 30,
        summary: "Requirement analysis, system architecture, database schema design, and UX planning.",
      },
      {
        roundNumber: 2,
        name: "Implementation",
        day: "Phase 2",
        marks: 40,
        summary: "Build working application with persistent database storage, API integration, and validation.",
      },
      {
        roundNumber: 3,
        name: "Demo & Technical Defense",
        day: "Phase 3",
        marks: 30,
        summary: "Live demonstration, codebase inspection, and answering technical questions from judges.",
      },
    ],
    directives: [
      {
        title: "Tools & Libraries Policy",
        iconType: "ai",
        description: "Teams may choose their own modern technology stack, libraries, and developer tools.",
        highlights: ["Full technology freedom.", "Teams must understand their codebase."],
      },
      {
        title: "Originality & Fair Play",
        iconType: "security",
        description: "All submitted work must be original; collaboration between competing teams is prohibited.",
        highlights: ["Original project work.", "Adherence to event rules."],
      },
      {
        title: "Demonstration & Viva",
        iconType: "defense",
        description: "Evaluation includes a working demo and technical explanation of the solution.",
        highlights: ["Functional verification.", "Architectural defense."],
      },
    ],
  };
}

export function registerEventInstructions(slug: string, data: CleanEventInstructions): void {
  INSTRUCTIONS_MAP[slug] = data;
}

export function deleteEventInstructions(slug: string): boolean {
  if (INSTRUCTIONS_MAP[slug]) {
    delete INSTRUCTIONS_MAP[slug];
    return true;
  }
  return false;
}
