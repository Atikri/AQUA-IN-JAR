---
title: "103: Respiration - The Skeletal Framework"
date: "2026-01-25"
weight: 103
mermaid: true
---

[← Back to Master Map](../)

# 🔬 Deep Dive 3: Respiration (The Skeleton)
**Textbook**: *Seikel (Chapter 2)*.
**Focus**: The bony framework that protects the lungs.

> **SLP Note**: Why study bones? Because posture affects breathing. "Text Neck" (Forward Head Posture) compresses the cervical spine and limits rib excursion. Understanding the **Axial Skeleton** is the first step to respiratory therapy.

---

## 1. The Vertebral Column (The Pillar)
The spine consists of 33 vertebrae (segments) stacked to form a flexible tube.
*(Mnemonic: **C**ereal at 7, **T**urkey at 12, **L**asagna at 5).*

### A. The Divisions
| Region | Number | Name | Function |
| :--- | :--- | :--- | :--- |
| **Cervical** | **C1-C7** | Neck | Supports the skull. High mobility. |
| **Thoracic** | **T1-T12** | Chest | **Anchor for Ribs**. Less mobile. |
| **Lumbar** | **L1-L5** | Lower Back | Weight bearing. Massive corpus. |
| **Sacral** | S1-S5 | Hips | Fused (Sacrum). Connects to Pelvis. |
| **Coccygeal** | 3-4 | Tailbone | Fused (Coccyx). |

### B. Special Vertebrae
*   **C1 (Atlas)**: Holds the globe of the skull. (Allows "Nodding" Yes).
*   **C2 (Axis)**: Has a "Dens" (pivot point). (Allows "Shaking" No).
*   **Why it matters**: Tension in C1/C2 acts directly on the larynx via the hyoid muscles.

---

## 2. The Two Girdles (The Anchors)
The spine needs cross-beams to attach limbs.
1.  **Pelvic Girdle (Bottom)**:
    *   *Ilium, Ischium, Pubis*.
    *   Role: Core stability. The abdominal muscles attach here.
2.  **Pectoral Girdle (Top)**:
    *   *Clavicle* (Collarbone) + *Scapula* (Shoulder Blade).
    *   Role: Upper chest expansion.
    *   *Voice Issue*: "Clavicular Breathing" (lifting the shoulders) is inefficient because it fights the gravity of the girdle.

---

## 3. The Rib Cage (The Barrel)
12 pairs of ribs form a protective cage.
*   **True Ribs (1-7)**: Attach *directly* to the Sternum via cartilage.
*   **False Ribs (8-10)**: Attach to the cartilage of the rib above (not sternum).
*   **Floating Ribs (11-12)**: Do not attach to the front at all.

### Key Mechanism: Torque
The ribs are naturally twisted. When you inhale, you untwist them (torque). When you relax, they snap back. This provides **Passive Recoil** (Free energy for exhalation).

---

## 4. Summary Map

{{< mermaid >}}
graph TD
    subgraph Skeleton [Axial Skeleton]
        Spine[Vertebral Column]
        Ribs[Rib Cage]
        Sternum[Sternum: Breastbone]
    end

    subgraph Regions [Spinal Regions]
        Spine --> C[Cervical: C1-C7 Neck]
        Spine --> T[Thoracic: T1-T12 Rib Support]
        Spine --> L[Lumbar: L1-L5 Weight Bearing]
    end

    subgraph RibTypes [Rib Classification]
        Ribs --> True[True: 1-7 Direct Attach]
        Ribs --> False[False: 8-10 Indirect Attach]
        Ribs --> Float[Floating: 11-12 No Front Attach]
    end

    C --> Atlas[C1: Atlas]
    C --> Axis[C2: Axis]

    style C fill:#f9f,stroke:#333
    style T fill:#ff9,stroke:#333
{{< /mermaid >}}
