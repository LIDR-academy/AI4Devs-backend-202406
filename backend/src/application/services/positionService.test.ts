import { PrismaClient } from '@prisma/client';
import { getCandidatesByPositionId } from './positionService';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    application: {
      findMany: jest.fn(),
    },
  })),
}));

describe('positionService', () => {
  let prisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCandidatesByPositionId', () => {
    it('should return formatted candidate data for a given position', async () => {
      const mockApplications = [
        {
          candidate: { firstName: 'John', lastName: 'Doe' },
          currentInterviewStep: 2,
          interviews: [{ score: 4 }, { score: 5 }],
        },
        {
          candidate: { firstName: 'Jane', lastName: 'Smith' },
          currentInterviewStep: 1,
          interviews: [],
        },
      ];

      (prisma.application.findMany as jest.Mock).mockResolvedValue(mockApplications);

      const result = await getCandidatesByPositionId(1);

      expect(prisma.application.findMany).toHaveBeenCalledWith({
        where: { positionId: 1 },
        include: {
          candidate: true,
          interviews: true,
        },
      });

      expect(result).toEqual([
        {
          fullName: 'John Doe',
          currentInterviewStep: 2,
          averageScore: 4.5,
        },
        {
          fullName: 'Jane Smith',
          currentInterviewStep: 1,
          averageScore: null,
        },
      ]);
    });

    it('should handle empty applications', async () => {
      (prisma.application.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getCandidatesByPositionId(1);

      expect(result).toEqual([]);
    });
  });
});
