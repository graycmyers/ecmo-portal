import { useState, useRef, useEffect } from "react";

const C = {
  purple:"#5c2d91",purpleMid:"#8661c5",purpleLight:"#f4f0fb",purpleBorder:"#d9c9f0",
  blue:"#0078d4",blueLight:"#eff6fc",blueBorder:"#c7e0f4",
  teal:"#038387",tealLight:"#f0fafa",tealBorder:"#b3e0e1",
  green:"#107c10",greenLight:"#f1faf1",greenBorder:"#9fd89f",
  orange:"#ca5010",orangeLight:"#fff9f5",orangeBorder:"#f4d1bb",
  red:"#a4262c",redLight:"#fdf3f4",
  nav:"#1b1b1f",
  text:"#1b1b1f",textMid:"#3d3d3d",textLight:"#616161",textMuted:"#8a8886",
  border:"#edebe9",borderMid:"#d2d0ce",
  bg:"#faf9f8",bgMid:"#f3f2f1",white:"#ffffff",
};

const STATUS_CFG={
  preparing:{label:"Preparing Plan",color:C.textMuted,bg:"#f3f2f1"},
  submitted:{label:"Under Review",color:C.blue,bg:C.blueLight},
  changes_requested:{label:"Changes Requested",color:C.orange,bg:C.orangeLight},
  partially_approved:{label:"Partially Approved",color:C.purpleMid,bg:C.purpleLight},
  approved:{label:"Approved — Not Started",color:C.green,bg:C.greenLight},
  active_on_track:{label:"Active — On Track",color:C.teal,bg:C.tealLight},
  active_at_risk:{label:"Active — At Risk",color:C.orange,bg:C.orangeLight},
  active_behind:{label:"Active — Behind Schedule",color:C.red,bg:C.redLight},
  completed:{label:"Completed",color:C.green,bg:C.greenLight},
};
const TYPE_CFG={
  standard:{label:"Standard",bg:C.greenLight,color:C.green},
  normal:{label:"Normal",bg:C.blueLight,color:C.blue},
  expedited:{label:"Expedited",bg:C.orangeLight,color:C.orange},
  emergency:{label:"Emergency",bg:C.redLight,color:C.red},
};
const PRI_CFG={
  critical:{label:"Critical",bg:C.redLight,color:C.red},
  high:{label:"High",bg:C.orangeLight,color:C.orange},
  medium:{label:"Medium",bg:C.blueLight,color:C.blue},
  low:{label:"Low",bg:C.greenLight,color:C.green},
};
const ADKAR_META={
  awareness:{letter:"A",color:C.blue,bg:C.blueLight,label:"Awareness",desc:"Build understanding of why this change is needed."},
  desire:{letter:"D",color:C.green,bg:C.greenLight,label:"Desire",desc:"Foster willingness to support and participate."},
  knowledge:{letter:"K",color:C.purple,bg:C.purpleLight,label:"Knowledge",desc:"Training and information on how to change."},
  ability:{letter:"A2",color:C.orange,bg:C.orangeLight,label:"Ability",desc:"Practical capability to implement day-to-day."},
  reinforcement:{letter:"R",color:C.teal,bg:C.tealLight,label:"Reinforcement",desc:"Sustain the change through measurement and recognition."},
  implementation:{letter:"⚙",color:C.textMuted,bg:C.bgMid,label:"Implementation Overview",desc:"Milestones, resources, and project plan."},
  approvals:{letter:"✓",color:C.purpleMid,bg:C.purpleLight,label:"Approvals",desc:"Leadership sign-offs required before project begins."},
};
const SECTION_ORDER=["awareness","desire","knowledge","ability","reinforcement","implementation","approvals"];
const ORGS=[
  {id:"all_bu",name:"All Business Units",color:C.nav,ids:["CHG-100421","CHG-100467","CHG-100503","CHG-100541"]},
  {id:"finance",name:"Finance & Accounting",color:C.green,ids:["CHG-100438","CHG-100491","CHG-100517","CHG-100528"]},
  {id:"ops",name:"Operations",color:C.teal,ids:["CHG-100438","CHG-100452","CHG-100479","CHG-100491","CHG-100517","CHG-100528"]},
  {id:"tech",name:"Technology / Azure Engineering",color:C.blue,ids:["CHG-100452","CHG-100491","CHG-100517"]},
  {id:"sales",name:"Sales",color:C.orange,ids:["CHG-100491","CHG-100517","CHG-100528"]},
  {id:"hr",name:"Human Resources",color:C.purpleMid,ids:["CHG-100479"]},
  {id:"security",name:"Security & Compliance",color:C.red,ids:["CHG-100421","CHG-100467"]},
  {id:"legal",name:"Legal & Compliance",color:"#6d4c41",ids:["CHG-100438","CHG-100491"]},
  {id:"rd",name:"Research & Development",color:"#7b1fa2",ids:["CHG-100517"]},
];

