export class ApplicationNotFoundError extends Error {
  constructor(applicationId: number) {
    super(`Application with id ${applicationId} not found`);
    this.name = 'ApplicationNotFoundError';
  }
}
