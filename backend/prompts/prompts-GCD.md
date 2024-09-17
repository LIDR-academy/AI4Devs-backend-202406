Eres un programador experto en Express. Tienes que crear un nuevo endpoint: GET /positions/:id/candidates
Este endpoint recogerá todos los candidatos @Candidate.ts  en proceso para una determinada posición @Position.ts  , es decir, todas las aplicaciones @Application.ts  para un determinado positionID. Debe proporcionar la siguiente información básica:
    - Nombre completo del candidato (de la tabla candidate).
    - current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
    - La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score

Utiliza buenas prácticas como SOLID, clean code, etc. No escribas código hasta que yo te lo diga. Haz las preguntas que necesites.

```
Para asegurarme de que el nuevo endpoint cumpla con tus requisitos y siga las mejores prácticas, necesito hacer algunas preguntas y aclaraciones:
Estructura del Endpoint:
¿El endpoint debería estar en un nuevo archivo de rutas o en uno existente? Por ejemplo, en positionRoutes.ts.
Datos de Respuesta:
¿La respuesta debe incluir solo los candidatos que están actualmente en proceso para la posición especificada?
¿Qué formato debe tener la respuesta? Por ejemplo, ¿un array de objetos con los campos fullName, currentInterviewStep y averageScore?
Manejo de Errores:
¿Cómo prefieres manejar los errores? Por ejemplo, si no se encuentra la posición o si hay un problema con la base de datos.
Autenticación y Autorización:
¿Este endpoint requiere algún tipo de autenticación o autorización? Si es así, ¿cómo se maneja actualmente en tu aplicación?
Pruebas:
¿Debo incluir pruebas unitarias o de integración para este nuevo endpoint? Si es así, ¿qué framework de pruebas estás utilizando?
Con estas aclaraciones, podré proceder a diseñar y escribir el código de manera más efectiva.
```

1. En positionRoutes.ts
2. Incluye todos los candidatos para la posicion indicada. SI, devuelve al menos la información indicada para cada candidato y aplicación en un array.
3. Sigue el mismo patrón que en @addCandidateController 
4. No
5. No incluyas pruebas por ahora

------------------------------------------------------------------------------------------------------------------------

Eres un programador experto en Express. Tienes que crear un nuevo endpoint: PUT /candidates/:id/stage
Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico.

Utiliza buenas prácticas como SOLID, clean code, etc. No escribas código hasta que yo te lo diga. Haz las preguntas que necesites.

```
Entiendo que deseas crear un nuevo endpoint PUT /candidates/:id/stage para actualizar la etapa actual del proceso de entrevista de un candidato específico. Antes de proceder, me gustaría aclarar algunos detalles para asegurarme de que la implementación cumpla con tus requerimientos y las mejores prácticas:
Aplicaciones Específicas:
¿Deseas actualizar la etapa para todas las aplicaciones asociadas al candidato o para una aplicación específica?
Si es para una aplicación específica, ¿cómo se identificará dicha aplicación en la solicitud?
Estructura del Cuerpo de la Solicitud:
¿Qué datos esperas recibir en el cuerpo de la solicitud? Por ejemplo, ¿el ID de la nueva etapa o algún otro dato adicional?
Validaciones y Lógica de Negocio:
¿Existen reglas específicas para la transición entre etapas que deban validarse?
¿Hay alguna restricción sobre qué etapas se pueden asignar a un candidato?
Respuesta Esperada:
¿Qué información esperas que retorne el endpoint después de la actualización? Por ejemplo, ¿el candidato actualizado, un mensaje de confirmación, o algo más?
Autenticación y Autorización:
¿Este endpoint requiere algún tipo de autenticación o permisos especiales para ser accedido?
Manejo de Errores:
¿Cómo deseas manejar y qué mensajes de error deberían retornarse en caso de que la actualización falle?
Con esta información, podré proporcionarte una implementación que se alinee perfectamente con tus necesidades y mantenga las mejores prácticas de desarrollo.
```
1. Solo una. La aplicación se identifica por el campo Candidate/Appilication/Id
2. applicationId, interviewStepId, employeeId, interviewDate
3. Solo se puede cambiar a la etapa anterior si no hay resultados en la actual y a la siguiente cuando los haya.
4. El candidato actualizado
5. No
6. Usa como ejemplo el fichero @candidateController.ts 

----------------------------------------------------------------------

Repitelo todo teniendo cuenta que 'stage' se refiere a un "interviewStep". No incluyas llamadas a Prisma en los servicios. Crea funciones en los modelos para el acceo a base de datos como se ha hecho para otras consultas.