// ─── PROJECT DATA ───────────────────────────────────────────────────────────
const INITIAL_PROJECTS=[
  {
    id:"CHG-100421",status:"changes_requested",title:"Enterprise-Wide MFA Enforcement via Microsoft Entra ID",
    changeType:"normal",priority:"high",riskLevel:"medium",
    owner:"Sarah Chen",department:"Security & Compliance",sponsor:"James O'Brien",
    startDate:"2025-03-15",endDate:"2025-06-30",estimatedCost:"$100K–$500K",
    financialBenefits:"Estimated $2.4M annually in avoided breach costs and compliance penalties. Projected 75% reduction in account-compromise helpdesk incidents (~$180K/yr saved). Prevents potential GDPR and SOC 2 fine exposure exceeding $5M.",
    affectedOrgs:["All Business Units","Security & Compliance"],
    projectProgress:{pct:0,note:"2 approver questions pending response."},
    agreedSections:{awareness:true,desire:true,knowledge:true,ability:true,reinforcement:true,implementation:true},
    adkarContent:{
      awareness:[
        {heading:"Why this change is happening",body:"Account compromise is the leading vector for enterprise data breaches. Contoso's current authentication system relies solely on passwords, which are insufficient for our threat landscape. Regulatory frameworks including GDPR, NIST 800-53, and our upcoming SOC 2 Type II audit all require multi-factor authentication for privileged and standard access. This is not a discretionary security improvement — it is a compliance requirement with a hard deadline tied to the Q3 audit window."},
        {heading:"Key messages by audience",body:"All employees: 'Your account will require a second verification step after March 15. This takes 30 seconds and protects your work and personal data from being compromised.'\n\nManagers: 'This change is mandatory. Your team will need to enroll by [date]. The helpdesk will be staffed 2× during the first two weeks.'\n\nIT Admins: 'Entra ID conditional access policies will be staged by department. See the admin runbook for exception handling and break-glass procedures.'"},
        {heading:"Communication plan",body:"Week −4: Executive sponsor email to all-staff from James O'Brien (CISO)\nWeek −3: Department manager briefing (30-minute live session + recording)\nWeek −2: Individual enrollment invitation emails with self-service portal link\nWeek −1: Helpdesk Tech Bar pop-ups in main campus buildings\nGo-live week: Daily status email to managers; helpdesk surge staffing active"},
      ],
      desire:[
        {heading:"What's in it for employees (WIIFM)",body:"Individual benefit: MFA protects your personal and professional data. A compromised corporate account frequently exposes personal information, payment data, and saved credentials in ways that affect employees personally — not just the company.\n\nPractical benefit: The Microsoft Authenticator app enables passwordless sign-in within 90 days of MFA rollout, meaning most employees will type their password less frequently, not more."},
        {heading:"Sponsor engagement plan",body:"James O'Brien (CISO) to record a 3-minute personal video explaining why this matters — distributed via Viva Engage and the intranet.\n\nDepartment VPs to reinforce enrollment deadline in their weekly communications.\n\nManager activation: Each manager receives a 'MFA Champion' guide and is asked to check in with their team on enrollment status weekly during Phase 1."},
        {heading:"Resistance management",body:"Expected resistance points:\n1. 'I don't have a smartphone.' → Hardware FIDO2 keys available from IT on request at no cost.\n2. 'My role doesn't need this.' → No exemptions. Policy applies to all accounts including contractors.\n3. 'This slows me down.' → Remind that Authenticator app push notifications take ~5 seconds; passwordless eliminates the password step entirely post-90 days."},
      ],
      knowledge:[
        {heading:"Training curriculum",body:"All employees: 15-minute self-paced module 'Getting Started with MFA' (available in LMS before enrollment opens). Covers: what MFA is, how to download and configure Microsoft Authenticator, what to do if you lose your phone.\n\nIT Administrators: 2-hour instructor-led session covering Entra ID Conditional Access policy configuration, named location policies, compliance reporting, and break-glass account procedures.\n\nHelpdesk staff: 4-hour training covering enrollment troubleshooting, exception request process, hardware key provisioning, and SSPR (Self-Service Password Reset) integration."},
        {heading:"Reference materials",body:"Quick-start card (physical + digital): 4 steps to enroll in MFA\nAdmin runbook: Conditional Access policy management, staged rollout controls, monitoring dashboard\nManager guide: How to check team enrollment status in the Entra admin portal\nFAQ document: Top 15 questions from pilot group\nEscalation matrix: Tier 1 → Tier 2 → Identity Engineering team"},
      ],
      ability:[
        {heading:"Support model during rollout",body:"Phase 1 (Weeks 1–2): Helpdesk staffed at 2× normal capacity. Walk-in Tech Bars in Buildings 1, 4, and 7 daily 8AM–6PM. Same-day enrollment support via Teams channel #mfa-help.\n\nPhase 2 (Weeks 3–6): Return to normal helpdesk coverage with dedicated MFA queue. Average ticket target: resolved within 2 business hours.\n\nPost-rollout: SSPR handles most password and auth issues without helpdesk contact."},
        {heading:"Practice environment",body:"Entra ID staging tenant available for IT Admin practice from March 1. Conditional Access policies will be tested in report-only mode for 2 weeks prior to enforcement, allowing teams to identify impacted users before hard enforcement begins."},
      ],
      reinforcement:[
        {heading:"Adoption metrics",body:"30-day checkpoint: % of employees enrolled by department (target: 100% of Priority 1 departments, 80% overall)\n90-day checkpoint: % passwordless-enabled; helpdesk ticket volume vs. baseline\n180-day checkpoint: Account compromise incident rate vs. prior 12-month average; time-to-authenticate benchmark"},
        {heading:"Recognition and sustainability",body:"Departments reaching 100% enrollment by target date will be recognized in the monthly company newsletter.\n\nMFA enrollment and Authenticator setup will be added to the new-hire onboarding checklist permanently.\n\nConditional Access policy will be maintained and reviewed quarterly by the Identity Engineering team. Break-glass accounts audited monthly."},
      ],
      implementation:[
        {heading:"Phased rollout plan",body:"Phase 1 (March 15–31): IT, Security, Finance, Legal — highest-risk departments first. Conditional Access in report-only for 1 week, then enforce.\nPhase 2 (April 1–30): Engineering, Sales, Marketing, HR\nPhase 3 (May 1–31): Remaining departments + all contractor accounts\nPhase 4 (June 1–30): Exceptions cleanup, passwordless enablement, hardware key distribution complete"},
        {heading:"Resources and dependencies",body:"Identity Engineering team: policy configuration and monitoring (3 FTEs)\nHelpdesk: surge staffing during Phase 1 (6 additional temp agents)\nExternal dependency: Microsoft Entra P2 licenses for all users — procurement initiated Feb 1\nHardware FIDO2 keys: 500 units ordered; delivery expected March 10\nBudget: $180K confirmed from IT Security budget. $320K contingency for expanded licensing."},
      ],
    },
    approvals:[
      {id:"it_dir",role:"IT Director",name:"Derek Hastings",dept:"IT",tier:1,status:"changes_requested",approvedAt:null,questions:[{id:"q1",text:"Confirm surge staffing budget for helpdesk Phase 2 has been secured.",askedAt:"2025-03-10",response:"",resolved:false}]},
      {id:"ciso",role:"CISO",name:"James O'Brien",dept:"Security",tier:1,status:"pending",approvedAt:null,questions:[]},
      {id:"vp_finance",role:"VP Finance",name:"Robert Chen",dept:"Finance",tier:2,status:"changes_requested",approvedAt:null,questions:[{id:"q2",text:"Provide line-item cost breakdown for the $100K–$500K estimate.",askedAt:"2025-03-10",response:"",resolved:false}]},
      {id:"vp_comp",role:"VP Compliance",name:"Sandra Lee",dept:"Legal",tier:2,status:"pending",approvedAt:null,questions:[]},
    ],
  },
  {
    id:"CHG-100438",status:"active_on_track",title:"SAP S/4HANA Upgrade — Finance & Supply Chain",
    changeType:"normal",priority:"high",riskLevel:"high",
    owner:"Marcus Williams",department:"Finance & Operations",sponsor:"Sandra Lee",
    startDate:"2025-04-01",endDate:"2025-09-30",estimatedCost:"$1M–$5M",
    financialBenefits:"Projected $3.8M in annual operational savings through process automation and reduced manual reconciliation (estimated 14,000 hours/year). Avoids $1.2M in annual extended SAP ECC support fees. Real-time financial analytics expected to reduce month-end close from 8 days to 3 days.",
    affectedOrgs:["Finance & Accounting","Operations","Legal & Compliance"],
    projectProgress:{pct:28,note:"Phase 1 blueprint complete. ABAP remediation 68% done. On track."},
    agreedSections:{awareness:true,desire:true,knowledge:true,ability:true,reinforcement:true,implementation:true},
    adkarContent:{
      awareness:[
        {heading:"Why this change is happening",body:"Contoso's SAP ECC 6.0 system reaches end of mainstream maintenance in 2027, with extended support costing $1.2M annually after that date. Beyond cost, ECC lacks real-time financial reporting, modern procurement automation, and the integrated analytics capabilities that the business has been requesting for three years. This upgrade to S/4HANA 2023 modernizes the Finance and Supply Chain platforms simultaneously, eliminating the need for a separate BI layer and enabling the real-time cash flow and inventory visibility our CFO has identified as a top-3 business priority."},
        {heading:"Stakeholder impact summary",body:"Finance team (180 users): Month-end close process changes significantly — automated journal entries, new Fiori apps replace SAP GUI transactions. Training is mandatory before go-live.\n\nSupply Chain / Procurement (95 users): New Ariba-integrated procurement workflows. PO and goods receipt processes change.\n\nIT / BASIS team: New infrastructure, HANA database administration skills required.\n\nExternal auditors: Updated data model and reporting structure — pre-briefing scheduled for June."},
        {heading:"Communications timeline",body:"March: Executive steering committee kickoff. Program overview published on intranet.\nApril: Department town halls by Finance and Supply Chain leads.\nMay–June: Key user identification and nomination process.\nJuly: Training schedule communicated to all affected users.\nAugust: Go-live countdown communications begin."},
      ],
      desire:[
        {heading:"Business benefits by audience",body:"Finance team: Month-end close reduced from 8 days to target of 3 days. Elimination of 14,000+ hours/year of manual reconciliation. Real-time cash position visibility replaces end-of-day batch reports.\n\nProcurement team: Automated PO approvals, integrated vendor catalog, real-time inventory on hand. Eliminates need to maintain parallel spreadsheets.\n\nSenior leadership: Live financial dashboard replaces static monthly reports. Drill-down capability from P&L to individual transaction level."},
        {heading:"Sponsor and champion program",body:"Sandra Lee (CFO/Sponsor) to present 'Why S/4HANA Now' at the April all-Finance meeting.\n\nKey User Network: 18 key users identified across Finance and Supply Chain. Each receives extra training and acts as first-line support for their team post-go-live. Key users are involved in UAT from July onward and have input into Fiori app configuration."},
      ],
      knowledge:[
        {heading:"Training plan",body:"End user training: Role-based Fiori app training delivered August 4–22, three weeks before go-live. 4 hours per role group. Delivered in classroom with sandbox system access.\n\nKey users: 16 hours of extended training covering configuration, reporting, and troubleshooting. Completed by July 31.\n\nIT/BASIS: 40-hour SAP HANA administration course (external vendor, April–May).\n\nABAPers / developers: Custom code remediation training (March–April); completed before build phase."},
        {heading:"Reference materials",body:"Fiori app quick-reference cards per role (printed + digital)\nProcess change summary: 'What's different in S/4HANA' by function\nAdmin runbook: HANA DB backup, monitoring, transport management\nChange impact log: Full list of transaction codes retired and their S/4 equivalents\nSandbox access: Available to all users from July 15 for self-directed practice"},
      ],
      ability:[
        {heading:"Hypercare support model",body:"Go-live hypercare period: September 1–30. On-site support team of 8 (4 functional consultants + 4 BASIS/tech) available 7AM–8PM local time.\n\nKey user network active from day 1 — each department has a named key user reachable via Teams.\n\nPriority helpdesk queue for S/4HANA issues. Target SLA: P1 issues resolved within 2 hours, P2 within 8 hours during hypercare."},
        {heading:"Practice and validation",body:"Sandbox environment available July 15 with real-looking anonymized data. Mandatory practice sessions for high-impact roles (AP, AR, GL, Procurement).\n\nEnd-to-end process rehearsal ('dress rehearsal' cutover simulation) scheduled August 25–26."},
      ],
      reinforcement:[
        {heading:"Adoption metrics",body:"Month-end close duration: Baseline 8 days → Target 3 days by December 2025\nManual journal entry volume: Target 60% reduction by Q1 2026\nKey user satisfaction score: Target >4.0/5.0 at 30-day post-go-live survey\nHelpdesk ticket volume: Return to pre-go-live baseline within 60 days"},
        {heading:"Sustainability plan",body:"Key user network maintained as permanent CoE (Center of Excellence) for SAP.\nQuarterly SAP steering committee reviews adoption KPIs.\nAnnual SAP enhancement roadmap process established — user community has formal input channel.\nNew-hire SAP onboarding path updated to S/4HANA by November 2025."},
      ],
      implementation:[
        {heading:"Program phases",body:"Phase 1 – Blueprint (April): Fit-gap analysis, process design sign-off, custom code inventory. ✓ Complete.\nPhase 2 – Build (May–June): Configuration, ABAP remediation (68% complete), interface development.\nPhase 3 – System Integration Testing (July): All interfaces and custom code tested end-to-end.\nPhase 4 – UAT (August 1–22): Key users validate all 47 in-scope processes.\nPhase 5 – Cutover (August 29 – September 1): Data migration, final validation, go-live.\nPhase 6 – Stabilize (September): Hypercare, issues resolution, KPI baseline."},
        {heading:"Resources and budget",body:"Accenture implementation partner: 6 functional consultants + 2 technical leads (contracted through September 30)\nInternal team: 4 IT/BASIS staff dedicated to project through September\nHardware: HANA appliance procured; delivered and installed April 15\nTotal budget: $3.2M (implementation) + $800K (licenses and infrastructure) = $4M committed\nChange management: ECMO Change Lead (Carmen Díaz) embedded in program team"},
      ],
    },
    approvals:[
      {id:"it_dir",role:"IT Director",name:"Nina Vasquez",dept:"IT",tier:1,status:"approved",approvedAt:"2025-03-18",questions:[]},
      {id:"cfo",role:"CFO",name:"Sandra Lee",dept:"Finance",tier:1,status:"approved",approvedAt:"2025-03-18",questions:[]},
      {id:"vp_fin",role:"VP Finance",name:"Robert Chen",dept:"Finance",tier:2,status:"approved",approvedAt:"2025-03-21",questions:[]},
      {id:"legal",role:"Legal",name:"Legal & Tax",dept:"Legal",tier:2,status:"approved",approvedAt:"2025-03-22",questions:[]},
    ],
  },
  {
    id:"CHG-100452",status:"active_on_track",title:"West Coast Data Center Network Core Refresh",
    changeType:"standard",priority:"medium",riskLevel:"medium",
    owner:"Priya Patel",department:"Corporate IT",sponsor:"Derek Hastings",
    startDate:"2025-02-22",endDate:"2025-05-17",estimatedCost:"$500K–$1M",
    financialBenefits:"Eliminates $240K/year in end-of-life hardware maintenance contracts. New Cisco Catalyst 9000 series reduces power consumption ~30%, saving ~$85K/year in energy costs. Increased redundancy expected to reduce unplanned downtime incidents by 70%, avoiding an estimated $1.1M/year in downtime-related losses.",
    affectedOrgs:["Technology / Azure Engineering","Operations"],
    projectProgress:{pct:60,note:"Pod A complete. Pod B in progress. On track."},
    agreedSections:{awareness:true,desire:true,knowledge:true,ability:true,reinforcement:true,implementation:true},
    adkarContent:{
      awareness:[
        {heading:"Why this change is happening",body:"The West Coast data center's core network switches are Cisco Catalyst 6500 series hardware, now 11 years old and end-of-life since December 2024. Cisco no longer provides security patches, hardware replacements, or TAC support for these units. A single point-of-failure failure in the current topology could take down all compute and storage services for the West Coast region for an estimated 4–8 hours. This refresh replaces the core and distribution layers with Cisco Catalyst 9500 and 9300 hardware, introduces redundant 40GbE uplinks, and implements a new leaf-spine topology that eliminates all single points of failure."},
        {heading:"Who is affected and how",body:"Data center operations team: Maintenance windows required for each pod cutover. Each pod requires a 4-hour scheduled outage window, communicated 2 weeks in advance.\n\nApplications teams: Brief planned outages during pod migrations. Teams should plan to defer deployments during migration windows.\n\nEnd users: No direct impact expected. All maintenance windows are scheduled outside business hours. Any unexpected issues trigger the data center incident response procedure."},
      ],
      desire:[
        {heading:"Stakeholder motivation",body:"Operations team: New hardware supports modern network automation (Ansible-based), reducing manual CLI work significantly. The team has been requesting this upgrade for 18 months.\n\nApplications and platform teams: 40GbE east-west bandwidth (vs. current 10GbE) removes the network as a bottleneck for data-intensive workloads. Redundant topology eliminates 'are we going down again?' anxiety during maintenance.\n\nFinance: Eliminates $240K/year in Cisco SMARTnet renewal costs for EOL hardware. Energy savings of ~$85K/year."},
      ],
      knowledge:[
        {heading:"Training and runbook updates",body:"Network Engineering team: 2-day Cisco Catalyst 9000 administration training (completed February 10). Covers: Cisco DNA Center onboarding, IOS-XE configuration differences from IOS, EVPN/VXLAN basics for future fabric readiness.\n\nRunbook updates: Network operations runbook updated to reflect new topology diagrams, failover procedures, and SNMP/monitoring configuration. Published in Confluence before Pod A cutover."},
      ],
      ability:[
        {heading:"Support and rollback readiness",body:"Each pod migration follows a 4-step procedure documented in the cutover runbook: (1) Pre-cutover config backup, (2) Migration window execution (scripted), (3) 30-minute validation checklist, (4) Rollback trigger criteria.\n\nRollback for each pod is achievable within 20 minutes by reverting to pre-staged config on legacy hardware, which remains physically in place until all pods are validated."},
      ],
      reinforcement:[
        {heading:"Success metrics",body:"Network uptime: Target 99.99% over 12 months post-refresh (vs. 99.7% on legacy hardware)\nUnplanned incident count: Target zero hardware-related outages in first 90 days\nMaintenance overhead: Track hours/month spent on network maintenance tasks; target 40% reduction\nEnergy use: Monthly power draw measurement; target 30% reduction vs. February 2025 baseline"},
      ],
      implementation:[
        {heading:"Pod cutover schedule",body:"Pod A (Completed Feb 28): Racks A1–A12. Core switches replaced. 40GbE uplinks active.\nPod B (In progress, target March 20): Racks B1–B10. Distribution layer refresh.\nPod C (Target April 10): Racks C1–C8. Final distribution layer segment.\nCore spine upgrade (Target April 25): New spine layer installation and cutover.\nValidation and closure (May 1–17): Full topology test, documentation update, project close."},
        {heading:"Budget and resources",body:"Hardware: $620K (Cisco Catalyst 9500 × 4, 9300 × 16, cabling)\nLabor: Internal network engineering team (3 FTEs) + CDW professional services for installation support\nBudget status: $620K of $800K spent through Pod B. On budget."},
      ],
    },
    approvals:[
      {id:"it_dir",role:"IT Director",name:"Derek Hastings",dept:"IT",tier:1,status:"approved",approvedAt:"2025-02-10",questions:[]},
      {id:"vp_infra",role:"VP Infrastructure",name:"Kevin Park",dept:"Infrastructure",tier:1,status:"approved",approvedAt:"2025-02-11",questions:[]},
    ],
  },
  {
    id:"CHG-100467",status:"completed",title:"Emergency Patch — Critical CVE-2025-0183 Perimeter Firewall",
    changeType:"emergency",priority:"critical",riskLevel:"critical",
    owner:"James O'Brien",department:"Security & Compliance",sponsor:"Derek Hastings",
    startDate:"2025-01-28",endDate:"2025-01-28",estimatedCost:"< $5K",
    financialBenefits:"Avoided estimated $15M–$50M in potential breach costs (industry average for firewall exploit leading to data exfiltration). Maintained cyber insurance policy compliance — lapse would have triggered a $2.1M premium increase. Preserved SOC 2 Type II compliance standing.",
    affectedOrgs:["All Business Units","Security & Compliance"],
    projectProgress:{pct:100,note:"All 6 sites patched in 17h 42m. Post-implementation review closed Feb 4."},
    agreedSections:{awareness:true,desire:true,knowledge:true,ability:true,reinforcement:true,implementation:true},
    adkarContent:{
      awareness:[
        {heading:"Incident summary and why immediate action was required",body:"CVE-2025-0183 is a critical unauthenticated remote code execution vulnerability in Palo Alto Networks PAN-OS affecting all versions prior to 10.2.8. CVSS score: 9.8 (Critical). Active exploitation was confirmed in the wild on January 27 at 11:47 PM PT. Contoso's perimeter firewall fleet across 6 sites runs PAN-OS 10.2.6. CISA issued Emergency Directive ED-2025-02 requiring patching within 48 hours for all federal and critical infrastructure operators. Contoso's insurance policy and SOC 2 controls require equivalent response time.\n\nThis was an emergency change. Normal ADKAR planning was compressed into a post-implementation review completed February 4."},
        {heading:"Communications during the incident",body:"January 28, 12:30 AM: CISO notified. Emergency response team activated.\nJanuary 28, 1:15 AM: Emergency CAB authorization obtained verbally from CTO and CISO.\nJanuary 28, 2:00 AM: All site network engineers notified and on call.\nJanuary 28, 8:00 AM: Steering committee briefed on status.\nJanuary 29, 8:12 PM: Patch confirmed on all 6 perimeter devices. All-clear issued."},
      ],
      desire:[
        {heading:"Motivation context",body:"In an emergency change, Desire is binary: the organization must act to protect itself. The threat was unambiguous — an actively exploited critical RCE on production perimeter devices.\n\nThe network and security engineering teams performed exceptionally, executing a complex multi-site patch operation in under 18 hours with zero service interruption. This will be recognized formally in the Q1 security all-hands."},
      ],
      knowledge:[
        {heading:"Skills and procedures applied",body:"All network engineers performing the patch had previously been trained on PAN-OS upgrade procedures (annual certification, last completed November 2024).\n\nPre-positioned HA (high-availability) failover procedures allowed each firewall to be patched without service interruption. This procedure was documented and tested during the October 2024 DR exercise — validation that proactive readiness activities paid off."},
      ],
      ability:[
        {heading:"Execution summary",body:"Site 1 (Redmond HQ): Patched January 28, 3:42 AM. Zero downtime — HA failover used.\nSite 2 (San Jose): Patched January 28, 6:15 AM.\nSite 3 (Seattle): Patched January 28, 9:30 AM.\nSites 4–6 (Chicago, New York, London): Patched January 28–29. London required a maintenance window due to legacy HA configuration — 12-minute outage from 2:00–2:12 AM local time, pre-communicated to London IT lead."},
      ],
      reinforcement:[
        {heading:"Post-incident review findings",body:"Post-implementation review completed February 4. Key findings:\n\n1. HA configuration at the London site was not current with the approved standard — corrective action assigned, due March 1.\n2. Patch notification-to-response time of 2h 43m exceeded the 4-hour SLA target — this is a positive result.\n3. Emergency CAB authorization process worked correctly but verbal-only documentation creates audit risk — updated process to require a follow-up written record within 2 hours of verbal authorization.\n\nAll findings closed or tracked in the security risk register."},
      ],
      implementation:[
        {heading:"Emergency change completion record",body:"Authorization: Verbal emergency CAB authorization obtained from CTO (Derek Hastings) and CISO (James O'Brien), January 28 at 1:15 AM PT. Written record filed January 28 at 9:00 AM.\nPatch version applied: PAN-OS 10.2.8-h3\nDevices patched: 6 perimeter firewalls (Palo Alto PA-5250 × 4, PA-3260 × 2)\nTotal duration: 17 hours 42 minutes from authorization to final confirmation\nRollback plan: Pre-staged rollback configurations saved; not required.\nPost-implementation review: Completed February 4. Closed."},
      ],
    },
    approvals:[
      {id:"it_dir",role:"IT Director",name:"Derek Hastings",dept:"IT",tier:1,status:"approved",approvedAt:"2025-01-28",questions:[]},
      {id:"vp_infra",role:"VP Infrastructure",name:"Kevin Park",dept:"Infrastructure",tier:1,status:"approved",approvedAt:"2025-01-28",questions:[]},
    ],
  },
  {
    id:"CHG-100479",status:"approved",title:"Automated Employee Onboarding Workflow — Power Automate",
    changeType:"standard",priority:"low",riskLevel:"low",
    owner:"Aisha Johnson",department:"Human Resources",sponsor:"Diane Foster",
    startDate:"2025-03-03",endDate:"2025-04-25",estimatedCost:"$25K–$100K",
    financialBenefits:"Estimated $340K/year in productivity savings by reducing IT provisioning time per new hire from 4.5 days to same-day. Eliminates ~2,200 hours/year of manual HR and IT data-entry tasks. Reduces new-hire time-to-productivity by an estimated 3 days, valued at ~$280K/year across 350 annual hires.",
    affectedOrgs:["Human Resources"],
    projectProgress:{pct:0,note:"Fully approved. Pilot starts Mar 3."},
    agreedSections:{awareness:true,desire:true,knowledge:true,ability:true,reinforcement:true,implementation:true},
    adkarContent:{
      awareness:[
        {heading:"Why we are automating onboarding",body:"Today, provisioning a new hire at Contoso requires an IT technician to manually complete 12 steps across 5 systems: Active Directory account creation, M365 license assignment, device request in ServiceNow, access group configuration, and distribution list enrollment. Average provisioning time is 4.5 business days — meaning new employees frequently arrive on Day 1 without a working laptop, email, or system access.\n\nThis Power Automate workflow connects HR (Workday), IT (Active Directory + M365), and Facilities (ServiceNow) into a single automated pipeline triggered the moment an offer is accepted in Workday. Provisioning completes within 2 hours of trigger."},
        {heading:"Who is affected",body:"HR coordinators: Offboarding the manual provisioning steps from their workflow. They will focus on the human-centered elements of onboarding instead.\n\nIT helpdesk: Eliminating 2,200+ hours/year of manual AD and M365 provisioning tasks. Staff will be redeployed to higher-value work.\n\nNew hires: Day 1 experience fundamentally improved — laptop, email, and system access ready when they walk in."},
      ],
      desire:[
        {heading:"WIIFM by audience",body:"HR team: Eliminates the most complained-about manual process in HR operations. Frees coordinators to spend more time on candidate and new-hire experience.\n\nIT Helpdesk: Removes repetitive, low-value provisioning tasks. The team has explicitly requested automation in two consecutive satisfaction surveys.\n\nManagers: New hires arrive productive on Day 1. No more 'can you call IT for my new person?' manager follow-up."},
        {heading:"Sponsor message",body:"Diane Foster (VP HR): 'This project directly supports our talent brand. When a new hire's first experience is waiting 5 days for a laptop, we lose trust immediately. We're fixing that.'"},
      ],
      knowledge:[
        {heading:"Training for HR coordinators",body:"1-hour training session on the new Workday trigger configuration — what fields must be complete to trigger the workflow correctly, and how to handle exceptions (contractor vs. FTE, international hires).\n\nIT Helpdesk: 30-minute walkthrough of the Power Automate flow and the new monitoring dashboard in ServiceNow. How to identify and escalate failed provisioning runs."},
        {heading:"Documentation",body:"HR coordinator guide: How to trigger, monitor, and escalate onboarding workflows\nIT runbook: Provisioning pipeline architecture, failure recovery steps, Azure Logic App monitoring\nFAQ: What happens for international hires, contractors, late offer acceptances"},
      ],
      ability:[
        {heading:"Support model",body:"Pilot phase (March 3–31): First 30 new hires processed through new workflow with HR coordinator monitoring each run. Any failures escalated to IT within 30 minutes.\n\nFull rollout (April 1+): Automated alerting to IT helpdesk for any failed provisioning steps. HR coordinator receives confirmation email within 2 hours of each successful onboarding trigger."},
      ],
      reinforcement:[
        {heading:"Success metrics",body:"Provisioning time per new hire: Baseline 4.5 days → Target same-day (< 4 hours)\nManual provisioning tasks per hire: Baseline 12 → Target 0\nNew-hire Day 1 satisfaction score (Workday survey): Baseline 3.2/5.0 → Target 4.5/5.0\nIT provisioning helpdesk tickets: Target 80% reduction within 90 days"},
      ],
      implementation:[
        {heading:"Rollout plan",body:"March 1–2: Final UAT sign-off and Workday integration certification\nMarch 3–31: Pilot — all new hires processed through new workflow with monitoring\nApril 1: Full production rollout\nApril 25: Project close; metrics baseline established\n\nTechnology: Microsoft Power Automate (Premium connector license), Workday API integration, Azure Logic Apps for orchestration.\nCost: $45K (implementation and integration) + $18K/year (Power Automate Premium licenses for 15 HR/IT users)"},
      ],
    },
    approvals:[
      {id:"it_dir",role:"IT Director",name:"Nina Vasquez",dept:"IT",tier:1,status:"approved",approvedAt:"2025-02-28",questions:[]},
      {id:"vp_hr",role:"VP HR",name:"Diane Foster",dept:"HR",tier:1,status:"approved",approvedAt:"2025-03-01",questions:[]},
    ],
  },
  {
    id:"CHG-100491",status:"partially_approved",title:"Legacy On-Premises Application Migration to Azure — Phase 1",
    changeType:"normal",priority:"high",riskLevel:"high",
    owner:"David Kim",department:"Azure Engineering",sponsor:"Marcus Webb",
    startDate:"2025-05-01",endDate:"2025-12-19",estimatedCost:"$1M–$5M",
    financialBenefits:"Estimated $4.2M in 3-year infrastructure cost savings (server decommission + datacenter floor space reduction). $1.8M/year avoided in legacy hardware refresh costs. Azure Reserved Instance pricing saves ~$620K/year vs. on-premises equivalent. Total 3-year NPV: ~$9.4M.",
    affectedOrgs:["Finance & Accounting","Operations","Technology / Azure Engineering","Sales"],
    projectProgress:{pct:0,note:"Tier 1 approved. Finance cost model question pending."},
    agreedSections:{awareness:true,desire:true,knowledge:true,ability:true,reinforcement:true,implementation:true},
    adkarContent:{
      awareness:[
        {heading:"The case for moving to Azure",body:"Contoso operates 47 on-premises applications across 3 legacy data center environments. Phase 1 of this migration targets the 14 highest-priority applications by business value, technical risk, and infrastructure age. The primary drivers are: (1) Three of the target applications run on servers with end-of-life hardware scheduled for decommission in Q3 2025 — migration avoids a $1.8M emergency hardware refresh. (2) Azure provides the scalability, resilience, and global redundancy that on-premises infrastructure cannot match. (3) Consolidation reduces ongoing data center operating costs by an estimated $1.4M/year."},
        {heading:"What changes and what stays the same",body:"Users of the 14 migrated applications will see no change in how they access or use those applications. URLs, login methods, and interfaces are preserved. What changes is the underlying infrastructure — applications move from physical servers in the Redmond data center to Azure regions.\n\nThe migration follows a lift-and-shift approach for Phase 1, with cloud-native optimization deferred to Phase 2. This minimizes user impact while achieving the infrastructure and cost objectives."},
      ],
      desire:[
        {heading:"Stakeholder benefits",body:"Application owners: Elimination of infrastructure management burden. Azure SLA of 99.99% replaces current 99.5% on-premises availability.\n\nIT Operations: Reduction in server count by 38 physical servers in Phase 1. Shift from reactive 'keep the lights on' to proactive cloud operations.\n\nFinance: 3-year NPV of $9.4M. Shift from CapEx (hardware refresh) to predictable OpEx (Azure consumption). Cost transparency via Azure Cost Management."},
        {heading:"Addressing concerns",body:"'Will my application be down during migration?' → Each application has a dedicated migration window with rollback capability. Target: zero business-hours downtime for all 14 apps.\n\n'Does this mean Contoso is moving everything to Azure?' → Phase 1 is 14 of 47 applications. A comprehensive migration roadmap will be shared with all application owners before Phase 2 planning begins."},
      ],
      knowledge:[
        {heading:"Training plan",body:"IT Operations staff: Azure Administrator (AZ-104) certification pathway for 12 staff — training begins May 1. Target: all 12 certified by August 31.\n\nApplication owners: 2-hour 'Your app in Azure' briefing covering monitoring, access management, backup policies, and how to raise Azure support tickets.\n\nDevOps / Platform team: Azure DevOps pipelines and Azure Monitor deep dive (8 hours, instructor-led, June)."},
      ],
      ability:[
        {heading:"Migration execution readiness",body:"Azure Landing Zone: Configured and validated in February. Security baseline, network topology, and identity integration complete.\n\nMigration tooling: Azure Migrate assessments completed for all 14 apps. Replication agents installed and tested in pre-production.\n\nRunbooks: Per-application migration runbooks written and reviewed. Each includes: pre-migration checklist, migration steps, validation checklist, rollback procedure."},
      ],
      reinforcement:[
        {heading:"Post-migration metrics",body:"Application availability: Track SLA for each migrated app vs. on-premises baseline\nCost per app: Monthly Azure cost vs. on-premises equivalent\nIncident volume: Azure Monitor alert volume vs. pre-migration helpdesk tickets\n90-day checkpoint: All 14 apps stable, IT staff certification progress, FinOps review of actual vs. projected costs"},
      ],
      implementation:[
        {heading:"Migration wave plan",body:"Wave 1 (May–June): Apps 1–4 — internal tools with limited user base. Validate tooling and runbook approach.\nWave 2 (July–August): Apps 5–10 — department-facing applications.\nWave 3 (September–December): Apps 11–14 — highest-complexity, most user-facing applications.\nDecommission: Physical server decommission begins Q4 2025 after each app's 30-day stability period."},
        {heading:"Budget",body:"Azure Reserved Instance commitment: $1.2M (3-year, covers all 14 apps)\nMigration labor (internal + partner): $820K\nTraining and certification: $95K\nContingency: $200K\nTotal committed: $2.3M of $4M budget envelope"},
      ],
    },
    approvals:[
      {id:"cto",role:"CTO",name:"Marcus Webb",dept:"Technology",tier:1,status:"approved",approvedAt:"2025-03-10",questions:[]},
      {id:"it_dir",role:"IT Director",name:"Nina Vasquez",dept:"IT",tier:1,status:"approved",approvedAt:"2025-03-11",questions:[]},
      {id:"vp_finance",role:"VP Finance",name:"Robert Chen",dept:"Finance",tier:2,status:"changes_requested",approvedAt:null,questions:[{id:"q3",text:"Provide 3-year TCO comparison: on-premises vs. Azure consumption model including committed use discounts.",askedAt:"2025-03-12",response:"",resolved:false}]},
      {id:"vp_comp",role:"VP Compliance",name:"Sandra Lee",dept:"Legal",tier:2,status:"pending",approvedAt:null,questions:[]},
    ],
  },
  {
    id:"CHG-100503",status:"submitted",title:"Microsoft Teams Phone — Legacy PBX Replacement",
    changeType:"standard",priority:"medium",riskLevel:"low",
    owner:"Sarah Chen",department:"Microsoft 365",sponsor:"Nina Vasquez",
    startDate:"2025-02-17",endDate:"2025-07-31",estimatedCost:"$100K–$500K",
    financialBenefits:"Eliminates $380K/year in legacy Avaya PBX maintenance and carrier SIP trunk contracts. Teams Phone Direct Routing reduces per-seat telephony cost from $42/month to $14/month (~$470K/year savings at 2,100 seats). Hardware decommission avoids $200K in upcoming PBX end-of-life refresh.",
    affectedOrgs:["All Business Units"],
    projectProgress:{pct:0,note:"Under Tier 1 review."},
    agreedSections:{awareness:true,desire:true,knowledge:true,ability:true,reinforcement:true,implementation:true},
    adkarContent:{
      awareness:[
        {heading:"Why the PBX is being replaced",body:"Contoso's Avaya Aura PBX system reached end-of-life in January 2025. Avaya's bankruptcy in 2024 has created significant uncertainty around long-term support availability. Current annual maintenance costs are $380K. The Teams Phone platform consolidates voice, video, chat, and meetings into a single Microsoft 365 application that employees already use daily — eliminating the need for desk phones, separate dial-in conference lines, and the physical PBX infrastructure entirely."},
        {heading:"What changes for employees",body:"Your desk phone will be decommissioned on a department-by-department schedule. Your existing direct-dial number will be ported and will ring in Teams on your PC, laptop, or mobile device.\n\nFor employees who need a physical handset: Poly Teams-certified desk phones are available on request. Most users will find the Teams app on their PC or mobile is sufficient.\n\nConference rooms: All conference room phones will be replaced with Teams Rooms devices on a parallel track."},
      ],
      desire:[
        {heading:"Why employees will like this",body:"Single app for all communications: No more switching between Teams for chat/meetings and a desk phone for calls. All in one place.\n\nWork from anywhere: Your business number works on your mobile, laptop, or at home — no forwarding required.\n\nNo more conference call dial-in codes: Teams meetings include integrated audio; external participants dial a single number, no conference codes."},
      ],
      knowledge:[
        {heading:"Training",body:"All employees: 20-minute self-paced module 'Making calls in Teams Phone' available in LMS 2 weeks before your department's cutover date.\n\nPower users and receptionists: 1-hour live training session covering call queues, auto-attendants, call transfer and park, voicemail setup.\n\nIT Admins: Teams Phone System administration training (4 hours) covering Direct Routing configuration, emergency calling compliance (E911), and call quality dashboard."},
      ],
      ability:[
        {heading:"Support during cutover",body:"IT helpdesk will proactively reach out to each department 1 week before their cutover date. A 'Teams Phone Quick Start' card will be placed at each employee's desk the day before their department goes live.\n\nDedicated Teams Phone support channel: #teams-phone-help in Teams for the first 30 days post-cutover."},
      ],
      reinforcement:[
        {heading:"Success metrics",body:"Desk phone decommission rate: Target 100% by July 31\nCall quality score (MOS): Target > 4.0 from Teams Call Quality Dashboard\nHelpdesk tickets per user: Return to baseline within 30 days of each department's cutover\nEmployee satisfaction: Post-migration survey targeting > 80% 'satisfied or better'"},
      ],
      implementation:[
        {heading:"Rollout schedule",body:"February (completed): Direct Routing SBC (session border controller) configuration and number porting for pilot group of 50 users in IT.\nMarch–April: IT, Finance, HR — 450 users\nMay–June: Engineering, Sales, Marketing — 900 users\nJuly: Remaining 750 users + conference room devices\nPBX decommission: August 2025"},
        {heading:"Budget",body:"Teams Phone licensing: Included in existing M365 E5 subscription (no incremental license cost)\nDirect Routing SBC (AudioCodes): $85K hardware + $24K/year support\nPoly desk phones (350 units): $140K\nProfessional services: $60K\nTotal: $309K capital. Payback period: 8 months."},
      ],
    },
    approvals:[
      {id:"it_dir",role:"IT Director",name:"Nina Vasquez",dept:"IT",tier:1,status:"pending",approvedAt:null,questions:[]},
      {id:"vp_hr",role:"VP HR",name:"Diane Foster",dept:"HR",tier:1,status:"pending",approvedAt:null,questions:[]},
    ],
  },
  {
    id:"CHG-100517",status:"preparing",title:"Enterprise Data Warehouse Modernization — Migration to Snowflake",
    changeType:"normal",priority:"high",riskLevel:"high",
    owner:"Rachel Torres",department:"Research & Development",sponsor:"Marcus Webb",
    startDate:"2025-06-02",endDate:"2025-11-28",estimatedCost:"$1M–$5M",
    financialBenefits:"Elimination of $1.4M/year in legacy Teradata license and hardware maintenance costs. Snowflake consumption model estimated at $480K/year — net savings of $920K/year. Analytics platform consolidation eliminates 3 redundant reporting tools saving $210K/year in additional licenses. Business intelligence cycle time expected to reduce from 3 days to 4 hours.",
    affectedOrgs:["Finance & Accounting","Operations","Technology / Azure Engineering","Sales","Research & Development"],
    projectProgress:{pct:0,note:"3 of 6 plan sections agreed. Ability, Reinforcement, and Implementation still drafting."},
    agreedSections:{awareness:true,desire:true,knowledge:true,ability:false,reinforcement:false,implementation:false},
    adkarContent:{
      awareness:[
        {heading:"Why we are modernizing the data warehouse",body:"Contoso's current Teradata data warehouse was implemented in 2013 and has reached architectural and commercial limits. License costs are $1.4M/year for a system with fixed capacity, no elastic scale, and a 3-day data latency cycle. The business has been requesting near-real-time analytics capabilities for 18 months — a request that is technically impossible on the current platform without a $3M+ Teradata expansion.\n\nSnowflake on Azure provides elastic compute (pay per query), zero-copy data sharing across teams, and integration with the Azure ML and Power BI platforms that R&D and Finance already use. This migration eliminates the Teradata estate entirely and positions Contoso's data platform for the next decade."},
        {heading:"Impact on existing reports and dashboards",body:"All existing reports and dashboards will continue to function after migration. The migration approach uses Snowflake's Teradata compatibility layer and automated DDL translation to preserve existing query logic. A 4-week parallel running period will validate that all reports produce identical results before Teradata is decommissioned.\n\nThe 3 redundant reporting tools (Microstrategy, SAS Visual Analytics, legacy SAP BW) will be consolidated into Power BI Premium after migration — this is a separate workstream with its own change management plan."},
      ],
      desire:[
        {heading:"Benefits by audience",body:"Finance / FP&A: Real-time financial dashboards replace next-morning batch reports. Month-close analytics available within hours of last transaction, not days.\n\nSales / Revenue Operations: Live pipeline analytics and territory performance — no more waiting for the end-of-day DW refresh.\n\nR&D / Data Science: Snowflake's near-unlimited elastic compute removes the 'queue for the cluster' problem. ML experiments can run without scheduling 3 days in advance.\n\nIT / Data Engineering: Elimination of Teradata maintenance overhead. Modern dbt-based transformation pipeline replaces complex legacy ETL scripts."},
      ],
      knowledge:[
        {heading:"Training plan",body:"Data Engineering team (8 engineers): 3-day Snowflake SnowPro Core certification preparation + dbt Fundamentals course. Completed before build phase begins in July.\n\nBI / Reporting team (12 analysts): 2-day 'Snowflake for Analysts' workshop covering Snowsight query interface, virtual warehouse management, and data sharing.\n\nPower BI report authors (35 users): 4-hour 'Connecting Power BI to Snowflake' workshop. Scheduled August.\n\nIT Operations: Snowflake account administration, resource monitors, data governance policies (RBAC, PII masking). 8-hour training, June."},
      ],
      ability:[
        {heading:"Support and enablement plan",body:"[DRAFT — This section is under development by the Data Engineering team and ECMO. Target completion: April 15.]\n\nPlanned elements:\n• Snowflake sandbox environment for analyst self-service exploration (available June 1)\n• Dedicated #snowflake-help Teams channel with Data Engineering on-call rotation\n• 'Office hours' with Data Engineering leads during migration windows\n• Rollback runbook: Teradata kept in read-only mode for 60 days post-cutover as fallback"},
      ],
      reinforcement:[
        {heading:"Metrics and sustainability",body:"[DRAFT — Under development. Target completion: April 15.]\n\nPlanned metrics:\n• Query performance: Benchmark top-20 business queries pre/post migration\n• Report delivery latency: Teradata baseline 3 days → Snowflake target 4 hours\n• Cost per query: Monitor Snowflake consumption vs. Teradata fixed cost equivalent\n• User adoption: % of analysts actively using Snowflake query editor vs. legacy tools at 30/90/180 days"},
      ],
      implementation:[
        {heading:"Program phases",body:"[DRAFT — Under development. Target completion: April 22.]\n\nPlanned phases:\nPhase 1 (June): Snowflake account setup, Azure private link, security baseline, data governance framework\nPhase 2 (July): Schema migration and ETL pipeline rebuild (dbt models)\nPhase 3 (August): Data validation and parallel running — Teradata vs. Snowflake results compared\nPhase 4 (September–October): Power BI reconnection and report validation\nPhase 5 (November): Teradata decommission and final go-live\n\nDetailed schedule and resource plan to follow."},
      ],
    },
    approvals:[
      {id:"cto",role:"CTO",name:"Marcus Webb",dept:"Technology",tier:1,status:"pending",approvedAt:null,questions:[]},
      {id:"cfo",role:"CFO",name:"Sandra Lee",dept:"Finance",tier:1,status:"pending",approvedAt:null,questions:[]},
      {id:"vp_finance",role:"VP Finance",name:"Robert Chen",dept:"Finance",tier:2,status:"pending",approvedAt:null,questions:[]},
      {id:"vp_comp",role:"VP Compliance",name:"Sandra Lee",dept:"Legal",tier:2,status:"pending",approvedAt:null,questions:[]},
    ],
  },
  {
    id:"CHG-100528",status:"changes_requested",title:"Salesforce CRM Bi-Directional Integration with SAP",
    changeType:"expedited",priority:"medium",riskLevel:"medium",
    owner:"Priya Patel",department:"Sales",sponsor:"Kevin Park",
    startDate:"2025-03-10",endDate:"2025-05-30",estimatedCost:"$100K–$500K",
    financialBenefits:"Eliminates $1.8M/year in manual rekeying labor across Sales Ops and Finance (estimated 4,300 hours/year across 22 FTEs). Real-time forecast accuracy improvement expected to release $2.1M in committed budget held as safety margin against inaccurate pipeline data. Faster quote-to-cash cycle (target: 8 days → 3 days) projected to accelerate $3.2M in receivables velocity.",
    affectedOrgs:["Finance & Accounting","Operations","Sales"],
    projectProgress:{pct:0,note:"Finance requesting ROI model and SAP write-back controls detail."},
    agreedSections:{awareness:true,desire:true,knowledge:true,ability:true,reinforcement:true,implementation:true},
    adkarContent:{
      awareness:[
        {heading:"The integration gap that this change solves",body:"Today, a closed deal in Salesforce requires a Sales Ops team member to manually re-enter the order data into SAP — a process that takes 45–90 minutes per order and is the source of 80% of order entry errors. This creates a 1–3 day lag between deal close and order processing, a constant source of frustration for Sales, Finance, and customers.\n\nThis MuleSoft integration creates a real-time bi-directional data bridge between Salesforce (opportunities, accounts, contracts) and SAP (orders, invoicing, delivery). When a deal closes in Salesforce, a validated sales order is automatically created in SAP within 5 minutes. SAP invoice and delivery status flows back to Salesforce in real time."},
        {heading:"Who is affected",body:"Sales team: Opportunity and account data is now validated against SAP customer master at point of entry in Salesforce — preventing duplicates and pricing errors before they reach Finance.\n\nSales Operations: Manual re-entry workflow is eliminated. Team transitions to exception management and data quality oversight.\n\nFinance: Real-time AR visibility in Salesforce. Quote-to-cash cycle shortened by ~5 days."},
      ],
      desire:[
        {heading:"WIIFM",body:"Sales reps: Deals close faster. No more 'waiting on Finance to process the order.' Customer gets confirmation same day.\n\nSales Ops: Elimination of the most tedious and error-prone task in the team's workflow. Redeployment to higher-value analysis work.\n\nFinance: Real-time receivables data without end-of-day SAP batch reports. More accurate cash forecasting.\n\nCustomers: Faster order confirmations and delivery status visibility."},
      ],
      knowledge:[
        {heading:"Training",body:"Sales Ops team (8 users): 2-hour training on the new Salesforce UI changes — order validation warnings, SAP account lookup, duplicate prevention workflow.\n\nFinance team (6 users): 1-hour briefing on new real-time SAP data visibility in Salesforce dashboards and how to reconcile discrepancies.\n\nIT Integration team: MuleSoft flow documentation, monitoring dashboard (Anypoint Platform), error queue management, and SAP BAPI interface runbook."},
      ],
      ability:[
        {heading:"Support model",body:"Hypercare period (2 weeks post-go-live): Integration team on call for any SAP write-back failures. Automated alerting configured for any order processing failure >15 minutes.\n\nFallback: Manual processing procedure documented and practiced — if integration fails, Sales Ops can revert to manual entry for individual orders while the integration team resolves issues."},
      ],
      reinforcement:[
        {heading:"Success metrics",body:"Manual re-entry hours: Baseline 4,300 hrs/yr → Target 0 within 90 days\nOrder entry error rate: Baseline 12% → Target < 2% at 60 days\nQuote-to-cash cycle: Baseline 8 days → Target 3 days at 90 days\nSales Ops satisfaction score: Target > 4.3/5.0 at 30-day survey"},
      ],
      implementation:[
        {heading:"Technical implementation plan",body:"March 10–20: MuleSoft Anypoint Platform configuration, SAP BAPI interface development, Salesforce connected app configuration.\nMarch 21–31: Integration testing in sandbox environments (Salesforce sandbox + SAP quality system).\nApril 1–14: UAT with Sales Ops and Finance key users.\nApril 15–30: Performance and load testing (target: 500 concurrent order events/hour).\nMay 1: Production go-live with hypercare.\nMay 30: Project close and metrics baseline."},
        {heading:"Budget",body:"MuleSoft Anypoint Platform (Starter tier): $95K/year\nImplementation labor (internal + Accenture): $180K\nSAP development (BAPI extensions): $45K\nTotal: $320K (within $100K–$500K budget range)"},
      ],
    },
    approvals:[
      {id:"it_dir",role:"IT Director",name:"Derek Hastings",dept:"IT",tier:1,status:"approved",approvedAt:"2025-03-03",questions:[]},
      {id:"vp_sales",role:"VP Sales",name:"Kevin Park",dept:"Sales",tier:1,status:"approved",approvedAt:"2025-03-04",questions:[]},
      {id:"vp_finance",role:"VP Finance",name:"Robert Chen",dept:"Finance",tier:2,status:"changes_requested",approvedAt:null,questions:[{id:"q4",text:"Provide ROI methodology for the $1.8M productivity and $2.1M forecast claims, and confirm SAP write-back controls preventing duplicate sales orders.",askedAt:"2025-03-05",response:"",resolved:false}]},
      {id:"security",role:"IT Security",name:"James O'Brien",dept:"Security",tier:2,status:"pending",approvedAt:null,questions:[]},
    ],
  },
  {
    id:"CHG-100541",status:"active_behind",title:"Global End-User Device Refresh — Surface Pro 11 & Windows 11",
    changeType:"standard",priority:"low",riskLevel:"low",
    owner:"Michael Okafor",department:"Corporate IT",sponsor:"Derek Hastings",
    startDate:"2025-04-14",endDate:"2025-10-31",estimatedCost:"$1M–$5M",
    financialBenefits:"Eliminates $640K/year in end-of-life Windows 10 extended security update (ESU) fees after October 2025. Windows 11 security baseline reduces endpoint security incident costs by estimated $420K/year. Improved employee productivity estimated at $890K/year (22-minute/day average productivity gain across 2,400 refreshed devices).",
    affectedOrgs:["All Business Units"],
    projectProgress:{pct:18,note:"CDW shipment delayed 3 weeks. HQ deployment started. Revised completion: Nov 21.",correctiveAction:"Windows 10 ESU bridge licenses purchased to cover all unrefreshed devices through November 21. CDW has committed to a revised delivery schedule; weekly status calls with CDW account team in place. HQ Redmond deployment continues on original schedule — 680 devices. Regional rollout dates shifted by 3 weeks across all remaining sites. No scope reduction. Project manager publishing weekly progress dashboard to IT leadership."},
    agreedSections:{awareness:true,desire:true,knowledge:true,ability:true,reinforcement:true,implementation:true},
    adkarContent:{
      awareness:[
        {heading:"Why devices are being refreshed now",body:"Contoso's current laptop fleet averages 4.8 years old. Windows 10 reaches end of support on October 14, 2025 — after which Microsoft will charge $640K/year for Extended Security Updates (ESUs) as a stopgap measure, or devices will receive no security updates at all.\n\nThis refresh replaces 2,400 devices with Surface Pro 11 running Windows 11, managed via Microsoft Intune. The business case is straightforward: replace aging hardware before the ESU cost hits, while delivering a modern, secure, and faster device to every employee."},
        {heading:"Employee experience",body:"Scheduling: IT will contact each employee's manager 2 weeks before their scheduled refresh date to coordinate a 45-minute device swap appointment.\n\nData migration: All data synced to OneDrive is automatically available on the new device. The IT technician will verify data migration before collecting the old device.\n\nDelay notice: Due to a CDW shipping delay, HQ deployments remain on schedule. Regional rollout has been pushed 3 weeks. Revised completion date is November 21, 2025. Windows 10 ESU coverage has been purchased to bridge the gap."},
      ],
      desire:[
        {heading:"Why employees will welcome this",body:"New Surface Pro 11: Significantly faster than current hardware (Intel Core Ultra 7 vs. average current Core i5). Better battery life (12 hours vs. typical 5–6 hours on current fleet). Lighter weight.\n\nWindows 11 quality-of-life improvements: Improved virtual desktops, better multi-monitor support, Snap layouts, integrated Microsoft Copilot.\n\nNo data loss: OneDrive sync ensures complete continuity. Most employees report the device swap takes less than 20 minutes of their active time."},
      ],
      knowledge:[
        {heading:"What employees need to know",body:"Before your appointment: Ensure all files are saved to OneDrive (not local desktop). IT will send a checklist 1 week in advance.\n\nDuring the swap: IT technician handles everything. You will verify your key apps are working before they leave.\n\nAfter the swap: Windows 11 orientation video (12 minutes) available in LMS. Quick reference card left with each device covering: Snap layouts, Start menu, Teams and M365 app access."},
      ],
      ability:[
        {heading:"Support model",body:"Mobile IT team: 8 technicians conducting scheduled device swaps at a rate of ~25/day.\n\nPost-swap support: Dedicated #device-refresh-help Teams channel for 60 days. Any device issue within 30 days of swap gets same-day IT response.\n\nVIP/executive concierge: C-suite and VP devices handled by senior IT staff with extended on-site support."},
      ],
      reinforcement:[
        {heading:"Metrics",body:"Devices refreshed vs. schedule: Weekly tracker published to IT leadership\nEmployee satisfaction at swap: Target > 4.5/5.0 on immediate post-swap survey\nDevice-related helpdesk tickets: Monitor volume in first 30 days post-region rollout; target return to baseline within 3 weeks\nWindows 10 ESU exposure: Zero devices on Windows 10 without ESU coverage after October 14, 2025"},
      ],
      implementation:[
        {heading:"Revised rollout schedule",body:"HQ Redmond (April 14 – May 30): 680 devices — on schedule\nSan Jose (June 2 – July 11): 420 devices — delayed 3 weeks from original plan\nSeattle + Chicago (July 14 – August 29): 610 devices\nNew York + Boston (September 1 – October 10): 440 devices\nInternational (London, Dublin, Singapore) (October 13 – November 21): 250 devices\n\nTotal: 2,400 devices"},
        {heading:"Budget and delay impact",body:"Device cost: $1,440,000 (2,400 × $600/unit Surface Pro 11 corporate pricing via CDW)\nIntune deployment and configuration: $85K\nIT labor (deployment): Internal team + 3 contract technicians\nWindows 10 ESU bridge (Oct–Nov): $48K — added due to shipping delay\nTotal: $1.57M (within $1M–$5M budget range)"},
      ],
    },
    approvals:[
      {id:"it_dir",role:"IT Director",name:"Nina Vasquez",dept:"IT",tier:1,status:"approved",approvedAt:"2025-03-28",questions:[]},
      {id:"vp_hr",role:"VP HR",name:"Diane Foster",dept:"HR",tier:1,status:"approved",approvedAt:"2025-03-30",questions:[]},
    ],
  },
];


