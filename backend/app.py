import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from score import calculate_risk_score, get_severity, calculate_confidence_score
from mitre_map import get_mitre_tags
from compliance_tags import get_compliance_tags, get_full_compliance_report
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ── Load data ──
with open("employees.json") as f:
    DATA = json.load(f)

EMPLOYEES  = DATA["employees"]
HONEYPOTS  = DATA["honeypot_files"]
TRAJECTORY = DATA["risk_trajectory"]
COLLUSION  = DATA["collusion_pairs"]

# ── In-memory stores ──
AUDIT_LOG = [
    {"time": "02:14", "action": "EMP1003 login from unknown device via VPN", "severity": "WARNING", "by": "SYSTEM"},
    {"time": "02:17", "action": "EMP1003 bulk export — 847 customer records", "severity": "CRITICAL", "by": "SYSTEM"},
    {"time": "02:31", "action": "USB device connected — EMP1003 session", "severity": "CRITICAL", "by": "SYSTEM"},
    {"time": "02:47", "action": "HONEYPOT accessed — BOM_CEO_Salary_2026.xlsx by EMP1003", "severity": "CRITICAL", "by": "SYSTEM"},
    {"time": "02:51", "action": "CISO (EMP1010) viewed EMP1003 profile", "severity": "INFO", "by": "EMP1010"},
    {"time": "02:53", "action": "CISO attempted to suppress Alert A-007 [BLOCKED — Dual Authorization Required]", "severity": "WARNING", "by": "SYSTEM"},
    {"time": "09:10", "action": "SOC Officer reviewed EMP1003 incident report", "severity": "INFO", "by": "SOC"},
    {"time": "09:15", "action": "Dual authorization requested — CISO + MD approval needed", "severity": "INFO", "by": "SYSTEM"},
    {"time": "09:20", "action": "Weekly RBI encrypted report auto-submitted — no CISO approval required", "severity": "INFO", "by": "SYSTEM"},
]

FROZEN_EMPLOYEES = set()
PENDING_DUAL_AUTH = {}
WHISTLEBLOWER_ALERTS = []
SOC_PENDING = {}

def now():
    return datetime.now().strftime("%H:%M")

# ═══════════════════════════
# ENDPOINT 1 — GET all employees
# ═══════════════════════════
@app.route("/api/employees", methods=["GET"])
def get_employees():
    result = []
    for emp in EMPLOYEES:
        score, breakdown = calculate_risk_score(emp)
        severity = get_severity(score)
        mitre    = get_mitre_tags(breakdown)
        comp     = get_compliance_tags(severity)
        frozen   = emp["id"] in FROZEN_EMPLOYEES
        result.append({
            **emp,
            "risk_score":      score,
            "severity":        severity,
            "score_breakdown": breakdown,
            "mitre_tags":      mitre,
            "compliance_tags": comp,
            "is_frozen":       frozen,
            "status":          "SUSPENDED" if frozen else "ACTIVE",
        })
    return jsonify(result)

# ═══════════════════════════
# ENDPOINT 2 — GET single employee
# ═══════════════════════════
@app.route("/api/employees/<emp_id>", methods=["GET"])
def get_employee(emp_id):
    emp = next((e for e in EMPLOYEES if e["id"] == emp_id), None)
    if not emp:
        return jsonify({"error": "Not found"}), 404
    score, breakdown = calculate_risk_score(emp)
    severity = get_severity(score)
    mitre    = get_mitre_tags(breakdown)
    comp     = get_compliance_tags(severity)
    trajectory = TRAJECTORY.get(emp_id, [score] * 30)
    return jsonify({
        **emp,
        "risk_score":      score,
        "severity":        severity,
        "score_breakdown": breakdown,
        "mitre_tags":      mitre,
        "compliance_tags": comp,
        "trajectory":      trajectory,
        "is_frozen":       emp_id in FROZEN_EMPLOYEES,
        "status":          "SUSPENDED" if emp_id in FROZEN_EMPLOYEES else "ACTIVE",
    })

