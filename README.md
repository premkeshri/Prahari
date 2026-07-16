PRAHARI
## Predictive Risk and Access Hazard Intelligence

> *"PRAHARI detected this in minutes. PNB took 7 years."*

Open link to See Image Of WEbsite 
https://drive.google.com/drive/folders/15eOKH85ZwcZpnhiuJOKoyBEitkO42UxQ?usp=sharing

---

##  What is PRAHARI?

PRAHARI is an AI-powered **Insider Threat Detection Platform** built for Indian banking. It detects privileged access misuse by monitoring employee *behaviour* — not just credentials — and alerts SOC teams before fraud occurs.

| Metric | Value |
|--------|-------|
|  Target | Bank of Maharashtra — 2,500+ branches |
|  Employees Monitored | 50,000+ (prototype: 10 mock employees) |
|  Fraud Exposure | Rs.36,014 Cr (RBI FY25 data) |
| Detection Time | Minutes (PNB took 7 years) |
|  False Positive Rate | Zero (Honeypot layer) |
|  Compliance | RBI CSF 2016 · ISO 27001 · CERT-In · DPDP 2023 |

---

##  The Problem

Banks today ask: **"Is the password correct?"**

They never ask: **"Is this employee behaving normally?"**

A loan officer who normally accesses 15 records suddenly downloads 847 at 2AM — current PAM systems say *"access granted."* PRAHARI flags it in seconds.

```
Rs.11,400 Cr  →  PNB SWIFT fraud — ran 7 years undetected
Rs.6,500 Cr   →  PMC Bank — MD + Board collusion
Rs.590 Cr     →  IDFC First — branch employee fraud
23,953 cases  →  Total bank fraud FY25
```

---

##  Key Features

###  Honeypot Deception Layer
Decoy files planted in privileged directories (`BOM_CEO_Salary_2026.xlsx`, `Customer_PAN_Database_Backup.csv`). Any access = **instant CRITICAL alert**. Zero false positives — guaranteed.

###  UEBA Behaviour Baseline
30-day behavioural baseline per employee. Tracks login hours, record access volume, known devices, known locations. Deviations trigger risk scoring.

###  Risk Score Engine
```
Night login (10PM–5AM)     → +20 points
USB device connected        → +25 points  
Bulk export (500+ records)  → +30 points
Rare/new location           → +15 points
Privilege escalation        → +10 points
Honeypot accessed           → = 100 (CRITICAL instantly)
```

###  LLM Investigation Agent
Vendor-independent AI analyst. Reads all signals and generates a structured 3-section report:
- **What happened** (exact timestamps + numbers)
- **Why it's suspicious** (vs 30-day baseline)
- **6 recommended actions** (freeze, rotate, preserve, report)

Switch between Claude → OpenAI → Gemini → on-premise Llama in 1 line.

###  Collusion Detection
Identifies 2+ employees coordinating on the same restricted resource. Maps to MITRE ATT&CK TA0008 Lateral Movement. Catches the PNB-style multi-employee fraud pattern.

###  SOC-Gated Freeze
No automatic employee suspension. 6-step checklist → SOC approve → CISO action → MD dual authorization. Human always in the loop.

###  5-Layer CISO Protection
*What if the CISO himself is corrupt?*
1. CISO has own UEBA risk profile in PRAHARI
2. CISO alerts bypass to MD + Board directly
3. Immutable audit log — CISO cannot delete entries
4. Dual authorization required for all critical actions
5. Auto RBI reports — CISO cannot block submission
         ▼
     Employee → CISO → MD → Board → RBI → CBI



## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React.js + Recharts | Real-time dashboard, component-based |
| Backend | Python Flask | 16 REST endpoints, lightweight |
| AI/ML | scikit-learn Isolation Forest | Unsupervised anomaly detection |
| LLM | Claude API (vendor-independent) | Structured investigation reports |
| PDF | jsPDF | Client-side incident report generation |
| Mock Data | Faker.js patterns | Realistic Indian bank employee data |
| Compliance | Built-in tagging | RBI CSF 2016, ISO 27001, CERT-In, DPDP |



