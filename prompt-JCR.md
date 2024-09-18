Prompt 1:
Con base al esquema de Prima, identifica las clases prinicipales del modelo. No deseo que realices ninguna tarea aun, solo que analices cada clase, 
en pro de estar preparado para la creación de endpoint orientados a obtener o actualizar el modelo de datos.

Prompt 2:
Podrias decribirme el modelo Application en detalle

Prompt 3:
Requiero construir el endpoint *GET /positions/:id/candidates* bajo la tecnologia mas apropiada de acuerdo al proyecto @backend , 
este endpoint retornara todos los candidatos en proceso para una determinada posicion (positionId). 

Se debe entregar como resultado la siguiente información:  
*Nombre completo del candidato (de la tabla candidate).
*current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
*La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score

Prompt 4:
Requiero construir otro endpoint con el método PUT */candidates/:id/stage*, el cual esta orientado actualizar la etapa 
del candidato en el modelo Application, actualizando el campo currentInterviewStep. Esto permitira modificar la fase 
actual del proceso de aplicacion en la que se encuentra un candidato específico. 

La estructura del mensaje es la siguiente: 
{ 
	applicationId: 1, 
	currentInterviewStep:1 
}
