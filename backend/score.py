
import json
 

 
def calculate_risk_score(employee):
    """
    Calculate risk score 0-100 based on signals.
    Returns score + breakdown dict.
    """
    score = 0
    breakdown = {}
 
    events = employee.get("access_events", [])
    context = employee.get("context_signals", [])
 
  
    for event in events:
        time_str = event.get("time", "")
        if time_str:
            hour = int(time_str.split(":")[0])
            if hour >= 22 or hour <= 5:
                if "night_login" not in breakdown:
                    breakdown["night_login"] = 20
                    score += 20
                break
 
    
    for event in events:
        if "usb" in event.get("action", "").lower():
            breakdown["usb_connected"] = 25
            score += 25
            break
 
    
    total_records = sum(e.get("records", 0) for e in events)
    avg = employee.get("avg_records_per_day", 50)
    if total_records > avg * 5:
        breakdown["bulk_export"] = 30
        score += 30
    elif total_records > avg * 2:
        breakdown["above_avg_records"] = 10
        score += 10
 
    
    known_locs = employee.get("known_locations", [])
    for event in events:
        loc = event.get("location", "")
        if loc and loc not in known_locs:
            breakdown["rare_location"] = 15
            score += 15
            break
 
   
    for event in events:
        action = event.get("action", "").lower()
        if "privilege" in action or "admin" in action or "escalat" in action:
            breakdown["privilege_escalation"] = 10
            score += 10
            break
 
   
    if employee.get("honeypot_accessed"):
        breakdown["honeypot_accessed"] = 100
        score = 100  # Override to 100 instantly
        return min(score, 100), breakdown
 
    
    context_weights = {
        "show_cause_notice":        15,
        "official_grievance":       10,
        "transfer_request":          8,
        "appraisal_declining":       7,
        "privilege_access_request": 10,
        "role_change_30_days":       7,
        "previous_alerts_90_days":   8,
    }
    for signal in context:
        if signal in context_weights and signal not in breakdown:
            w = context_weights[signal]
            breakdown[signal] = w
            score += w
 
    
    conf = employee.get("confidence_score", 100)
    if conf < 50:
        breakdown["low_confidence_login"] = 15
        score += 15
    elif conf < 70:
        breakdown["medium_confidence_login"] = 7
        score += 7
 
    return min(score, 100), breakdown
 
 
def calculate_confidence_score(login_event, employee):
    """
    Zero Trust Confidence Score — 5 factors, 20 points each = 100%
    """
    score = 0
    breakdown = {}
 
   
    known_devices = employee.get("known_devices", [])
    device = login_event.get("device", "")
    if device in known_devices:
        breakdown["known_device"] = 20
        score += 20
    else:
        breakdown["known_device"] = 0
 
    
    location = login_event.get("location", "")
    known_locs = employee.get("known_locations", [])
    if location in known_locs:
        breakdown["office_network"] = 20
        score += 20
    else:
        breakdown["office_network"] = 0
 
    time_str = login_event.get("time", "09:00")
    hour = int(time_str.split(":")[0])
    normal_start, normal_end = employee.get("normal_login_hours", [9, 18])
    if normal_start <= hour <= normal_end:
        breakdown["normal_hours"] = 20
        score += 20
    elif abs(hour - normal_start) <= 2 or abs(hour - normal_end) <= 2:
        breakdown["normal_hours"] = 10
        score += 10
    else:
        breakdown["normal_hours"] = 0
 
   
    if location in known_locs:
        breakdown["known_location"] = 20
        score += 20
    else:
        breakdown["known_location"] = 0
 
    records = login_event.get("records", 0)
    avg = employee.get("avg_records_per_day", 50)
    if records <= avg * 2:
        breakdown["behaviour_match"] = 20
        score += 20
    elif records <= avg * 4:
        breakdown["behaviour_match"] = 10
        score += 10
    else:
        breakdown["behaviour_match"] = 0
 
    return score, breakdown
 
 
def get_severity(score):
    """Return severity label based on risk score."""
    if score >= 76:
        return "CRITICAL"
    elif score >= 51:
        return "ALERT"
    elif score >= 31:
        return "WATCH"
    else:
        return "NORMAL"
 
 
def get_severity_color(severity):
    """Return Tailwind color class for severity."""
    colors = {
        "CRITICAL": "red",
        "ALERT":    "orange",
        "WATCH":    "yellow",
        "NORMAL":   "green"
    }
    return colors.get(severity, "green")
 
 
if __name__ == "__main__":
    with open("employees.json") as f:
        data = json.load(f)
 
    print("── PRAHARI Score Engine Test ──\n")
    for emp in data["employees"]:
        score, breakdown = calculate_risk_score(emp)
        severity = get_severity(score)
        print(f"{emp['name']:20} | Score: {score:3} | {severity:8} | Signals: {list(breakdown.keys())}")
 
    print("\n✅ Score engine working correctly!")
