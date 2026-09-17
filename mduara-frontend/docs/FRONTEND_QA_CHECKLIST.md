# M-Duara Frontend QA Checklist

Use this checklist after pulling the current frontend into a complete local checkout.

## 1. Clean local verification

From Windows Command Prompt in the repository root:

```bat
git status
npm install
npm run typecheck
npm run web
```

If the Expo cache is stale:

```bat
npx expo start --clear
```

A release candidate is not considered verified until `npm run typecheck` exits successfully and the web app completes the smoke tests below.

## 2. Guest journey

- Landing page renders without horizontal overflow at desktop, tablet and mobile widths.
- Sign In and Create Account open the authentication overlay.
- Goal marketplace shows Home Appliances, Travel, Education and Personal categories.
- Selecting a goal opens the savings-plan/matching flow.
- Back navigation preserves the selected goal and entered plan values.
- Matching results open the canonical public Chama detail page.
- Public Chama detail shows recruitment state, entry mode, contribution information, officials, Constitution/rules and the public-safe trust indicator.
- Closed/private Chamas do not display an active public application action.
- Prototype merchants are visibly labeled as prototype data.
- Reward controls never claim eligibility or redemption without backend confirmation.
- Starting an application from a selected Chama preserves that Chama through Login/Create Account and OTP.
- After authentication, the selected Chama opens the application review/acknowledgement flow rather than dropping the user onto an unrelated dashboard.
- Application submission remains a clearly labeled frontend prototype state and does not claim backend-confirmed membership or payment.

## 3. Authentication

Prototype accounts currently defined by the frontend fixtures:

| Role scenario | Phone | PIN |
| --- | --- | --- |
| Multi-Chama member / Secretary in one Chama | +254730200300 | 3579 |
| Chairperson | +254700000001 | 2468 |
| Treasurer | +254700000002 | 4680 |
| Member only | +254700000003 | 1234 |
| Platform Super Admin | +254750400500 | 5791 |

Verify:

- Wrong phone/PIN does not create a session.
- Correct phone/PIN signs in once and loads the memberships attached to that account.
- Registration does not expose a role selector.
- Terms checkbox is required before registration OTP step.
- Forgot-PIN flow validates phone, OTP step and 4-digit PIN confirmation without falsely claiming a backend reset has been persisted.

## 4. Multi-Chama member view

Using Aisha's prototype account:

- Personal dashboard lists all active Chamas.
- Total saved is calculated from the member's own membership records.
- Selecting a Chama changes the active Chama context.
- Opening a member Chama routes to the member workspace, not an official workspace.
- Trust score shown in member view is clearly labeled prototype and does not expose another member's private financial information.

## 5. Workspace switching

Using Aisha's account:

- Select Summertides '27.
- Workspace selector offers Member View and Secretary Workspace.
- Switching to Secretary does not require another login.
- Switching back to Member View does not lose the selected Chama.
- Changing to a Chama where Aisha is only a member removes the Secretary workspace option.
- If a previously open route is not allowed in the new context, the app immediately resolves to the correct allowed fallback without flashing the restricted screen.

## 6. Secretary workspace

- Secretary dashboard opens for the active Chama.
- Member Register filters All / Active / Pending / Suspended correctly.
- Member search works by name, role or status.
- Expanding a member reveals only privacy-safe register activity.
- Applications list selection updates the detail panel.
- Application review remains read-only until backend review/audit actions exist.
- Announcements / Meetings / Minutes tabs switch correctly.
- Announcement button stays disabled until the minimum valid subject/message is entered.
- Saving a prototype announcement updates only the frontend session and clearly says so.
- Minutes validation does not pretend to publish an official record.

## 7. Chair workspace

