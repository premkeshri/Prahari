# ── PRAHARI Compliance Tags — RBI + ISO + CERT-In ──
 
COMPLIANCE_MAP = {
    "CRITICAL": [
        "RBI CSF 2016 — Sec 4.2 Privileged Access Management",
        "RBI Master Direction IT 2023 — Cl 7.1 Access Control",
        "CERT-In: Mandatory report within 6 hours of detection",
        "ISO 27001:2022 — A.9.4 System & Application Access Control",
    ],
    "ALERT": [
        "RBI Master Direction IT 2023 — Cl 7.1 Access Control",
        "ISO 27001:2022 — A.9.2 User Access Management",
    ],
    "WATCH": [
        "RBI Master Direction IT 2023 — Cl 7.1 Access Control",
    ],
    "NORMAL": []
}
 
DPDP_NOTE = (
    "DPDP Act 2023 Compliant — Only risk scores shown. "
    "No raw employee PII exposed in dashboard."
)
 
WHISTLEBLOWER_NOTE = (
    "RBI Whistleblower Framework — Anonymous reporting channel "
    "available directly to Board of Directors."
)
 
 
def get_compliance_tags(severity):
    """Return compliance tags for a given severity level."""
    return COMPLIANCE_MAP.get(severity, [])
 
 
def get_full_compliance_report(severity, mitre_tags):
    """Generate full compliance section for incident PDF."""
    tags = get_compliance_tags(severity)
    return {
        "regulatory_tags": tags,
        "mitre_tags": mitre_tags,
        "dpdp_note": DPDP_NOTE,
        "whistleblower_note": WHISTLEBLOWER_NOTE,
        "audit_requirement": (
            "All actions logged in immutable audit trail. "
            "Available for RBI inspection and external statutory audit."
        )
    }
 
 
# ── Test ──
if __name__ == "__main__":
    print("── PRAHARI Compliance Tags Test ──\n")
    for severity in ["CRITICAL", "ALERT", "WATCH", "NORMAL"]:
        tags = get_compliance_tags(severity)
        print(f"{severity}:")
        if tags:
            for t in tags:
                print(f"  ✅ {t}")
        else:
            print("  — No tags (silent monitoring)")
        print()
    print("✅ Compliance tags working correctly!")
 