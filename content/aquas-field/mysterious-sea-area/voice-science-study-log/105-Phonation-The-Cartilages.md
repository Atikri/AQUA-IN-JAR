---
title: "105: Phonation - The Cartilaginous Framework"
date: "2026-01-26"
weight: 105
mermaid: true
---

[← Back to Master Map](../)

# 🔬 Deep Dive 5: The Larynx (Framework)
**Textbook**: *Seikel (Chapter 4)*.
**Focus**: The Hyoid Bone and the 9 Cartilages.

> **SLP Note**: You must visualize the Larynx as a "suspension bridge." It hangs from the Hyoid bone. If the Hyoid is tense (tongue tension), the Larynx cannot tilt freely.

---

## 1. The Hyoid Bone (The Anchor)
*   **Unique Feature**: The only bone in the body that does **not** articulate with another bone. It floats in muscle.
*   **Shape**: "U" shaped (Greek "Hyoid").
*   **Significance**: It is the interface between the **Tongue** (above) and the **Larynx** (below).

---

## 2. The Laryngeal Cartilages (3 Paired, 3 Unpaired)
Total = 9 Cartilages.

### A. The Unpaired Cartilages (The Big Shields)
1.  **Cricoid Cartilage**:
    *   *Shape*: A Signet Ring (low in front, high in back).
    *   *Role**: The base foundation. Sits on top of the Trachea.
2.  **Thyroid Cartilage**:
    *   *Shape*: A Shield. Two plates (laminae) fused at the front.
    *   *Feature*: **Adam's Apple** (Thyroid Notch).
    *   *Role**: Protects the vocal folds. Rocking it forward creates HIGH PITCH.
3.  **Epiglottis**:
    *   *Shape*: A Leaf.
    *   *Role**: **Survival**. It folds down during swallowing to cover the airway. *Acoustically*, it contributes to the "Twang" funnel.

### B. The Paired Cartilages (The Movers)
1.  **Arytenoid Cartilages** (Crucial!):
    *   *Shape*: Pyramids.
    *   *Location*: Sitting on the high back wall of the Cricoid.
    *   *Role**: The vocal folds attach to them. When they move, the vocal folds open/close.
    *   *Landmarks*: **Vocal Process** (Front tip), **Muscular Process** (Side tip).
2.  **Corniculate Cartilages**: Tiny cones on top of the Arytenoids. (Extensions).
3.  **Cuneiform Cartilages**: Rods buried inside the Aryepiglottic Folds. Provide structure/stiffness to the collar.

---

## 3. The Two Key Joints
1.  **Cricothyroid Joint**:
    *   Allows the Thyroid to **ROCK** forward.
    *   *Result*: Stretches the cords -> **Pitch goes UP**.
2.  **Cricoarytenoid Joint**:
    *   Allows the Arytenoids to **GLIDE, ROCK, and ROTATE**.
    *   *Result*: Adduction (Closing) and Abduction (Opening).

---

## 4. Summary Map

{{< mermaid >}}
graph TD
    subgraph Framework [The Laryngeal Skeleton]
        Hyoid[Hyoid Bone: The Anchor]
        Larynx[Larynx]
    end
    
    Hyoid --> Larynx

    subgraph Unpaired [Unpaired Cartilages]
        Cricoid[Cricoid: Foundation Ring]
        Thyroid[Thyroid: The Shield]
        Epi[Epiglottis: The Lid]
    end

    subgraph Paired [Paired Cartilages]
        Ary[Arytenoids: The Movers]
        Corn[Corniculates: Apex]
        Cun[Cuneiforms: Fold Support]
    end

    Larynx --> Cricoid
    Larynx --> Thyroid
    Larynx --> Ary

    Ary --> Corn
    
    subgraph Joints [Functional Joints]
        CTJoint[Cricothyroid Joint: PITCH]
        CAJoint[Cricoarytenoid Joint: OPEN/CLOSE]
    end
    
    Thyroid --- CTJoint --- Cricoid
    Ary --- CAJoint --- Cricoid

    style Ary fill:#f9f,stroke:#333
    style Thyroid fill:#ff9,stroke:#333
    style Cricoid fill:#ff9,stroke:#333
{{< /mermaid >}}
