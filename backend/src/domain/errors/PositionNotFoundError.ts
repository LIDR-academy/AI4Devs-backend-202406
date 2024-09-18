export class PositionNotFoundError extends Error {
  constructor(positionId: number) {
    super(`Position with id ${positionId} not found`);
    this.name = 'PositionNotFoundError';
  }
}
