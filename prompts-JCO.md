# Cursor
# Claude-3.5-Sonnet

# PROMPT 1
Act as a senior software engineer, expert in backend development.

You have to create a new endpoint in @backend  's folder of the project called "GET /positions/:id/candidates".

This endpoint will collect all candidates in process for a given position, i.e. all applications for a given positionID. It should provide the following basic information:

    - Full name of the candidate (from the candidate table).
    - current_interview_step: which stage of the process the candidate is in (from the application table).
    - The average score of the candidate. Remember that each interview performed by the candidate has a score.

Use the style of other endpoints, following good practices (Domain-Driven Design, SOLID principles and DRY) but keeping the folder structure present in the project. Provide the code with details of the files to update or create in each code block.

## PROMPT 2
Let's repeat the exercise for the PUT /candidates/:id/stage method
This endpoint will update the stage of the moved candidate. It allows you to modify the current stage of the interview process that a specific candidate is in.

## PROMPT 3
Move the position route to its own file called positionRoutes.ts.