import json
import random
 
# ── Mock Indian bank employee data for PRAHARI ──
 
employees = [
    {
        "id": "EMP1001",
        "name": "Anil Mehta",
        "role": "Loan Officer",
        "branch": "Mumbai Main",
        "risk_score": 12,
        "severity": "NORMAL",
        "normal_login_hours": [9, 18],
        "avg_records_per_day": 45,
        "known_devices": ["laptop-mum-001"],
        "known_locations": ["Mumbai"],
        "context_signals": [],
        "access_events": [
            {"time": "09:15", "action": "Login", "device": "laptop-mum-001", "location": "Mumbai", "records": 0, "risk_delta": 0},
            {"time": "09:20", "action": "Accessed CBS", "device": "laptop-mum-001", "location": "Mumbai", "records": 12, "risk_delta": 0},
            {"time": "11:30", "action": "Loan Processing", "device": "laptop-mum-001", "location": "Mumbai", "records": 23, "risk_delta": 0},
            {"time": "14:00", "action": "Customer Verification", "device": "laptop-mum-001", "location": "Mumbai", "records": 10, "risk_delta": 0}
        ],
        "honeypot_accessed": False,
        "honeypot_file": None,
        "confidence_score": 99,
        "confidence_breakdown": {
            "known_device": 20,
            "office_network": 20,
            "normal_hours": 20,
            "known_location": 20,
            "behaviour_match": 19
        },
        "score_breakdown": {},
        "mitre_tags": [],
        "compliance_tags": [],
        "audit_logs": [
            {"time": "09:15", "action": "Login successful", "by": "EMP1001"},
            {"time": "14:45", "action": "Session ended", "by": "EMP1001"}
        ]
    },
    {
        "id": "EMP1002",
        "name": "Priya Sharma",
        "role": "Branch Manager",
        "branch": "Delhi CP",
        "risk_score": 34,
        "severity": "WATCH",
        "normal_login_hours": [9, 18],
        "avg_records_per_day": 60,
        "known_devices": ["laptop-del-002"],
        "known_locations": ["Delhi"],
        "context_signals": ["appraisal_declining"],
        "access_events": [
            {"time": "08:45", "action": "Login", "device": "laptop-del-002", "location": "Delhi", "records": 0, "risk_delta": 0},
            {"time": "09:00", "action": "Accessed CBS", "device": "laptop-del-002", "location": "Delhi", "records": 30, "risk_delta": 0},
            {"time": "20:30", "action": "Late evening login", "device": "laptop-del-002", "location": "Delhi", "records": 15, "risk_delta": 7},
            {"time": "21:00", "action": "Accessed loan portal", "device": "laptop-del-002", "location": "Delhi", "records": 20, "risk_delta": 7}
        ],
        "honeypot_accessed": False,
        "honeypot_file": None,
        "confidence_score": 78,
        "confidence_breakdown": {
            "known_device": 20,
            "office_network": 20,
            "normal_hours": 18,
            "known_location": 20,
            "behaviour_match": 0
        },
        "score_breakdown": {
            "appraisal_declining": 7,
            "late_login": 7,
            "above_avg_records": 20
        },
        "mitre_tags": [],
        "compliance_tags": ["RBI Master Direction IT 2023 — Cl 7.1"],
        "audit_logs": [
            {"time": "08:45", "action": "Login successful", "by": "EMP1002"},
            {"time": "21:15", "action": "Session ended", "by": "EMP1002"}
        ]
    },
    {
        "id": "EMP1003",
        "name": "Raj Kumar",
        "role": "IT Admin",
        "branch": "Pune Main",
        "risk_score": 94,
        "severity": "CRITICAL",
        "normal_login_hours": [9, 18],
        "avg_records_per_day": 45,
        "known_devices": ["laptop-pune-003"],
        "known_locations": ["Pune"],
        "context_signals": ["show_cause_notice", "transfer_request"],
        "access_events": [
            {"time": "02:14", "action": "Login — unknown device via VPN", "device": "UNKNOWN-DEVICE", "location": "Unknown/VPN", "records": 0, "risk_delta": 20},
            {"time": "02:17", "action": "Bulk export — 847 customer records", "device": "UNKNOWN-DEVICE", "location": "Unknown/VPN", "records": 847, "risk_delta": 30},
            {"time": "02:31", "action": "USB device connected", "device": "UNKNOWN-DEVICE", "location": "Unknown/VPN", "records": 0, "risk_delta": 25},
            {"time": "02:33", "action": "Privilege escalation attempted", "device": "UNKNOWN-DEVICE", "location": "Unknown/VPN", "records": 0, "risk_delta": 10},
            {"time": "02:47", "action": "Honeypot file accessed — BOM_CEO_Salary_2026.xlsx", "device": "UNKNOWN-DEVICE", "location": "Unknown/VPN", "records": 0, "risk_delta": 9}
        ],
        "honeypot_accessed": True,
        "honeypot_file": "BOM_CEO_Salary_2026.xlsx",
        "confidence_score": 22,
        "confidence_breakdown": {
            "known_device": 0,
            "office_network": 0,
            "normal_hours": 0,
            "known_location": 2,
            "behaviour_match": 0
        },
        "score_breakdown": {
            "night_login": 20,
            "bulk_export": 30,
            "usb_connected": 25,
            "privilege_escalation": 10,
            "honeypot_accessed": 9
        },
        "mitre_tags": ["TA0010 — Exfiltration", "TA0004 — Privilege Escalation", "TA0009 — Collection"],
        "compliance_tags": [
            "RBI CSF 2016 — Sec 4.2 Privileged Access",
            "RBI Master Direction IT 2023 — Cl 7.1",
            "CERT-In: Report within 6 hours",
            "ISO 27001 A.9.4"
        ],
        "audit_logs": [
            {"time": "02:14", "action": "Login from unknown device", "by": "EMP1003"},
            {"time": "02:47", "action": "Honeypot file accessed — CRITICAL", "by": "EMP1003"},
            {"time": "02:51", "action": "CISO viewed EMP1003 profile", "by": "CISO"},
            {"time": "09:10", "action": "CISO tried to delete alert A-007 [BLOCKED — Dual Auth Required]", "by": "CISO"}
        ]
    },
    {
        "id": "EMP1004",
        "name": "Sunita Patel",
        "role": "Teller",
        "branch": "Jaipur Tonk Road",
        "risk_score": 8,
        "severity": "NORMAL",
        "normal_login_hours": [9, 17],
        "avg_records_per_day": 30,
        "known_devices": ["desktop-jai-004"],
        "known_locations": ["Jaipur"],
        "context_signals": [],
        "access_events": [
            {"time": "09:05", "action": "Login", "device": "desktop-jai-004", "location": "Jaipur", "records": 0, "risk_delta": 0},
            {"time": "10:00", "action": "Cash transaction processing", "device": "desktop-jai-004", "location": "Jaipur", "records": 15, "risk_delta": 0},
            {"time": "15:30", "action": "End of day reconciliation", "device": "desktop-jai-004", "location": "Jaipur", "records": 10, "risk_delta": 0}
        ],
        "honeypot_accessed": False,
        "honeypot_file": None,
        "confidence_score": 100,
        "confidence_breakdown": {
            "known_device": 20,
            "office_network": 20,
            "normal_hours": 20,
            "known_location": 20,
            "behaviour_match": 20
        },
        "score_breakdown": {},
        "mitre_tags": [],
        "compliance_tags": [],
        "audit_logs": [
            {"time": "09:05", "action": "Login successful", "by": "EMP1004"},
            {"time": "17:00", "action": "Session ended", "by": "EMP1004"}
        ]
    },
    {
        "id": "EMP1005",
        "name": "Vikram Singh",
        "role": "SWIFT Operator",
        "branch": "Mumbai Main",
        "risk_score": 67,
        "severity": "ALERT",
        "normal_login_hours": [9, 18],
        "avg_records_per_day": 20,
        "known_devices": ["laptop-mum-005"],
        "known_locations": ["Mumbai"],
        "context_signals": ["official_grievance", "role_change_30_days"],
        "access_events": [
            {"time": "11:23", "action": "Login — new device", "device": "laptop-new-099", "location": "Mumbai", "records": 0, "risk_delta": 15},
            {"time": "11:30", "action": "SWIFT system accessed", "device": "laptop-new-099", "location": "Mumbai", "records": 5, "risk_delta": 0},
            {"time": "23:45", "action": "Off-hours SWIFT access", "device": "laptop-new-099", "location": "Mumbai", "records": 8, "risk_delta": 20},
            {"time": "23:50", "action": "Large transfer initiated — Rs.45L", "device": "laptop-new-099", "location": "Mumbai", "records": 1, "risk_delta": 15}
        ],
        "honeypot_accessed": False,
        "honeypot_file": None,
        "confidence_score": 45,
        "confidence_breakdown": {
            "known_device": 0,
            "office_network": 20,
            "normal_hours": 5,
            "known_location": 20,
            "behaviour_match": 0
        },
        "score_breakdown": {
            "new_device": 15,
            "night_login": 20,
            "official_grievance": 10,
            "role_change": 7,
            "large_transfer": 15
        },
        "mitre_tags": ["TA0001 — Initial Access", "TA0010 — Exfiltration"],
        "compliance_tags": [
            "RBI Master Direction IT 2023 — Cl 7.1",
            "ISO 27001 A.9.2"
        ],
        "audit_logs": [
            {"time": "11:23", "action": "Login from new device", "by": "EMP1005"},
            {"time": "23:50", "action": "Large SWIFT transfer initiated", "by": "EMP1005"}
        ]
    },
    {
        "id": "EMP1006",
        "name": "Deepa Nair",
        "role": "Database Admin",
        "branch": "Chennai Anna Salai",
        "risk_score": 19,
        "severity": "NORMAL",
        "normal_login_hours": [9, 19],
        "avg_records_per_day": 100,
        "known_devices": ["laptop-che-006"],
        "known_locations": ["Chennai"],
        "context_signals": [],
        "access_events": [
            {"time": "09:30", "action": "Login", "device": "laptop-che-006", "location": "Chennai", "records": 0, "risk_delta": 0},
            {"time": "10:00", "action": "DB maintenance", "device": "laptop-che-006", "location": "Chennai", "records": 80, "risk_delta": 0},
            {"time": "18:00", "action": "Backup verification", "device": "laptop-che-006", "location": "Chennai", "records": 50, "risk_delta": 0}
        ],
        "honeypot_accessed": False,
        "honeypot_file": None,
        "confidence_score": 96,
        "confidence_breakdown": {
            "known_device": 20,
            "office_network": 20,
            "normal_hours": 20,
            "known_location": 20,
            "behaviour_match": 16
        },
        "score_breakdown": {"slight_above_avg": 19},
        "mitre_tags": [],
        "compliance_tags": [],
        "audit_logs": [
            {"time": "09:30", "action": "Login successful", "by": "EMP1006"}
        ]
    },
    {
        "id": "EMP1007",
        "name": "Arjun Reddy",
        "role": "Loan Officer",
        "branch": "Hyderabad Banjara Hills",
        "risk_score": 58,
        "severity": "ALERT",
        "normal_login_hours": [9, 18],
        "avg_records_per_day": 40,
        "known_devices": ["laptop-hyd-007"],
        "known_locations": ["Hyderabad"],
        "context_signals": ["show_cause_notice", "privilege_access_request"],
        "access_events": [
            {"time": "22:10", "action": "Off-hours login", "device": "laptop-hyd-007", "location": "Hyderabad", "records": 0, "risk_delta": 20},
            {"time": "22:15", "action": "Accessed 234 loan records", "device": "laptop-hyd-007", "location": "Hyderabad", "records": 234, "risk_delta": 15},
            {"time": "22:30", "action": "Attempted admin portal access", "device": "laptop-hyd-007", "location": "Hyderabad", "records": 0, "risk_delta": 10}
        ],
        "honeypot_accessed": False,
        "honeypot_file": None,
        "confidence_score": 52,
        "confidence_breakdown": {
            "known_device": 20,
            "office_network": 20,
            "normal_hours": 0,
            "known_location": 12,
            "behaviour_match": 0
        },
        "score_breakdown": {
            "night_login": 20,
            "bulk_records": 15,
            "show_cause_notice": 13,
            "privilege_request": 10
        },
        "mitre_tags": ["TA0004 — Privilege Escalation"],
        "compliance_tags": ["RBI Master Direction IT 2023 — Cl 7.1", "ISO 27001 A.9.4"],
        "audit_logs": [
            {"time": "22:10", "action": "Off-hours login detected", "by": "EMP1007"}
        ]
    },
    {
        "id": "EMP1008",
        "name": "Meera Krishnan",
        "role": "Compliance Officer",
        "branch": "Bangalore MG Road",
        "risk_score": 5,
        "severity": "NORMAL",
        "normal_login_hours": [9, 18],
        "avg_records_per_day": 25,
        "known_devices": ["laptop-blr-008"],
        "known_locations": ["Bangalore"],
        "context_signals": [],
        "access_events": [
            {"time": "09:00", "action": "Login", "device": "laptop-blr-008", "location": "Bangalore", "records": 0, "risk_delta": 0},
            {"time": "10:30", "action": "Compliance report review", "device": "laptop-blr-008", "location": "Bangalore", "records": 20, "risk_delta": 0}
        ],
        "honeypot_accessed": False,
        "honeypot_file": None,
        "confidence_score": 100,
        "confidence_breakdown": {
            "known_device": 20,
            "office_network": 20,
            "normal_hours": 20,
            "known_location": 20,
            "behaviour_match": 20
        },
        "score_breakdown": {},
        "mitre_tags": [],
        "compliance_tags": [],
        "audit_logs": [
            {"time": "09:00", "action": "Login successful", "by": "EMP1008"}
        ]
    },
    {
        "id": "EMP1009",
        "name": "Rahul Gupta",
        "role": "CBS Admin",
        "branch": "Delhi Connaught Place",
        "risk_score": 43,
        "severity": "WATCH",
        "normal_login_hours": [9, 18],
        "avg_records_per_day": 55,
        "known_devices": ["laptop-del-009"],
        "known_locations": ["Delhi"],
        "context_signals": ["transfer_request"],
        "access_events": [
            {"time": "09:00", "action": "Login", "device": "laptop-del-009", "location": "Delhi", "records": 0, "risk_delta": 0},
            {"time": "12:00", "action": "CBS configuration change", "device": "laptop-del-009", "location": "Delhi", "records": 30, "risk_delta": 8},
            {"time": "19:30", "action": "After-hours access", "device": "laptop-del-009", "location": "Delhi", "records": 25, "risk_delta": 20},
            {"time": "19:45", "action": "Accessed admin settings", "device": "laptop-del-009", "location": "Delhi", "records": 0, "risk_delta": 15}
        ],
        "honeypot_accessed": False,
        "honeypot_file": None,
        "confidence_score": 68,
        "confidence_breakdown": {
            "known_device": 20,
            "office_network": 20,
            "normal_hours": 8,
            "known_location": 20,
            "behaviour_match": 0
        },
        "score_breakdown": {
            "after_hours": 20,
            "admin_access": 15,
            "transfer_request": 8
        },
        "mitre_tags": ["TA0004 — Privilege Escalation"],
        "compliance_tags": ["RBI Master Direction IT 2023 — Cl 7.1"],
        "audit_logs": [
            {"time": "09:00", "action": "Login successful", "by": "EMP1009"},
            {"time": "19:30", "action": "After-hours access flagged", "by": "EMP1009"}
        ]
    },
    {
        "id": "EMP1010",
        "name": "Kavya Menon",
        "role": "CISO",
        "branch": "HQ — Mumbai",
        "risk_score": 11,
        "severity": "NORMAL",
        "normal_login_hours": [8, 20],
        "avg_records_per_day": 15,
        "known_devices": ["laptop-hq-ciso"],
        "known_locations": ["Mumbai"],
        "context_signals": [],
        "access_events": [
            {"time": "08:30", "action": "Login", "device": "laptop-hq-ciso", "location": "Mumbai", "records": 0, "risk_delta": 0},
            {"time": "09:00", "action": "Security dashboard review", "device": "laptop-hq-ciso", "location": "Mumbai", "records": 10, "risk_delta": 0},
            {"time": "17:00", "action": "Incident report review", "device": "laptop-hq-ciso", "location": "Mumbai", "records": 5, "risk_delta": 0}
        ],
        "honeypot_accessed": False,
        "honeypot_file": None,
        "confidence_score": 98,
        "confidence_breakdown": {
            "known_device": 20,
            "office_network": 20,
            "normal_hours": 20,
            "known_location": 20,
            "behaviour_match": 18
        },
        "score_breakdown": {"minor_deviation": 11},
        "mitre_tags": [],
        "compliance_tags": [],
        "audit_logs": [
            {"time": "08:30", "action": "CISO login successful", "by": "EMP1010"},
            {"time": "09:05", "action": "CISO reviewed EMP1003 alert", "by": "EMP1010"}
        ]
    }
]
 
