---
title: "106: Phonation - The Intrinsic Muscles"
date: "2026-01-26"
weight: 106
mermaid: true
---

[← Back to Master Map](../)

# 🔬 Deep Dive 6: The Larynx (Muscles)
**Textbook**: *Seikel (Chapter 4)*.
**Focus**: The fine-motor control of the Adductors, Abductor, and Tensors.

> **SLP Note**: Paralysis of these muscles leads to specific voice disorders. e.g., PCA paralysis is life-threatening (cannot breathe).

---

## 1. The Adductors ( The Closers)
We need 3 muscles to close the glottis tight (for Speak, Cough, Bear Down).

1.  **Lateral Cricoarytenoid (LCA)**:
    *   *Action*: Rotates the vocal process **Medially** (inward).
    *   *Result*: Closes the mid-glottis. "Whisper Mode."
2.  **Transverse Interarytenoid (TIA)**:
    *   *Action*: Slides the arytenoids together.
    *   *Result*: Closes the back gap (Glottal Chink).
3.  **Oblique Interarytenoid (OIA)**:
    *   *Action*: Criss-crosses (X shape). Pulls the apexes together.
    *   *Result*: Helps close the Laryngeal Inlet (swallowing safety).

## 2. The Abductor (The Opener)
Only **ONE** muscle opens the vocal folds. If this fails, you suffocate.
*   **Posterior Cricoarytenoid (PCA)**:
    *   *Origin*: Back plate of Cricoid.
    *   *Insertion*: Muscular process of Arytenoid.
    *   *Action*: Pulls the muscular process BACK.
    *   *Result*: Tips the vocal process OUT (Open).

---

## 3. The Tensors (The Pitch Changers)
1.  **Cricothyroid (CT)**: **The High Note Muscle**.
    *   *Pars Recta*: Rocks Thyroid down.
    *   *Pars Oblique*: Slides Thyroid forward.
    *   *Result*: Stretches the cords -> Pitch Up.
2.  **Thyroarytenoid (TA)**: **The Body of the Vocal Fold**.
    *   **Thyrovocalis (Medial TA)**: The vibrating edge. Tenses to incresae stiffness (Chest Voice logic).
    *   **Thyromuscularis (Lateral TA)**: The shield. Relaxes the cover.

---

## 4. Summary Map

{{< mermaid >}}
graph TD
    subgraph Adductors [Adductors: CLOSE]
        LCA[LCA: Lateral Cricoarytenoid]
        IA[Interarytenoids: Transverse & Oblique]
    end

    subgraph Abductors [Abductors: OPEN]
        PCA[PCA: Posterior Cricoarytenoid]
    end

    subgraph Tensors [Tensors: PITCH/BODY]
        CT[CT: Cricothyroid - Pitch UP]
        TA[TA: Thyroarytenoid - Chest/Thick]
    end

    subgraph TA_Detail [TA Divisions]
        Vocalis[Thyrovocalis: Active Tensor]
        Muscularis[Thyromuscularis: Relaxer]
    end

    TA --> Vocalis
    TA --> Muscularis

    style PCA fill:#f99,stroke:#333,stroke-width:4px
    style CT fill:#ff9,stroke:#333
{{< /mermaid >}}
