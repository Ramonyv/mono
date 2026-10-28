# Mono Workspace

A screenshot-driven freelancer workspace covering Today, Projects, Clients, Tasks, Calendar, Invoices, Expenses, Budget, Investments, Notes and Meetings.

## Run

- `npm install`
- `npm run dev` — starts at http://localhost:4175 and selects the next available port if occupied.
- `npm run build` — generates the bundled Hugeicons subset and checks application syntax.
- `npm test` — checks screen rendering and linked workflows using a DOM environment.

The deployable application is in `dist/`. No external font or icon CDN is required. Inter and the Hugeicons stroke-rounded subset are bundled locally.

## Implemented workflows

- Separate workspaces, including a populated Personal Workspace and empty user-created workspaces.
- Projects, clients and tasks with searchable/filterable tables, contextual inspectors, selection and alternate card/board views.
- Task status, priority, subtasks, comments, attachments and project deliverables.
- Calendar week, month, day and agenda views, with event details and creation/editing.
- Invoice line items, tax and totals, live invoice previews, payment recording and print-to-PDF through the browser dialog.
- Expenses with receipt uploads, project/client relationships, payment methods and reimbursement/billable flags.
- Budget category amounts, allocation previews and alert/carry-forward settings.
- Investments with asset type selection, value/gain calculation and asset suggestions.
- Notes with rich text formatting, tags, attachments and live preview.
- Meetings with participants, agendas, links, reminders, attachments and live preview.
- Quick Add, workspace-wide search and time tracking.
- Shared date/time/month pickers, checkmarks and interface controls use bundled Hugeicons with a 1.5px stroke.

## Assumptions and current limits

- Data is local to the browser and origin. Records use localStorage; uploaded file bytes use IndexedDB. This implementation has no shared-account backend or cross-device synchronization.
- Dates and sample summaries preserve the references' April 2025 context. Some screenshots use inconsistent totals and record relationships; the demo preserves the visible reference summaries, while new workspaces use their own records.
- Send Invoice opens the user's email composer for review. Meeting invite/reminder options are saved locally; no background email or calendar service is connected.
- Investment charts and demo insights are illustrative, without live market data. The preview estimates annualized return from a single investment and current valuation; it does not model multiple cash flows.
- Reference sample attachments have metadata only. Newly uploaded files can be downloaded.
- Company marks are CSS representations and Hugeicons; original standalone company artwork and the profile photograph were not supplied.
- Browser visual capture was unavailable during implementation. DOM/workflow checks pass, but screenshot comparisons and final pixel-level corrections remain pending. The user authorized continuing implementation while capture is unavailable.

## Reference source

The supplied UI screenshots and token boards are the visual specification. Application code does not render screenshots as page backgrounds.

Hugeicons: https://hugeicons.com/docs
