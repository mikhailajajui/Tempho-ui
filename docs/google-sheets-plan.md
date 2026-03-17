# Google Sheets Form Integration Plan

## Goal
Send the pricing form data to a Google Sheet when the user submits the form on `/myspace/forms` (App Router), using a Google Apps Script web app.

## Reference Script
We will adapt this working Apps Script (provided) and keep the same pattern:

- `doPost(e)` parses `e.parameter`
- append to a Sheet by ID
- send notification email
- return `OK`

## Data to Capture (current pricing form)
These fields exist in `src/app/pricing/page.tsx`:

- `name` (full name)
- `email`
- `phone`
- `gender`
- `occupants`
- `location`
- `moveInDate`
- `budget`
- `monthlyHouseholdIncome`
- `parking`
- `accommodationType`
- `creditScore`
- `currentStep` (optional)
- `submittedAt` (new timestamp)

## Sheet Columns (suggested)
Keep column order stable:

1. Submission ID
2. Full Name
3. Email
4. Phone
5. Gender
6. Occupants
7. Location
8. Move-in Date
9. Budget
10. Monthly Household Income
11. Parking
12. Accommodation Type
13. Credit Score
14. Current Step
15. Updated At

## Integration Steps

1. **Create Google Sheet**
   - Add the header row with the column list above.
   - Copy the Sheet ID from the URL.

2. **Create Apps Script**
   - `Extensions → Apps Script`
   - Paste the reference script and update:
     - `openById('<SHEET_ID>')`
     - `appendRow([...])` to match the column order
     - Notification email list

3. **Deploy as Web App**
   - `Deploy → New deployment → Web app`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Copy the Web App URL (this is the POST endpoint)

4. **Wire Up the Form Submit (Next.js)**
   - In `src/app/pricing/page.tsx`, inside `handleSubmit`:
     - `POST` to the Apps Script URL with `Content-Type: application/x-www-form-urlencoded` (or JSON, if the script is updated to parse JSON)
     - Send the fields listed above
     - Handle success/failure with UI feedback

5. **Test**
   - Submit the form locally at `http://localhost:3000/myspace/forms`
   - Verify:
     - row appears in the sheet
     - email notification arrives

## Request Payload (x-www-form-urlencoded)
Example keys to send:

- `submissionId`
- `name`
- `email`
- `phone`
- `gender`
- `occupants`
- `location`
- `moveInDate`
- `budget`
- `monthlyHouseholdIncome`
- `parking`
- `accommodationType`
- `creditScore`
- `currentStep`
- `updatedAt`

## App Script Notes
- If you want JSON payloads instead, update:
  - `const data = JSON.parse(e.postData.contents);`
  - And deploy again.
- Apps Script web apps sometimes cache; redeploy after edits.

## Files to Change (Next.js)
- `src/app/pricing/page.tsx` (form submission handler)

## Open Questions
- Which email(s) should receive notifications?
- Do you want to store partial submissions (step 1/2), or only final submit?