honeypot_files = [
    {
        "name": "BOM_CEO_Salary_2026.xlsx",
        "path": "/privileged/hr/BOM_CEO_Salary_2026.xlsx",
        "accessed": True,
        "accessed_by": "EMP1003",
        "accessed_at": "02:47",
        "mitre_tag": "TA0009 — Collection T1005"
    },
    {
        "name": "Customer_PAN_Database_Backup.csv",
        "path": "/privileged/data/Customer_PAN_Database_Backup.csv",
        "accessed": False,
        "accessed_by": None,
        "accessed_at": None,
        "mitre_tag": "TA0009 — Collection T1005"
    },
    {
        "name": "Merger_Confidential_Draft.pdf",
        "path": "/privileged/legal/Merger_Confidential_Draft.pdf",
        "accessed": False,
        "accessed_by": None,
        "accessed_at": None,
        "mitre_tag": "TA0009 — Collection T1005"
    }
]
 
risk_trajectory = {
    "EMP1003": [12, 14, 15, 18, 20, 22, 25, 28, 30, 33,
                35, 38, 40, 44, 47, 50, 54, 58, 62, 66,
                70, 74, 78, 82, 85, 88, 90, 91, 93, 94]
}
 
collusion_pairs = [
    {
        "employee_a": "EMP1003",
        "employee_b": "EMP1007",
        "reason": "Both accessed same CBS loan records within 15 minutes at night",
        "time_window": "22:10 — 02:17",
        "risk_level": "HIGH",
        "mitre_tag": "TA0008 — Lateral Movement T1078"
    }
]
 
output = {
    "employees": employees,
    "honeypot_files": honeypot_files,
    "risk_trajectory": risk_trajectory,
    "collusion_pairs": collusion_pairs
}
 
with open("employees.json", "w") as f:
    json.dump(output, f, indent=2)
 
print("✅ employees.json generated successfully!")
print(f"   Total employees: {len(employees)}")
print(f"   Critical alerts: {len([e for e in employees if e['severity'] == 'CRITICAL'])}")
print(f"   Honeypot files: {len(honeypot_files)}")
print(f"   Collusion pairs: {len(collusion_pairs)}")
 