// ─── RESOURCE DOCS ──────────────────────────────────────────────────────────
const RESOURCE_DOCS={
  "adkar-guide":{title:"ADKAR Quick Reference Guide",sections:[
    {heading:"What is ADKAR?",body:"ADKAR is a goal-oriented change management model developed by Prosci. It describes five sequential building blocks that individuals need to achieve for a change to succeed."},
    {heading:"A — Awareness",body:"Employees understand the business reasons for the change and the risk of the status quo.\n\nKey actions: Executive communications, town halls, manager briefings, intranet announcements, FAQ pages."},
    {heading:"D — Desire",body:"Individuals make a personal choice to support the change. Desire cannot be mandated — it must be cultivated through visible sponsorship and clear WIIFM messaging.\n\nKey actions: Sponsor roadshows, WIIFM by audience, manager advocacy program, resistance management plan."},
    {heading:"K — Knowledge",body:"Employees know how to change — the skills, behaviors, and processes required to perform their role in the new way.\n\nKey actions: Role-based training curricula, quick reference guides, hands-on labs, admin runbooks, SOPs."},
    {heading:"A — Ability",body:"The gap between knowing and doing. Ability requires practice, support systems, and time — not just training.\n\nKey actions: Tiered support model, practice environments, IT Tech Bars, performance job aids, helpdesk capacity planning."},
    {heading:"R — Reinforcement",body:"Actions taken to sustain and embed the change after go-live.\n\nKey actions: KPI measurement at 30/90/180 days, recognition programs, embedding in onboarding, feedback loops, course correction."},
  ]},
  "threshold":{title:"Change Threshold Decision Tree",sections:[
    {heading:"When is change management required?",body:"Use this decision tree to determine the level of change management support your project requires."},
    {heading:"Required — Full ADKAR Plan and Approval",body:"• Affects 1,000 or more employees\n• Involves a security control or compliance obligation\n• Financial exposure greater than $100,000\n• Emergency, Expedited, or Normal change type\n• Introduces a new enterprise system or replaces an existing one"},
    {heading:"Recommended — ADKAR Plan and Light Approval",body:"• Affects 200–999 employees\n• Introduces new tools, workflows, or third-party integrations\n• Changes a process that affects multiple departments\n• Medium or higher risk classification"},
    {heading:"Optional — ECMO Advisory",body:"• Fewer than 200 employees affected\n• Low-risk and limited in scope\n• Follows a well-established, pre-approved pattern"},
  ]},
  "comms-templates":{title:"Communication Plan Templates",sections:[
    {heading:"Template 1: Initial Change Announcement",body:"Subject: [Change Title] — What You Need to Know\n\nDear [Audience],\n\nI'm writing to let you know about an upcoming change that will affect [scope].\n\n[2–3 sentences on what is changing and why.]\n\nHere's what this means for you: [specific impact].\n\nMore information will follow on [date].\n\n[Sponsor name and title]"},
    {heading:"Template 2: Training Invitation",body:"Subject: Required Training — [System/Process Name] — [Date]\n\nAs part of the [project name] change, you are required to complete training before [go-live date]:\n\n• [Training name] — [duration] — [format]\n\n[Change Lead name]"},
    {heading:"Template 3: Go-Live Reminder",body:"Subject: [Change] Goes Live [Date] — You're Ready\n\nHi [Name],\n\n• What changes: [one sentence]\n• What you need to do: [one sentence]\n• Where to get help: [support channel]\n\n[Owner name]"},
  ]},
  "resistance":{title:"Resistance Management Playbook",sections:[
    {heading:"Understanding resistance",body:"Resistance to change is normal and expected. It is a signal that the Desire element of ADKAR has not yet been achieved. Addressing resistance constructively is one of the most important activities a change lead can do."},
    {heading:"Common resistance patterns",body:"1. 'I don't understand why this is changing.' → Root cause: Awareness gap. Intervention: Direct communication from a respected leader.\n\n2. 'This will make my job harder.' → Root cause: Perceived negative impact. Intervention: Acknowledge the concern; provide pilot evidence.\n\n3. 'I wasn't consulted.' → Root cause: Exclusion. Intervention: Bring them into the process; give them a visible role."},
    {heading:"Escalation path",body:"Level 1: Change Lead — direct conversation, additional WIIFM messaging.\nLevel 2: Manager — manager activation and peer influence.\nLevel 3: Sponsor — personal outreach for persistent resistance.\nLevel 4: HR — for cases where resistance becomes non-compliance."},
  ]},
  "intake-instructions":{title:"Intake Form — Instructions",sections:[
    {heading:"Purpose",body:"The intake form captures all information needed to classify your change, trigger the correct approval workflow, and pre-populate your ADKAR project plan."},
    {heading:"Required fields",body:"• Requestor name, email, department, and job title\n• Change title and classification (type, category, priority)\n• Impact level and estimated number of affected users\n• Planned start and end dates\n• Risk level and mitigation plan\n• Estimated cost range and budget source\n• Business problem and proposed solution\n• IT approver and business approver names"},
    {heading:"What happens after submission",body:"1. The ECMO receives and reviews your submission within 1 business day.\n2. An ADKAR project plan is automatically generated.\n3. Your Change Lead reviews the plan with you.\n4. You agree to each section, then submit for leadership approval.\n5. Approval routing is automated based on risk, cost, and scope."},
  ]},
  "prosci":{title:"Prosci ADKAR Overview",sections:[
    {heading:"About Prosci",body:"Prosci is the global leader in change management research and methodology. The ADKAR model was developed by Prosci founder Jeff Hiatt based on research with more than 700 organizations."},
    {heading:"Why ADKAR?",body:"Unlike process-focused models, ADKAR is people-focused. It provides a clear, measurable way to assess where individuals are in their change journey and design targeted interventions.\n\nThe ECMO selected ADKAR as the enterprise framework because it is the most widely researched and most practically actionable methodology available."},
  ]},
  "change-types":{title:"Change Types Explained",sections:[
    {heading:"Overview",body:"Every change request is classified by type. The type determines the approval pathway, urgency of review, and level of ADKAR planning required before work begins."},
    {heading:"Standard",body:"A Standard change is pre-approved, low-risk, and follows a fully documented, repeatable procedure.\n\nExamples: Routine security patches per an approved runbook, standard hardware replacements, pre-approved software updates with no user impact.\n\nApproval: Pre-approved. CAB review not required per individual change instance."},
    {heading:"Normal",body:"A Normal change is any new, non-emergency change that has not been pre-approved. Normal changes require full ADKAR planning and tiered leadership approval.\n\nExamples: System upgrades, application rollouts, process redesigns, new vendor integrations, cloud migrations.\n\nApproval: Full ADKAR plan required. CAB review required."},
    {heading:"Expedited",body:"An Expedited change is a Normal change with a compressed review timeline due to genuine business urgency.\n\nApproval: Same as Normal, but prioritized. Expedited CAB review required."},
    {heading:"Emergency",body:"An Emergency change is an unplanned, urgent response to a critical incident. Fast-track process; receives post-implementation review.\n\nApproval: Verbal emergency authorization required. Expedited post-implementation CAB review within 5 business days."},
  ]},
  "priority-levels":{title:"Priority Levels Explained",sections:[
    {heading:"Critical",body:"The change addresses a business-stopping condition or imminent risk. Delay is not acceptable.\n\nEffect: Immediate ECMO engagement. Expedited approval queue."},
    {heading:"High",body:"The change has significant impact on operations, revenue, or a large number of users.\n\nEffect: Prioritized scheduling. ECMO assigns a dedicated Change Lead."},
    {heading:"Medium",body:"The change addresses an important need but can tolerate a reasonable review cycle.\n\nEffect: Standard ECMO review cycle of 2–4 weeks."},
    {heading:"Low",body:"The change has limited urgency and minimal risk of disruption.\n\nEffect: Standard scheduling. May be batched with similar changes."},
  ]},
  "impact-levels":{title:"Impact Levels Explained",sections:[
    {heading:"Critical",body:"The change has the potential to affect the entire organization, core operations, or external customers. A failure could cause widespread disruption.\n\nEffect: Requires executive sponsor. Full approval chain including VP Finance and VP Compliance."},
    {heading:"Major",body:"The change significantly affects one or more large business units, key systems, or thousands of employees.\n\nEffect: Requires IT Director approval. Full ADKAR plan mandatory."},
    {heading:"Moderate",body:"The change affects a defined group of users or a limited set of systems. Impact is meaningful but manageable.\n\nEffect: Standard ADKAR plan. Approval based on cost and risk level."},
    {heading:"Minor",body:"The change affects a small number of users or has very limited system impact.\n\nEffect: May qualify for lighter-touch change management. ECMO advisory recommended."},
  ]},
  "risk-levels":{title:"Risk Levels Explained",sections:[
    {heading:"Overview",body:"Risk level is assessed by combining the probability that something goes wrong with the business impact if it does. It is a key driver of approval requirements and ADKAR planning depth."},
    {heading:"Critical",body:"High probability of failure or high consequence if failure occurs — or both. Could cause a significant outage, security incident, data loss, or regulatory violation.\n\nExamples: Live database schema migrations, firewall changes, emergency patches with no available rollback path.\n\nEffect: Mandatory rollback plan. Full contingency plan required. VP-level approvals triggered."},
    {heading:"High",body:"Either a meaningful chance of failure or a high-impact consequence if the change does not go as planned.\n\nExamples: Large-scale data migrations, major system upgrades, multi-region network changes.\n\nEffect: Full risk analysis section required. Detailed mitigation and rollback plans reviewed by ECMO."},
    {heading:"Medium",body:"Moderate probability of issues and moderate consequences. Standard mitigation and rollback planning is sufficient.\n\nEffect: Standard mitigation plan required. Rollback plan recommended."},
    {heading:"Low",body:"Low probability of failure and limited consequences if issues arise.\n\nEffect: Basic risk description sufficient. Rollback procedure noted but detailed plan not required."},
  ]},
};

// ─── SHARED COMPONENTS ──────────────────────────────────────────────────────
function Avatar({initials,color,size=40}){return <div style={{width:size,height:size,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:size*0.32,fontWeight:700,color:C.white}}>{initials}</span></div>;}
function Pill({label,color,bg,size=11}){return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 9px",borderRadius:10,fontSize:size,fontWeight:700,background:bg,color,whiteSpace:"nowrap"}}>{label}</span>;}
function Chip({children,color=C.textLight}){return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:2,fontSize:11,fontWeight:500,background:C.bgMid,color,border:`1px solid ${C.border}`}}>{children}</span>;}
function Rule(){return <div style={{height:1,background:C.border,margin:"22px 0"}}/>;}
function SectionHeading({children}){return <p style={{margin:"0 0 12px",fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.2}}>{children}</p>;}
function StatusDot({status}){return <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:STATUS_CFG[status]?.color||C.textMuted,flexShrink:0}}/>;}
function InfoBtn({onClick,title}){return <button onClick={onClick} title={title||"Learn more"} style={{width:16,height:16,borderRadius:"50%",border:`1px solid ${C.borderMid}`,background:C.bgMid,color:C.textMuted,fontSize:10,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0,verticalAlign:"middle",marginLeft:6}}>?</button>;}
function TabBar({tabs,active,onChange}){
  return <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>{tabs.map(([id,label])=>(
    <button key={id} onClick={()=>onChange(id)} style={{background:"none",border:"none",borderBottom:`2px solid ${active===id?C.purple:"transparent"}`,marginBottom:-1,padding:"10px 18px",cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontSize:14,color:active===id?C.purple:C.textLight,fontWeight:active===id?600:400,whiteSpace:"nowrap"}}
      onMouseEnter={e=>{if(active!==id){e.target.style.color=C.textMid;e.target.style.borderBottomColor=C.borderMid;}}}
      onMouseLeave={e=>{if(active!==id){e.target.style.color=C.textLight;e.target.style.borderBottomColor="transparent";}}}>{label}</button>
  ))}</div>;
}
function SlidePanel({docKey,onClose}){
  const doc=RESOURCE_DOCS[docKey];
  if(!doc)return null;
  return <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"flex-start",justifyContent:"flex-end"}}>
    <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)"}}/>
    <div style={{position:"relative",width:520,maxHeight:"100vh",background:C.white,overflowY:"auto",boxShadow:"-4px 0 24px rgba(0,0,0,0.14)"}}>
      <div style={{padding:"20px 24px 16px",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,background:C.white,zIndex:1,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
        <div><div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Reference</div><h2 style={{margin:0,fontSize:18,fontWeight:600,color:C.text}}>{doc.title}</h2></div>
        <button onClick={onClose} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:2,padding:"5px 14px",cursor:"pointer",fontSize:12,color:C.textLight,fontFamily:"'Segoe UI',sans-serif",flexShrink:0,marginTop:4}}>Close</button>
      </div>
      <div style={{padding:"20px 24px 48px"}}>{doc.sections.map((s,i)=><div key={i} style={{marginBottom:22}}><h3 style={{margin:"0 0 8px",fontSize:13.5,fontWeight:700,color:C.purple}}>{s.heading}</h3><p style={{margin:0,fontSize:13,color:C.textMid,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{s.body}</p></div>)}</div>
    </div>
  </div>;
}

// ─── NAV ────────────────────────────────────────────────────────────────────
function Nav({current,navigate,totalProjects}){
  return <nav style={{background:C.nav,height:44,display:"flex",alignItems:"center",paddingLeft:20,paddingRight:28,position:"sticky",top:0,zIndex:200,boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}>
    <button onClick={()=>navigate("home")} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:"0 16px 0 0",marginRight:8,borderRight:"1px solid rgba(255,255,255,0.15)"}}>
      <span style={{color:"rgba(255,255,255,0.95)",fontSize:14,fontWeight:600}}>Contoso</span>
      <span style={{color:"rgba(255,255,255,0.3)",margin:"0 3px"}}>|</span>
      <span style={{color:"rgba(255,255,255,0.8)",fontSize:14}}>Change Management</span>
    </button>
    <div style={{display:"flex",flex:1}}>
      {[["home","Home"],["dashboard","Dashboard"],["intake","Submit a Request"],["portfolio","Project Portfolio"]].map(([id,label])=>(
        <button key={id} onClick={()=>navigate(id)} style={{background:"none",border:"none",borderBottom:`2px solid ${current===id?"#a78bfa":"transparent"}`,cursor:"pointer",padding:"0 14px",height:44,fontFamily:"'Segoe UI',sans-serif",fontSize:13,color:current===id?"#c4b5fd":"rgba(255,255,255,0.7)",fontWeight:current===id?600:400}}
          onMouseEnter={e=>{if(current!==id){e.target.style.color="rgba(255,255,255,0.95)";e.target.style.borderBottomColor="rgba(255,255,255,0.25)";}}}
          onMouseLeave={e=>{if(current!==id){e.target.style.color="rgba(255,255,255,0.7)";e.target.style.borderBottomColor="transparent;"}}}>
          {label}{id==="portfolio"&&totalProjects!==10&&<span style={{marginLeft:5,background:C.purple,color:C.white,borderRadius:10,fontSize:10,fontWeight:700,padding:"0 5px"}}>{totalProjects}</span>}
        </button>
      ))}
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <Avatar initials="YN" color={C.purpleMid} size={28}/>
      <span style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>Your Name</span>
    </div>
  </nav>;
}

