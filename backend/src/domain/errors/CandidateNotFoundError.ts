export class CandidateNotFoundError extends Error {
  constructor(candidateId: number) {
    super(`Candidate with id ${candidateId} not found`);
    this.name = 'CandidateNotFoundError';
  }
}
