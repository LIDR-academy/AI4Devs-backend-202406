import { Candidate } from '../models/Candidate';

export interface ICandidateRepository {
  findById(id: number): Promise<Candidate | null>;
  update(candidate: Candidate): Promise<Candidate>;
}