// ─── LANDING PAGE ───────────────────────────────────────────────────────────
const ADKAR_LANDING=[
  {key:"A1",letter:"A",word:"Awareness",color:C.blue,border:C.blueBorder,bg:C.blueLight,tagline:"Why must this change happen?",desc:"Build understanding of the business reasons for the change and the risks of not changing."},
  {key:"D",letter:"D",word:"Desire",color:C.green,border:C.greenBorder,bg:C.greenLight,tagline:"Why should I support this change?",desc:"Cultivate the personal motivation to participate. Desire cannot be assumed — it must be earned through visible sponsorship and clear WIIFM messaging."},
  {key:"K",letter:"K",word:"Knowledge",color:C.purple,border:C.purpleBorder,bg:C.purpleLight,tagline:"How do I change?",desc:"Provide the training, information, and role-specific skills needed to understand what the change looks like in daily work."},
  {key:"A2",letter:"A",word:"Ability",color:C.orange,border:C.orangeBorder,bg:C.orangeLight,tagline:"Can I perform the change day to day?",desc:"Bridge the gap between knowledge and practice through support systems, practice environments, and time."},
  {key:"R",letter:"R",word:"Reinforcement",color:C.teal,border:C.tealBorder,bg:C.tealLight,tagline:"How do we make the change permanent?",desc:"Sustain adoption through measurement at 30/90/180 days, recognition programs, and feedback-driven course correction."},
];
const TEAM_DATA=[
  {name:"Dr. Melissa Grant",initials:"MG",role:"Director, Enterprise Change Management",cert:"Prosci CCP",color:C.purple,email:"mgrant@contoso.com",teamsId:"mgrant",areas:["Portfolio governance","Executive partnerships","Framework oversight"]},
  {name:"Jordan Webb",initials:"JW",role:"Senior Change Lead — Technology",cert:"Prosci CCP · PMP",color:C.blue,email:"jwebb@contoso.com",teamsId:"jwebb",areas:["Security changes","Cloud migrations","Infrastructure"]},
  {name:"Carmen Díaz",initials:"CD",role:"Change Lead — Workforce & Process",cert:"Prosci CCP · SHRM",color:C.teal,email:"cdiaz@contoso.com",teamsId:"cdiaz",areas:["HR systems","Workflow automation","Organizational design"]},
  {name:"Theo Nakamura",initials:"TN",role:"Communications & Engagement Lead",cert:"IABC Certified",color:C.orange,email:"tnakamura@contoso.com",teamsId:"tnakamura",areas:["Executive communications","Stakeholder mapping","Campaigns"]},
  {name:"Priya Osei",initials:"PO",role:"Training & Enablement Lead",cert:"ATD CPTD",color:C.green,email:"posei@contoso.com",teamsId:"posei",areas:["Curriculum design","Instructor-led training","Adoption metrics"]},
  {name:"Raj Patel",initials:"RP",role:"Change Analytics & Portfolio Reporting",cert:"Certified Analytics",color:C.purple,email:"rpatel@contoso.com",teamsId:"rpatel",areas:["Dashboard reporting","ADKAR metrics","PMO liaison"]},
];
const FAQS=[
  {q:"How do I know if my project needs change management support?",a:"If your project affects 1,000 or more employees, involves a security or compliance obligation, or carries financial exposure over $100K, change management support is required. For projects affecting 200–999 employees or introducing new tools or workflows, it is strongly recommended."},
  {q:"What is the difference between Standard, Normal, Expedited, and Emergency changes?",a:"Standard changes are pre-approved, low-risk, and follow a documented procedure. Normal changes are new, non-emergency changes requiring full ADKAR planning and approval. Expedited changes are Normal changes with a compressed timeline. Emergency changes are unplanned responses to critical incidents and receive post-implementation review."},
  {q:"How long does the ADKAR planning and approval process take?",a:"Simple or low-risk changes often complete planning and approval within 1–2 weeks. Medium-complexity changes typically take 2–4 weeks. High-risk or enterprise-wide changes can take 4–8 weeks. Starting the intake form early is the single most effective way to shorten cycle time."},
  {q:"Who are the required approvers and how are they determined?",a:"Approvers are assigned in two tiers based on scope and risk. Tier 1 typically includes the relevant IT Director and a business sponsor. Tier 2 approvers are triggered automatically based on cost threshold, employee count, or data sensitivity."},
  {q:"Can I edit the ADKAR plan after submitting it for approval?",a:"Once submitted, sections that have been agreed to cannot be edited without a two-step unlock — which resets that section's approval status. If an approver requests changes, your plan moves to Changes Requested. You can then respond, revise the relevant sections, and resubmit."},
  {q:"What is the ECMO's role once a project is approved and active?",a:"After approval, your assigned Change Lead remains engaged throughout execution — monitoring adoption metrics, checking in at 30- and 90-day marks, helping escalate resistance issues, and reporting status to the executive dashboard."},
  {q:"Does a submitted intake form automatically create an ADKAR plan?",a:"Yes. Once you submit the intake form, the platform uses your information — change type, affected population, risk level, timeline, and business justification — to pre-populate all five ADKAR sections."},
  {q:"Who can view project plans and dashboard data?",a:"Intake forms and ADKAR plans are visible to the project owner, assigned Change Lead, and designated approvers. Executive dashboard data is visible to all senior leadership team members and the ECMO."},
];

