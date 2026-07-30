# Acknowledgement Email Mapping

Talvanta Africa forwards validated submissions to Make.com through server-side
route handlers. The browser does not control the workflow identifier,
submission reference, or timestamp.

All three webhook payloads use the existing version 1.0 envelope:

- `eventType` identifies the workflow.
- `submissionId` is the server-generated submission reference.
- `submittedAt` is a server-generated ISO 8601 UTC timestamp.
- `data` contains the validated workflow-specific fields.

The existing `eventType` field is the submission-type field. Do not add or
expect a duplicate `submissionType` property.

## Candidate Registration

API route:
`POST /api/candidate-registration`

Make.com webhook environment variable:
`MAKE_CANDIDATE_WEBHOOK_URL`

Recipient name field:
`data.fullName`

Recipient email field:
`data.email`

Submission reference field:
`submissionId`

Submission timestamp field:
`submittedAt`

Submission type field:
`eventType` with the value `candidate.registration.created`

Useful context fields:

- `data.currentJobTitle`
- `data.employmentStatus`
- `data.yearsOfExperience`
- `data.keySkills`
- `data.preferredEmploymentTypes`
- `data.workplacePreferences`
- `data.preferredRoles`
- `data.availability`
- `data.careerInterests`

## Employer Recruitment Request

API route:
`POST /api/hire-talent`

Make.com webhook environment variable:
`MAKE_EMPLOYER_WEBHOOK_URL`

Recipient name field:
`data.contactPerson`

Recipient email field:
`data.workEmail`

Submission reference field:
`submissionId`

Submission timestamp field:
`submittedAt`

Submission type field:
`eventType` with the value `employer.hiring_enquiry.created`

Useful context fields:

- `data.organisationName`
- `data.jobTitle`
- `data.department`
- `data.employmentType`
- `data.numberOfPositions`
- `data.workplaceArrangement`
- `data.jobLocation`
- `data.recruitmentTimeline`
- `data.preferredService`

## Contact Enquiry

API route:
`POST /api/contact`

Make.com webhook environment variable:
`MAKE_CONTACT_WEBHOOK_URL`

Recipient name field:
`data.fullName`

Recipient email field:
`data.email`

Submission reference field:
`submissionId`

Submission timestamp field:
`submittedAt`

Submission type field:
`eventType` with the value `contact.enquiry.created`

Useful context fields:

- `data.organisation`
- `data.enquiryType`
- `data.subject`
- `data.message`

## API Success Responses

All three API routes use the existing shared success response:

```json
{
  "success": true,
  "message": "Workflow-specific success message.",
  "submissionId": "server-generated submission reference"
}
```

The frontends display `submissionId` only after the API confirms success. The
website does not return Make.com response bodies and does not claim that an
acknowledgement email has been delivered.

## Make.com Configuration

For each scenario, configure an acknowledgement email only after the existing
storage and processing steps that must succeed. Map the recipient and context
fields exactly as documented above. Keep the webhook response as a successful
2xx response only when the scenario has met the success criteria expected by
the website.

Test candidate, employer, and contact scenarios separately with clearly
fictional data. Confirm that the submission ID in the website response matches
the webhook payload, stored record, internal notification, and acknowledgement
email.

## Security Notes

- Webhook secrets must not be committed.
- Email delivery must be configured in Make.com.
- Acknowledgement messages must not expose private submission data.
- Submission references are not authentication credentials.
- Gmail delivery success must be tested in Make.com.
- Do not include full free-text submissions in acknowledgement emails when a
  concise summary is sufficient.
- Do not expose webhook URLs, shared secrets, credentials, or environment
  values in client code or email content.