##  Project Structure

```
Prahari/
├── backend/
│   ├── app.py              # Flask API — 16 endpoints
│   ├── score.py            # Risk score + confidence engine
│   ├── mitre_map.py        # MITRE ATT&CK tag mapping
│   ├── compliance_tags.py  # RBI/ISO/CERT-In tag mapping
│   ├── generate_data.py    # Mock employee data generator
│   ├── employees.json      # Generated employee data
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React app — all components
│   │   └── App.css         # Styles
│   ├── public/
│   └── package.json
│
└── README.md
```

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | All employees with risk scores |
| GET | `/api/employees/<id>` | Single employee detail |
| POST | `/api/investigate` | LLM investigation report |
| GET | `/api/honeypots` | Honeypot file status |
| GET | `/api/collusion` | Collusion pair detection |
| GET | `/api/audit` | Immutable audit log |
| POST | `/api/freeze/<id>` | SOC freeze access |
| GET | `/api/trajectory/<id>` | 30-day risk trajectory |
| POST | `/api/dual-auth/request` | CISO → MD dual authorization |
| POST | `/api/whistleblower` | Anonymous Board report |
| GET | `/api/ciso-security` | 5-layer CISO protection data |
| GET | `/api/branches` | Branch-level risk rollup |
| GET | `/api/rbi-report` | Auto-generated RBI compliance report |
| GET | `/api/health` | System health check |

---

##  Demo Walkthrough

1. **Login as CISO** (`ciso123`)
2. **Dashboard** → See 10 employees ranked by risk score
3. **Click "SIMULATE ATTACK"** → Raj Kumar turns CRITICAL (100/100)
4. **See** →  TRAP HIT badge + MITRE TA0009 tag
5. **Click Raj Kumar** → See 30-day trajectory (12 → 45 → 100)
6. **Click "Investigate"** → LLM generates 3-section report
7. **Click "Freeze"** → 6-checkbox SOC protocol
8. **Switch to Collusion tab** → See Raj Kumar ↔ Arjun Reddy red connection
9. **Switch to Audit Log** → Click any entry for full details
10. **Logout → Login as MD** (`md123`) → See RBI Reports tab

---

##  Risk Score Formula

```python
def calculate_risk_score(employee):
    score = 0
    
    if employee['honeypot_accessed']:
        return 100, {'honeypot_accessed': 100}  # Instant CRITICAL
    
    if is_night_login(employee):      score += 20
    if usb_connected(employee):       score += 25
    if bulk_export(employee):         score += 30
    if rare_location(employee):       score += 15
    if privilege_escalation(employee):score += 10
    
    return min(score, 100), breakdown
```

---

##  Compliance Coverage

| Framework | Coverage |
|-----------|----------|
| RBI CSF 2016 | Section 4.2 — Privileged Access Management |
| RBI Master Direction IT 2023 | Clause 7.1 — Access Control |
| CERT-In | 6-hour mandatory incident reporting |
| ISO 27001:2022 | Annex A.9.4 — System Access Control |
| DPDP Act 2023 | Employee monitoring with consent framework |

---

##  Future Roadmap

- **Phase 2**: XGBoost ML model + Apache Kafka real-time streaming
- **Phase 3**: Graph Neural Network for collusion + on-premise Llama
- **Phase 4**: Cross-bank threat intelligence + Mobile SOC app

---

##  Team

**Tech Matriarchs** — FinSpark '26

| Member | Role |
|--------|------|
| Sejal Sharma | Team Lead |
| Prem Keshri | Tech Lead + Frontend |
| Riyanshi Jain | Frontend Dev |
| Rydam Sharma | Documentation |

---



<div align="center">


