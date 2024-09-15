import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Application {
    id?: number;
    positionId: number;
    candidateId: number;
    applicationDate: Date;
    currentInterviewStep: number;
    notes?: string;
    interviews: { score?: number }[];
    candidate: { firstName: string; lastName: string };
    interviewStep: { name: string };

    constructor(data: any) {
        this.id = data.id;
        this.positionId = data.positionId;
        this.candidateId = data.candidateId;
        this.applicationDate = new Date(data.applicationDate);
        this.currentInterviewStep = data.currentInterviewStep;
        this.notes = data.notes;
        this.interviews = data.interviews || [];
        this.candidate = data.candidate;
        this.interviewStep = data.interviewStep;
    }

    async save() {
        // Implementación existente para guardar la aplicación
    }

    /**
     * Encuentra una aplicación por su ID.
     * @param id El ID de la aplicación a encontrar.
     * @returns Una instancia de Application o null si no se encuentra.
     */
    static async findOne(id: number): Promise<Application | null> {
        try {
            const data = await prisma.application.findUnique({
                where: { id },
                include: {
                    candidate: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    interviewStep: {
                        select: {
                            name: true,
                        },
                    },
                    interviews: {
                        select: {
                            score: true,
                        },
                    },
                },
            });

            if (!data) {
                return null;
            }

            return new Application(data);
        } catch (error) {
            console.error(`Error al encontrar la aplicación con ID ${id}:`, error);
            throw new Error('Error al recuperar la aplicación');
        }
    }

    /**
     * Obtiene todas las aplicaciones para una posición específica.
     * @param positionId El ID de la posición.
     * @returns Una lista de instancias de Application.
     */
    static async getApplicationsByPositionId(positionId: number): Promise<Application[]> {
        try {
            const applicationsData = await prisma.application.findMany({
                where: { positionId },
                include: {
                    candidate: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    interviewStep: {
                        select: {
                            name: true,
                        },
                    },
                    interviews: {
                        select: {
                            score: true,
                        },
                    },
                },
            });

            return applicationsData.map(data => new Application(data));
        } catch (error) {
            console.error('Error al obtener las aplicaciones por posición:', error);
            throw new Error('Error al recuperar las aplicaciones para la posición');
        }
    }

    /**
     * Actualiza la etapa actual de la entrevista de la aplicación.
     * @returns La instancia actualizada de Application.
     */
    async updateStage(): Promise<Application> {
        try {
            const updatedData = await prisma.application.update({
                where: { id: this.id },
                data: {
                    currentInterviewStep: this.currentInterviewStep,
                },
                include: {
                    candidate: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    interviewStep: {
                        select: {
                            name: true,
                        },
                    },
                    interviews: {
                        select: {
                            score: true,
                        },
                    },
                },
            });

            // Actualizar la instancia local con los nuevos datos
            this.currentInterviewStep = updatedData.currentInterviewStep;
            this.interviewStep = updatedData.interviewStep;
            // Actualizar otros campos si es necesario

            return new Application(updatedData);
        } catch (error) {
            console.error('Error al actualizar la etapa de la aplicación:', error);
            throw new Error('Error al actualizar la etapa de la aplicación');
        }
    }

    /**
     * Encuentra una aplicación por el ID del candidato.
     * @param candidateId El ID del candidato.
     * @returns La instancia de Application o null si no se encuentra.
     */
    static async findByCandidateId(candidateId: number): Promise<Application | null> {
        try {
            const data = await prisma.application.findFirst({
                where: { candidateId },
                include: {
                    candidate: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    interviewStep: {
                        select: {
                            name: true,
                        },
                    },
                    interviews: {
                        select: {
                            score: true,
                        },
                    },
                },
            });

            if (!data) {
                return null;
            }

            return new Application(data);
        } catch (error) {
            console.error(`Error al encontrar la aplicación para el candidato con ID ${candidateId}:`, error);
            throw new Error('Error al buscar la aplicación');
        }
    }
}
