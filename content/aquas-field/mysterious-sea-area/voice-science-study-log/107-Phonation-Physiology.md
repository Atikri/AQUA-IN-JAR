---
title: "107: Phonation - Physiology (Myoelastic Theory)"
date: "2026-01-26"
weight: 107
mermaid: true
---

[← Back to Master Map](../)

# 🔬 Deep Dive 7: Physiology of Phonation
**Textbook**: *Seikel (Chapter 5)*.
**Focus**: How tissue + air = sound. (Bernoulli Effect, Attack, Registers).

---

## 1. The Myoelastic-Aerodynamic Theory
This is the "Law of Gravity" for voice.
*   **Myo (Muscle)**: Muscles bring the cords together (Adduction). They do NOT open/close 440 times a second. They just *hold* the position.
*   **Elastic**: The tissue naturally wants to snap back to shape.
*   **Aerodynamic**: The airflow sucks them shut.

### The Cycle (1 Hz):
1.  **Pressure Build**: Cords are closed. Subglottal pressure rises.
2.  **Blow Out**: Air pushes cords apart (from bottom to top).
3.  **Bernoulli Effect**: As air rushes through the narrow gap, pressure DROPS.
4.  **Suck Shut**: The drop in pressure sucks the cords back together.
5.  **Repeat**.

---

## 2. Vocal Attack (The Start)
How you *start* the sound defines the health.
1.  **Simultaneous Attack**: Air flow and Adduction start *exactly* at the same time. (Healthy). "Zzz".
2.  **Breathy Attack**: Air starts *before* Adduction. "Hhh-aaa". (Hypo-adduction).
3.  **Glottal Attack**: Adduction starts *before* Air. "Ah!". (Hyper-adduction). Hard collision.

---

## 3. Vocal Registers (The Modes)
*   **Modal Register**: Normal speech. Full mucosal wave. Phase difference (Bottom-to-Top).
*   **Glottal Fry (Pulse)**: Very low pitch (30-90Hz). Low pressure. Flaccid edges.
*   **Falsetto (Loft)**: Very high pitch. Thin, stiff edges. No vertical phase difference (only edges touch).

---

## 4. Summary Map

{{< mermaid >}}
graph TD
    subgraph Theory [Myoelastic-Aerodynamic Theory]
        Step1[1. Adduction: Muscles hold closed]
        Step2[2. Pressure: Psub builds up]
        Step3[3. Opening: Air forces apart]
        Step4[4. Bernoulli: Velocity UP = Pressure DOWN]
        Step5[5. Closing: Suction + Elasticity]
    end

    Step1 --> Step2 --> Step3 --> Step4 --> Step5 --> Step2

    subgraph Attacks [Types of Onset]
        Soft[Breathy: Air First]
        Hard[Glottal: Muscle First]
        Balanced[Simultaneous: Healthy]
    end

    style Step4 fill:#f9f,stroke:#333
{{< /mermaid >}}