# ═══════════════════════════
# ENDPOINT 3 — POST investigate (LLM Agent)
# ═══════════════════════════
@app.route("/api/investigate", methods=["POST"])
def investigate():
    emp = request.json
    if not emp:
        return jsonify({"error": "No data"}), 400

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")

    if api_key and api_key != "your_key_here":
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=api_key)
            prompt = f"""You are a senior bank security analyst at Bank of Maharashtra.
Analyse this insider threat case and write a concise structured investigation report.

EMPLOYEE: {emp.get('name')} | Role: {emp.get('role')} | Branch: {emp.get('branch')}
RISK SCORE: {emp.get('risk_score')}/100 | Severity: {emp.get('severity')}
ACCESS EVENTS: {json.dumps(emp.get('access_events', []))}
EMPLOYEE CONTEXT SIGNALS: {emp.get('context_signals', [])}
HONEYPOT TOUCHED: {emp.get('honeypot_accessed', False)}
HONEYPOT FILE: {emp.get('honeypot_file', 'None')}
CONFIDENCE SCORE: {emp.get('confidence_score', 100)}%
MITRE TAGS: {emp.get('mitre_tags', [])}

Write exactly 3 sections:

SECTION 1 — WHAT HAPPENED:
(2-3 sentences with exact timestamps and numbers)

SECTION 2 — WHY THIS IS SUSPICIOUS:
(2-3 sentences comparing to 30-day baseline)

SECTION 3 — RECOMMENDED ACTIONS:
1. Freeze session immediately
2. Rotate all passwords for this employee
3. Disable VPN and remote access
4. Notify CISO and HR Manager
5. Preserve USB and system logs as forensic evidence
6. File RBI Fraud Report — CSF 2016 Section 4.2 within 6 hours

Keep total under 200 words. Plain English."""

            msg = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=400,
                messages=[{"role": "user", "content": prompt}]
            )
            report = msg.content[0].text
        except Exception as e:
            report = _mock_report(emp)
    else:
        report = _mock_report(emp)

    AUDIT_LOG.append({
        "time": now(), "severity": "INFO",
        "action": f"LLM Investigation report generated for {emp.get('name')}",
        "by": "AI-ENGINE"
    })
    return jsonify({"report": report})

def _mock_report(emp):
    name    = emp.get("name", "Unknown")
    score   = emp.get("risk_score", 0)
    events  = emp.get("access_events", [])
    context = emp.get("context_signals", [])
    hp      = emp.get("honeypot_accessed", False)
    hpf     = emp.get("honeypot_file", "")
    ev_sum  = " ".join([f"At {e.get('time','')}, {e.get('action','')}." for e in events[:3]])
    ctx_sum = f"Employee context flags: {', '.join(context)}." if context else ""
    hp_line = f"Critically, honeypot trap file '{hpf}' was accessed — confirming malicious intent with zero false positive margin." if hp else ""
    return f"""SECTION 1 — WHAT HAPPENED:
{ev_sum} {hp_line}
Risk score escalated to {score}/100 triggering a {emp.get('severity','CRITICAL')} alert.

SECTION 2 — WHY THIS IS SUSPICIOUS:
{name} deviated significantly from their 30-day behavioural baseline. {ctx_sum} The combination of off-hours access, unusual data volume, and employee context creates a high-confidence insider threat pattern consistent with MITRE ATT&CK TA0010 Exfiltration.

SECTION 3 — RECOMMENDED ACTIONS:
1. Freeze {name}'s system access immediately pending SOC review
2. Rotate all passwords and revoke active sessions for {emp.get('id','')}
3. Disable VPN and remote access privileges
4. Notify CISO and HR Manager within 1 hour
5. Preserve all USB and system logs as forensic evidence
6. File RBI Fraud Report — CSF 2016 Section 4.2 within 6 hours"""

# ═══════════════════════════
# ENDPOINT 4 — GET honeypots
# ═══════════════════════════
@app.route("/api/honeypots", methods=["GET"])
def get_honeypots():
    return jsonify(HONEYPOTS)

# ═══════════════════════════
# ENDPOINT 5 — GET collusion
# ═══════════════════════════
@app.route("/api/collusion", methods=["GET"])
def get_collusion():
    return jsonify(COLLUSION)

# ═══════════════════════════
# ENDPOINT 6 — GET audit log
# ═══════════════════════════
@app.route("/api/audit", methods=["GET"])
def get_audit():
    return jsonify(list(reversed(AUDIT_LOG)))

