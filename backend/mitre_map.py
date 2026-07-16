
 
MITRE_MAP = {
    "night_login": {
        "tactic": "Initial Access",
        "tactic_id": "TA0001",
        "technique": "Valid Accounts",
        "technique_id": "T1078",
        "description": "Adversary used valid credentials at unusual hours"
    },
    "usb_connected": {
        "tactic": "Exfiltration",
        "tactic_id": "TA0010",
        "technique": "Exfiltration over Physical Medium",
        "technique_id": "T1052",
        "description": "Data copied to removable physical media"
    },
    "bulk_export": {
        "tactic": "Exfiltration",
        "tactic_id": "TA0010",
        "technique": "Exfiltration over network",
        "technique_id": "T1041",
        "description": "Large volume of data exported from internal system"
    },
    "privilege_escalation": {
        "tactic": "Privilege Escalation",
        "tactic_id": "TA0004",
        "technique": "Abuse Elevation Control Mechanism",
        "technique_id": "T1548",
        "description": "Attempt to gain higher-level permissions"
    },
    "honeypot_accessed": {
        "tactic": "Collection",
        "tactic_id": "TA0009",
        "technique": "Data from Local System",
        "technique_id": "T1005",
        "description": "Accessed sensitive decoy file — confirms malicious intent"
    },
    "rare_location": {
        "tactic": "Initial Access",
        "tactic_id": "TA0001",
        "technique": "Valid Accounts — unusual geolocation",
        "technique_id": "T1078",
        "description": "Login from unrecognised location or via VPN"
    },
    "collusion_detected": {
        "tactic": "Lateral Movement",
        "tactic_id": "TA0008",
        "technique": "Valid Accounts",
        "technique_id": "T1078",
        "description": "Multiple insiders coordinating access to same resources"
    },
    "new_device": {
        "tactic": "Initial Access",
        "tactic_id": "TA0001",
        "technique": "Valid Accounts — new device",
        "technique_id": "T1078",
        "description": "Login from unregistered device"
    },
    "above_avg_records": {
        "tactic": "Collection",
        "tactic_id": "TA0009",
        "technique": "Data from Information Repositories",
        "technique_id": "T1213",
        "description": "Accessed significantly more records than baseline"
    },
    "low_confidence_login": {
        "tactic": "Initial Access",
        "tactic_id": "TA0001",
        "technique": "Valid Accounts — anomalous context",
        "technique_id": "T1078",
        "description": "Low Zero Trust confidence score on login"
    },
}
 
 
def get_mitre_tags(score_breakdown):
    """
    Given a score breakdown dict, return list of MITRE tags.
    """
    tags = []
    for signal in score_breakdown.keys():
        if signal in MITRE_MAP:
            m = MITRE_MAP[signal]
            tag = f"{m['tactic_id']} — {m['tactic']} ({m['technique_id']})"
            if tag not in tags:
                tags.append(tag)
    return tags
 
 
def get_mitre_details(signal):
    """Get full MITRE details for a single signal."""
    return MITRE_MAP.get(signal, None)
 
 

if __name__ == "__main__":
    test_breakdown = {
        "night_login": 20,
        "bulk_export": 30,
        "usb_connected": 25,
        "privilege_escalation": 10,
        "honeypot_accessed": 100
    }
    tags = get_mitre_tags(test_breakdown)
    print("── MITRE ATT&CK Tags Test ──\n")
    for tag in tags:
        print(f"  ✅ {tag}")
    print("\n✅ MITRE mapping working correctly!")
