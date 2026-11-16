# Contribute a competition

1. Create a branch and add a folder under `competitions/` using a stable, lowercase, hyphenated slug. Start from an existing entry.
2. Add `competition.yaml`. Match the folder name to the slug, set `source_url` to the official organizer page, and use `last_verified` for the date you checked it.
3. Add `README.md` with an H1 title, a short plain-text summary paragraph, then a `## How to start` heading and a short first paragraph. You can add more Markdown to that section. Include entry instructions for open events and how to find results for closed events.
4. Run `npm ci` and `npm run validate`, then open a pull request.

## Dates and links

- Use `deadline.at` for an announced time, including the UTC offset, and `deadline.time_zone` for the organizer's IANA time zone.
- Use `deadline.day` for a date-only deadline and supply the organizer's time zone. Set `opens_on` when the submission opening date is known. For rolling benchmarks, omit the deadline.
- Use `entry` for a direct registration, submission, or waitlist link. Add published write-ups and results under `solutions` as HTTPS links.
- Keep the slug when updating an existing entry so its website URL continues to work.

Merging catalog changes to `main` triggers the site's Vercel Deploy Hook after validation. The repository maintainer sets the hook URL as the `VERCEL_DEPLOY_HOOK_URL` Actions secret. Use the workflow's manual run on `main` to retry a deployment after fixing its configuration.
