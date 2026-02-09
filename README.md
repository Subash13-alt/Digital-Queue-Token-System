
# GovQueue: Logic-Based Digital Queue Management System

## Problem Statement
Government offices often suffer from overcrowding, lack of transparency in waiting times, and "queue jumping," which leads to citizen frustration and administrative chaos. Physical lines are inefficient and inaccessible for senior citizens or people with disabilities.

## The Solution
GovQueue is a deterministic, rule-based digital token system that:
1.  **Sequentially manages tokens** per service category.
2.  **Eliminates physical standing** by providing real-time digital status tracking.
3.  **Prioritizes vulnerable citizens** using automated insertion logic.
4.  **Enforces office hours** to manage staff workload.

## Key Features
- **Deterministic Wait Time:** Uses fixed service time averages (Revenue: 8m, Aadhaar: 6m, etc.) to calculate position-based estimated wait times.
- **Priority Logic:** Automatically places "Priority Tokens" ahead of standard tokens while maintaining their own internal sequence.
- **Multi-Counter Support:** Distributes the load across up to 3 active counters simultaneously.
- **Daily Persistence:** Data persists in LocalStorage but resets automatically every day at midnight.
- **Office Hours Enforcement:** Token generation is disabled outside 09:00 - 17:00.

## Why AI is Intentionally NOT Used
1.  **Predictability:** Public services require 100% reproducible results. AI models can produce different estimations for the same input.
2.  **Transparency:** A citizen should be able to verify their wait time using simple math.
3.  **Offline Capability:** The system must function reliably even if external cloud services (like LLM APIs) are down.
4.  **No Hallucinations:** In a government context, providing "guessed" or "probabilistic" token numbers is unacceptable. Deterministic logic ensures the next token is always exactly N+1.

## Technology Stack
- **Framework:** React 18+ with TypeScript (for type safety and robust state management).
- **Styling:** Tailwind CSS (for accessible, responsive, government-standard UI).
- **Storage:** Web LocalStorage API (zero-latency, zero-cost persistence).
