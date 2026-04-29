# Sentinel AI – Intelligent Crisis Response Platform 🛡️✨

**Sentinel AI** is a cloud-deployed, real-time emergency orchestration platform designed to eliminate communication gaps during large-scale hospitality crises. By integrating **AI-powered decision-making (Gemini AI)** with live location tracking and smart safety mapping, it transforms chaotic emergency situations into structured, coordinated, and data-driven responses.

---

## 🚀 The Problem
In modern hospitality settings, traditional alarms are passive—they notify individuals that a crisis exists but fail to provide dynamic guidance. This leads to:
* **Static Guidance:** Reliance on physical maps that may lead guests into hazard zones.
* **Information Silos:** Lack of real-time synchronization between guests, staff, and emergency responders.
* **Reactive Approach:** Delayed responses that only begin after damage has occurred.

## 💡 The Solution
Sentinel AI bridges the gap by creating a unified intelligence loop:
* **For Guests:** Interactive PWA providing real-time rerouted safety maps based on live hazard detection.
* **For Staff:** A "Rescue Priority List" and automated task assignment to ensure efficient triage.
* **For Admins:** A centralized Command Center for building-wide orchestration and tactical monitoring.

## 🛠️ Technical Architecture
Sentinel AI uses a modern full-stack implementation built on Google Cloud infrastructure:

### **Frontend**
* **React + Vite:** Blazing-fast performance and PWA capabilities.
* **TypeScript:** For a scalable and type-safe codebase.
* **Framer Motion:** Smooth UI transitions for high-stress scenarios.
* **Tailwind CSS:** Modern, responsive Bento-grid design aesthetics.

### **Backend & Intelligence**
* **Gemini 2.5 Flash (Google AI Studio):** Multimodal AI analyzing live telemetry to generate rerouting recommendations.
* **Cloud Firestore:** Real-time NoSQL database for sub-second stakeholder synchronization.
* **Firebase Auth & Storage:** Secure role-based access control and hazard media vault.
* **Node.js & Express:** Robust API orchestration.

---

## 🏗️ System Flow
1. **Detection:** Staff or IoT sensors report a hazard via the Sentinel PWA.
2. **Intelligence:** Gemini AI analyzes floor plans and hazard proximity to calculate safe routes.
3. **Orchestration:** Sync updates deliver rerouted maps to Guests and tactical markers to Admins in <200ms.

## 🌍 UN Sustainable Development Goals
Sentinel AI is directly aligned with:
* **Goal 11: Sustainable Cities and Communities** – Making urban spaces safer and reducing disaster-related impact.
* **Goal 3: Good Health and Well-being** – Prioritizing life-saving rescue for vulnerable individuals.

---

## 🛠️ Installation & Setup
1. **Clone the repo:**
   ```bash
   git clone [https://github.com/shreyasingh/sentinel-ai.git](https://github.com/shreyasingh/sentinel-ai.git)
