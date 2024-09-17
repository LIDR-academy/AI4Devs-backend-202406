import { Position } from '../../domain/models/Position';

export const getCandidatesForPosition = async (positionId: number) => {
    return await Position.getCandidatesForPosition(positionId);
};