# ═══════════════════════════
# ENDPOINT 7 — POST freeze (SOC-gated)
# ═══════════════════════════
@app.route("/api/freeze/<emp_id>", methods=["POST"])
def freeze_access(emp_id):
    emp = next((e for e in EMPLOYEES if e["id"] == emp_id), None)
    if not emp:
        return jsonify({"error": "Not found"}), 404

    FROZEN_EMPLOYEES.add(emp_id)
    AUDIT_LOG.append({
        "time": now(), "severity": "CRITICAL",
        "action": f"Access FROZEN for {emp['name']} ({emp_id}) — SOC approved",
        "by": "SOC"
    })

    return jsonify({
        "success": True,
        "message": f"{emp['name']}'s access has been frozen.",
        "status": "SUSPENDED",
        "checklist": [
            "✅ Session terminated immediately",
            "⬜ Rotate all passwords for this employee",
            "⬜ Disable VPN and remote access",
            "⬜ Notify CISO and HR Manager",
            "⬜ Preserve USB and system logs as evidence",
            "⬜ File RBI Fraud Report — CSF 2016 Section 4.2"
        ]
    })

# ═══════════════════════════
# ENDPOINT 8 — GET trajectory
# ═══════════════════════════
@app.route("/api/trajectory/<emp_id>", methods=["GET"])
def get_trajectory(emp_id):
    import random
    trajectory = TRAJECTORY.get(emp_id)
    if not trajectory:
        emp = next((e for e in EMPLOYEES if e["id"] == emp_id), None)
        base = emp.get("risk_score", 10) if emp else 10
        trajectory = [max(0, min(100, base + random.randint(-4, 4))) for _ in range(30)]
    return jsonify({"trajectory": trajectory})

# ═══════════════════════════
# ENDPOINT 9 — POST dual auth request
# ═══════════════════════════
@app.route("/api/dual-auth/request", methods=["POST"])
def dual_auth_request():
    data   = request.json
    action = data.get("action", "")
    emp_id = data.get("emp_id", "")
    req_id = f"DA-{len(PENDING_DUAL_AUTH)+1:04d}"
    PENDING_DUAL_AUTH[req_id] = {
        "action": action,
        "emp_id": emp_id,
        "status": "PENDING_MD_APPROVAL",
        "requested_by": "CISO",
        "requested_at": now(),
    }
    AUDIT_LOG.append({
        "time": now(), "severity": "WARNING",
        "action": f"Dual authorization requested for '{action}' on {emp_id} — awaiting MD approval",
        "by": "CISO"
    })
    return jsonify({
        "request_id": req_id,
        "status": "PENDING_MD_APPROVAL",
        "message": "Dual authorization required. Request sent to MD. Waiting for second approval.",
        "required_approvers": ["CISO", "MD/CEO"],
        "received_approvals": ["CISO"]
    })

# ═══════════════════════════
# ENDPOINT 10 — POST whistleblower
# ═══════════════════════════
@app.route("/api/whistleblower", methods=["POST"])
def whistleblower():
    data = request.json
    alert_id = f"WB-{len(WHISTLEBLOWER_ALERTS)+1:04d}"
    WHISTLEBLOWER_ALERTS.append({
        "id": alert_id,
        "message": data.get("message", "Anonymous report"),
        "target": data.get("target", ""),
        "submitted_at": now(),
        "status": "FORWARDED_TO_BOARD",
        "encrypted": True,
        "anonymous": True,
    })
    AUDIT_LOG.append({
        "time": now(), "severity": "WARNING",
        "action": f"Anonymous whistleblower alert {alert_id} submitted — forwarded directly to Board of Directors (CISO bypassed)",
        "by": "ANONYMOUS"
    })
    return jsonify({
        "success": True,
        "alert_id": alert_id,
        "message": "Your report has been encrypted and forwarded directly to the Board of Directors. CISO has not been notified.",
        "status": "FORWARDED_TO_BOARD"
    })

