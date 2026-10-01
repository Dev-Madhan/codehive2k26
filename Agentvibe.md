# CODEHIVE PRESENTS — AGENTVIBE

## PROMPT. BUILD. AUTOMATE.

**Complete Event Guide • Problem Statements • 2-Day Schedule**

**Event Theme:** AI Agent Building Challenge  
**Core Idea:** Teams progressively design, build, integrate and test a MailPilot-style productivity agent across four rounds.  
**Timings:** Day 1: 10:30 AM–3:30 PM | Day 2: 9:00 AM–3:30 PM  
**Teams:** 50 start; top 25 qualify for Day 2.

> **From Ideas to Intelligent Agents.**

---

# 1. Event Overview

AGENTVIBE is an AI agent building technical event. Participants are expected to build more than a normal chatbot: the agent should understand user requests, extract information, use tools/data, and recommend actions.

- **Event Name:** AGENTVIBE
- **Tagline:** Prompt. Build. Automate.
- **Core Use Case:** MailPilot AI – Autonomous Email & Productivity Agent.
- **Recommended Team Size:** 2–3 members (organizer to finalize).
- All teams receive the same core problem for consistent judging.
- Gmail account access is not compulsory; organizer-provided sample emails and mock calendar/task APIs may be used.
- Real email sending requires user approval.

---

# 2. Four-Round Flow

| Day | Round | Challenge | Suggested Team Flow |
|---|---|---|---|
| Day 1 | R1 | Agent Blueprint | 50 → 40 |
| Day 1 | R2 | Vibe Build | 40 → 25 |
| Day 2 | R3 | Agent Connect | 25 → 8 |
| Day 2 | R4 | Agent Evolution Final | 8 → Winner |

**Suggested shortlist counts may be adjusted based on judge capacity.**

- Day 1 Total: **100 marks**
- Day 2 Total: **100 marks**
- Overall Total: **200 marks**

---

# 3. DAY 1 — Official Problem Statement

## MAILPILOT AI — SMART EMAIL & PRODUCTIVITY AGENT

### Problem

Students and professionals receive many emails daily. Interview invitations, assignment deadlines, meeting details and action requests can get lost among newsletters and less important messages.

Manually reading each email, creating reminders, preparing replies and tracking follow-ups takes time and may cause missed deadlines.

### Challenge

Design and build an agent that processes a provided set of sample emails, understands their intent, classifies priority, extracts useful details and turns emails into an organized action list.

---

## Day 1 — Mandatory Features

### 1. Email Classification

Classify emails into:

- Urgent
- Action Required
- See Later
- FYI
- Low Priority
- Noise

### 2. Email Summary

Generate a short summary for each email.

### 3. Information Extraction

Extract:

- Sender
- Dates
- Deadlines
- Meeting time
- Requested action
- Whether a reply is needed

### 4. Dashboard

Display:

- Priority
- Summary
- Extracted task/deadline
- Status

### 5. Reply Draft

Generate a reply draft that the user can:

- Edit
- Discard

### 6. Search & Filtering

Allow search/filtering by:

- Keyword
- Sender
- Priority

### 7. Input Validation & Uncertainty Handling

Handle unclear or missing details appropriately.

### Optional Bonus Features

Teams may additionally implement:

- Mock calendar/reminder suggestions
- Follow-up detection
- Natural-language search
- Sample attachment summary

### Day 1 Deliverable

Teams must provide:

- Working prototype
- Source code
- Simple workflow/architecture diagram
- 2–3 minute demo

**Gmail OAuth is not compulsory. Use provided data or mock APIs.**

---

# 4. Day 1 Schedule — 10:30 AM–3:30 PM

| Time | Activity | Purpose |
|---|---|---|
| 10:30–10:45 | Opening & Rules | Team rules, allowed tools, judging and submission format |
| 10:45–10:55 | Problem Release | Release MailPilot problem and sample data |
| 10:55–12:00 | **ROUND 1 — Agent Blueprint** | Requirements, workflow, architecture, tool plan, safety rules |
| 12:00–12:20 | Round 1 Evaluation | Design review and short Q&A |
| 12:20–12:50 | Lunch / Break | Prepare build environment |
| 12:50–2:35 | **ROUND 2 — Vibe Build** | Build the working core prototype |
| 2:35–3:10 | Demo & Evaluation | Live demo, common test cases, judge questions |
| 3:10–3:25 | Score Compilation | Verify scores and tie-breaks |
| 3:25–3:30 | Results & Briefing | Announce top 25 and Day 2 instructions |

---

# 5. Round 1 — Agent Blueprint

**Maximum: 40 marks**

| Evaluation Criteria | Marks |
|---|---:|
| Problem understanding | 10 |
| Agent workflow and decision logic | 10 |
| Tools/data flow and architecture | 8 |
| Safety, permissions and error handling | 6 |
| Clarity and originality | 6 |
| **Total** | **40** |

