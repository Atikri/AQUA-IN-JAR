---
title: "104: Respiration - Physiology (Volumes & Pressures)"
date: "2026-01-26"
weight: 104
mermaid: true
---

[← Back to Master Map](../)

# 🔬 Deep Dive 4: Respiration (Physiology)
**Textbook**: *Seikel (Chapter 3)*.
**Focus**: How we measure air (Spirometry) and the forces driving it.

> **SLP Note**: You will use these concepts to diagnose respiratory weakness (e.g., in Parkinson's or COPD). The key metric for singers/speakers is **Vital Capacity**.

---

## 1. Forces of Respiration
How does air get in? It's not "sucking." It's **Boyle's Law**.
*   **Volume Up = Pressure Down**.
*   When the Diaphragm drops, the lungs expand -> Pressure drops -> Air rushes in to equalize.

### The 4 Drive Pressures
1.  **Alveolar Pressure ($P_{al}$)**: Pressure inside the lungs.
2.  **Subglottal Pressure ($P_s$)**: Pressure below the vocal folds. (**The Power of Voice**).
3.  **Intrapleural Pressure ($P_{pl}$)**: Pressure between the lung lining (pleura). Always negative (suction) to hold lungs to ribs.
4.  **Atmospheric Pressure ($P_{atm}$)**: The air outside (Reference point: 0).

---

## 2. Lung Volumes (The Tank Size)
Using a Spirometer, we measure specific chunks of air.

*   **Tidal Volume (TV)**: The air used in a normal, quiet breath (watching TV). ~500cc.
*   **Inspiratory Reserve Volume (IRV)**: The extra air you can inhale *after* a normal breath. (The "Big Breath").
*   **Expiratory Reserve Volume (ERV)**: The extra air you can squeeze out *after* a normal exhale.
*   **Residual Volume (RV)**: The air remaining in lungs *after* maximum exhalation. **You cannot empty this.** (It prevents lung collapse).

---

## 3. Lung Capacities (The Combinations)
Capacities are sums of volumes.

### A. Vital Capacity (VC) - THE GOLD STANDARD
*   **Formula**: $VC = IRV + TV + ERV$.
*   **Definition**: The total amount of air available for life and speech. From Max Inhale to Max Exhale.
*   **Average**: ~4000-5000cc (varies by height/age).

### B. Functional Residual Capacity (FRC)
*   **Formula**: $FRC = ERV + RV$.
*   **Definition**: The amount of air in the body at the end of a passive exhale (Resting Expiratory Level). This is the "Reset point."

---

## 4. The Check-Valve Effect
When we speak, we don't just let the air flow out. We check it.
*   **Checking Action**: Using the muscles of *Inhalation* (External Intercostals) during *Exhalation* to hold back the recoil force.
*   **Why**: To maintain steady, constant subglottal pressure ($P_s$) for a long phrase instead of a loud burst.

---

## 5. Summary Map

{{< mermaid >}}
graph TD
    subgraph Volumes [Lung Volumes]
        TV[Tidal Volume: Resting Breath]
        IRV[Inspiratory Reserve: Max Deep Breath]
        ERV[Expiratory Reserve: Squeeze Out]
        RV[Residual Volume: Cannot Empty]
    end

    subgraph Capacities [Functional Combinations]
        VC[Vital Capacity: The Tank]
        FRC[Functional Residual Capacity: Rest]
        TLC[Total Lung Capacity: Everything]
    end

    style VC fill:#f9f,stroke:#333

    TV --> VC
    IRV --> VC
    ERV --> VC

    ERV --> FRC
    RV --> FRC
{{< /mermaid >}}
