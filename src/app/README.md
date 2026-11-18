# BusinessBee Africa — Startup Profile Redesign

This package contains a redesigned editorial startup profile page intended to make a company profile feel like a digital company feature rather than a plain directory record.

## Files

- `page.tsx` — replacement for the current dynamic profile page.
- `profile.css` — replacement stylesheet for the profile page.
- `startup-content.ts` — illustrative, structured content for three sample startup profiles.

## Integration

1. Replace the current startup profile `page.tsx` with this `page.tsx`.
2. Replace the current `profile.css` with this stylesheet.
3. Add `startup-content.ts` alongside the existing `data.ts` file (the import in `page.tsx` assumes it is one directory above the route page, beside `data.ts`).
4. Keep the existing `data.ts` and its `PROFILES` export. The new page uses the existing `Profile` records for identity, routing and fallback content.
5. Confirm the relative import paths match your actual folder structure. If `startup-content.ts` is placed elsewhere, update its import.

## Design notes

- Uses the existing dark BBA palette and restrained green accents.
- Includes company identity, editorial hero, overview, company snapshot, product showcase, leadership, milestones, funding and ecosystem connections.
- Optional sections render only when structured content exists.
- Existing non-startup profiles retain a simpler fallback rather than being forced into a startup-specific layout.
- The `STARTUP_CONTENT` values are deliberately marked as illustrative in the UI. They are mock content to demonstrate layout and hierarchy, not verified company facts.
- Product and cover imagery use remote image URLs with `unoptimized`, consistent with the existing page's current approach.

## Before production

Replace demo copy, names, funding, milestones, market lists and partner/investor labels with sourced company information. Remove or adapt the design-preview ribbon when the directory is populated with real records.