The blueprint should cover the requirements, workflow, architecture, tool/data plan, and safety approach.

---

# 6. Round 2 — Vibe Build

**Maximum: 60 marks**

| Evaluation Criteria | Marks |
|---|---:|
| Core functionality | 20 |
| Classification and summary quality | 10 |
| Deadline/action extraction | 10 |
| Dashboard and search | 8 |
| Reply draft and approval flow | 5 |
| Validation/reliability/demo | 4 |
| Usability/originality | 3 |
| **Total** | **60** |

### Day 1 Score

**Round 1: 40 marks + Round 2: 60 marks = 100 marks**

---

# 7. DAY 2 — Surprise Problem Statement

## MAILPILOT AI — CONTEXT-AWARE ACTION & FOLLOW-UP AGENT

### Surprise Scenario

The basic MailPilot prototype works.

Now the inbox contains:

- Conflicting meeting updates
- Duplicate messages
- Missing dates
- Changed deadlines
- Messages that require approval before action

The agent must connect email context with task/calendar data, update recommendations and avoid unsafe actions.

### Challenge

Upgrade the Day 1 prototype to process a new organizer-provided email stream and produce reliable, context-aware action recommendations.

The upgraded agent should:

- Detect changes
- Detect conflicts
- Prioritize tasks
- Recommend appropriate actions
- Ask for confirmation before external or irreversible actions

---

# 8. Day 2 — Surprise Requirements

## 1. Context Linking

Connect emails about the same:

- Interview
- Assignment
- Meeting
- Project

## 2. Change Detection

Recognize revised:

- Meeting times
- Deadlines

and flag older information as superseded.

## 3. Conflict Detection

Identify:

- Overlapping meetings
- Conflicting deadlines

and explain the conflict.

## 4. Follow-Up Detection

Identify messages awaiting a response and draft a follow-up when appropriate.

## 5. Action Planner

Propose:

- Tasks
- Reminders
- Calendar updates

using mock APIs or controlled integration.

## 6. Safety

Do not:

- Send emails without explicit user confirmation
- Modify calendar records without explicit user confirmation
- Modify task records without explicit user confirmation

## 7. Uncertainty Handling

If dates, time or intent are unclear:

- Ask for clarification
- Never invent missing details

### Example

Email A:

> “Interview Friday at 10 AM.”

Later email:

> “The interview has moved to Friday at 2 PM.”

The agent should:

1. Detect the change.
2. Identify the newer information.
3. Treat the previous information as superseded.
4. Update the proposed calendar entry.
5. Ask for approval before committing the update.

### Day 2 Deliverable

- Updated prototype
- Test evidence
- Short explanation of changes
- Live demo

---

# 9. Day 2 Schedule — 9:00 AM–3:30 PM

| Time | Activity | Purpose |
|---|---|---|
| 9:00–9:15 | Check-in & Briefing | Attendance, rules and environment check |
| 9:15–9:30 | Surprise Release | New emails, mock API docs and test format |
| 9:30–11:45 | **ROUND 3 — Agent Connect** | Implement context linking, change/conflict detection and action planning |
| 11:45–12:15 | Round 3 Evaluation | Common tests and short demo |
| 12:15–12:50 | Lunch / Break | Break and score verification |
| 12:50–2:20 | **ROUND 4 — Agent Evolution** | Improve reliability and prepare final demo |
| 2:20–3:00 | Final Demo & Technical Defence | Live scenario test, architecture and safety questions |
| 3:00–3:20 | Final Scoring | Judges verify scores and tie-breakers |
| 3:20–3:30 | Results & Closing | Winner announcement and certificates |

---

# 10. Round 3 — Agent Connect

**Maximum: 40 marks**

| Evaluation Criteria | Marks |
|---|---:|
| Context linking/change detection | 10 |
| Conflict detection and explanation | 8 |
| Integration with Day 1 prototype | 8 |
| Action planning/recommendations | 6 |
| Reliability and edge cases | 5 |
| Implementation clarity | 3 |
| **Total** | **40** |

---

# 11. Round 4 — Agent Evolution Final

**Maximum: 60 marks**

| Evaluation Criteria | Marks |
|---|---:|
| End-to-end functionality | 15 |
| Correctness on surprise tests | 12 |
| Safe action/approval handling | 10 |
| Architecture and code explanation | 8 |
| Reliability/error handling | 5 |
| Demo and communication | 5 |
| Useful innovation | 5 |
| **Total** | **60** |

---

# 12. Overall Scoring