- Chair account opens Chair Workspace without a second login.
- Dashboard/overview identifies the current Chama.
- Recruitment route opens the dedicated Chair Recruitment screen with working Open/Paused state and capacity controls.
- Applications route opens the dedicated Chair Applications screen with local prototype decision state and explicit audit boundaries.
- Contributions route opens privacy-safe Chair contribution oversight rather than Treasurer reconciliation or a generic placeholder.
- Governance remains explicitly overview-only because it has no dedicated product route yet; it does not look falsely actionable.
- Reports opens the shared report centre.
- Member View remains available for the Chair's own personal membership activity.

## 8. Treasurer workspace

- Treasurer account opens Treasurer Workspace for the correct Chama.
- Contribution/reconciliation screen loads.
- Financial Monitor opens the dedicated Treasurer monitoring screen and remains scoped to the active Chama.
- Financial Monitor filters All / Confirmed / Processing / Failed and expands transaction detail.
- Reports/Statements opens the shared report centre.
- No raw private information for unrelated members is displayed outside the role's allowed operational view.
- Any mutation that requires backend reconciliation remains read-only or explicitly pending.

## 9. Super Admin

- Super Admin signs into Platform Administration.
- Dashboard, Users, Chamas, Payments, System Health and Audit Logs routes resolve.
- Users tabs/search/row expansion work.
- Chamas tabs/search/row expansion work.
- Chamas CSV export downloads the current filtered view on web.
- Non-web export is visibly unavailable instead of silently failing.
- Payments filters and expandable transaction detail work.
- Payment detail does not expose fake reversal/retry actions.
- System Health Refresh changes only the local prototype timestamp and says so.
- Service rows expand/collapse and do not expose unaudited restart/replay controls.


## 10. Shared authenticated pages

For Member, Chair, Secretary, Treasurer and Super Admin where the route is available:

- Support Tickets opens a real prototype ticket workspace: create local ticket, filter All/Open/Resolved, search and inspect ticket detail.
- Reports opens a real report-preview workspace with period selection and no fake production export.
- Notifications supports All/Unread, expand/collapse and local mark-read / mark-all-read state.
- Settings supports local reminder/language preferences; security-sensitive changes remain visibly backend-gated.
- My Profile shows the one-identity/many-Chamas model, membership roles and local editable name/email preview while keeping verified phone read-only.

## 11. Responsive smoke test

Test at approximately:

- 1440 px desktop
- 1024 px laptop/tablet landscape
- 768 px tablet
- 390 px phone

Verify:

- No horizontal page overflow.
- Sidebar collapses on desktop.
- Mobile sidebar opens/closes over the content.
- Mobile bottom navigation remains reachable.
- Cards wrap instead of clipping.
- Long Chama names do not destroy layout.
- Authentication overlay remains usable on small screens and with the on-screen keyboard.

## 12. Accessibility smoke test

- Keyboard can reach major web controls in a logical order.
- Tabs expose selected state.
- Expandable rows expose expanded state.
- Chama/workspace selectors expose expanded and selected state.
- Checkboxes expose checked state.
- Icon-only buttons have accessible labels.
- Disabled actions are visibly disabled and accompanied by explanatory text where the reason is not obvious.
- Primary text and important states remain legible in both compact and wide layouts.

## 13. Release gate

Do not mark the frontend release-ready unless all of the following are true:

- [ ] `npm install` completes successfully.
- [ ] `npm run typecheck` exits with code 0.
- [ ] `npm run web` starts successfully.
- [x] Every visible navigation path has an explicit real-screen resolver.
- [x] Zero visible navigation paths intentionally resolve to the generic ModuleState placeholder.
- [x] Finish-up source regression: 16 changed files transpile with zero syntax diagnostics.
- [ ] Guest flow smoke test passes.
- [ ] Multi-Chama/workspace switching smoke test passes.
- [ ] Secretary smoke test passes.
- [ ] Chair smoke test passes.
- [ ] Treasurer smoke test passes.
- [ ] Super Admin smoke test passes.
- [ ] Responsive smoke test passes.
- [ ] Accessibility smoke test passes.
- [ ] No visible control is decorative while looking actionable.
- [ ] No frontend-only state is presented as a production-confirmed payment, approval, reward, trust calculation or administrative mutation.
