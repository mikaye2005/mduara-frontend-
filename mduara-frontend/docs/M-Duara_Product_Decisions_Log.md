# M-Duara Product Decisions & Open Architecture Log

These decisions were confirmed during frontend prototype review and must be treated as product constraints unless explicitly changed later.

## PD-01: One identity, many Chamas
A user has one login identity and may belong to any number of Chamas. No separate credentials are created per Chama.

## PD-02: Base Member + optional official office
Every Chama participant has Member capabilities. A membership may hold one official office: Chairperson, Secretary or Treasurer.

## PD-03: Maximum one official office per Chama
The same membership can never be Secretary + Treasurer, Chair + Secretary, etc.

## PD-04: Official role is Chama-scoped
A role held in Chama A grants no official permissions in Chama B.

## PD-05: Officials still use Member View
Chairperson, Secretary and Treasurer can view their own savings, contributions, loans, statements and normal member experience.

## PD-06: Workspace switching, not account switching
Authenticated officials switch between Member View and their official workspace for the active Chama. They do not log into a second account.

## PD-07: Super Admin is platform-scoped
Super Admin is not publicly selectable and is independent of Chama membership. A platform admin may separately be a Chama member.

## PD-08: No public role picker
Login/registration never asks the user to choose Chair, Secretary, Treasurer or Super Admin. Authorization comes from backend membership/platform context.

## PD-09: Landing is a single-page website
Explore Chamas, How it works, Features, Safety & Trust, Pricing and FAQs scroll to sections on the same landing page.

## PD-10: View Chama opens real selected detail
Public Chama cards open the selected Chama's officials, rules, contribution/commitment data and entry method.

## PD-11: Auth-gated application resumes intent
A signed-out visitor can create/login then resume the same Chama application without rediscovery.

## PD-12: New logo is source branding, not drop-in artwork
The supplied logo is the approved source mark but must be adapted into palette-consistent transparent/inverse/compact variants before product use.

## PD-13: Phase 1 is goal-based saving
Phase 1 user journey: individual goal → group formation around similar goals → contributions → progress tracking → KSh 500 commitment mechanism → trust score → marketplace/merchant reward.

## PD-14: Approved Mbogi categories
HOME APPLIANCES: Washing machine, Fridge, TV, Cooker. TRAVEL: Diani, Zanzibar, Dubai, Maasai Mara. EDUCATION: School fees, Professional course, University fees. PERSONAL: Laptop, Phone, Furniture.

## PD-15: Goal aggregate card pattern
Goal cards may show metrics like Washing Machine Goals / 87 members saving / KSh 3.8M total target value / 3 partner merchants; values must eventually come from backend aggregates.

## PD-16: Prototype uses centralized mock data
Until live APIs are connected, all prototype views must share one deterministic mock-data/state layer so screens cannot disagree.

## PD-17: No dead interaction rule
Any control that looks clickable must work, be disabled with a reason, or be removed.

