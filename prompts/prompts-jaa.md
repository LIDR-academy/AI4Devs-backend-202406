# PROMPTS

```markdown
Analyze @backend and check for all the endpoints already implemented; I want to implement two new endpoint but I want to analyze the state of the current backend. Please respond the following questions: - Is the backend following good DDD, SOLID  and DRY practices? Does this backend following good design patterns? 
```

```markdown
I don't want to refactor the code now, but if needed, our goal now is check the viability to implement two new endpoints following good DDD, SOLID, DRY practices. The following endpoints are these: 

* `GET /positions/:id/candidates` 
This endpoint will collect all candidates in process for a given position, i.e. all applications for a given positionID. It should provide the following basic information:
  - Full name of the candidate (from the candidate table).
  - current_interview_step: which stage of the process the candidate is in (from the application table).
  - The average score of the candidate. Remember that each interview performed by the candidate has a score.

* `PUT /candidates/:id/stage`  
This endpoint will update the stage of the moved candidate. It allows you to modify the current stage of the interview process that a specific candidate is in.

Is the backend in good shape to implement them?
```

```markdown
Let's elaborate the solution doing it step by step, lets begin with the first endpoint, please be explicitr with the answer, tell me also which are the files that needs to be edited, where I need to create the new files
```

```markdown
Lets continue with the second endpoint, please be explicit with the answer like you did before, remember the second endpoint is PUT /candidates/:id/stage
```

```markdown
Create two powershell scripts to tests and validate the two endpoints
``` 

```markdown
Let's fix a bug, the @updateCandidateStage needs another filter shich is the positionId, avoid taking the first be descending date application, instead we need to add a new filter using positionId
```