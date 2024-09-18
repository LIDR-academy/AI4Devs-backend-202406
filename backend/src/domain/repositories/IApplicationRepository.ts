import { Application } from '../models/Application';

export interface IApplicationRepository {
  findByPositionId(positionId: number): Promise<Application[]>;
  update(application: Application): Promise<Application>;

  findById(applicationId: number): Promise<Application | null>;
}