# ═══════════════════════════
# ENDPOINT 11 — GET CISO security status
# ═══════════════════════════
@app.route("/api/ciso-security", methods=["GET"])
def ciso_security():
    ciso = next((e for e in EMPLOYEES if e.get("role") == "CISO"), None)
    ciso_score, ciso_breakdown = calculate_risk_score(ciso) if ciso else (0, {})
    return jsonify({
        "ciso_profile": {
            "name": ciso.get("name") if ciso else "Kavya Menon",
            "risk_score": ciso_score,
            "severity": get_severity(ciso_score),
            "monitored": True,
            "alerts_bypass_ciso": True,
            "alert_destination": "MD + Board of Directors",
        },
        "protection_layers": [
            {
                "id": 1,
                "title": "CISO Monitored by UEBA",
                "description": "CISO has their own risk profile and baseline. Alerts bypass CISO and go directly to MD and Board.",
                "status": "ACTIVE"
            },
            {
                "id": 2,
                "title": "Immutable Audit Log",
                "description": "Every action by every user — including CISO — is logged in write-once storage. No delete access for anyone.",
                "status": "ACTIVE"
            },
            {
                "id": 3,
                "title": "Dual Authorization (4-Eyes Principle)",
                "description": "Any critical action requires CISO + MD approval. One person cannot suppress alerts alone.",
                "status": "ACTIVE"
            },
            {
                "id": 4,
                "title": "Automated RBI Report",
                "description": "Weekly encrypted reports go directly to RBI portal — no CISO approval required. Suppressions also reported.",
                "status": "ACTIVE"
            },
            {
                "id": 5,
                "title": "Anonymous Whistleblower Channel",
                "description": "Any employee can report directly to Board of Directors — encrypted, anonymous, CISO bypassed.",
                "status": "ACTIVE"
            }
        ],
        "pending_dual_auth": list(PENDING_DUAL_AUTH.values()),
        "whistleblower_count": len(WHISTLEBLOWER_ALERTS),
        "rbi_reports_sent": 4,
        "last_rbi_report": "2026-07-06 09:00 IST",
    })

# ═══════════════════════════
# ENDPOINT 12 — GET branches rollup
# ═══════════════════════════
@app.route("/api/branches", methods=["GET"])
def get_branches():
    branches = {}
    for emp in EMPLOYEES:
        branch = emp.get("branch", "Unknown")
        score, _ = calculate_risk_score(emp)
        severity  = get_severity(score)
        if branch not in branches:
            branches[branch] = {"branch": branch, "employees": 0, "critical": 0, "alert": 0, "watch": 0, "normal": 0, "max_risk": 0, "top_threat": None}
        branches[branch]["employees"] += 1
        branches[branch][severity.lower()] += 1
        if score > branches[branch]["max_risk"]:
            branches[branch]["max_risk"] = score
            branches[branch]["top_threat"] = emp.get("name")
    return jsonify(list(branches.values()))

# ═══════════════════════════
# ENDPOINT 13 — GET incident report data (for PDF)
# ═══════════════════════════
@app.route("/api/incident-report/<emp_id>", methods=["GET"])
def incident_report(emp_id):
    emp = next((e for e in EMPLOYEES if e["id"] == emp_id), None)
    if not emp:
        return jsonify({"error": "Not found"}), 404
    score, breakdown = calculate_risk_score(emp)
    severity  = get_severity(score)
    mitre     = get_mitre_tags(breakdown)
    comp      = get_compliance_tags(severity)
    trajectory = TRAJECTORY.get(emp_id, [score] * 30)
    return jsonify({
        "employee": {**emp, "risk_score": score, "severity": severity},
        "score_breakdown": breakdown,
        "mitre_tags": mitre,
        "compliance_tags": comp,
        "trajectory": trajectory,
        "audit_entries": [log for log in AUDIT_LOG if emp.get("name","") in log.get("action","") or emp_id in log.get("action","")],
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
        "report_ref": f"PRAHARI-INC-{emp_id}-{datetime.now().strftime('%Y%m%d')}",
    })

# ═══════════════════════════
# ENDPOINT 14 — Health check
# ═══════════════════════════
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "running",
        "system": "PRAHARI v2.0",
        "employees_loaded": len(EMPLOYEES),
        "honeypots_active": len(HONEYPOTS),
        "endpoints": 14,
        "frozen_count": len(FROZEN_EMPLOYEES),
    })

if __name__ == "__main__":
    print("🔒 PRAHARI v2.0 Backend Starting...")
    print(f"   Employees: {len(EMPLOYEES)}")
    print(f"   Honeypots: {len(HONEYPOTS)}")
    print(f"   Endpoints: 14")
    print(f"   URL: http://localhost:5000")
    print()
    app.run(debug=True, port=5000)