# GitHub Copilot Prompts

```markdown
@workspace We need to create two new endpoints to this project. In order to do that, first, analyze and understand the current code in the backend folder.
```

```markdown
@workspace Following the best practices for Domain-Driven Design and SOLID and DRY principles, add a new endpoint `GET /positions/:id/candidates` that will retrieve all the candidates that are in process for the positions with the ID `:id`.

The endpoint must provide an array of Candidate objects that include the following information of each candidate:
- Candidate's Full Name
- Current Interview Step to identify the current step
- Average Score with the calculation of the average of each score for each interview the candidate has passed.

Besides that, the endpoint must be error proof handling all the possible errors for invalid candidate ID, candidate ID not found, server error, etc.
```

```markdown
@workspace Explain what would be need to update the step where a candidate is in an application.
```

```markdown
@workspace Following the best practices for Domain-Driven Design and SOLID and DRY principles, add a new endpoint `PUT position/:positionId/candidate/:candidateId/step/:step` that will update the current interview step to `:step` for the given candidate `:candidateId` and position `positionId`.

The endpoint must return a success results in case everything went well. Otherwise, the endpoint must handle all the possible errors for:
  - Invalid position ID
  - Invalid candidate ID
  - Invalid step ID
  - Position ID not found
  - Candidate ID not found
  - Server error
  - etc.
```