| Round | Marks |
|---|---:|
| Round 1 — Agent Blueprint | 40 |
| Round 2 — Vibe Build | 60 |
| **Day 1 Total** | **100** |
| Round 3 — Agent Connect | 40 |
| Round 4 — Agent Evolution Final | 60 |
| **Day 2 Total** | **100** |
| **OVERALL TOTAL** | **200** |

---

# 13. Organizer Preparation Checklist

Before the event, organizers should:

- Prepare common sample emails covering:
  - Urgent
  - Action-required
  - FYI
  - Noise
  - Duplicate
  - Updated
  - Incomplete
- Prepare the Day 2 surprise dataset separately.
- Do not reveal the Day 2 surprise dataset on Day 1.
- Provide the same dataset, API documentation/mock endpoints and test conditions to every team.
- Publish allowed AI tools, internet access, IDEs, libraries and external API rules before the event.
- Avoid requiring participants to connect personal Gmail accounts.
- Use organizer-provided test data.
- Prepare judge score sheets and common test cases before event day.
- Require source code, README/run instructions and a short demo.
- Prepare a tie-break procedure.
- Have a technical support volunteer for environment/API problems without solving tasks for teams.

---

# 14. Suggested Technology Options

The event is technology-flexible.

### Frontend

- React
- Next.js

### Backend

- Node.js
- Express
- Python
- FastAPI

### AI

- Permitted LLM API
- Organizer-provided model endpoint

### Data

- JSON
- Sample emails
- Mock Calendar APIs
- Mock Tasks APIs
- SQLite
- Supabase

Organizers should publish the exact allowed options and API access rules before the event.

---

# 15. Rules & Fairness

1. All teams receive the same Day 1 core problem and dataset.
2. Day 2 surprise requirements and hidden test cases are released only at the scheduled time.
3. Teams must be able to explain their architecture and code.
4. Only organizer-provided or consented test data should be used.
5. Participants should not use private personal emails for the competition.
6. The agent must separate known facts from uncertain information.
7. The agent must not fabricate missing dates or details.
8. External actions such as sending email or editing calendar entries require explicit user approval.
9. Teams should follow the published AI, internet, library, IDE and external API rules.
10. Teams must comply with the event's submission and evaluation procedures.

---

# 16. Tie-Break Procedure

The source event guide specifies the following tie-break order:

1. Mandatory test cases passed
2. Safety score
3. Short judge Q&A

---

# 17. Technical Defense

During the final evaluation, teams should be prepared to explain:

- Agent architecture
- Agent workflow
- Decision logic
- Data flow
- Tool usage
- AI/LLM integration
- Classification approach
- Information extraction
- Context linking
- Change detection
- Conflict detection
- Follow-up logic
- Action planning
- Safety and approval mechanisms
- Error handling
- Uncertainty handling
- Major implementation decisions

Teams must be able to explain the architecture and code used in their submitted solution.

---

# 18. Core Safety Principles

AGENTVIBE places particular importance on safe AI-agent behavior.

### Human Approval

The agent should request explicit user confirmation before external or irreversible actions.

### No Fabrication

When information is missing or unclear, the agent should not invent details.

### Clarification

When date, time or intent is uncertain, the agent should ask for clarification.

### Controlled Integration

Calendar, task and email operations should use controlled or mock integrations where applicable.

---

# 19. Complete Event Journey

```text
DAY 1
50 TEAMS
   ↓
R1 — AGENT BLUEPRINT
40 MARKS
   ↓
R2 — VIBE BUILD
60 MARKS
   ↓
TOP 25 TEAMS
   ↓
DAY 2
   ↓
SURPRISE CONTEXT RELEASE
   ↓
R3 — AGENT CONNECT
40 MARKS
   ↓
TOP 8 TEAMS
   ↓
R4 — AGENT EVOLUTION FINAL
60 MARKS
   ↓
WINNER
```

### Agent Evolution

```text
EMAIL
  ↓
UNDERSTAND
  ↓
CLASSIFY
  ↓
EXTRACT
  ↓
SUMMARIZE
  ↓
RECOMMEND
  ↓
DRAFT REPLY
  ↓
────────────────────
DAY 2
────────────────────
  ↓
CONTEXT LINKING
  ↓
CHANGE DETECTION
  ↓
CONFLICT DETECTION
  ↓
FOLLOW-UP DETECTION
  ↓
ACTION PLANNING
  ↓
HUMAN APPROVAL
  ↓
SAFE ACTION
```

---

# 20. Final Event Identity

## AGENTVIBE

### **PROMPT. BUILD. AUTOMATE.**

**Design → Build → Connect → Evolve**

AGENTVIBE challenges teams to build an intelligent productivity agent that can understand information, reason about context, connect related data, recommend actions, and operate safely with human approval.

> **From Ideas to Intelligent Agents.**

---

**CODEHIVE PRESENTS — AGENTVIBE**

**Prompt. Build. Automate.**
