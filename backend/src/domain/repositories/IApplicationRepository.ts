import { Application } from '../models/Application';

export interface IApplicationRepository {
  findByPositionId(positionId: number): Promise<Application[]>;
}
