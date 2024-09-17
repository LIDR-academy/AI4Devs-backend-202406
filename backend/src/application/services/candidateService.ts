import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { Application } from '../../domain/models/Application';
import { InterviewStep } from '../../domain/models/InterviewStep';
import { Interview } from '../../domain/models/Interview';

interface UpdateStageInput {
    interviewStepId: number;
    employeeId: number;
    interviewDate: Date;
}

export const addCandidate = async (candidateData: any) => {
    try {
        validateCandidateData(candidateData); // Validar los datos del candidato
    } catch (error: any) {
        throw error;
    }

    const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
    try {
        const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
        const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

        // Guardar la educación del candidato
        if (candidateData.educations) {
            for (const education of candidateData.educations) {
                const educationModel = new Education(education);
                educationModel.candidateId = candidateId;
                await educationModel.save();
                candidate.education.push(educationModel);
            }
        }

        // Guardar la experiencia laboral del candidato
        if (candidateData.workExperiences) {
            for (const experience of candidateData.workExperiences) {
                const experienceModel = new WorkExperience(experience);
                experienceModel.candidateId = candidateId;
                await experienceModel.save();
                candidate.workExperience.push(experienceModel);
            }
        }

        // Guardar los archivos de CV
        if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
            const resumeModel = new Resume(candidateData.cv);
            resumeModel.candidateId = candidateId;
            await resumeModel.save();
            candidate.resumes.push(resumeModel);
        }
        return savedCandidate;
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('El correo electrónico ya existe en la base de datos');
        } else {
            throw error;
        }
    }
};

export const findCandidateById = async (id: number): Promise<Candidate | null> => {
    try {
        const candidate = await Candidate.findOne(id); // Usar método del modelo
        return candidate;
    } catch (error) {
        console.error('Error al buscar el candidato:', error);
        throw new Error('Error al recuperar el candidato');
    }
};

export const updateCandidateStage = async (
    candidateId: number,
    applicationId: number,
    updateData: UpdateStageInput
): Promise<Candidate> => {
    const candidate = await Candidate.findOne(candidateId);
    if (!candidate) {
        throw new Error('Candidato no encontrado');
    }

    const application = await Application.findOne(applicationId);
    if (!application) {
        throw new Error('Aplicación no encontrada');
    }

    const currentStep = await InterviewStep.findOne(application.currentInterviewStep);
    if (!currentStep) {
        throw new Error('Etapa de entrevista actual no encontrada');
    }

    const newStep = await InterviewStep.findOne(updateData.interviewStepId);
    if (!newStep) {
        throw new Error('Nueva etapa de entrevista no encontrada');
    }

    // Obtener todas las etapas del flujo de entrevistas ordenadas
    const interviewFlow = await Application.findInterviewFlow(application.currentInterviewStep);
    if (!interviewFlow) {
        throw new Error('Flujo de entrevistas no encontrado');
    }

    const sortedSteps = interviewFlow.interviewSteps.sort((a: { orderIndex: number; }, b: { orderIndex: number; }) => a.orderIndex - b.orderIndex);
    const currentIndex = sortedSteps.findIndex((step: { id: number | undefined; }) => step.id === currentStep.id);
    const newIndex = sortedSteps.findIndex((step: { id: number | undefined; }) => step.id === newStep.id);

    if (newIndex === -1) {
        throw new Error('La nueva etapa no pertenece al flujo de entrevistas actual');
    }

    if (newIndex === currentIndex - 1) { // Cambiar a etapa anterior
        const hasResults = await Application.hasResultsInStep(applicationId, currentStep.id as number);
        if (hasResults) {
            throw new Error('No se puede retroceder a la etapa anterior porque hay resultados en la etapa actual');
        }
    } else if (newIndex === currentIndex + 1) { // Avanzar a siguiente etapa
        const hasResults = await Application.hasResultsInStep(applicationId, currentStep.id as number);
        if (!hasResults) {
            throw new Error('No se puede avanzar a la siguiente etapa porque no hay resultados en la etapa actual');
        }
    } else {
        throw new Error('Transición de etapa inválida');
    }

    // Actualizar la etapa actual de la aplicación
    await Application.updateCurrentInterviewStep(applicationId, newStep.id as number);

    // Registrar la nueva entrevista
    await Interview.create({
        applicationId: applicationId,
        interviewStepId: newStep.id,
        employeeId: updateData.employeeId,
        interviewDate: updateData.interviewDate,
    });

    // Retornar el candidato actualizado
    return await Candidate.findOne(candidateId) as Candidate;
};