function LandingPage({navigate,openDoc}){
  const [tab,setTab]=useState("about");
  const [openADKAR,setOpenADKAR]=useState(null);
  const [openFAQ,setOpenFAQ]=useState(null);
  const TABS=[["about","About this program"],["adkar","The ADKAR model"],["process","How it works"],["team","Our team"],["faq","FAQ"]];
  return <div style={{minHeight:"calc(100vh - 44px)",background:C.bg,fontFamily:"'Segoe UI',Tahoma,sans-serif"}}>
    <div style={{background:C.white,borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 32px"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,paddingTop:16,marginBottom:14,fontSize:12,color:C.textMuted}}>
          <span>Contoso Intranet</span><span>›</span><span>Office of Technology</span><span>›</span>
          <span style={{color:C.textMid,fontWeight:600}}>Enterprise Change Management</span>
        </div>
        <h1 style={{margin:"0 0 6px",fontSize:28,fontWeight:600,color:C.text,letterSpacing:-0.3}}>Enterprise Change Management</h1>
        <p style={{margin:"0 0 18px",fontSize:14,color:C.textLight,lineHeight:1.65,maxWidth:620}}>A structured, people-centered approach to managing technology and process change — built on the Prosci ADKAR framework and operated by the Enterprise Change Management Office (ECMO).</p>
        <TabBar tabs={TABS} active={tab} onChange={setTab}/>
      </div>
    </div>
    <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 32px 80px",display:"grid",gridTemplateColumns:"1fr 280px",gap:28,alignItems:"start"}}>
      <div>
        {tab==="about"&&<div>
          <SectionHeading>Program overview</SectionHeading>
          <p style={{fontSize:14,color:C.textMid,lineHeight:1.75,margin:"0 0 16px"}}>The Enterprise Change Management Office (ECMO) sits within the Office of Technology and partners with project owners to ensure every significant change to systems, processes, or ways of working is planned, communicated, and sustained in a way that maximizes adoption and minimizes disruption.</p>
          <Rule/>
          <SectionHeading>Why structured change management matters</SectionHeading>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[{stat:"70%",desc:"of change initiatives fall short — the primary cause is people readiness, not technology failures.",color:C.red},{stat:"6×",desc:"more likely to meet objectives with excellent change management vs. no structured approach.",color:C.green},{stat:"30%",desc:"faster speed of adoption when training and structured communications are part of the plan.",color:C.blue},{stat:"$320M",desc:"median value at risk per enterprise project that lacks people-side change support.",color:C.orange}].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:14,padding:"14px 16px",background:C.white,border:`1px solid ${C.border}`,borderRadius:3}}>
                <div style={{fontSize:24,fontWeight:700,color:s.color,minWidth:58,letterSpacing:-1,flexShrink:0}}>{s.stat}</div>
                <div style={{fontSize:13,color:C.textLight,lineHeight:1.6}}>{s.desc}</div>
              </div>
            ))}
          </div>
          <Rule/>
          <SectionHeading>What qualifies for change management support?</SectionHeading>
          <div style={{border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
            {[{level:"Required",desc:"Changes affecting 1,000+ employees, or involving security controls, compliance obligations, or financial exposure greater than $100K.",color:C.red},{level:"Recommended",desc:"Changes affecting 200–999 employees, or introducing new tools, workflows, or third-party integrations.",color:C.orange},{level:"Optional",desc:"Changes with limited scope and low disruption risk — the ECMO can advise on a lighter-touch approach.",color:C.blue}].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"12px 16px",background:C.white,borderBottom:i<2?`1px solid ${C.border}`:"none",borderLeft:`3px solid ${r.color}`}}>
                <span style={{fontSize:12,fontWeight:700,color:r.color,background:r.color+"14",padding:"2px 8px",borderRadius:2,flexShrink:0,marginTop:1}}>{r.level}</span>
                <span style={{fontSize:13,color:C.textMid,lineHeight:1.55}}>{r.desc}</span>
              </div>
            ))}
          </div>
        </div>}
        {tab==="adkar"&&<div>
          <SectionHeading>The Prosci ADKAR model</SectionHeading>
          <p style={{fontSize:14,color:C.textMid,lineHeight:1.75,margin:"0 0 20px"}}>ADKAR describes the five building blocks required for successful individual and organizational change. Each must be achieved in sequence.</p>
          <div style={{border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden",marginBottom:18}}>
            {ADKAR_LANDING.map((item,i)=>{const open=openADKAR===item.key;return(
              <div key={item.key} style={{borderBottom:i<ADKAR_LANDING.length-1?`1px solid ${C.border}`:"none"}}>
                <button onClick={()=>setOpenADKAR(open?null:item.key)} style={{width:"100%",display:"flex",alignItems:"center",gap:14,padding:"13px 18px",cursor:"pointer",background:open?item.bg:C.white,border:"none",textAlign:"left",fontFamily:"'Segoe UI',sans-serif"}}
                  onMouseEnter={e=>{if(!open)e.currentTarget.style.background=C.bgMid;}} onMouseLeave={e=>{if(!open)e.currentTarget.style.background=C.white;}}>
                  <div style={{width:34,height:34,borderRadius:"50%",border:`2px solid ${open?item.color:C.borderMid}`,background:open?item.color:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:15,fontWeight:800,color:open?C.white:item.color,fontFamily:"Georgia,serif"}}>{item.letter}</span>
                  </div>
                  <div style={{flex:1}}><span style={{fontSize:14,fontWeight:600,color:open?item.color:C.text}}>{item.word}</span><span style={{fontSize:12.5,color:C.textLight,marginLeft:10}}>— {item.tagline}</span></div>
                  <span style={{fontSize:13,color:C.textMuted,transform:open?"rotate(180deg)":"none",transition:"transform 0.15s"}}>▾</span>
                </button>
                {open&&<div style={{padding:"2px 18px 16px 66px",background:item.bg,borderTop:`1px solid ${item.border}`}}><p style={{margin:"12px 0 0",fontSize:13.5,color:C.textMid,lineHeight:1.7}}>{item.desc}</p></div>}
              </div>
            );})}
          </div>
        </div>}
        {tab==="process"&&<div>
          <SectionHeading>End-to-end process</SectionHeading>
          <div style={{border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
            {[{n:1,title:"Submit intake form",desc:"Complete the structured change request — scope, risk, timeline, cost, and stakeholder data.",action:"Open form",id:"intake"},{n:2,title:"AI generates ADKAR plan",desc:"All five ADKAR sections are pre-populated from your intake. Review, edit, and agree section by section."},{n:3,title:"Tiered leadership approval",desc:"The plan routes to required approvers. Approvers may ask questions inline. Respond and resubmit."},{n:4,title:"Project execution begins",desc:"Approved plans go active. Status tracks against the linked project schedule in real time."},{n:5,title:"Portfolio and dashboard oversight",desc:"All active changes are visible in the executive dashboard.",action:"View dashboard",id:"dashboard"}].map((step,i,arr)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 18px",background:C.white,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:C.purple,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><span style={{fontSize:11,fontWeight:700,color:C.white}}>{step.n}</span></div>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:2}}>{step.title}</div><div style={{fontSize:13,color:C.textLight,lineHeight:1.6}}>{step.desc}</div></div>
                {step.action&&<button onClick={()=>navigate(step.id)} style={{flexShrink:0,padding:"5px 12px",fontSize:12,fontWeight:600,color:C.purple,background:C.white,border:`1px solid ${C.purpleBorder}`,borderRadius:2,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif"}}>{step.action} →</button>}
              </div>
            ))}
          </div>
        </div>}
        {tab==="team"&&<div>
          <SectionHeading>Enterprise Change Management Office</SectionHeading>
          <p style={{fontSize:13,color:C.textMuted,margin:"0 0 20px"}}>Questions? Email <a href="mailto:changemanagement@contoso.com" style={{color:C.purple}}>changemanagement@contoso.com</a> or message us on Teams.</p>
          <div style={{border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
            {TEAM_DATA.map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"16px 20px",background:C.white,borderBottom:i<TEAM_DATA.length-1?`1px solid ${C.border}`:"none"}}>
                <Avatar initials={p.initials} color={p.color} size={44}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:1}}>{p.name}</div>
                  <div style={{fontSize:13,color:C.purple,marginBottom:7}}>{p.role}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                    {p.areas.map((a,j)=><Chip key={j}>{a}</Chip>)}
                    <Chip color={C.textMuted}>🏅 {p.cert}</Chip>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <a href={`mailto:${p.email}`}
                      style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",fontSize:12,fontWeight:600,color:C.blue,background:C.blueLight,border:`1px solid ${C.blueBorder}`,borderRadius:2,textDecoration:"none",cursor:"pointer"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#dff0fd"} onMouseLeave={e=>e.currentTarget.style.background=C.blueLight}>
                      ✉ Email
                    </a>
                    <a href={`https://teams.microsoft.com/l/chat/0/0?users=${p.email}`} target="_blank" rel="noopener noreferrer"
                      style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",fontSize:12,fontWeight:600,color:C.purple,background:C.purpleLight,border:`1px solid ${C.purpleBorder}`,borderRadius:2,textDecoration:"none",cursor:"pointer"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#ede0f9"} onMouseLeave={e=>e.currentTarget.style.background=C.purpleLight}>
                      💬 Teams
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}
        {tab==="faq"&&<div>
          <SectionHeading>Frequently asked questions</SectionHeading>
          <div style={{border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
            {FAQS.map((item,i)=>{const open=openFAQ===i;return(
              <div key={i} style={{borderBottom:i<FAQS.length-1?`1px solid ${C.border}`:"none"}}>
                <button onClick={()=>setOpenFAQ(open?null:i)} style={{width:"100%",display:"flex",alignItems:"flex-start",gap:12,padding:"13px 18px",cursor:"pointer",background:open?C.purpleLight:C.white,border:"none",textAlign:"left",fontFamily:"'Segoe UI',sans-serif"}}
                  onMouseEnter={e=>{if(!open)e.currentTarget.style.background=C.bgMid;}} onMouseLeave={e=>{if(!open)e.currentTarget.style.background=C.white;}}>
                  <span style={{fontSize:14,color:open?C.purple:C.textMuted,flexShrink:0,marginTop:1,transform:open?"rotate(180deg)":"none",transition:"transform 0.15s"}}>▾</span>
                  <span style={{fontSize:14,fontWeight:open?600:500,color:open?C.purple:C.text,lineHeight:1.45}}>{item.q}</span>
                </button>
                {open&&<div style={{padding:"0 18px 16px 44px",background:C.purpleLight,borderTop:`1px solid ${C.purpleBorder}`}}><p style={{margin:"12px 0 0",fontSize:13.5,color:C.textMid,lineHeight:1.75}}>{item.a}</p></div>}
              </div>
            );})}
          </div>
        </div>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,padding:"16px 18px"}}>
          <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:10}}>About the ECMO</div>
          <p style={{margin:"0 0 10px",fontSize:13,color:C.textLight,lineHeight:1.65}}>The ECMO operates under the Prosci ADKAR framework within the Office of Technology.</p>
          <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>📬 <a href="mailto:changemanagement@contoso.com" style={{color:C.purple}}>changemanagement@contoso.com</a></div>
          <div style={{fontSize:12,color:C.textMuted}}>📍 Building 4, Floor 3 · Redmond, WA</div>
        </div>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
          <div style={{padding:"11px 16px",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:13,fontWeight:600,color:C.text}}>Resources</span></div>
          {[["adkar-guide","ADKAR Quick Reference Guide"],["threshold","Change Threshold Decision Tree"],["comms-templates","Communication Plan Templates"],["resistance","Resistance Management Playbook"],["intake-instructions","Intake Form — Instructions"],["prosci","Prosci ADKAR Overview"]].map(([key,label],i,arr)=>(
            <div key={key} onClick={()=>openDoc(key)} style={{padding:"9px 16px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.bgMid} onMouseLeave={e=>e.currentTarget.style.background=C.white}>
              <span style={{fontSize:13,color:C.purple,fontWeight:500}}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
          <div style={{padding:"11px 16px",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:13,fontWeight:600,color:C.text}}>Program highlights</span></div>
          {[["Changes managed to date","47"],["Average approval cycle time","9 days"],["Adoption rate across projects","91%"],["Active certified CM leads","5"]].map(([label,value],i,arr)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 16px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
              <span style={{fontSize:12.5,color:C.textLight}}>{label}</span>
              <span style={{fontSize:13,fontWeight:700,color:C.text}}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>;
}

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
function Dashboard({projects,navigate,openDoc,archiveProject}){
  const [tab,setTab]=useState("orgs");
  const [expandedOrgs,setExpandedOrgs]=useState(new Set());
  const [expandedRisks,setExpandedRisks]=useState(new Set());
  const [expandedTypes,setExpandedTypes]=useState(new Set());
  const [expandedCompleted,setExpandedCompleted]=useState(new Set());
  const toggleOrg=id=>setExpandedOrgs(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleRisk=id=>setExpandedRisks(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleType=id=>setExpandedTypes(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleCompleted=id=>setExpandedCompleted(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  const DASH_TABS=[["orgs","By Organization"],["health","Portfolio Health"],["risk","Risk View"],["changetype","Change Type"],["completed","Completed"]];

  const completedProjects=projects.filter(p=>p.status==="completed");
  const activeProjects=projects.filter(p=>p.status!=="completed");// used for orgs/risk/changetype
  const total=projects.length;
  const activeCount=projects.filter(p=>p.status.startsWith("active")).length;
  const attn=projects.filter(p=>["active_behind","changes_requested"].includes(p.status));
  const completed=completedProjects.length;
  const pendingQ=projects.flatMap(p=>p.approvals.flatMap(a=>a.questions.filter(q=>!q.resolved))).length;
  const newProjects=projects.filter(p=>!INITIAL_PROJECTS.some(ip=>ip.id===p.id));
  const statusCounts=activeProjects.reduce((acc,p)=>({...acc,[p.status]:(acc[p.status]||0)+1}),{});
  const riskCounts=activeProjects.reduce((acc,p)=>({...acc,[p.riskLevel]:(acc[p.riskLevel]||0)+1}),{});
  const typeCounts=activeProjects.reduce((acc,p)=>({...acc,[p.changeType]:(acc[p.changeType]||0)+1}),{});

  const getProjectOrgs=pid=>ORGS.filter(o=>o.ids.includes(pid)).map(o=>o.name).join(", ")||"—";

  const KPI=[
    {v:total,label:"Total Requests",color:C.blue,filter:"all"},
    {v:activeCount,label:"Active Projects",color:C.teal,filter:"active"},
    {v:attn.length,label:"Need Attention",color:C.red,filter:"attention"},
    {v:completed,label:"Completed",color:C.green,filter:"completed"},
    {v:pendingQ,label:"Open Approver Questions",color:C.orange,filter:"pending"},
  ];

  const RISK_TIERS=[
    {key:"critical",label:"Critical Risk",color:C.red,bg:C.redLight},
    {key:"high",label:"High Risk",color:C.orange,bg:C.orangeLight},
    {key:"medium",label:"Medium Risk",color:C.blue,bg:C.blueLight},
    {key:"low",label:"Low Risk",color:C.green,bg:C.greenLight},
  ];

  return <div style={{minHeight:"calc(100vh - 44px)",background:C.bg,fontFamily:"'Segoe UI',Tahoma,sans-serif"}}>
    <div style={{background:C.white,borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:1180,margin:"0 auto",padding:"0 32px"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,paddingTop:16,marginBottom:14,fontSize:12,color:C.textMuted}}>
          <button onClick={()=>navigate("home")} style={{background:"none",border:"none",color:C.purple,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontSize:12,padding:0}}>Home</button><span>›</span>
          <span style={{color:C.textMid,fontWeight:600}}>Executive Dashboard</span>
        </div>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:32,paddingBottom:18}}>
          <div>
            <h1 style={{margin:"0 0 4px",fontSize:26,fontWeight:600,color:C.text}}>Executive Dashboard</h1>
            <p style={{margin:0,fontSize:13.5,color:C.textLight}}>Change impact across {total} requests · Live view</p>
          </div>
          {newProjects.length>0&&<div style={{background:C.greenLight,border:`1px solid ${C.greenBorder}`,borderRadius:3,padding:"8px 14px",fontSize:12.5,color:C.green,fontWeight:600,flexShrink:0}}>{newProjects.length} new project{newProjects.length>1?"s":""} added since baseline</div>}
        </div>
      </div>
    </div>

    <div style={{maxWidth:1180,margin:"0 auto",padding:"22px 32px 80px"}}>
      {/* KPI strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:18}}>
        {KPI.map((k,i)=>(
          <div key={i} onClick={()=>navigate("portfolio",{filter:k.filter})} style={{background:C.white,borderRadius:3,padding:"14px 16px",border:`1px solid ${C.border}`,borderTop:`3px solid ${k.color}`,cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,0.1)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{fontSize:28,fontWeight:700,color:k.color,letterSpacing:-1}}>{k.v}</div>
            <div style={{fontSize:12,fontWeight:600,color:C.textMid,marginTop:3}}>{k.label}</div>
            <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>View in portfolio →</div>
          </div>
        ))}
      </div>

      {/* Attention banner */}
      {attn.length>0&&<div style={{background:C.redLight,border:`1px solid ${C.red}33`,borderRadius:3,padding:"12px 16px",marginBottom:18}}>
        <div style={{fontSize:13,fontWeight:700,color:C.red,marginBottom:8}}>{attn.length} project{attn.length>1?"s":""} require attention</div>
        {attn.map(p=>{const sc=STATUS_CFG[p.status]||{};return(
          <div key={p.id} onClick={()=>navigate("portfolio",{projectId:p.id})} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 10px",marginBottom:4,background:C.white,border:`1px solid ${C.border}`,borderLeft:`3px solid ${sc.color}`,borderRadius:3,cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.bgMid} onMouseLeave={e=>e.currentTarget.style.background=C.white}>
            <code style={{fontFamily:"monospace",fontSize:11,color:C.textMuted,flexShrink:0}}>{p.id}</code>
            <div style={{flex:1}}><span style={{fontSize:13,fontWeight:600,color:C.text}}>{p.title}</span><span style={{fontSize:12,color:C.textLight,marginLeft:10}}>{p.projectProgress.note}</span></div>
            <Pill label={sc.label} color={sc.color} bg={sc.bg}/>
            <span style={{fontSize:13,color:C.textMuted}}>›</span>
          </div>
        );})}
      </div>}

      <div style={{display:"flex",gap:18,alignItems:"flex-start"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:"3px 3px 0 0",borderBottom:"none"}}><TabBar tabs={DASH_TABS} active={tab} onChange={setTab}/></div>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderTop:"none",borderRadius:"0 0 3px 3px",overflow:"hidden"}}>

            {/* BY ORG TAB */}
            {tab==="orgs"&&<div>
              {newProjects.length>0&&<div style={{borderBottom:`1px solid ${C.border}`}}>
                <div style={{padding:"12px 18px",background:C.greenLight,borderLeft:`4px solid ${C.green}`}}><div style={{fontSize:13,fontWeight:600,color:C.green}}>Newly Submitted Projects</div></div>
                {newProjects.map(p=>{const sc=STATUS_CFG[p.status]||{};return(
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 18px",borderTop:`1px solid ${C.border}`,background:C.bgMid}}>
                    <code style={{fontSize:10,fontFamily:"monospace",color:C.textMuted}}>{p.id}</code>
                    <div style={{flex:1,fontSize:13,fontWeight:600,color:C.text}}>{p.title}</div>
                    <Pill label={sc.label} color={sc.color} bg={sc.bg}/>
                    <button onClick={()=>navigate("portfolio",{projectId:p.id})} style={{fontSize:11,color:C.green,background:C.greenLight,border:`1px solid ${C.greenBorder}`,borderRadius:2,padding:"3px 10px",cursor:"pointer",fontFamily:"'Segoe UI',sans-serif"}}>View plan →</button>
                  </div>
                );})}
              </div>}
              {[...ORGS].sort((a,b)=>{
                const an=activeProjects.filter(p=>a.ids.includes(p.id)&&["active_behind","changes_requested"].includes(p.status)).length;
                const bn=activeProjects.filter(p=>b.ids.includes(p.id)&&["active_behind","changes_requested"].includes(p.status)).length;
                return bn-an;
              }).map((org,oi,arr)=>{
                const orgProjects=activeProjects.filter(p=>org.ids.includes(p.id));
                if(!orgProjects.length)return null;
                const needAttn=orgProjects.filter(p=>["active_behind","changes_requested"].includes(p.status));
                const expanded=expandedOrgs.has(org.id);
                return <div key={org.id} style={{borderBottom:oi<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <div onClick={()=>toggleOrg(org.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",cursor:"pointer",borderLeft:`4px solid ${org.color}`,background:expanded?org.color+"08":C.white}}
                    onMouseEnter={e=>e.currentTarget.style.background=expanded?org.color+"08":C.bgMid}
                    onMouseLeave={e=>e.currentTarget.style.background=expanded?org.color+"08":C.white}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:expanded?3:0}}>
                        <strong style={{fontSize:13.5,color:C.text,whiteSpace:"nowrap"}}>{org.name}</strong>
                        {needAttn.length>0&&<span style={{fontSize:11,fontWeight:700,color:C.red,background:C.redLight,padding:"1px 8px",borderRadius:10,whiteSpace:"nowrap",flexShrink:0}}>{needAttn.length} need{needAttn.length>1?"":"s"} attention</span>}
                      </div>
                      {expanded&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:3}}>
                        {Object.entries(orgProjects.reduce((a,p)=>({...a,[p.status]:(a[p.status]||0)+1}),{})).map(([st,n])=>{const sc=STATUS_CFG[st]||{};return <Pill key={st} label={`${n} ${sc.label}`} color={sc.color} bg={sc.bg} size={10}/>;})}</div>}
                    </div>
                    <div style={{fontSize:12,color:C.textMuted,flexShrink:0}}>{orgProjects.length} project{orgProjects.length!==1?"s":""}</div>
                    <span style={{fontSize:14,color:C.textMuted,transform:expanded?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>▾</span>
                  </div>
                  {expanded&&orgProjects.map(p=>{const sc=STATUS_CFG[p.status]||{};const hi=needAttn.some(n=>n.id===p.id);return(
                    <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 18px",borderTop:`1px solid ${C.border}`,background:hi?C.orangeLight+"55":C.bgMid,flexWrap:"wrap"}}>
                      <StatusDot status={p.status}/>
                      <code style={{fontSize:10,fontFamily:"monospace",color:C.textMuted,flexShrink:0}}>{p.id}</code>
                      <div style={{flex:1,minWidth:120}}><div style={{fontSize:13,fontWeight:600,color:C.text}}>{p.title}</div><div style={{fontSize:11,color:C.textMuted}}>{p.owner}</div></div>
                      <Pill label={sc.label} color={sc.color} bg={sc.bg}/>
                      {p.projectProgress.pct>0&&<div style={{width:54}}><div style={{height:3,background:C.border,borderRadius:2}}><div style={{height:"100%",width:`${p.projectProgress.pct}%`,background:sc.color}}/></div><div style={{fontSize:9,color:sc.color,fontWeight:700}}>{p.projectProgress.pct}%</div></div>}
                      <div style={{fontSize:11,color:C.textMuted}}>{p.approvals.filter(a=>a.status==="approved").length}/{p.approvals.length} approvals</div>
                      <button onClick={()=>navigate("portfolio",{projectId:p.id})} style={{fontSize:11,color:org.color,background:org.color+"14",border:`1px solid ${org.color}33`,borderRadius:2,padding:"3px 9px",cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontWeight:700}}>View plan →</button>
                    </div>
                  );})}
                </div>;
              })}
            </div>}

            {/* HEALTH TAB */}
            {tab==="health"&&<div style={{padding:"20px 24px"}}>
              <SectionHeading>Status breakdown (active projects)</SectionHeading>
              <div style={{border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden",marginBottom:24}}>
                {Object.entries(statusCounts).map(([s,n],i,arr)=>{const sc=STATUS_CFG[s]||{};return(
                  <div key={s} onClick={()=>navigate("portfolio",{filter:["active_behind","changes_requested"].includes(s)?"attention":s.startsWith("active")?"active":["submitted","partially_approved","changes_requested"].includes(s)?"pending":"all"})}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bgMid} onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                    <StatusDot status={s}/>
                    <span style={{flex:1,fontSize:13,fontWeight:500,color:sc.color}}>{sc.label}</span>
                    <div style={{width:28,height:28,borderRadius:"50%",background:sc.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:sc.color}}>{n}</div>
                    <span style={{fontSize:12,color:C.textMuted}}>View →</span>
                  </div>
                );})}
              </div>
              <SectionHeading>Open approver questions</SectionHeading>
              {projects.flatMap(p=>p.approvals.flatMap(a=>a.questions.filter(q=>!q.resolved).map(q=>({proj:p,approver:a,question:q})))).length===0?(
                <div style={{padding:"24px",textAlign:"center",color:C.green,fontSize:14,background:C.greenLight,border:`1px solid ${C.greenBorder}`,borderRadius:3}}>All approver questions have been resolved.</div>
              ):(
                <div style={{border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
                  {projects.flatMap(p=>p.approvals.flatMap(a=>a.questions.filter(q=>!q.resolved).map(q=>({proj:p,approver:a,question:q})))).map(({proj,approver,question},i,arr)=>(
                    <div key={question.id} style={{padding:"12px 16px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,color:C.textMuted,marginBottom:3}}><code style={{fontFamily:"monospace"}}>{proj.id}</code> · {approver.name} ({approver.role})</div>
                          <div style={{fontSize:13,color:C.textMid}}>{question.text}</div>
                        </div>
                        <button onClick={()=>navigate("portfolio",{projectId:proj.id})} style={{flexShrink:0,fontSize:11,color:C.orange,background:C.orangeLight,border:`1px solid ${C.orangeBorder}`,borderRadius:2,padding:"4px 10px",cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontWeight:700}}>Respond →</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>}

            {/* RISK VIEW TAB — grouped, all collapsed by default, excludes completed */}
            {tab==="risk"&&<div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,borderBottom:`1px solid ${C.border}`}}>
                {RISK_TIERS.map((rt,i)=>{const n=activeProjects.filter(p=>p.riskLevel===rt.key).length;return(
                  <div key={rt.key} style={{padding:"14px 18px",borderRight:i<3?`1px solid ${C.border}`:"none",background:rt.bg+"55"}}>
                    <div style={{fontSize:22,fontWeight:700,color:rt.color}}>{n}</div>
                    <div style={{fontSize:12,fontWeight:700,color:rt.color}}>{rt.label}</div>
                  </div>
                );})}
              </div>
              {RISK_TIERS.map((rt,rdi,rtArr)=>{
                const tierProjects=activeProjects.filter(p=>p.riskLevel===rt.key);
                if(!tierProjects.length)return null;
                const expanded=expandedRisks.has(rt.key);
                const needAttn=tierProjects.filter(p=>["active_behind","changes_requested"].includes(p.status));
                return <div key={rt.key} style={{borderBottom:rdi<rtArr.length-1?`1px solid ${C.border}`:"none"}}>
                  <div onClick={()=>toggleRisk(rt.key)} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",cursor:"pointer",borderLeft:`4px solid ${rt.color}`,background:expanded?rt.color+"08":C.white}}
                    onMouseEnter={e=>e.currentTarget.style.background=expanded?rt.color+"08":C.bgMid}
                    onMouseLeave={e=>e.currentTarget.style.background=expanded?rt.color+"08":C.white}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:expanded?3:0}}>
                        <strong style={{fontSize:13.5,color:rt.color}}>{rt.label}</strong>
                        {needAttn.length>0&&<span style={{fontSize:11,fontWeight:700,color:C.red,background:C.redLight,padding:"1px 8px",borderRadius:10,whiteSpace:"nowrap",flexShrink:0}}>{needAttn.length} need{needAttn.length>1?"":"s"} attention</span>}
                      </div>
                      {expanded&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:3}}>
                        {Object.entries(tierProjects.reduce((a,p)=>({...a,[p.status]:(a[p.status]||0)+1}),{})).map(([st,n])=>{const sc=STATUS_CFG[st]||{};return <Pill key={st} label={`${n} ${sc.label}`} color={sc.color} bg={sc.bg} size={10}/>;})}
                      </div>}
                    </div>
                    <div style={{fontSize:12,color:C.textMuted,flexShrink:0}}>{tierProjects.length} project{tierProjects.length!==1?"s":""}</div>
                    <span style={{fontSize:14,color:C.textMuted,transform:expanded?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>▾</span>
                  </div>
                  {expanded&&<div>
                    <div style={{display:"grid",gridTemplateColumns:"110px 1fr 120px 95px 140px 145px",background:C.bgMid,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
                      {["Status","Project","Change Type","Cost","Fin. Benefit","Org Affected"].map(h=><div key={h} style={{padding:"7px 10px",fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:0.3}}>{h}</div>)}
                    </div>
                    {tierProjects.map((p,i,arr)=>{
                      const sc=STATUS_CFG[p.status]||{};const tc=TYPE_CFG[p.changeType]||{};
                      const hi=needAttn.some(n=>n.id===p.id);
                      return <div key={p.id} onClick={()=>navigate("portfolio",{projectId:p.id})}
                        style={{display:"grid",gridTemplateColumns:"110px 1fr 120px 95px 140px 145px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",background:hi?C.orangeLight+"44":C.white}}
                        onMouseEnter={e=>e.currentTarget.style.background=hi?C.orangeLight+"88":C.bgMid}
                        onMouseLeave={e=>e.currentTarget.style.background=hi?C.orangeLight+"44":C.white}>
                        {/* Status — wraps instead of overflows */}
                        <div style={{padding:"10px 10px",display:"flex",alignItems:"flex-start",paddingTop:12}}>
                          <span style={{fontSize:11,fontWeight:700,color:sc.color,background:sc.bg,padding:"2px 7px",borderRadius:10,lineHeight:1.4,display:"inline-block"}}>{sc.label}</span>
                        </div>
                        <div style={{padding:"10px 10px"}}>
                          <code style={{fontSize:10,fontFamily:"monospace",color:C.textMuted}}>{p.id}</code>
                          <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.3}}>{p.title.split(" ").slice(0,7).join(" ")}{p.title.split(" ").length>7?"…":""}</div>
                          <div style={{fontSize:11,color:C.textMuted}}>{p.owner}</div>
                        </div>
                        <div style={{padding:"10px 10px",display:"flex",alignItems:"center"}}><Pill label={tc.label} color={tc.color} bg={tc.bg}/></div>
                        <div style={{padding:"10px 10px",fontSize:12,color:C.textLight,display:"flex",alignItems:"center"}}>{p.estimatedCost}</div>
                        <div style={{padding:"10px 10px",fontSize:11,color:C.green,fontWeight:600,lineHeight:1.35,display:"flex",alignItems:"center"}}>{p.financialBenefits?(p.financialBenefits.split(".")[0]+"."):""}</div>
                        <div style={{padding:"10px 10px",fontSize:11,color:C.textLight,lineHeight:1.35,display:"flex",alignItems:"center"}}>{getProjectOrgs(p.id).split(", ").slice(0,2).join(", ")}</div>
                      </div>;
                    })}
                  </div>}
                </div>;
              })}
            </div>}

            {/* CHANGE TYPE TAB — grouped accordion like Risk View, excludes completed */}
            {tab==="changetype"&&<div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,borderBottom:`1px solid ${C.border}`}}>
                {Object.entries(TYPE_CFG).map(([t,tc],i)=>{const n=typeCounts[t]||0;return(
                  <div key={t} style={{padding:"14px 18px",borderRight:i<3?`1px solid ${C.border}`:"none",background:tc.bg+"88"}}>
                    <div style={{fontSize:22,fontWeight:700,color:tc.color}}>{n}</div>
                    <div style={{fontSize:12,fontWeight:700,color:tc.color}}>{tc.label}</div>
                  </div>
                );})}
              </div>
              {Object.entries(TYPE_CFG).map(([t,tc],tdi,tArr)=>{
                const typeProjects=activeProjects.filter(p=>p.changeType===t);
                if(!typeProjects.length)return null;
                const expanded=expandedTypes.has(t);
                const needAttn=typeProjects.filter(p=>["active_behind","changes_requested"].includes(p.status));
                return <div key={t} style={{borderBottom:tdi<tArr.length-1?`1px solid ${C.border}`:"none"}}>
                  <div onClick={()=>toggleType(t)} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",cursor:"pointer",borderLeft:`4px solid ${tc.color}`,background:expanded?tc.color+"08":C.white}}
                    onMouseEnter={e=>e.currentTarget.style.background=expanded?tc.color+"08":C.bgMid}
                    onMouseLeave={e=>e.currentTarget.style.background=expanded?tc.color+"08":C.white}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:expanded?3:0}}>
                        <Pill label={tc.label} color={tc.color} bg={tc.bg}/>
                        {needAttn.length>0&&<span style={{fontSize:11,fontWeight:700,color:C.red,background:C.redLight,padding:"1px 8px",borderRadius:10,whiteSpace:"nowrap",flexShrink:0}}>{needAttn.length} need{needAttn.length>1?"":"s"} attention</span>}
                      </div>
                      {expanded&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:3}}>
                        {Object.entries(typeProjects.reduce((a,p)=>({...a,[p.status]:(a[p.status]||0)+1}),{})).map(([st,n])=>{const sc=STATUS_CFG[st]||{};return <Pill key={st} label={`${n} ${sc.label}`} color={sc.color} bg={sc.bg} size={10}/>;})}
                      </div>}
                    </div>
                    <div style={{fontSize:12,color:C.textMuted,flexShrink:0}}>{typeProjects.length} project{typeProjects.length!==1?"s":""}</div>
                    <span style={{fontSize:14,color:C.textMuted,transform:expanded?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>▾</span>
                  </div>
                  {expanded&&<div>
                    <div style={{display:"grid",gridTemplateColumns:"110px 1fr 110px 95px 140px 145px",background:C.bgMid,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
                      {["Status","Project","Priority","Cost","Fin. Benefit","Org Affected"].map(h=><div key={h} style={{padding:"7px 10px",fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:0.3}}>{h}</div>)}
                    </div>
                    {typeProjects.map((p,i,arr)=>{
                      const sc=STATUS_CFG[p.status]||{};const pc=PRI_CFG[p.priority]||{};
                      const hi=needAttn.some(n=>n.id===p.id);
                      return <div key={p.id} onClick={()=>navigate("portfolio",{projectId:p.id})}
                        style={{display:"grid",gridTemplateColumns:"110px 1fr 110px 95px 140px 145px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",background:hi?C.orangeLight+"44":C.white}}
                        onMouseEnter={e=>e.currentTarget.style.background=hi?C.orangeLight+"88":C.bgMid}
                        onMouseLeave={e=>e.currentTarget.style.background=hi?C.orangeLight+"44":C.white}>
                        <div style={{padding:"10px 10px",display:"flex",alignItems:"flex-start",paddingTop:12}}>
                          <span style={{fontSize:11,fontWeight:700,color:sc.color,background:sc.bg,padding:"2px 7px",borderRadius:10,lineHeight:1.4,display:"inline-block"}}>{sc.label}</span>
                        </div>
                        <div style={{padding:"10px 10px"}}>
                          <code style={{fontSize:10,fontFamily:"monospace",color:C.textMuted}}>{p.id}</code>
                          <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.3}}>{p.title.split(" ").slice(0,7).join(" ")}{p.title.split(" ").length>7?"…":""}</div>
                          <div style={{fontSize:11,color:C.textMuted}}>{p.owner}</div>
                        </div>
                        <div style={{padding:"10px 10px",display:"flex",alignItems:"center"}}><Pill label={pc.label} color={pc.color} bg={pc.bg}/></div>
                        <div style={{padding:"10px 10px",fontSize:12,color:C.textLight,display:"flex",alignItems:"center"}}>{p.estimatedCost}</div>
                        <div style={{padding:"10px 10px",fontSize:11,color:C.green,fontWeight:600,lineHeight:1.35,display:"flex",alignItems:"center"}}>{p.financialBenefits?(p.financialBenefits.split(".")[0]+"."):""}</div>
                        <div style={{padding:"10px 10px",fontSize:11,color:C.textLight,lineHeight:1.35,display:"flex",alignItems:"center"}}>{getProjectOrgs(p.id).split(", ").slice(0,2).join(", ")}</div>
                      </div>;
                    })}
                  </div>}
                </div>;
              })}
            </div>}

            {/* COMPLETED TAB */}
            {tab==="completed"&&<div>
              {completedProjects.length===0?(
                <div style={{padding:"40px",textAlign:"center",color:C.textMuted,fontSize:14}}>No completed projects yet.</div>
              ):<div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,borderBottom:`1px solid ${C.border}`}}>
                  {Object.entries(TYPE_CFG).map(([t,tc],i)=>{const n=completedProjects.filter(p=>p.changeType===t).length;return(
                    <div key={t} style={{padding:"14px 18px",borderRight:i<3?`1px solid ${C.border}`:"none",background:tc.bg+"88"}}>
                      <div style={{fontSize:22,fontWeight:700,color:tc.color}}>{n}</div>
                      <div style={{fontSize:12,fontWeight:700,color:tc.color}}>{tc.label}</div>
                    </div>
                  );})}
                </div>
                {/* Group completed by change type */}
                {Object.entries(TYPE_CFG).map(([t,tc],tdi,tArr)=>{
                  const grp=completedProjects.filter(p=>p.changeType===t);
                  if(!grp.length)return null;
                  const expanded=expandedCompleted.has(t);
                  return <div key={t} style={{borderBottom:tdi<tArr.length-1?`1px solid ${C.border}`:"none"}}>
                    <div onClick={()=>toggleCompleted(t)} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",cursor:"pointer",borderLeft:`4px solid ${tc.color}`,background:expanded?tc.color+"08":C.white}}
                      onMouseEnter={e=>e.currentTarget.style.background=expanded?tc.color+"08":C.bgMid}
                      onMouseLeave={e=>e.currentTarget.style.background=expanded?tc.color+"08":C.white}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <Pill label={tc.label} color={tc.color} bg={tc.bg}/>
                          <span style={{fontSize:12,color:C.textMuted}}>{grp.length} completed project{grp.length!==1?"s":""}</span>
                        </div>
                      </div>
                      <span style={{fontSize:14,color:C.textMuted,transform:expanded?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>▾</span>
                    </div>
                    {expanded&&<div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 100px 150px 155px 160px",background:C.bgMid,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
                        {["Project","Priority","Cost","Financial Benefit","Org Affected"].map(h=><div key={h} style={{padding:"7px 10px",fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:0.3}}>{h}</div>)}
                      </div>
                      {grp.map((p,i,arr)=>{
                        const pc=PRI_CFG[p.priority]||{};
                        return <div key={p.id} onClick={()=>navigate("portfolio",{projectId:p.id})}
                          style={{display:"grid",gridTemplateColumns:"1fr 100px 150px 155px 160px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",background:C.white}}
                          onMouseEnter={e=>e.currentTarget.style.background=C.bgMid}
                          onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                          <div style={{padding:"10px 12px"}}>
                            <code style={{fontSize:10,fontFamily:"monospace",color:C.textMuted}}>{p.id}</code>
                            <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.3}}>{p.title.split(" ").slice(0,7).join(" ")}{p.title.split(" ").length>7?"…":""}</div>
                            <div style={{fontSize:11,color:C.textMuted}}>{p.owner} · {p.endDate}</div>
                          </div>
                          <div style={{padding:"10px 10px",display:"flex",alignItems:"center"}}><Pill label={pc.label} color={pc.color} bg={pc.bg}/></div>
                          <div style={{padding:"10px 10px",fontSize:12,color:C.textLight,display:"flex",alignItems:"center"}}>{p.estimatedCost}</div>
                          <div style={{padding:"10px 10px",fontSize:11,color:C.green,fontWeight:600,lineHeight:1.35,display:"flex",alignItems:"center"}}>{p.financialBenefits?(p.financialBenefits.split(".")[0]+"."):""}</div>
                          <div style={{padding:"10px 10px",fontSize:11,color:C.textLight,lineHeight:1.35,display:"flex",alignItems:"center"}}>{getProjectOrgs(p.id).split(", ").slice(0,2).join(", ")}</div>
                        </div>;
                      })}
                    </div>}
                  </div>;
                })}
              </div>}
            </div>}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",gap:12,position:"sticky",top:68,alignSelf:"flex-start"}}>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
            <div style={{padding:"11px 16px",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:13,fontWeight:600,color:C.text}}>Portfolio Health</span></div>
            {Object.entries(statusCounts).map(([s,n])=>{const sc=STATUS_CFG[s]||{};return(
              <div key={s} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",borderBottom:`1px solid ${C.border}`}}>
                <StatusDot status={s}/>
                <span style={{flex:1,fontSize:12,color:sc.color,fontWeight:500}}>{sc.label}</span>
                <span style={{fontSize:13,fontWeight:700,color:sc.color}}>{n}</span>
              </div>
            );})}
          </div>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
            <div style={{padding:"11px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>Risk Mix</span>
              <InfoBtn onClick={()=>openDoc("risk-levels")} title="What do the risk levels mean?"/>
            </div>
            {["critical","high","medium","low"].map(r=>{const n=projects.filter(p=>p.riskLevel===r).length;if(!n)return null;const c={critical:C.red,high:C.orange,medium:C.blue,low:C.green}[r];const lbl={critical:"Critical",high:"High",medium:"Medium",low:"Low"}[r];return(
              <div key={r} style={{padding:"9px 14px",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:c,fontWeight:600}}>{lbl}</span><span style={{fontSize:12,fontWeight:700,color:c}}>{n}</span></div>
                <div style={{height:4,background:C.border,borderRadius:2}}><div style={{height:"100%",width:`${Math.round(n/projects.length*100)}%`,background:c,borderRadius:2}}/></div>
              </div>
            );})}
          </div>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
            <div style={{padding:"11px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>Change Type Mix</span>
              <InfoBtn onClick={()=>openDoc("change-types")} title="What are the change types?"/>
            </div>
            {["standard","normal","expedited","emergency"].map(t=>{const n=projects.filter(p=>p.changeType===t).length;if(!n)return null;const tc=TYPE_CFG[t]||{};return(
              <div key={t} style={{padding:"9px 14px",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:tc.color,fontWeight:600}}>{tc.label}</span><span style={{fontSize:12,fontWeight:700,color:tc.color}}>{n}</span></div>
                <div style={{height:4,background:C.border,borderRadius:2}}><div style={{height:"100%",width:`${Math.round(n/projects.length*100)}%`,background:tc.color,borderRadius:2}}/></div>
              </div>
            );})}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

// ─── INTAKE FORM ─────────────────────────────────────────────────────────────
const FORM_SECTIONS=[
  {id:"requestor",title:"Requestor Information"},
  {id:"classification",title:"Change Classification"},
  {id:"impact",title:"Impact Assessment"},
  {id:"scope",title:"Scope & Timeline"},
  {id:"risk",title:"Risk Analysis"},
  {id:"cost",title:"Cost & Resources"},
  {id:"justification",title:"Business Justification"},
  {id:"approvals",title:"Approvals & Sign-offs"},
];
const sectionDefaults={
  requestor:{fullName:"",email:"",phone:"",department:"",jobTitle:"",manager:"",submissionDate:new Date().toISOString().split("T")[0]},
  classification:{changeTitle:"",changeType:"",changeCategory:"",changePriority:""},
  impact:{impactLevel:"",affectedSystems:[],userCount:"",affectedUnits:[],customerFacing:"",downtime:"",financialGain:"",financialGainType:[],financialGainEstimate:""},
  scope:{startDate:"",endDate:"",implementationWindow:"",rolloutApproach:"",affectedRegions:[],testingCompleted:"",changeScope:"",customerFacing2:"",teamsImpacted:[]},
  risk:{riskLevel:"",riskDescription:"",mitigationPlan:"",rollbackPlan:"",contingencyPlan:""},
  cost:{estimatedCost:"",costCategory:"",budgetSource:"",resourcesRequired:[],vendorInvolved:"",vendorName:""},
  justification:{businessProblem:"",proposedSolution:"",expectedBenefits:"",successMetrics:"",alternativesConsidered:"",stakeholders:""},
  approvals:{itApprover:"",businessApprover:"",securityReview:"",complianceReview:"",cabReview:"",additionalNotes:""},
};
const completionRules={
  requestor:["fullName","email","department","jobTitle"],
  classification:["changeTitle","changeType","changeCategory","changePriority"],
  impact:["impactLevel","userCount","customerFacing"],
  scope:["startDate","endDate","rolloutApproach","changeScope"],
  risk:["riskLevel","mitigationPlan"],
  cost:["estimatedCost","costCategory","budgetSource"],
  justification:["businessProblem","proposedSolution","expectedBenefits"],
  approvals:["itApprover","businessApprover"],
};
const makeInitialForm=()=>({
  fullName:"",email:"",phone:"",department:"",jobTitle:"",manager:"",
  submissionDate:new Date().toISOString().split("T")[0],
  changeTitle:"",changeType:"",changeCategory:"",changePriority:"",
  changeId:`CHG-${Date.now().toString().slice(-6)}`,
  impactLevel:"",affectedSystems:[],userCount:"",affectedUnits:[],customerFacing:"",downtime:"",
  financialGain:"",financialGainType:[],financialGainEstimate:"",
  startDate:"",endDate:"",implementationWindow:"",rolloutApproach:"",affectedRegions:[],testingCompleted:"",
  changeScope:"",customerFacing2:"",teamsImpacted:[],
  riskLevel:"",riskDescription:"",mitigationPlan:"",rollbackPlan:"",contingencyPlan:"",
  estimatedCost:"",costCategory:"",budgetSource:"",resourcesRequired:[],vendorInvolved:"",vendorName:"",
  businessProblem:"",proposedSolution:"",expectedBenefits:"",successMetrics:"",alternativesConsidered:"",stakeholders:"",
  itApprover:"",businessApprover:"",securityReview:"",complianceReview:"",cabReview:"",additionalNotes:"",
});
function getSectionCompletion(form,sid){
  const fields=completionRules[sid]||[];
  const filled=fields.filter(f=>{const v=form[f];return Array.isArray(v)?v.length>0:v&&v.trim()!=="";});
  return fields.length===0?0:Math.round(filled.length/fields.length*100);
}
// Auto-derive CAB review requirement from change type
function deriveCabReview(changeType){
  if(changeType==="standard") return "no";
  if(changeType==="emergency"||changeType==="expedited") return "expedited";
  if(changeType==="normal") return "yes";
  return "";
}

// Form primitives
function FLabel({label,required}){return <label style={{display:"block",fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>;}
function FHint({children}){return <p style={{fontSize:12,color:C.textLight,marginBottom:6,marginTop:0,lineHeight:1.5}}>{children}</p>;}
function FInput({label,value,onChange,type="text",required,hint,placeholder}){return <div style={{marginBottom:20}}><FLabel label={label} required={required}/>{hint&&<FHint>{hint}</FHint>}<input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"8px 12px",fontSize:14,border:`1px solid ${C.borderMid}`,borderRadius:2,background:C.white,color:C.text,outline:"none",boxSizing:"border-box",fontFamily:"'Segoe UI',sans-serif"}} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.borderMid}/></div>;}
function FSelect({label,value,onChange,options,required,hint}){return <div style={{marginBottom:20}}><FLabel label={label} required={required}/>{hint&&<FHint>{hint}</FHint>}<div style={{position:"relative"}}><select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"8px 32px 8px 12px",fontSize:14,border:`1px solid ${C.borderMid}`,borderRadius:2,background:C.white,color:value?C.text:C.textLight,appearance:"none",cursor:"pointer",outline:"none",fontFamily:"'Segoe UI',sans-serif"}} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.borderMid}><option value="">Select an option</option>{options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}</select><span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:C.textMuted,fontSize:10}}>▼</span></div></div>;}
function FTextarea({label,value,onChange,required,hint,placeholder,rows=4}){return <div style={{marginBottom:20}}><FLabel label={label} required={required}/>{hint&&<FHint>{hint}</FHint>}<textarea value={value} rows={rows} placeholder={placeholder} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"8px 12px",fontSize:14,resize:"vertical",border:`1px solid ${C.borderMid}`,borderRadius:2,background:C.white,color:C.text,outline:"none",boxSizing:"border-box",fontFamily:"'Segoe UI',sans-serif",lineHeight:1.5}} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.borderMid}/></div>;}
function FCheckboxGroup({label,options,selected,onChange,hint}){
  const toggle=val=>onChange(selected.includes(val)?selected.filter(v=>v!==val):[...selected,val]);
  return <div style={{marginBottom:20}}><FLabel label={label}/>{hint&&<FHint>{hint}</FHint>}<div style={{display:"flex",flexWrap:"wrap",gap:8}}>{options.map(opt=>{const val=opt.value||opt;const lbl=opt.label||opt;const checked=selected.includes(val);return <div key={val} onClick={()=>toggle(val)} style={{padding:"6px 14px",borderRadius:2,fontSize:13,cursor:"pointer",border:`1px solid ${checked?C.blue:C.borderMid}`,background:checked?C.blueLight:C.white,color:checked?"#004578":C.text,fontWeight:checked?600:400,userSelect:"none"}}>{checked&&<span style={{marginRight:5}}>✓</span>}{lbl}</div>;})} </div></div>;
}
function FRadioGroup({label,options,value,onChange,required,hint,onInfo,locked,lockedNote}){
  return <div style={{marginBottom:20}}>
    <div style={{display:"flex",alignItems:"center",marginBottom:6,gap:4}}>
      <FLabel label={label} required={required}/>
      {onInfo&&<InfoBtn onClick={onInfo} title={`Learn about ${label.toLowerCase()}`}/>}
    </div>
    {hint&&<FHint>{hint}</FHint>}
    {locked?(
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{padding:"6px 14px",borderRadius:2,fontSize:13,border:`1px solid ${C.blue}`,background:C.blue,color:C.white,fontWeight:600}}>
          {options.find(o=>(o.value||o)===value)?.label||value}
        </div>
        {lockedNote&&<span style={{fontSize:12,color:C.textMuted,fontStyle:"italic"}}>{lockedNote}</span>}
      </div>
    ):(
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {options.map(opt=>{const val=opt.value||opt;const lbl=opt.label||opt;const checked=value===val;return <div key={val} onClick={()=>onChange(checked?"":val)} style={{padding:"6px 14px",borderRadius:2,fontSize:13,cursor:"pointer",border:`1px solid ${checked?C.blue:C.borderMid}`,background:checked?C.blue:C.white,color:checked?C.white:C.text,fontWeight:checked?600:400,userSelect:"none"}}>{lbl}</div>;})}
      </div>
    )}
  </div>;
}
function FTwoCol({children}){return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 24px"}}>{children}</div>;}
function FDivider({label}){return <div style={{display:"flex",alignItems:"center",gap:12,margin:"8px 0 20px"}}><span style={{fontSize:12,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:0.5,whiteSpace:"nowrap"}}>{label}</span><div style={{flex:1,height:1,background:C.border}}/></div>;}
function FSectionCard({id,title,sectionRef,onClear,children}){
  const [confirmClear,setConfirmClear]=useState(false);
  const handleClear=()=>{if(confirmClear){onClear();setConfirmClear(false);}else{setConfirmClear(true);setTimeout(()=>setConfirmClear(false),3000);}};
  return <div ref={el=>{if(sectionRef)sectionRef.current[id]=el;}} data-section={id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,padding:"24px 28px",marginBottom:16}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22,paddingBottom:12,borderBottom:`2px solid ${C.blueLight}`}}>
      <h2 style={{fontSize:17,fontWeight:600,color:C.blue,margin:0}}>{title}</h2>
      {onClear&&<button onClick={handleClear} style={{padding:"4px 12px",fontSize:12,cursor:"pointer",borderRadius:2,border:`1px solid ${confirmClear?C.red:C.borderMid}`,background:confirmClear?C.redLight:C.white,color:confirmClear?C.red:C.textLight,fontFamily:"'Segoe UI',sans-serif",fontWeight:confirmClear?600:400}}>{confirmClear?"⚠ Confirm Clear":"Clear Section"}</button>}
    </div>
    {children}
  </div>;
}

const DEMO_FORM_DATA=[
  {
    fullName:"Marcus Rivera",email:"mrivera@contoso.com",phone:"425-555-0182",department:"Corporate IT",jobTitle:"Senior IT Program Manager",manager:"Sandra Okafor",
    changeTitle:"Zero-Trust Network Segmentation — Phase 2",changeType:"normal",changeCategory:"Network & Connectivity",changePriority:"high",
    impactLevel:"major",userCount:"1,001–10,000",affectedSystems:["Networking / Firewall","Active Directory / Entra ID","Security Tools"],affectedUnits:["All Business Units","Security","Operations"],customerFacing:"no",downtime:"4–8 hours",
    financialGain:"yes",financialGainType:["Cost avoidance","Cost savings / reduction"],financialGainEstimate:"$1M–$5M",
    startDate:"2025-07-01",endDate:"2025-10-31",implementationWindow:"Weekend — Saturday",rolloutApproach:"phased",affectedRegions:["North America","EMEA (Europe, Middle East, Africa)"],testingCompleted:"partial",
    changeScope:"enterprise",customerFacing2:"no",teamsImpacted:["IT / Technology","Security team"],
    riskLevel:"high",riskDescription:"Misconfigured ACLs could disrupt cross-segment traffic. Legacy devices may not support 802.1X port authentication.",mitigationPlan:"Run 4-week pilot in isolated lab. Automated rollback scripts ready. Tier-1 helpdesk surge staffing planned.",rollbackPlan:"VLAN revert scripts tested and documented. Can restore prior state within 20 minutes.",contingencyPlan:"Maintenance window extended to 6 hours if rollback needed. Vendor on standby.",
    estimatedCost:"$100,001–$500,000",costCategory:"CapEx (Capital Expenditure)",budgetSource:"IT central budget",resourcesRequired:["Internal IT staff","External vendor / contractor","Security team"],vendorInvolved:"yes",vendorName:"Cisco Systems",
    businessProblem:"Phase 1 established perimeter controls. Phase 2 addresses lateral movement risk — our current flat network allows any compromised endpoint to reach any resource.",proposedSolution:"Implement micro-segmentation across 14 network zones using Cisco ISE and Catalyst 9000 switches with 802.1X port-based authentication.",expectedBenefits:"Elimination of lateral movement risk. Reduced blast radius of any future breach to a single zone. Automated device compliance enforcement.",successMetrics:"Zero cross-segment policy violations within 60 days. 100% 802.1X enrollment. Audit-ready network topology documentation.",alternativesConsidered:"Software-defined perimeter (rejected — higher cost). Continued reliance on perimeter-only controls (rejected — unacceptable risk).",stakeholders:"Sandra Okafor (VP Ops), CISO James O'Brien, Network Engineering team, Cisco TAC",
    itApprover:"Jordan Webb",businessApprover:"Sandra Okafor",securityReview:"yes",complianceReview:"yes",cabReview:"yes",additionalNotes:"Pilot group: Building 4 floors 2–3. Phase 2 full rollout pending pilot sign-off.",
  },
  {
    fullName:"Priya Sundaram",email:"psundaram@contoso.com",phone:"425-555-0247",department:"Human Resources",jobTitle:"HR Technology Lead",manager:"Carmen Díaz",
    changeTitle:"Workday HCM Self-Service Portal — Global Rollout",changeType:"normal",changeCategory:"Software / Application",changePriority:"medium",
    impactLevel:"major",userCount:"All employees",affectedSystems:["Active Directory / Entra ID","Third-Party Integrations"],affectedUnits:["All Business Units","HR"],customerFacing:"no",downtime:"None",
    financialGain:"yes",financialGainType:["Cost savings / reduction","Headcount reduction or redeployment"],financialGainEstimate:"$250,001–$1,000,000",
    startDate:"2025-08-01",endDate:"2025-12-15",implementationWindow:"Business Hours (9AM–5PM local)",rolloutApproach:"phased",affectedRegions:["North America","EMEA (Europe, Middle East, Africa)","Asia Pacific"],testingCompleted:"no",
    changeScope:"enterprise",customerFacing2:"no",teamsImpacted:["Human Resources","IT / Technology","All teams"],
    riskLevel:"medium",riskDescription:"Data migration from legacy PeopleSoft. Change fatigue risk across large employee population.",mitigationPlan:"Data migration dry-run completed twice. Champions network of 60 HR coordinators trained. Manager-specific training module deployed.",rollbackPlan:"Legacy PeopleSoft read-only access maintained for 90 days post-cutover.",contingencyPlan:"HR shared services team available to process manual transactions if portal unavailable.",
    estimatedCost:"$500,001–$1,000,000",costCategory:"OpEx (Operational Expenditure)",budgetSource:"Existing departmental budget",resourcesRequired:["Internal IT staff","External vendor / contractor","Training & change enablement"],vendorInvolved:"yes",vendorName:"Workday Inc.",
    businessProblem:"HR transactions require manual coordinator intervention. Current system is 14 years old and approaching end-of-support.",proposedSolution:"Deploy Workday HCM self-service portal enabling employees to manage HR transactions directly. Integrates with Microsoft Entra ID for SSO.",expectedBenefits:"Eliminate ~6,200 manual HR tickets per year. HR staff redirected from administrative processing to strategic advisory work.",successMetrics:"80% of eligible transactions completed self-service within 90 days. HR admin ticket volume reduced by 70%. Employee satisfaction score above 4.0/5.0.",alternativesConsidered:"SAP SuccessFactors (rejected — higher integration cost). PeopleSoft upgrade (rejected — 3× cost, same architecture limitations).",stakeholders:"Carmen Díaz (Change Lead), CHRO Dana Wells, all department managers, IT Identity team",
    itApprover:"Carmen Díaz",businessApprover:"Dana Wells",securityReview:"yes",complianceReview:"yes",cabReview:"yes",additionalNotes:"GDPR data transfer assessments complete. Employee privacy notice updated.",
  },
  {
    fullName:"Kevin Abara",email:"kabara@contoso.com",phone:"425-555-0391",department:"Finance & Operations",jobTitle:"Finance Systems Analyst",manager:"Rebecca Tran",
    changeTitle:"Accounts Payable Automation — Intelligent Invoice Processing",changeType:"normal",changeCategory:"Process / Workflow",changePriority:"medium",
    impactLevel:"moderate",userCount:"51–200",affectedSystems:["SAP / ERP","Third-Party Integrations"],affectedUnits:["Finance","Operations"],customerFacing:"no",downtime:"None",
    financialGain:"yes",financialGainType:["Cost savings / reduction","Headcount reduction or redeployment"],financialGainEstimate:"$250,001–$1,000,000",
    startDate:"2025-09-01",endDate:"2026-01-31",implementationWindow:"Business Hours (9AM–5PM local)",rolloutApproach:"pilot",affectedRegions:["North America"],testingCompleted:"no",
    changeScope:"multi_org",customerFacing2:"no",teamsImpacted:["Finance","Operations"],
    riskLevel:"low",riskDescription:"OCR accuracy on non-standard vendor invoices. Integration with existing SAP AP module.",mitigationPlan:"Human-in-the-loop review for invoices below 92% confidence score. 30-day parallel run before full automation.",rollbackPlan:"Manual AP processing remains available. Automation can be disabled at invoice-type level.",contingencyPlan:"Dedicated AP queue staffed during parallel run to catch exceptions.",
    estimatedCost:"$100,001–$500,000",costCategory:"OpEx (Operational Expenditure)",budgetSource:"Existing departmental budget",resourcesRequired:["Internal IT staff","External vendor / contractor","Legal / compliance review"],vendorInvolved:"yes",vendorName:"Microsoft Azure AI Services",
    businessProblem:"AP team processes 12,000+ invoices per month manually. Average processing time is 4.2 days. Error rate of 3.1% results in ~370 exceptions/month.",proposedSolution:"Deploy Azure AI Document Intelligence for OCR and ML-based invoice classification. Integrate with SAP S/4HANA via standard API. Intelligent routing for exceptions.",expectedBenefits:"Reduce invoice processing time from 4.2 days to under 4 hours. Cut error rate below 0.5%. Redeploy 3 FTEs to higher-value financial analysis.",successMetrics:"Average processing time under 4 hours within 60 days. Error rate below 0.5%. AP team satisfaction score 4.0+ / 5.0.",alternativesConsidered:"Offshore BPO (rejected — data sovereignty). RPA scripts (rejected — brittle). SAP native OCR (rejected — insufficient accuracy).",stakeholders:"Rebecca Tran (VP Finance), AP Manager Joanna Liu, IT Integration team, Procurement Director",
    itApprover:"Jordan Webb",businessApprover:"Rebecca Tran",securityReview:"no",complianceReview:"yes",cabReview:"yes",additionalNotes:"Vendor data processing agreement executed. SOC 2 report reviewed.",
  },
  {
    fullName:"Tanya Kowalski",email:"tkowalski@contoso.com",phone:"425-555-0514",department:"Sales",jobTitle:"Sales Operations Manager",manager:"Derek Fong",
    changeTitle:"Salesforce CPQ Implementation — Configure, Price, Quote Automation",changeType:"expedited",changeCategory:"Software / Application",changePriority:"high",
    impactLevel:"major",userCount:"51–200",affectedSystems:["Salesforce / CRM","Third-Party Integrations"],affectedUnits:["Sales","Finance","Operations"],customerFacing:"yes",downtime:"4–8 hours",
    financialGain:"yes",financialGainType:["Revenue increase","Cost savings / reduction"],financialGainEstimate:"$5M–$25M",
    startDate:"2025-06-15",endDate:"2025-09-30",implementationWindow:"Maintenance Window (scheduled)",rolloutApproach:"parallel",affectedRegions:["North America","EMEA (Europe, Middle East, Africa)"],testingCompleted:"no",
    changeScope:"multi_org",customerFacing2:"yes",teamsImpacted:["Sales","Finance","Legal & Compliance"],
    riskLevel:"high",riskDescription:"Complex product catalog with 3,400 SKUs. Finance approval workflow changes. Sales rep adoption risk given prior failed CPQ attempt.",mitigationPlan:"Gamified onboarding with deal-based training. Finance-sales alignment workshops. Dedicated Salesforce admin on standby first 30 days.",rollbackPlan:"Legacy quoting tool remains available as fallback for 60 days. Manual quote process documented.",contingencyPlan:"Deal desk team handles complex quotes manually if CPQ unavailable during initial weeks.",
    estimatedCost:"$500,001–$1,000,000",costCategory:"OpEx (Operational Expenditure)",budgetSource:"Project-specific budget",resourcesRequired:["Internal IT staff","External vendor / contractor","Training & change enablement","Legal / compliance review"],vendorInvolved:"yes",vendorName:"Salesforce / Revenue Cloud",
    businessProblem:"Sales reps create quotes manually using Excel. Average quote takes 2.3 days. Pricing errors cost ~$1.8M in margin leakage annually. Approval cycles for non-standard discounts average 6 days.",proposedSolution:"Implement Salesforce CPQ integrated with existing Salesforce CRM. Automated approval routing, product configurator, and dynamic pricing rules.",expectedBenefits:"Reduce quote time from 2.3 days to 2 hours. Eliminate pricing errors. Accelerate deal cycles. Real-time margin visibility for finance.",successMetrics:"Average quote generation under 2 hours within 60 days. Pricing error rate below 0.2%. Sales rep adoption above 85% within 30 days.",alternativesConsidered:"Apttus CPQ (rejected — higher cost, longer implementation). Custom-built pricing tool (rejected — 18-month timeline).",stakeholders:"Derek Fong (VP Sales), CFO Linda Chen, Sales Ops, Legal team for approval workflow design",
    itApprover:"Jordan Webb",businessApprover:"Derek Fong",securityReview:"yes",complianceReview:"no",additionalNotes:"Q3 revenue targets dependent on this being live by September 1. Executive sponsor: CEO.",
  },
  {
    fullName:"Amara Osei",email:"aosei@contoso.com",phone:"425-555-0638",department:"Azure Engineering",jobTitle:"Cloud Platform Architect",manager:"Raj Patel",
    changeTitle:"Azure DevOps to GitHub Enterprise Cloud Migration",changeType:"normal",changeCategory:"Cloud & Platform Services",changePriority:"medium",
    impactLevel:"moderate",userCount:"51–200",affectedSystems:["DevOps / GitHub","Active Directory / Entra ID","Security Tools"],affectedUnits:["Operations","Research"],customerFacing:"no",downtime:"< 15 minutes",
    financialGain:"yes",financialGainType:["Productivity gains (monetized)","License / contract savings"],financialGainEstimate:"$250,001–$1,000,000",
    startDate:"2025-10-01",endDate:"2026-02-28",implementationWindow:"Weekend — Saturday",rolloutApproach:"phased",affectedRegions:["North America","EMEA (Europe, Middle East, Africa)"],testingCompleted:"no",
    changeScope:"multi_org",customerFacing2:"no",teamsImpacted:["IT / Technology","Security team"],
    riskLevel:"medium",riskDescription:"History loss during repo migration. CI/CD pipeline breakage. Secret scanning for legacy credentials in commit history.",mitigationPlan:"git-filter-repo to sanitize commit history. Full pipeline inventory before migration. Secret scanning pre-migration with developer notification.",rollbackPlan:"Azure DevOps org kept read-only for 90 days post-migration. Can re-point pipelines within 2 hours.",contingencyPlan:"Dedicated DevOps engineer on standby each migration weekend. Rollback runbook tested in staging.",
    estimatedCost:"$100,001–$500,000",costCategory:"Both CapEx and OpEx",budgetSource:"IT central budget",resourcesRequired:["Internal IT staff","Security team"],vendorInvolved:"no",vendorName:"",
    businessProblem:"Azure DevOps is fragmented across 7 organizations with inconsistent access controls. GitHub Copilot integration requires GitHub Enterprise. Developers report 18% of time lost to context-switching.",proposedSolution:"Migrate all 340 repositories from Azure DevOps to GitHub Enterprise Cloud. Standardize CI/CD on GitHub Actions. Enable GitHub Copilot Business across engineering.",expectedBenefits:"Unified source control platform. GitHub Copilot projected to save 12–18 hours/developer/month. Simplified RBAC across repos.",successMetrics:"100% repo migration with zero history loss. CI/CD pipelines green within 48 hours of each team migration. Copilot adoption above 70% within 60 days.",alternativesConsidered:"Consolidate Azure DevOps organizations (rejected — doesn't enable Copilot). GitLab (rejected — additional licensing cost, team unfamiliarity).",stakeholders:"Raj Patel (Portfolio Reporting), CTO Lisa Nguyen, Lead Architects, Security team for RBAC review",
    itApprover:"Jordan Webb",businessApprover:"Raj Patel",securityReview:"yes",complianceReview:"no",cabReview:"yes",additionalNotes:"GitHub Enterprise license procurement in progress. Team-by-team migration: October 2025 through February 2026.",
  },
];

function IntakeForm({addProject,navigate,openDoc,demoIndex,setDemoIndex,demoLoaded,setDemoLoaded}){
  const [form,setForm]=useState(makeInitialForm);
  const [activeSection,setActiveSection]=useState("requestor");
  const [submitted,setSubmitted]=useState(false);
  const [submittedId,setSubmittedId]=useState(null);
  const [prevForm,setPrevForm]=useState(null);// for undo
  const sectionRefs=useRef({});
  const update=(k,v)=>setForm(f=>({...f,[k]:v}));
  const loadDemo=()=>{
    if(demoIndex>=DEMO_FORM_DATA.length||demoLoaded)return;
    setPrevForm(form);
    const d=DEMO_FORM_DATA[demoIndex];
    const cab=deriveCabReview(d.changeType);
    setForm({...makeInitialForm(),...d,cabReview:cab,changeId:form.changeId,submissionDate:form.submissionDate});
    setDemoIndex(i=>i+1);
    setDemoLoaded(true);
  };
  const undoDemo=()=>{if(prevForm){setForm(prevForm);setPrevForm(null);setDemoIndex(i=>Math.max(0,i-1));setDemoLoaded(false);}};

  // Smart update: when changeType changes, auto-set CAB review and suggest priority
  const updateChangeType=v=>{
    const cab=deriveCabReview(v);
    setForm(f=>({...f,changeType:v,cabReview:cab,...(v==="emergency"&&!f.changePriority?{changePriority:"critical"}:{})}));
  };
  const clearSection=id=>setForm(f=>({...f,...sectionDefaults[id]}));
  const totalCompletion=Math.round(FORM_SECTIONS.reduce((sum,s)=>sum+getSectionCompletion(form,s.id),0)/FORM_SECTIONS.length);
  const cabDerived=!!form.changeType&&deriveCabReview(form.changeType)===form.cabReview;
  const cabLockNote={standard:"Auto-set: Standard changes are pre-approved. CAB review not required.",emergency:"Auto-set: Emergency changes require Expedited CAB review within 5 business days post-implementation.",expedited:"Auto-set: Expedited changes require Expedited CAB review.",normal:"Auto-set: Normal changes require full CAB review."}[form.changeType]||"";

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setActiveSection(e.target.dataset.section);}),{threshold:0.25,rootMargin:"-60px 0px -55% 0px"});
    Object.values(sectionRefs.current).forEach(el=>{if(el)obs.observe(el);});
    return ()=>obs.disconnect();
  },[]);
  const scrollTo=id=>{setActiveSection(id);sectionRefs.current[id]?.scrollIntoView({behavior:"smooth",block:"start"});};
  const handleSubmit=()=>{
    const missing=FORM_SECTIONS.filter(s=>getSectionCompletion(form,s.id)<50);
    if(missing.length>0){alert(`Please complete the following sections before submitting:\n\n${missing.map(s=>`• ${s.title}`).join("\n")}`);return;}
    const newProject={
      id:form.changeId,status:"submitted",title:form.changeTitle||"New Change Request",
      changeType:form.changeType||"normal",priority:form.changePriority||"medium",riskLevel:form.riskLevel||"medium",
      owner:form.fullName,department:form.department,sponsor:form.businessApprover,
      startDate:form.startDate,endDate:form.endDate,estimatedCost:form.estimatedCost,
      financialBenefits:form.financialGain==="yes"&&form.financialGainEstimate?`Estimated ${form.financialGainEstimate} annual gain. ${form.financialGainType.join(", ")}.`:"Not yet quantified",
      affectedOrgs:form.affectedUnits.length?form.affectedUnits:[form.department],
      projectProgress:{pct:0,note:"Newly submitted. ADKAR plan generation pending."},
      agreedSections:{awareness:false,desire:false,knowledge:false,ability:false,reinforcement:false,implementation:false},
      adkarContent:{awareness:[{heading:"Auto-generated from intake",body:`Business problem: ${form.businessProblem||"—"}\n\nProposed solution: ${form.proposedSolution||"—"}`}],desire:[{heading:"WIIFM",body:form.expectedBenefits||"—"}],knowledge:[{heading:"Training plan",body:"To be developed by the assigned Change Lead."}],ability:[{heading:"Support model",body:"To be developed by the assigned Change Lead."}],reinforcement:[{heading:"Success metrics",body:form.successMetrics||"To be defined."}],implementation:[{heading:"Project plan",body:`Start: ${form.startDate||"—"} · End: ${form.endDate||"—"}\nRollout approach: ${form.rolloutApproach||"—"}\nEstimated cost: ${form.estimatedCost||"—"}`}]},
      approvals:[
        {id:"it_dir",role:"IT Approver",name:form.itApprover,dept:"IT",tier:1,status:"pending",approvedAt:null,questions:[]},
        {id:"biz",role:"Business Approver",name:form.businessApprover,dept:form.department,tier:1,status:"pending",approvedAt:null,questions:[]},
      ],
    };
    addProject(newProject);setSubmittedId(newProject.id);setDemoLoaded(false);setSubmitted(true);
  };

  if(submitted) return <div style={{minHeight:"calc(100vh - 44px)",background:C.bgMid,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif"}}>
    <div style={{background:C.white,borderRadius:3,padding:48,maxWidth:540,textAlign:"center",border:`1px solid ${C.border}`}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:C.greenLight,border:`2px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 20px"}}>✓</div>
      <h2 style={{fontSize:22,fontWeight:600,color:C.green,margin:"0 0 8px"}}>Request Submitted Successfully</h2>
      <p style={{color:C.textLight,fontSize:13.5,margin:"0 0 16px",lineHeight:1.6}}>Your change request has been received and your ADKAR plan has been pre-populated based on your intake responses.</p>
      <div style={{background:C.bgMid,borderRadius:2,padding:"10px 20px",margin:"0 0 8px",fontFamily:"monospace",fontSize:16,fontWeight:700,color:C.blue,display:"inline-block"}}>{form.changeId}</div>
      <p style={{color:C.textMuted,fontSize:12,margin:"0 0 28px",lineHeight:1.5}}>A confirmation has been sent to <strong>{form.email}</strong>. Save the ID above for tracking.</p>
      <div style={{background:C.purpleLight,border:`1px solid ${C.purpleBorder}`,borderRadius:3,padding:"14px 20px",marginBottom:24,textAlign:"left"}}>
        <div style={{fontSize:13,fontWeight:600,color:C.purple,marginBottom:4}}>Your next step</div>
        <div style={{fontSize:13,color:C.textMid,lineHeight:1.6}}>Open your ADKAR plan, review each section, click <strong>Agree to section</strong> for each one, then send to your approvers. All sections must be agreed before approvals can begin.</div>
      </div>
      <div style={{display:"flex",gap:12,justifyContent:"center"}}>
        <button onClick={()=>{setForm(makeInitialForm());setPrevForm(null);setSubmitted(false);setSubmittedId(null);}} style={{padding:"10px 20px",background:C.white,color:C.textMid,border:`1px solid ${C.borderMid}`,borderRadius:2,fontSize:13,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif"}}>Submit Another Request</button>
        <button onClick={()=>navigate("portfolio",{projectId:submittedId})} style={{padding:"10px 24px",background:C.purple,color:C.white,border:"none",borderRadius:2,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",boxShadow:"0 2px 8px rgba(92,45,145,0.3)"}}>View My ADKAR Plan →</button>
      </div>
    </div>
  </div>;

  return <div style={{minHeight:"calc(100vh - 44px)",background:C.bgMid,fontFamily:"'Segoe UI',Tahoma,sans-serif"}}>
    <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"16px 32px"}}>
      <div style={{maxWidth:1260,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,fontSize:12,color:C.textMuted}}>
          <button onClick={()=>navigate("home")} style={{background:"none",border:"none",color:C.purple,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontSize:12,padding:0}}>Home</button><span>›</span><span style={{color:C.textMid,fontWeight:600}}>Submit a Request</span>
        </div>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
          <div>
            <h1 style={{margin:"0 0 4px",fontSize:24,fontWeight:600,color:C.text}}>Change Management Request</h1>
            <p style={{margin:0,fontSize:14,color:C.textLight}}>Complete all sections to submit your change request. Required fields are marked <span style={{color:C.red}}>*</span>.</p>
          </div>
          <div style={{flexShrink:0,marginLeft:16,display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
            <div style={{background:C.bgMid,padding:"8px 14px",borderRadius:2,textAlign:"right"}}>
              <div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>Request ID</div>
              <div style={{fontFamily:"monospace",fontWeight:700,color:C.blue,fontSize:14,marginTop:2}}>{form.changeId}</div>
            </div>
            {/* Demo banner */}
            <div style={{background:"#fffbeb",border:`1px solid #f59e0b`,borderRadius:2,padding:"10px 14px",maxWidth:290,textAlign:"center"}}>
              <div style={{fontSize:11,color:"#92400e",fontWeight:700,marginBottom:7}}>Demo use only — fills form with sample data</div>
              {demoLoaded&&<div style={{fontSize:11,color:"#92400e",background:"#fef3c7",border:`1px solid #f59e0b`,borderRadius:2,padding:"4px 8px",marginBottom:7}}>Submit or undo the current example before loading another.</div>}
              <div style={{display:"flex",gap:6,justifyContent:"center",alignItems:"center"}}>
                {prevForm&&<button onClick={undoDemo} style={{padding:"4px 10px",fontSize:11,color:"#92400e",background:"#fef3c7",border:`1px solid #f59e0b`,borderRadius:2,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontWeight:600}}>↩ Undo</button>}
                <button onClick={loadDemo} disabled={demoIndex>=DEMO_FORM_DATA.length||demoLoaded}
                  style={{padding:"5px 14px",fontSize:12,fontWeight:700,color:(demoIndex<DEMO_FORM_DATA.length&&!demoLoaded)?C.white:C.textMuted,background:(demoIndex<DEMO_FORM_DATA.length&&!demoLoaded)?"#d97706":"#e5e7eb",border:"none",borderRadius:2,cursor:(demoIndex<DEMO_FORM_DATA.length&&!demoLoaded)?"pointer":"default",fontFamily:"'Segoe UI',sans-serif"}}>
                  {demoLoaded?"Example loaded…":`Load Example (${Math.max(0,DEMO_FORM_DATA.length-demoIndex)} of ${DEMO_FORM_DATA.length} left)`}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{marginTop:14,display:"flex",gap:4}}>
          {FORM_SECTIONS.map(s=>{const pct=getSectionCompletion(form,s.id);return <div key={s.id} title={s.title} onClick={()=>scrollTo(s.id)} style={{flex:1,height:4,borderRadius:2,background:pct===100?C.green:pct>0?C.blue:C.border,cursor:"pointer"}}/>;})}</div>
      </div>
    </div>

    <div style={{display:"flex",maxWidth:1260,margin:"0 auto",padding:"20px 32px 60px"}}>
      {/* Sidebar */}
      <div style={{width:240,flexShrink:0,marginRight:20,position:"sticky",top:68,alignSelf:"flex-start",maxHeight:"calc(100vh - 100px)",overflowY:"auto"}}>
        <div style={{background:C.white,borderRadius:3,border:`1px solid ${C.border}`,overflow:"hidden"}}>
          <div style={{padding:"12px 14px",background:C.nav}}>
            <h3 style={{margin:0,color:C.white,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>Form Guide</h3>
            <p style={{margin:"4px 0 0",color:"rgba(255,255,255,0.7)",fontSize:11}}>Click any section to jump</p>
          </div>
          {FORM_SECTIONS.map(s=>{const pct=getSectionCompletion(form,s.id);const isActive=activeSection===s.id;const isDone=pct===100;return(
            <div key={s.id} onClick={()=>scrollTo(s.id)} style={{padding:"11px 14px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,background:isActive?C.blueLight:C.white,borderLeft:`3px solid ${isActive?C.blue:isDone?C.green:C.border}`}}
              onMouseEnter={e=>{if(!isActive)e.currentTarget.style.background=C.bgMid;}}
              onMouseLeave={e=>{if(!isActive)e.currentTarget.style.background=C.white;}}>
              <div style={{display:"flex",alignItems:"center",marginBottom:5}}>
                <span style={{fontSize:12.5,fontWeight:isActive?600:500,color:isActive?C.blue:C.text,flex:1}}>{s.title}</span>
                {isDone&&<span style={{color:C.green,fontSize:13}}>✓</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{flex:1,height:3,background:C.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:isDone?C.green:isActive?C.blue:C.blueBorder,transition:"width 0.3s"}}/></div>
                <span style={{fontSize:11,color:C.textMuted,minWidth:28,textAlign:"right"}}>{pct}%</span>
              </div>
            </div>
          );})}
          <div style={{padding:"12px 14px",background:C.bgMid}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:6,fontWeight:600}}>Overall Progress</div>
            <div style={{height:5,background:C.border,borderRadius:3,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:`${totalCompletion}%`,background:totalCompletion===100?C.green:C.blue,transition:"width 0.4s",borderRadius:3}}/></div>
            <div style={{fontSize:12,color:totalCompletion===100?C.green:C.blue,fontWeight:700}}>{totalCompletion}% complete</div>
          </div>
        </div>
      </div>

      {/* Main form */}
      <div style={{flex:1,minWidth:0}}>
        {/* 1. Requestor */}
        <FSectionCard id="requestor" title="Requestor Information" sectionRef={sectionRefs} onClear={()=>clearSection("requestor")}>
          <FTwoCol><FInput label="Full Name" value={form.fullName} onChange={v=>update("fullName",v)} required placeholder="Your full name"/><FInput label="Email Address" value={form.email} onChange={v=>update("email",v)} type="email" required placeholder="name@contoso.com"/></FTwoCol>
          <FTwoCol><FInput label="Job Title" value={form.jobTitle} onChange={v=>update("jobTitle",v)} required placeholder="Your current title"/><FInput label="Phone" value={form.phone} onChange={v=>update("phone",v)} placeholder="Optional"/></FTwoCol>
          <FTwoCol>
            <FSelect label="Department / Business Unit" value={form.department} onChange={v=>update("department",v)} required options={["Azure Engineering","Microsoft 365","Security & Compliance","Corporate IT","Finance & Operations","Human Resources","Legal & Compliance","Marketing","Sales","Supply Chain","Research & Development","Customer Experience","Other"]}/>
            <FInput label="Direct Manager" value={form.manager} onChange={v=>update("manager",v)} placeholder="Manager's full name"/>
          </FTwoCol>
          <FTwoCol>
            <FInput label="Submission Date" value={form.submissionDate} onChange={v=>update("submissionDate",v)} type="date"/>
            <div style={{marginBottom:20}}><FLabel label="Change Request ID"/><div style={{padding:"8px 12px",background:C.bgMid,border:`1px solid ${C.border}`,borderRadius:2,fontSize:14,color:C.textMuted,fontFamily:"monospace"}}>{form.changeId}</div></div>
          </FTwoCol>
        </FSectionCard>

        {/* 2. Classification */}
        <FSectionCard id="classification" title="Change Classification" sectionRef={sectionRefs} onClear={()=>clearSection("classification")}>
          <FInput label="Change Request Title" value={form.changeTitle} onChange={v=>update("changeTitle",v)} required placeholder="Brief, descriptive title of the proposed change"/>
          <FDivider label="Change Type"/>
          <FRadioGroup label="Change Type" value={form.changeType} onChange={updateChangeType} required onInfo={()=>openDoc("change-types")}
            options={[{value:"standard",label:"Standard"},{value:"normal",label:"Normal"},{value:"emergency",label:"Emergency"},{value:"expedited",label:"Expedited"}]}/>
          {form.changeType==="emergency"&&<div style={{padding:"10px 14px",background:C.redLight,border:`1px solid ${C.red}44`,borderRadius:2,marginTop:-12,marginBottom:20,fontSize:13,color:C.red}}><strong>Emergency change:</strong> Requires verbal authorization before work begins. Post-implementation CAB review must be completed within 5 business days. Priority has been set to Critical.</div>}
          {form.changeType==="expedited"&&<div style={{padding:"10px 14px",background:C.orangeLight,border:`1px solid ${C.orange}44`,borderRadius:2,marginTop:-12,marginBottom:20,fontSize:13,color:C.orange}}><strong>Expedited change:</strong> Business urgency must be documented. Follows the same approval requirements as a Normal change, on a compressed timeline.</div>}
          <FTwoCol>
            <FSelect label="Change Category" value={form.changeCategory} onChange={v=>update("changeCategory",v)} required
              options={["Infrastructure / Hardware","Software / Application","Network & Connectivity","Security & Access Control","Process / Workflow","Policy & Governance","Data & Database","Organizational / Structural","Vendor / Third-Party","Cloud & Platform Services","End-User Computing","Other"]}/>
            <FRadioGroup label="Priority Level" value={form.changePriority} onChange={v=>update("changePriority",v)} required onInfo={()=>openDoc("priority-levels")}
              options={[{value:"critical",label:"Critical"},{value:"high",label:"High"},{value:"medium",label:"Medium"},{value:"low",label:"Low"}]}/>
          </FTwoCol>
        </FSectionCard>

        {/* 3. Impact */}
        <FSectionCard id="impact" title="Impact Assessment" sectionRef={sectionRefs} onClear={()=>clearSection("impact")}>
          <FTwoCol>
            <FRadioGroup label="Overall Impact Level" value={form.impactLevel} onChange={v=>update("impactLevel",v)} required onInfo={()=>openDoc("impact-levels")}
              options={[{value:"critical",label:"Critical"},{value:"major",label:"Major"},{value:"moderate",label:"Moderate"},{value:"minor",label:"Minor"}]}/>
            <FSelect label="Estimated Users Affected" value={form.userCount} onChange={v=>update("userCount",v)} required
              options={["1–50","51–200","201–1,000","1,001–10,000","10,001–50,000","50,001–100,000","100,000+","All employees","External customers only","Both internal and external"]}/>
          </FTwoCol>
          <FCheckboxGroup label="Affected Systems / Platforms" hint="Select all systems that will be directly modified or impacted."
            options={["Azure","Microsoft 365 / Office","Active Directory / Entra ID","SAP / ERP","Salesforce / CRM","Networking / Firewall","Data Warehouse / Analytics","DevOps / GitHub","End-User Devices","Telephony / Teams","Security Tools","Third-Party Integrations","Other"]}
            selected={form.affectedSystems} onChange={v=>update("affectedSystems",v)}/>
          <FCheckboxGroup label="Affected Business Units"
            options={["All Business Units","Azure Engineering","Microsoft 365","Security","Finance","HR","Legal","Marketing","Sales","Operations","Research"]}
            selected={form.affectedUnits} onChange={v=>update("affectedUnits",v)}/>
          <FTwoCol>
            <FRadioGroup label="Customer-Facing Impact?" value={form.customerFacing} onChange={v=>update("customerFacing",v)} required
              options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"possible",label:"Possibly"}]}/>
            <FSelect label="Expected Downtime" value={form.downtime} onChange={v=>update("downtime",v)}
              options={["None","< 15 minutes","15–60 minutes","1–4 hours","4–8 hours","8–24 hours","Multiple days","Unknown / TBD"]}/>
          </FTwoCol>
          <FDivider label="Financial Impact"/>
          <FRadioGroup label="Does this change result in a direct financial gain?" value={form.financialGain} onChange={v=>update("financialGain",v)}
            hint="Financial gain includes cost savings, revenue increases, or avoided costs attributable to this change."
            options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown / TBD"}]}/>
          {form.financialGain==="yes"&&<>
            <FCheckboxGroup label="Type of Financial Gain"
              options={["Cost savings / reduction","Revenue increase","Cost avoidance","Productivity gains (monetized)","License / contract savings","Infrastructure savings","Headcount reduction or redeployment","Other"]}
              selected={form.financialGainType} onChange={v=>update("financialGainType",v)}/>
            <FSelect label="Estimated Annual Financial Gain" value={form.financialGainEstimate} onChange={v=>update("financialGainEstimate",v)}
              hint="Provide your best estimate of annualized value. Elaborate in the Business Justification section."
              options={["< $50,000","$50,000–$250,000","$250,001–$1,000,000","$1M–$5M","$5M–$25M","$25M–$100M","$100M+","Not yet quantified"]}/>
          </>}
        </FSectionCard>

        {/* 4. Scope — enhanced */}
        <FSectionCard id="scope" title="Scope & Timeline" sectionRef={sectionRefs} onClear={()=>clearSection("scope")}>
          <FDivider label="Scope"/>
          <FRadioGroup label="Change Scope" value={form.changeScope} onChange={v=>update("changeScope",v)} required
            hint="How broadly does this change reach across the organization?"
            options={[{value:"team",label:"Immediate team only"},{value:"org",label:"Single organization / department"},{value:"multi_org",label:"Multiple organizations"},{value:"enterprise",label:"Enterprise-wide"}]}/>
          <FRadioGroup label="Is this change customer-facing?" value={form.customerFacing2} onChange={v=>update("customerFacing2",v)}
            options={[{value:"yes",label:"Yes — affects external customers"},{value:"no",label:"No — internal only"},{value:"indirect",label:"Indirectly (e.g. support tools)"}]}/>
          <FCheckboxGroup label="Which teams / functions does this change directly impact?"
            hint="Select all that apply. This drives the communication and training plan."
            options={["All teams","IT / Technology","Finance","Sales","Human Resources","Marketing","Legal & Compliance","Operations","Supply Chain","Research & Development","Customer Support","External vendors / partners"]}
            selected={form.teamsImpacted} onChange={v=>update("teamsImpacted",v)}/>
          <FDivider label="Timeline"/>
          <FTwoCol>
            <FInput label="Planned Start Date" value={form.startDate} onChange={v=>update("startDate",v)} type="date" required/>
            <FInput label="Planned End / Completion Date" value={form.endDate} onChange={v=>update("endDate",v)} type="date" required/>
          </FTwoCol>
          <FSelect label="Implementation Window" value={form.implementationWindow} onChange={v=>update("implementationWindow",v)}
            hint="When will the actual implementation activity take place?"
            options={["Business Hours (9AM–5PM local)","Extended Hours (7AM–9PM local)","After-Hours / Overnight","Weekend — Saturday","Weekend — Sunday","Holiday Window","Maintenance Window (scheduled)","Continuous / No specific window"]}/>
          <FRadioGroup label="Rollout Approach" value={form.rolloutApproach} onChange={v=>update("rolloutApproach",v)} required
            options={[{value:"bigbang",label:"Big Bang"},{value:"phased",label:"Phased"},{value:"pilot",label:"Pilot First"},{value:"canary",label:"Canary Release"},{value:"bluegreen",label:"Blue/Green"},{value:"parallel",label:"Parallel Run"}]}/>
          <FCheckboxGroup label="Affected Regions / Geographies"
            options={["North America","Latin America","EMEA (Europe, Middle East, Africa)","Asia Pacific","China","India","Global / All Regions"]}
            selected={form.affectedRegions} onChange={v=>update("affectedRegions",v)}/>
          <FRadioGroup label="Has testing been completed in a non-production environment?" value={form.testingCompleted} onChange={v=>update("testingCompleted",v)}
            options={[{value:"yes",label:"Yes — fully tested"},{value:"partial",label:"Partial"},{value:"no",label:"No"},{value:"na",label:"N/A"}]}/>
        </FSectionCard>

        {/* 5. Risk */}
        <FSectionCard id="risk" title="Risk Analysis" sectionRef={sectionRefs} onClear={()=>clearSection("risk")}>
          <FRadioGroup label="Overall Risk Level" value={form.riskLevel} onChange={v=>update("riskLevel",v)} required onInfo={()=>openDoc("risk-levels")}
            hint="Consider probability of failure × business impact."
            options={[{value:"critical",label:"Critical"},{value:"high",label:"High"},{value:"medium",label:"Medium"},{value:"low",label:"Low"}]}/>
          <FTextarea label="Risk Description" value={form.riskDescription} onChange={v=>update("riskDescription",v)}
            hint="Describe the key risks. Include technical, operational, and security risks."
            placeholder="e.g., Potential for service interruption during migration window; risk of data loss if backup fails..." rows={3}/>
          <FTextarea label="Mitigation Plan" value={form.mitigationPlan} onChange={v=>update("mitigationPlan",v)} required
            hint="How will identified risks be reduced or managed?"
            placeholder="e.g., Pre-change backup completed and verified; 30-minute health check post-deployment..." rows={3}/>
          <FTextarea label="Rollback / Backout Plan" value={form.rollbackPlan} onChange={v=>update("rollbackPlan",v)}
            hint="Step-by-step plan to reverse the change if it fails."
            placeholder="e.g., Step 1: Halt deployment. Step 2: Restore from snapshot. Step 3: Notify stakeholders..." rows={3}/>
          <FTextarea label="Contingency / Business Continuity Plan" value={form.contingencyPlan} onChange={v=>update("contingencyPlan",v)}
            hint="What is the plan if both implementation and rollback fail?"
            placeholder="e.g., Activate DR environment; escalate to on-call incident commander..." rows={3}/>
        </FSectionCard>

        {/* 6. Cost */}
        <FSectionCard id="cost" title="Cost & Resources" sectionRef={sectionRefs} onClear={()=>clearSection("cost")}>
          <FTwoCol>
            <FSelect label="Estimated Total Cost" value={form.estimatedCost} onChange={v=>update("estimatedCost",v)} required
              options={["< $5,000","$5,000–$25,000","$25,001–$100,000","$100,001–$500,000","$500,001–$1,000,000","$1M–$5M","$5M+","No direct cost","TBD / Requires estimation"]}/>
            <FSelect label="Cost Category" value={form.costCategory} onChange={v=>update("costCategory",v)} required
              options={["CapEx (Capital Expenditure)","OpEx (Operational Expenditure)","Both CapEx and OpEx","Internal labor only","No cost"]}/>
          </FTwoCol>
          <FSelect label="Budget Source" value={form.budgetSource} onChange={v=>update("budgetSource",v)} required
            options={["Existing departmental budget","IT central budget","Project-specific budget","Executive discretionary fund","Requires new budget approval","Cross-charged to multiple departments","External grant / funding"]}/>
          <FCheckboxGroup label="Resources Required" hint="Select all resource types needed."
            options={["Internal IT staff","External vendor / contractor","Cloud compute / infrastructure spend","Software licenses","Hardware procurement","Data migration services","Training & change enablement","Legal / compliance review","Security team","Executive sponsor time"]}
            selected={form.resourcesRequired} onChange={v=>update("resourcesRequired",v)}/>
          <FTwoCol>
            <FRadioGroup label="Vendor / Third-Party Involved?" value={form.vendorInvolved} onChange={v=>update("vendorInvolved",v)}
              options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]}/>
            {form.vendorInvolved==="yes"&&<FInput label="Vendor / Third-Party Name(s)" value={form.vendorName} onChange={v=>update("vendorName",v)} placeholder="e.g., Accenture, IBM, Cisco"/>}
          </FTwoCol>
        </FSectionCard>

        {/* 7. Justification */}
        <FSectionCard id="justification" title="Business Justification" sectionRef={sectionRefs} onClear={()=>clearSection("justification")}>
          <FTextarea label="Business Problem / Opportunity" value={form.businessProblem} onChange={v=>update("businessProblem",v)} required
            hint="What problem does this change solve, or what opportunity does it enable?"
            placeholder="e.g., Current authentication system does not support MFA, creating a security gap and compliance risk..." rows={4}/>
          <FTextarea label="Proposed Solution" value={form.proposedSolution} onChange={v=>update("proposedSolution",v)} required
            hint="Describe what will be done and how it addresses the problem."
            placeholder="e.g., Deploy Microsoft Entra ID conditional access policies across all tenants, enforcing MFA for all users..." rows={4}/>
          <FTextarea label="Expected Benefits" value={form.expectedBenefits} onChange={v=>update("expectedBenefits",v)} required
            hint="Quantify benefits where possible — cost savings, efficiency gains, risk reduction, revenue impact."
            placeholder="e.g., Reduce account compromise incidents by ~80%; achieve SOC2 MFA compliance; reduce helpdesk calls by 200/month..." rows={4}/>
          <FTextarea label="Success Metrics / KPIs" value={form.successMetrics} onChange={v=>update("successMetrics",v)}
            hint="How will you measure whether this change was successful?"
            placeholder="e.g., 100% MFA enrollment within 30 days; zero MFA-related support tickets after 60 days..." rows={3}/>
          <FTextarea label="Alternatives Considered" value={form.alternativesConsidered} onChange={v=>update("alternativesConsidered",v)}
            hint="What other options were evaluated? Why was this approach chosen?" rows={3}/>
          <FInput label="Key Stakeholders" value={form.stakeholders} onChange={v=>update("stakeholders",v)}
            hint="Names and roles of key stakeholders who have been consulted."
            placeholder="e.g., Jane Smith (CISO), Bob Jones (VP Engineering), Compliance team"/>
        </FSectionCard>

        {/* 8. Approvals */}
        <FSectionCard id="approvals" title="Approvals & Sign-offs" sectionRef={sectionRefs} onClear={()=>clearSection("approvals")}>
          <p style={{fontSize:13,color:C.textLight,marginTop:0,marginBottom:20,background:"#fff4ce",border:"1px solid #f7e28e",borderRadius:2,padding:"10px 14px"}}>
            <strong>Note:</strong> Providing approver names here does not constitute formal approval. Approval workflows will be triggered automatically based on change type and risk level after submission.
          </p>
          <FTwoCol>
            <FInput label="IT Change Owner / Approver" value={form.itApprover} onChange={v=>update("itApprover",v)} required placeholder="Full name of IT approver"/>
            <FInput label="Business Owner / Approver" value={form.businessApprover} onChange={v=>update("businessApprover",v)} required placeholder="Full name of business approver"/>
          </FTwoCol>
          <FTwoCol>
            <FRadioGroup label="Security Review Required?" value={form.securityReview} onChange={v=>update("securityReview",v)}
              options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"pending",label:"In Progress"}]}/>
            <FRadioGroup label="Compliance / Legal Review Required?" value={form.complianceReview} onChange={v=>update("complianceReview",v)}
              options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"pending",label:"In Progress"}]}/>
          </FTwoCol>
          {/* CAB Review — auto-set from change type */}
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6}}><FLabel label="CAB (Change Advisory Board) Review Required?"/></div>
            {form.changeType?(
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.bgMid,border:`1px solid ${C.border}`,borderRadius:2}}>
                  <span style={{fontSize:13,fontWeight:600,color:form.cabReview==="no"?C.green:form.cabReview==="expedited"?C.orange:C.blue}}>
                    {form.cabReview==="no"?"Not required — Standard change":form.cabReview==="expedited"?"Expedited CAB review required":form.cabReview==="yes"?"Full CAB review required":"—"}
                  </span>
                  {cabDerived&&<span style={{fontSize:11,color:C.textMuted,fontStyle:"italic"}}>Auto-set based on change type</span>}
                </div>
                <p style={{fontSize:12,color:C.textMuted,margin:"6px 0 0"}}>{cabLockNote}</p>
              </div>
            ):(
              <FRadioGroup label="" value={form.cabReview} onChange={v=>update("cabReview",v)} hint="Select your change type in the Classification section to auto-populate this field."
                options={[{value:"yes",label:"Yes"},{value:"no",label:"No — Standard change"},{value:"expedited",label:"Expedited CAB review"}]}/>
            )}
          </div>
          <FTextarea label="Additional Notes / Instructions for Reviewers" value={form.additionalNotes} onChange={v=>update("additionalNotes",v)}
            hint="Any other context reviewers or approvers should be aware of."
            placeholder="e.g., Please coordinate with Jane Smith before scheduling the CAB review..." rows={4}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8,paddingTop:20,borderTop:`1px solid ${C.border}`}}>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:3}}>Ready to submit?</div>
              <div style={{fontSize:13,color:C.textLight}}>{totalCompletion===100?"All sections are complete. Your request is ready.":`${totalCompletion}% complete — please finish all required fields.`}</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setForm(makeInitialForm())} style={{padding:"10px 18px",background:C.white,color:C.textMid,border:`1px solid ${C.borderMid}`,borderRadius:2,fontSize:13,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif"}}>Clear Form</button>
              <button onClick={handleSubmit} style={{padding:"10px 26px",background:C.blue,color:C.white,border:"none",borderRadius:2,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif"}}
                onMouseEnter={e=>e.target.style.background="#106ebe"} onMouseLeave={e=>e.target.style.background=C.blue}>Submit Request →</button>
            </div>
          </div>
        </FSectionCard>
      </div>
    </div>
  </div>;
}

// ─── PORTFOLIO ──────────────────────────────────────────────────────────────
function Portfolio({projects,updateProject,navigate,archiveProject,restoreProject,archivedIds,initialProjectId,initialFilter}){
  const [selectedId,setSelectedId]=useState(initialProjectId||null);
  const [filter,setFilter]=useState(initialFilter||"all");
  const [responses,setResponses]=useState({});
  const [confirmArchive,setConfirmArchive]=useState(null);// projectId awaiting confirm

  const activeProjects=projects.filter(p=>!archivedIds.has(p.id));
  const archived=projects.filter(p=>archivedIds.has(p.id));

  const FILTERS=[["all","All"],["attention","Needs Attention"],["active","Active"],["pending","Pending Approval"],["completed","Completed"],["archived","Archived"]];
  const getFiltered=(f,list)=>{
    if(f==="all")return list.filter(p=>!archivedIds.has(p.id));
    if(f==="attention")return activeProjects.filter(p=>["active_behind","changes_requested"].includes(p.status));
    if(f==="active")return activeProjects.filter(p=>p.status.startsWith("active"));
    if(f==="pending")return activeProjects.filter(p=>["submitted","partially_approved","changes_requested"].includes(p.status));
    if(f==="completed")return activeProjects.filter(p=>p.status==="completed");
    if(f==="archived")return archived;
    return list;
  };
  const filtered=getFiltered(filter,projects);
  const selected=selectedId?projects.find(p=>p.id===selectedId):null;

  const toggleSection=(pid,sk)=>updateProject(pid,p=>({...p,agreedSections:{...p.agreedSections,[sk]:!p.agreedSections[sk]}}));
  const submitResponse=(pid,aid,qid)=>{
    const resp=responses[qid]?.trim();if(!resp)return;
    updateProject(pid,p=>{
      const na=p.approvals.map(a=>a.id!==aid?a:{...a,status:"pending",questions:a.questions.map(q=>q.id!==qid?q:{...q,response:resp,resolved:true})});
      const allRes=na.every(a=>a.questions.every(q=>q.resolved));
      return {...p,approvals:na,status:allRes&&p.status==="changes_requested"?"submitted":p.status};
    });
    setResponses(r=>({...r,[qid]:""}));
  };
  const approveSection=(pid,aid)=>updateProject(pid,p=>{
    const na=p.approvals.map(a=>a.id!==aid?a:{...a,status:"approved",approvedAt:new Date().toISOString().split("T")[0]});
    const t1=na.filter(a=>a.tier===1).every(a=>a.status==="approved");
    const all=na.every(a=>a.status==="approved");
    return {...p,approvals:na,status:all?"approved":t1?"partially_approved":p.status};
  });

  if(selected){
    const isArchived=archivedIds.has(selected.id);
    const sc=STATUS_CFG[selected.status]||{};const tc=TYPE_CFG[selected.changeType]||{};const pc=PRI_CFG[selected.priority]||{};
    const agreedCount=Object.values(selected.agreedSections).filter(Boolean).length;
    const content=selected.adkarContent||{};

    return <div style={{minHeight:"calc(100vh - 44px)",background:C.bg,fontFamily:"'Segoe UI',Tahoma,sans-serif"}}>
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"16px 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,fontSize:12,color:C.textMuted}}>
            <button onClick={()=>navigate("home")} style={{background:"none",border:"none",color:C.purple,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontSize:12,padding:0}}>Home</button><span>›</span>
            <button onClick={()=>setSelectedId(null)} style={{background:"none",border:"none",color:C.purple,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontSize:12,padding:0}}>Project Portfolio</button><span>›</span>
            <span style={{color:C.textMid,fontWeight:600}}>{selected.id}</span>
          </div>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:20}}>
            <div style={{flex:1,minWidth:0}}>
              <h1 style={{margin:"0 0 10px",fontSize:22,fontWeight:600,color:C.text,lineHeight:1.3}}>{selected.title}</h1>
              {/* Labelled pills */}
              <div style={{display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-start",marginBottom:12}}>
                {[
                  {label:"Status",pill:<Pill label={sc.label} color={sc.color} bg={sc.bg} size={12}/>},
                  {label:"Change Type",pill:<Pill label={tc.label} color={tc.color} bg={tc.bg}/>},
                  {label:"Priority",pill:<Pill label={pc.label} color={pc.color} bg={pc.bg}/>},
                ].map(({label,pill})=>(
                  <div key={label} style={{display:"flex",flexDirection:"column",gap:3,alignItems:"flex-start"}}>
                    <span style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:0.7}}>{label}</span>
                    {pill}
                  </div>
                ))}
                <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"flex-start"}}>
                  <span style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:0.7}}>Owner</span>
                  <span style={{fontSize:12,color:C.textMid,fontWeight:500}}>{selected.owner} · {selected.department}</span>
                </div>
              </div>
              {/* Progress + corrective action */}
              {selected.projectProgress.pct>0&&(
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 14px",background:selected.status==="active_behind"?C.redLight:C.greenLight,border:`1px solid ${selected.status==="active_behind"?C.red+"44":C.greenBorder}`,borderRadius:3,marginBottom:4}}>
                  <div style={{width:120,flexShrink:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:11,fontWeight:700,color:selected.status==="active_behind"?C.red:C.green}}>Project progress</span>
                      <span style={{fontSize:11,fontWeight:800,color:selected.status==="active_behind"?C.red:C.green}}>{selected.projectProgress.pct}%</span>
                    </div>
                    <div style={{height:5,background:"rgba(0,0,0,0.08)",borderRadius:3}}>
                      <div style={{height:"100%",width:`${selected.projectProgress.pct}%`,background:selected.status==="active_behind"?C.red:C.green,borderRadius:3}}/>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:selected.status==="active_behind"?C.red:C.green,flex:1}}>{selected.projectProgress.note}</div>
                </div>
              )}
              {selected.status==="active_behind"&&selected.projectProgress.correctiveAction&&(
                <div style={{padding:"10px 14px",background:C.orangeLight,border:`1px solid ${C.orangeBorder}`,borderLeft:`3px solid ${C.orange}`,borderRadius:"0 3px 3px 0",marginTop:6}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.orange,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Corrective Action Plan</div>
                  <div style={{fontSize:13,color:C.textMid,lineHeight:1.65}}>{selected.projectProgress.correctiveAction}</div>
                </div>
              )}
            </div>
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,padding:"8px 16px",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:700,color:C.purple}}>{agreedCount}/6</div>
                <div style={{fontSize:11,color:C.textMuted}}>Sections agreed</div>
              </div>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,padding:"8px 16px",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:700,color:selected.approvals.filter(a=>a.status==="approved").length===selected.approvals.length?C.green:C.orange}}>{selected.approvals.filter(a=>a.status==="approved").length}/{selected.approvals.length}</div>
                <div style={{fontSize:11,color:C.textMuted}}>Approved</div>
              </div>
              {isArchived?(
                <button onClick={()=>restoreProject(selected.id)} style={{padding:"8px 16px",fontSize:12,fontWeight:600,color:C.blue,background:C.blueLight,border:`1px solid ${C.blueBorder}`,borderRadius:3,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",alignSelf:"center"}}>Restore Project</button>
              ):(
                <button onClick={()=>archiveProject(selected.id)} style={{padding:"8px 16px",fontSize:12,fontWeight:600,color:C.textMuted,background:C.white,border:`1px solid ${C.border}`,borderRadius:3,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",alignSelf:"center"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.orange;e.currentTarget.style.color=C.orange;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}}>Archive Project</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 32px 80px",display:"grid",gridTemplateColumns:"1fr 256px",gap:20}}>
        <div>
          {SECTION_ORDER.filter(s=>s!=="approvals").map(sid=>{
            const m=ADKAR_META[sid];const agreed=selected.agreedSections[sid];
            const sectionContent=content[sid]||[];
            return <div key={sid} style={{background:C.white,border:`1px solid ${agreed?m.color+"44":C.border}`,borderRadius:3,marginBottom:10,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 18px",background:agreed?m.bg:C.white,borderBottom:`1px solid ${agreed?m.color+"22":C.border}`}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:agreed?m.color:C.white,border:`2px solid ${agreed?m.color:C.borderMid}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:12,fontWeight:800,color:agreed?C.white:m.color,fontFamily:"Georgia,serif"}}>{m.letter}</span>
                </div>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:agreed?m.color:C.text}}>{m.label}</div><div style={{fontSize:12,color:C.textLight}}>{m.desc}</div></div>
                <button onClick={()=>toggleSection(selected.id,sid)} style={{padding:"5px 14px",fontSize:12,fontWeight:600,background:agreed?C.white:m.color,color:agreed?m.color:C.white,border:`1px solid ${m.color}`,borderRadius:2,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif"}}>{agreed?"Agreed — Unlock":"Agree to section"}</button>
              </div>
              <div style={{padding:"16px 20px"}}>
                {sectionContent.length>0?(
                  sectionContent.map((item,ci)=>(
                    <div key={ci} style={{marginBottom:ci<sectionContent.length-1?18:0}}>
                      <h4 style={{margin:"0 0 6px",fontSize:13,fontWeight:700,color:agreed?m.color:C.textMid,borderBottom:`1px solid ${C.border}`,paddingBottom:4}}>{item.heading}</h4>
                      <p style={{margin:0,fontSize:13,color:C.textMid,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{item.body}</p>
                    </div>
                  ))
                ):(
                  <p style={{margin:0,fontSize:13,color:C.textLight,fontStyle:"italic"}}>No content defined for this section yet. Click "Agree to section" once content has been reviewed and finalized.</p>
                )}
                {agreed&&<div style={{marginTop:12,padding:"8px 12px",background:m.color+"10",border:`1px solid ${m.color}22`,borderRadius:2,fontSize:12,color:m.color,fontWeight:600}}>This section has been agreed to and is locked. Click "Agreed — Unlock" to make edits.</div>}
              </div>
            </div>;
          })}

          {/* Approvals — changed from red to purple */}
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 18px",background:C.purpleLight,borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:C.purple,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:12,fontWeight:800,color:C.white}}>✓</span></div>
              <div><div style={{fontSize:14,fontWeight:600,color:C.purple}}>Approvals</div><div style={{fontSize:12,color:C.textLight}}>Leadership sign-offs required before this project may begin.</div></div>
            </div>
            {selected.approvals.map((a,i)=>{
              const openQ=a.questions.filter(q=>!q.resolved);
              return <div key={a.id} style={{padding:"14px 18px",borderBottom:i<selected.approvals.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,justifyContent:"space-between"}}>
                  <div style={{display:"flex",gap:10,flex:1}}>
                    <Avatar initials={a.name.split(" ").map(n=>n[0]).join("").slice(0,2)} color={a.status==="approved"?C.green:a.status==="changes_requested"?C.orange:C.textMuted} size={36}/>
                    <div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{a.name}</div><div style={{fontSize:12,color:C.textLight}}>{a.role} · {a.dept} · Tier {a.tier}</div>{a.approvedAt&&<div style={{fontSize:11,color:C.green,marginTop:2}}>Approved {a.approvedAt}</div>}</div>
                  </div>
                  <div style={{flexShrink:0,display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                    <Pill label={a.status==="approved"?"Approved":a.status==="changes_requested"?"Question pending":"Pending review"} color={a.status==="approved"?C.green:a.status==="changes_requested"?C.orange:C.textMuted} bg={a.status==="approved"?C.greenLight:a.status==="changes_requested"?C.orangeLight:C.bgMid}/>
                    {a.status==="pending"&&agreedCount===6&&<button onClick={()=>approveSection(selected.id,a.id)} style={{fontSize:11,color:C.green,background:C.greenLight,border:`1px solid ${C.greenBorder}`,borderRadius:2,padding:"3px 10px",cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontWeight:700}}>Simulate Approval</button>}
                  </div>
                </div>
                {openQ.map(q=>(
                  <div key={q.id} style={{marginTop:10,padding:"10px 14px",background:C.orangeLight,border:`1px solid ${C.orangeBorder}`,borderRadius:3,borderLeft:`3px solid ${C.orange}`}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.orange,marginBottom:4}}>Question from {a.name}</div>
                    <div style={{fontSize:13,color:C.textMid,marginBottom:8}}>{q.text}</div>
                    <textarea value={responses[q.id]||""} onChange={e=>setResponses(r=>({...r,[q.id]:e.target.value}))} rows={2} placeholder="Type your response here…" style={{width:"100%",padding:"7px 10px",fontSize:12.5,border:`1px solid ${C.borderMid}`,borderRadius:2,fontFamily:"'Segoe UI',sans-serif",boxSizing:"border-box",resize:"vertical"}}/>
                    <div style={{display:"flex",justifyContent:"flex-end",marginTop:6}}>
                      <button onClick={()=>submitResponse(selected.id,a.id,q.id)} style={{padding:"5px 14px",fontSize:12,fontWeight:600,background:C.purple,color:C.white,border:"none",borderRadius:2,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif"}}>Submit Response →</button>
                    </div>
                  </div>
                ))}
              </div>;
            })}
          </div>
        </div>

        {/* Plan sidebar */}
        <div style={{display:"flex",flexDirection:"column",gap:12,position:"sticky",top:68,alignSelf:"flex-start"}}>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
            <div style={{padding:"10px 14px",background:C.nav}}><span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.55)",textTransform:"uppercase",letterSpacing:0.8}}>Plan Progress</span></div>
            {SECTION_ORDER.filter(s=>s!=="approvals").map(sid=>{const m=ADKAR_META[sid];const agreed=selected.agreedSections[sid];return(
              <div key={sid} onClick={()=>toggleSection(selected.id,sid)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.bgMid} onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                <div style={{width:8,height:8,borderRadius:"50%",background:agreed?m.color:C.borderMid,flexShrink:0}}/>
                <span style={{flex:1,fontSize:12.5,color:agreed?m.color:C.textLight,fontWeight:agreed?600:400}}>{m.label}</span>
                <span style={{fontSize:11,color:C.green}}>{agreed?"✓":""}</span>
              </div>
            );})}
            <div style={{padding:"10px 14px"}}>
              <div style={{height:4,background:C.border,borderRadius:2}}><div style={{height:"100%",width:`${Math.round(agreedCount/6*100)}%`,background:agreedCount===6?C.green:C.purple,borderRadius:2}}/></div>
              <div style={{fontSize:11,color:C.textMuted,marginTop:4}}>{agreedCount} of 6 sections agreed</div>
            </div>
          </div>
          {/* Project Information with financial benefits */}
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:3,padding:"12px 14px"}}>
            <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>Project Information</div>
            {[["Owner",selected.owner],["Sponsor",selected.sponsor],["Department",selected.department],["Start",selected.startDate],["End",selected.endDate],["Est. Cost",selected.estimatedCost]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:C.textMuted}}>{l}</span>
                <span style={{fontSize:12,fontWeight:600,color:C.textMid,textAlign:"right",maxWidth:130}}>{v}</span>
              </div>
            ))}
            {selected.financialBenefits&&<>
              <div style={{height:1,background:C.border,margin:"10px 0"}}/>
              <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:7}}>Financial Benefits</div>
              <p style={{margin:0,fontSize:12,color:C.green,lineHeight:1.6,fontWeight:500}}>{selected.financialBenefits}</p>
            </>}
          </div>
        </div>
      </div>
    </div>;
  }

  return <div style={{minHeight:"calc(100vh - 44px)",background:C.bg,fontFamily:"'Segoe UI',Tahoma,sans-serif"}}>
    <div style={{background:C.white,borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 32px"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,paddingTop:16,marginBottom:12,fontSize:12,color:C.textMuted}}>
          <button onClick={()=>navigate("home")} style={{background:"none",border:"none",color:C.purple,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontSize:12,padding:0}}>Home</button><span>›</span><span style={{color:C.textMid,fontWeight:600}}>Project Portfolio</span>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:16,gap:20}}>
          <div><h1 style={{margin:"0 0 4px",fontSize:24,fontWeight:600,color:C.text}}>Project Portfolio</h1><p style={{margin:0,fontSize:13.5,color:C.textLight}}>{projects.length} change request{projects.length!==1?"s":""} · Click any project to view its ADKAR plan.</p></div>
          <button onClick={()=>navigate("intake")} style={{padding:"8px 18px",background:C.purple,color:C.white,border:"none",borderRadius:2,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",flexShrink:0}}>Submit New Request</button>
        </div>
        <div style={{display:"flex",marginBottom:-1,flexWrap:"wrap"}}>
          {FILTERS.map(([id,label])=>{
            const count=getFiltered(id,projects).length;
            return <button key={id} onClick={()=>setFilter(id)} style={{background:"none",border:"none",borderBottom:`2px solid ${filter===id?C.purple:"transparent"}`,padding:"9px 16px",cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontSize:13.5,color:filter===id?C.purple:C.textLight,fontWeight:filter===id?600:400,marginBottom:-1}}
              onMouseEnter={e=>{if(filter!==id){e.target.style.color=C.textMid;e.target.style.borderBottomColor=C.borderMid;}}}
              onMouseLeave={e=>{if(filter!==id){e.target.style.color=C.textLight;e.target.style.borderBottomColor="transparent;"}}}>{label} <span style={{fontSize:12,color:filter===id?C.purple:C.textMuted}}>({count})</span></button>;
          })}
        </div>
      </div>
    </div>
    <div style={{maxWidth:1100,margin:"0 auto",padding:"22px 32px 80px"}}>
      <div style={{border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
        {/* Column headers */}
        {filtered.length>0&&<div style={{display:"grid",gridTemplateColumns:"130px 1fr 120px 100px 110px 160px 110px",background:C.bgMid,borderBottom:`1px solid ${C.border}`}}>
          {["Status / Progress","Project","Type","Priority","Cost","Financial Benefit",""].map(h=><div key={h} style={{padding:"8px 10px",fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:0.3}}>{h}</div>)}
        </div>}
        {filtered.length===0&&<div style={{padding:"40px",textAlign:"center",color:C.textMuted,fontSize:14}}>{filter==="archived"?"No archived projects.":"No projects match this filter."}</div>}
        {filtered.map((proj,i)=>{
          const sc=STATUS_CFG[proj.status]||{};const tc=TYPE_CFG[proj.changeType]||{};const pc=PRI_CFG[proj.priority]||{};
          const approvedCount=proj.approvals.filter(a=>a.status==="approved").length;
          const hasOpenQ=proj.approvals.some(a=>a.questions.some(q=>!q.resolved));
          const isNew=!INITIAL_PROJECTS.some(ip=>ip.id===proj.id);
          const isArchived=archivedIds.has(proj.id);
          const awaitingConfirm=confirmArchive===proj.id;
          const hi=["active_behind","changes_requested"].includes(proj.status)&&!isArchived;
          return <div key={proj.id}
            style={{display:"grid",gridTemplateColumns:"130px 1fr 120px 100px 110px 160px 110px",borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",borderLeft:`3px solid ${isArchived?C.borderMid:sc.color}`,background:isArchived?"#fafafa":hi?C.orangeLight+"33":C.white,opacity:isArchived?0.8:1}}
            onMouseEnter={e=>e.currentTarget.style.background=isArchived?"#f0f0f0":hi?C.orangeLight+"66":C.bgMid}
            onMouseLeave={e=>e.currentTarget.style.background=isArchived?"#fafafa":hi?C.orangeLight+"33":C.white}>
            {/* Status + progress */}
            <div style={{padding:"12px 10px",display:"flex",flexDirection:"column",gap:5,justifyContent:"center",cursor:"pointer"}} onClick={()=>setSelectedId(proj.id)}>
              {isArchived
                ?<span style={{fontSize:11,fontWeight:700,color:C.textMuted,background:C.bgMid,padding:"2px 7px",borderRadius:10,lineHeight:1.4,display:"inline-block",alignSelf:"flex-start"}}>Archived</span>
                :<span style={{fontSize:11,fontWeight:700,color:sc.color,background:sc.bg,padding:"2px 7px",borderRadius:10,lineHeight:1.4,display:"inline-block",alignSelf:"flex-start"}}>{sc.label}</span>}
              {!isArchived&&proj.projectProgress.pct>0&&(
                <div style={{width:"100%"}}>
                  <div style={{height:4,background:"rgba(0,0,0,0.08)",borderRadius:2,marginBottom:2}}>
                    <div style={{height:"100%",width:`${proj.projectProgress.pct}%`,background:sc.color,borderRadius:2}}/>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,color:sc.color}}>{proj.projectProgress.pct}% complete</span>
                </div>
              )}
              {!isArchived&&<span style={{fontSize:10,color:C.textMuted}}>{approvedCount}/{proj.approvals.length} approvals</span>}
            </div>
            {/* Project */}
            <div style={{padding:"10px 10px",cursor:"pointer"}} onClick={()=>setSelectedId(proj.id)}>
              <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
                <code style={{fontSize:10,fontFamily:"monospace",color:C.textMuted,background:C.bgMid,padding:"1px 5px",borderRadius:2}}>{proj.id}</code>
                {hasOpenQ&&!isArchived&&<span style={{fontSize:10,fontWeight:700,color:C.orange,background:C.orangeLight,padding:"1px 6px",borderRadius:10}}>Response needed</span>}
                {isNew&&<span style={{fontSize:10,fontWeight:700,color:C.green,background:C.greenLight,padding:"1px 6px",borderRadius:10}}>New</span>}
              </div>
              <div style={{fontSize:13,fontWeight:600,color:isArchived?C.textMuted:C.text,lineHeight:1.3,marginBottom:2}}>{proj.title.split(" ").slice(0,8).join(" ")}{proj.title.split(" ").length>8?"…":""}</div>
              <div style={{fontSize:11,color:C.textMuted}}>{proj.owner} · {proj.department}</div>
            </div>
            {/* Type */}
            <div style={{padding:"12px 10px",display:"flex",alignItems:"center",cursor:"pointer"}} onClick={()=>setSelectedId(proj.id)}>
              <Pill label={tc.label} color={tc.color} bg={tc.bg}/>
            </div>
            {/* Priority */}
            <div style={{padding:"12px 10px",display:"flex",alignItems:"center",cursor:"pointer"}} onClick={()=>setSelectedId(proj.id)}>
              <Pill label={pc.label} color={pc.color} bg={pc.bg}/>
            </div>
            {/* Cost */}
            <div style={{padding:"12px 10px",fontSize:12,color:C.textLight,display:"flex",alignItems:"center",cursor:"pointer"}} onClick={()=>setSelectedId(proj.id)}>
              {proj.estimatedCost||"—"}
            </div>
            {/* Financial Benefit */}
            <div style={{padding:"12px 10px",fontSize:11,color:C.green,fontWeight:600,lineHeight:1.35,display:"flex",alignItems:"center",cursor:"pointer"}} onClick={()=>setSelectedId(proj.id)}>
              {proj.financialBenefits?proj.financialBenefits.split(/\.\s/)[0]+".":"—"}
            </div>
            {/* Actions */}
            <div style={{padding:"10px 10px",display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
              {isArchived?(
                <button onClick={e=>{e.stopPropagation();restoreProject(proj.id);}} style={{padding:"4px 10px",fontSize:11,fontWeight:600,color:C.blue,background:C.blueLight,border:`1px solid ${C.blueBorder}`,borderRadius:2,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",whiteSpace:"nowrap"}}>Restore</button>
              ):(
                awaitingConfirm?(
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    <button onClick={e=>{e.stopPropagation();archiveProject(proj.id);setConfirmArchive(null);}} style={{padding:"4px 8px",fontSize:10,fontWeight:700,color:C.white,background:C.orange,border:"none",borderRadius:2,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif"}}>Confirm</button>
                    <button onClick={e=>{e.stopPropagation();setConfirmArchive(null);}} style={{padding:"4px 8px",fontSize:10,color:C.textMuted,background:C.white,border:`1px solid ${C.border}`,borderRadius:2,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif"}}>Cancel</button>
                  </div>
                ):(
                  <button onClick={e=>{e.stopPropagation();setConfirmArchive(proj.id);}} style={{padding:"4px 10px",fontSize:11,color:C.textMuted,background:C.white,border:`1px solid ${C.border}`,borderRadius:2,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",whiteSpace:"nowrap"}}>Archive</button>
                )
              )}
            </div>
          </div>;
        })}
      </div>
    </div>
  </div>;
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App(){
  const [projects,setProjects]=useState(INITIAL_PROJECTS);
  const [archivedIds,setArchivedIds]=useState(new Set());
  const [page,setPage]=useState("home");
  const [pageParams,setPageParams]=useState({});
  const [slideDoc,setSlideDoc]=useState(null);
  const [demoIndex,setDemoIndex]=useState(0);
  const [demoLoaded,setDemoLoaded]=useState(false);
  const top=useRef(null);

  const updateProject=(id,fn)=>setProjects(prev=>prev.map(p=>p.id===id?fn(p):p));
  const addProject=p=>setProjects(prev=>[...prev,p]);
  const archiveProject=id=>setArchivedIds(prev=>{const n=new Set(prev);n.add(id);return n;});
  const restoreProject=id=>setArchivedIds(prev=>{const n=new Set(prev);n.delete(id);return n;});
  const navigate=(dest,params={})=>{setPage(dest);setPageParams(params);top.current?.scrollIntoView({behavior:"instant"});};
  const openDoc=key=>setSlideDoc(key);

  // Active (non-archived) projects for dashboard
  const activeProjects=projects.filter(p=>!archivedIds.has(p.id));

  return <div ref={top}>
    <Nav current={page} navigate={navigate} totalProjects={projects.length}/>
    {page==="home"&&<LandingPage navigate={navigate} openDoc={openDoc}/>}
    {page==="dashboard"&&<Dashboard projects={activeProjects} navigate={navigate} openDoc={openDoc}/>}
    {page==="intake"&&<IntakeForm addProject={addProject} navigate={navigate} openDoc={openDoc} demoIndex={demoIndex} setDemoIndex={setDemoIndex} demoLoaded={demoLoaded} setDemoLoaded={setDemoLoaded}/>}
    {page==="portfolio"&&<Portfolio projects={projects} updateProject={updateProject} navigate={navigate} archiveProject={archiveProject} restoreProject={restoreProject} archivedIds={archivedIds} initialProjectId={pageParams.projectId} initialFilter={pageParams.filter}/>}
    {slideDoc&&<SlidePanel docKey={slideDoc} onClose={()=>setSlideDoc(null)}/>}
  </div>;
}
