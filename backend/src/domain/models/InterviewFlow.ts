import { PrismaClient } from '@prisma/client';
import { InterviewStep } from './InterviewStep';

const prisma = new PrismaClient();

export class InterviewFlow {
    id?: number;
    name: string;
    interviewSteps: InterviewStep[];

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.interviewSteps = data.interviewSteps || [];
    }

    async save() {
        const flowData: any = {
            name: this.name,
        };

        if (this.id) {
            return await prisma.interviewFlow.update({
                where: { id: this.id },
                data: flowData,
            });
        } else {
            return await prisma.interviewFlow.create({
                data: flowData,
            });
        }
    }

    static async findOne(id: number): Promise<InterviewFlow | null> {
        const data = await prisma.interviewFlow.findUnique({
            where: { id: id },
            include: { interviewSteps: true },
        });
        if (!data) return null;
        return new InterviewFlow(data);
    }
}

