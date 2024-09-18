import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { ApplicationNotFoundError } from '../../domain/errors/ApplicationNotFoundError';

export class UpdateApplicationStageUseCase {
  constructor(private applicationRepository: IApplicationRepository) {}

  async execute(applicationId: number, newStage: number): Promise<void> {
    const application =
      await this.applicationRepository.findById(applicationId);
    if (!application) {
      throw new ApplicationNotFoundError(applicationId);
    }

    application.currentInterviewStep = newStage;
    await this.applicationRepository.update(application);
  }
}
