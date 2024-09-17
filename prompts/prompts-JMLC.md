# Comparativa con varias IA usando Cursor.sh para crear endpoint GET/positions/:id/candidates 

He querido probar varios modelos para ver que resultados daban con el mismo prompt:

```
Hola. Nos han pasado el siguiente cambio para esta aplicación:

"""
GET /positions/:id/candidates
Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:

- Nombre completo del candidato (de la tabla candidate).
- current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
- La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score
"""

Necesito que me ayudes a hacer los cambios en la aplicación
Es muy importante que sigas principios de clean code, SOLID, DRY y Domain Driven Design.
```

## Claude-3.5-sonnet

Para implementar el nuevo endpoint `GET /positions/:id/candidates`, seguiremos los principios de clean code, SOLID, DRY y Domain Driven Design. Aquí están los pasos necesarios:

1. **Actualizar el archivo de rutas** para incluir el nuevo endpoint.
2. **Crear un nuevo servicio** para manejar la lógica de negocio.
3. **Actualizar el controlador** para manejar la solicitud.
4. **Actualizar el archivo de especificaciones de la API** para documentar el nuevo endpoint.

### 1. Actualizar el archivo de rutas

Actualiza el archivo `backend/src/routes/candidateRoutes.ts` para incluir el nuevo endpoint:


```20:22:backend/src/routes/candidateRoutes.ts
router.get('/:id', getCandidateById);

export default router;
```


```typescript:backend/src/routes/positionRoutes.ts
import { Router } from 'express';
import { getCandidatesByPositionId } from '../presentation/controllers/positionController';

const router = Router();

router.get('/:id/candidates', getCandidatesByPositionId);

export default router;
```

### 2. Crear un nuevo servicio

Crea un nuevo archivo `backend/src/application/services/positionService.ts` para manejar la lógica de negocio:

```typescript:backend/src/application/services/positionService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCandidatesByPositionId = async (positionId: number) => {
    const applications = await prisma.application.findMany({
        where: { positionId },
        include: {
            candidate: true,
            interviews: true,
        },
    });

    return applications.map(app => ({
        fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
        currentInterviewStep: app.currentInterviewStep,
        averageScore: app.interviews.length > 0 ? app.interviews.reduce((acc, interview) => acc + (interview.score || 0), 0) / app.interviews.length : null,
    }));
};
```

### 3. Actualizar el controlador

Actualiza el archivo `backend/src/presentation/controllers/positionController.ts` para manejar la solicitud:

```typescript:backend/src/presentation/controllers/positionController.ts
import { Request, Response } from 'express';
import { getCandidatesByPositionId } from '../../application/services/positionService';

export const getCandidatesByPositionIdController = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Invalid position ID format' });
        }
        const candidates = await getCandidatesByPositionId(positionId);
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
```

### 4. Actualizar el archivo de especificaciones de la API

Actualiza el archivo `backend/api-spec.yaml` para documentar el nuevo endpoint:


```155:161:backend/api-spec.yaml
  /upload:
    post:
      summary: Upload a file
      description: Uploads a file to the server. Only PDF and DOCX files are allowed.
      requestBody:
        required: true
        content:
```


```yaml
  /positions/{id}/candidates:
    get:
      summary: Get candidates for a position
      description: Retrieves all candidates in process for a given position.
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
          description: The ID of the position
      responses:
        '200':
          description: A list of candidates
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    fullName:
                      type: string
                      description: Full name of the candidate
                    currentInterviewStep:
                      type: integer
                      description: Current interview step of the candidate
                    averageScore:
                      type: number
                      description: Average score of the candidate
        '400':
          description: Invalid position ID format
        '500':
          description: Internal server error
```

### 5. Actualizar el archivo de rutas principales

Asegúrate de que el archivo `backend/src/index.ts` importe y use las nuevas rutas:


```5:5:backend/src/index.ts
import candidateRoutes from './routes/candidateRoutes';
```


```typescript:backend/src/index.ts
import positionRoutes from './routes/positionRoutes';
```


```40:41:backend/src/index.ts
app.use('/candidates', candidateRoutes);

```


```typescript:backend/src/index.ts
app.use('/positions', positionRoutes);
```

Con estos cambios, hemos añadido un nuevo endpoint `GET /positions/:id/candidates` que sigue los principios de clean code, SOLID, DRY y Domain Driven Design.


## o1-mini
¡Hola! Vamos a implementar el nuevo endpoint `GET /positions/:id/candidates` siguiendo las buenas prácticas de Clean Code, SOLID, DRY y Domain-Driven Design.

### 1. Actualizar el Controlador

Primero, añadiremos una nueva función en el controlador de candidatos para manejar la lógica del endpoint.

```typescript:backend/src/presentation/controllers/candidateController.ts
import { Request, Response } from 'express';
import { addCandidate, findCandidateById, getCandidatesByPositionId } from '../../application/services/candidateService';

// ... otros imports y controladores existentes

export const getCandidatesByPositionIdController = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'ID de posición inválido' });
        }

        const candidates = await getCandidatesByPositionId(positionId);
        res.json(candidates);
    } catch (error: any) {
        console.error('Error al obtener candidatos por posición:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
```

### 2. Actualizar el Servicio

Añadiremos una nueva función en el servicio de candidatos para manejar la lógica de negocio.

```typescript:backend/src/application/services/candidateService.ts
import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
// ... otros imports

export const getCandidatesByPositionId = async (positionId: number) => {
    try {
        const applications = await prisma.application.findMany({
            where: { positionId },
            include: {
                candidate: true,
                interviewStep: {
                    select: { name: true },
                },
                interviews: {
                    select: { score: true },
                },
            },
        });

        return applications.map(app => ({
            fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
            currentInterviewStep: app.interviewStep.name,
            averageScore: app.interviews.length > 0 
                ? app.interviews.reduce((acc, curr) => acc + curr.score, 0) / app.interviews.length 
                : null,
        }));
    } catch (error) {
        console.error('Error en getCandidatesByPositionId:', error);
        throw new Error('No se pudieron obtener los candidatos');
    }
};
```

### 3. Actualizar las Rutas

Añadiremos una nueva ruta en `candidateRoutes.ts` para el nuevo endpoint.

```typescript:backend/src/routes/candidateRoutes.ts
import { Router } from 'express';
import { addCandidate, getCandidateById, getCandidatesByPositionIdController } from '../presentation/controllers/candidateController';

const router = Router();

// Ruta existente para añadir candidato
router.post('/', async (req, res) => {
  try {
    const result = await addCandidate(req.body);
    res.status(201).send(result);
  } catch (error: any) {
    if (error instanceof Error) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: "An unexpected error occurred" });
    }
  }
});

// Ruta existente para obtener candidato por ID
router.get('/:id', getCandidateById);

// Nueva ruta para obtener candidatos por posición
router.get('/positions/:id/candidates', getCandidatesByPositionIdController);

export default router;
```

### 4. Actualizar el Esquema de Prisma (si es necesario)

Asegúrate de que las relaciones en tu esquema de Prisma estén correctamente definidas para incluir `interviewStep` e `interviews` en las consultas.

```prisma
model Application {
  id                   Int            @id @default(autoincrement())
  positionId           Int
  candidateId          Int
  applicationDate      DateTime
  currentInterviewStep Int
  notes                String?
  position             Position       @relation(fields: [positionId], references: [id])
  candidate            Candidate      @relation(fields: [candidateId], references: [id])
  interviewStep        InterviewStep  @relation(fields: [currentInterviewStep], references: [id])
  interviews           Interview[]
}
```

### 5. Actualizar el Archivo de Especificación de la API

Si utilizas `api-spec.yaml`, añade la nueva ruta.

```yaml:backend/api-spec.yaml
paths:
  # ... otras rutas
  /positions/{id}/candidates:
    get:
      summary: Obtener candidatos por posición
      description: Recupera todos los candidatos en proceso para una determinada posición.
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
          description: ID de la posición
      responses:
        '200':
          description: Lista de candidatos
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    fullName:
                      type: string
                      description: Nombre completo del candidato
                    currentInterviewStep:
                      type: string
                      description: Fase actual del proceso
                    averageScore:
                      type: number
                      description: Puntuación media del candidato
        '400':
          description: ID de posición inválido
        '500':
          description: Error interno del servidor
```

### 6. Buenas Prácticas Adicionales

- **Validación de Entrada:** Asegúrate de validar el `positionId` en el controlador.
- **Manejo de Errores:** Gestiona adecuadamente los posibles errores y proporciona mensajes claros.
- **Optimización de Consultas:** Utiliza `select` en Prisma para obtener solo los campos necesarios, mejorando el rendimiento.

### 7. Pruebas

No olvides añadir pruebas para el nuevo endpoint para asegurar su correcto funcionamiento.

```typescript:backend/src/application/tests/candidateService.test.ts
import { getCandidatesByPositionId } from '../services/candidateService';
import prisma from '../../prisma/client';

jest.mock('../../prisma/client');

describe('getCandidatesByPositionId', () => {
    it('debería devolver una lista de candidatos con datos correctos', async () => {
        // Configurar el mock de prisma
        prisma.application.findMany.mockResolvedValue([
            {
                candidate: { firstName: 'John', lastName: 'Doe' },
                interviewStep: { name: 'Technical Interview' },
                interviews: [{ score: 4 }, { score: 5 }],
            },
            // ... otros candidatos
        ]);

        const result = await getCandidatesByPositionId(1);
        expect(result).toEqual([
            {
                fullName: 'John Doe',
                currentInterviewStep: 'Technical Interview',
                averageScore: 4.5,
            },
            // ... otros candidatos
        ]);
    });

    it('debería manejar errores correctamente', async () => {
        prisma.application.findMany.mockRejectedValue(new Error('DB error'));
        await expect(getCandidatesByPositionId(1)).rejects.toThrow('No se pudieron obtener los candidatos');
    });
});
```

### Resumen

Hemos añadido:

1. **Controlador:** `getCandidatesByPositionIdController` en `candidateController.ts`.
2. **Servicio:** `getCandidatesByPositionId` en `candidateService.ts`.
3. **Ruta:** `GET /positions/:id/candidates` en `candidateRoutes.ts`.
4. **Esquema de API:** Definición en `api-spec.yaml`.
5. **Pruebas:** Añadidas en `candidateService.test.ts`.

Estos cambios aseguran que el nuevo endpoint se integre de manera limpia y eficiente en la aplicación existente, siguiendo las mejores prácticas de desarrollo.


## gpt-4o

Para implementar el nuevo endpoint `GET /positions/:id/candidates` siguiendo las buenas prácticas de Clean Code, SOLID, DRY y Domain-Driven Design, sigue estos pasos:

### 1. Actualizar el archivo de rutas

Actualiza el archivo `backend/src/routes/positionRoutes.ts` para incluir el nuevo endpoint:

```typescript:backend/src/routes/positionRoutes.ts
import { Router } from 'express';
import { getCandidatesByPositionIdController } from '../presentation/controllers/positionController';

const router = Router();

router.get('/:id/candidates', getCandidatesByPositionIdController);

export default router;
```

### 2. Crear un nuevo servicio

Crea un nuevo archivo `backend/src/application/services/positionService.ts` para manejar la lógica de negocio:

```typescript:backend/src/application/services/positionService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCandidatesByPositionId = async (positionId: number) => {
    const applications = await prisma.application.findMany({
        where: { positionId },
        include: {
            candidate: true,
            interviews: true,
        },
    });

    return applications.map(app => ({
        fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
        currentInterviewStep: app.currentInterviewStep,
        averageScore: app.interviews.length > 0 
            ? app.interviews.reduce((acc, interview) => acc + (interview.score || 0), 0) / app.interviews.length 
            : null,
    }));
};
```

### 3. Actualizar el controlador

Actualiza el archivo `backend/src/presentation/controllers/positionController.ts` para manejar la solicitud:

```typescript:backend/src/presentation/controllers/positionController.ts
import { Request, Response } from 'express';
import { getCandidatesByPositionId } from '../../application/services/positionService';

export const getCandidatesByPositionIdController = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Invalid position ID format' });
        }
        const candidates = await getCandidatesByPositionId(positionId);
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
```

### 4. Actualizar el archivo de especificaciones de la API

Actualiza el archivo `backend/api-spec.yaml` para documentar el nuevo endpoint:

```yaml:backend/api-spec.yaml
paths:
  /positions/{id}/candidates:
    get:
      summary: Get candidates for a position
      description: Retrieves all candidates in process for a given position.
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
          description: The ID of the position
      responses:
        '200':
          description: A list of candidates
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    fullName:
                      type: string
                      description: Full name of the candidate
                    currentInterviewStep:
                      type: integer
                      description: Current interview step of the candidate
                    averageScore:
                      type: number
                      description: Average score of the candidate
        '400':
          description: Invalid position ID format
        '500':
          description: Internal server error
```

### 5. Actualizar el archivo de rutas principales

Asegúrate de que el archivo `backend/src/index.ts` importe y use las nuevas rutas:

```typescript:backend/src/index.ts
import positionRoutes from './routes/positionRoutes';

app.use('/positions', positionRoutes);
```

Con estos cambios, hemos añadido un nuevo endpoint `GET /positions/:id/candidates` que sigue los principios de Clean Code, SOLID, DRY y Domain-Driven Design.


## Comparativa

|                           | Claude 3.5   |   o1-mini  |   gpt-4o | o1-mini (de nuevo)
| Ruta separada /positions  |      SI      |     NO     |     SI   |   SI
| Controlador separado      |      SI      |     NO     |     SI   |   SI
| Servicio separado         |      SI      |     NO     |     SI   |   SI
| Completar api-spec.yml    |      SI+     |     SI-    |     SI+  |   SI+
| Test                      |      NO      |     SI-    |     NO   |   NO

- Calidad del código muy similar, tratan error de parámetro para devolver un 400, hacen try-catch para devolver 500, ...
    - Todos colocan el uso de positionRoutes en index.ts, lo coloca al final
    - Claude declaraba el método `positionController.getCandidatesByPositionIdController` pero luego lo usaba con otro nombre `getCandidatesByPositionId`
- El api-spec.yml o1-mini ha completado en castellano mientras que Claude y 4o ha hecho en inglés como el resto de fichero.
- KO: o1-mini Dice de actualizar el esquema de Prisma si es necesario...es confuso si no es necesario

# Prompt 2: Crear un test unitario para el servicio creado

Puedes crear un test unitario para @positionService.ts ?
Recuerda que debes mockear dependencias externas como Prisma.

## o1-mini

### Respuesta

```
import { getCandidatesByPositionId } from './positionService';
import { PrismaClient, Application } from '@prisma/client';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        application: {
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const mockPrisma = new PrismaClient();

describe('getCandidatesByPositionId', () => {
    beforeAll(() => {
        (PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of candidates with correct data', async () => {
        const positionId = 1;
        const mockApplications: Application[] = [
            {
                id: 1,
                positionId: positionId,
                candidateId: 1,
                applicationDate: new Date(),
                currentInterviewStep: 2,
                notes: 'Application notes',
                candidate: {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '1234567890',
                    address: '123 Main St',
                    educations: [],
                    workExperiences: [],
                    resumes: [],
                    applications: [],
                },
                interviews: [
                    { id: 1, applicationId: 1, interviewStepId: 2, employeeId: 1, interviewDate: new Date(), result: 'Passed', score: 4, notes: 'Good performance' },
                    { id: 2, applicationId: 1, interviewStepId: 2, employeeId: 2, interviewDate: new Date(), result: 'Passed', score: 5, notes: 'Excellent performance' },
                ],
            },
        ];

        mockPrisma.application.findMany.mockResolvedValue(mockApplications);

        const result = await getCandidatesByPositionId(positionId);

        expect(mockPrisma.application.findMany).toHaveBeenCalledWith({
            where: { positionId },
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
        ]);
    });

    it('should return an empty list if there are no applications', async () => {
        const positionId = 2;

        mockPrisma.application.findMany.mockResolvedValue([]);

        const result = await getCandidatesByPositionId(positionId);

        expect(mockPrisma.application.findMany).toHaveBeenCalledWith({
            where: { positionId },
            include: {
                candidate: true,
                interviews: true,
            },
        });

        expect(result).toEqual([]);
    });

    it('should handle errors correctly', async () => {
        const positionId = 3;
        const errorMessage = 'Database error';

        mockPrisma.application.findMany.mockRejectedValue(new Error(errorMessage));

        await expect(getCandidatesByPositionId(positionId)).rejects.toThrow(errorMessage);

        expect(mockPrisma.application.findMany).toHaveBeenCalledWith({
            where: { positionId },
            include: {
                candidate: true,
                interviews: true,
            },
        });
    });
});
```

### Prompt para corregir error

```
Al ejecutar con `npm test` se produce el siguiente error:

 FAIL  dist/application/services/positionService.test.js
  ● getCandidatesByPositionId › debería devolver una lista de candidatos con datos correctos

    TypeError: prisma.application.findMany.mockResolvedValue is not a function
```

**Da el mismo error**


## Claude 3.5

### Respuesta

```
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
```

### Error

**Da el mismo error y con Debug with AI tampoco se corrige**


# Poblar de datos con seed.ts

No podía ejecutar `ts-node seed.ts` como dice el Readme.md. He pedido ayuda al chat y me ha dicho lo siguiente, que no ha funcionado:

## Respuesta

Entiendo que estás teniendo problemas para ejecutar `ts-node`. Vamos a resolver esto paso a paso:

1. Primero, asegúrate de que `ts-node` está instalado. Si no lo has instalado aún, puedes hacerlo con:

   ```
   npm install -g ts-node typescript
   ```

   O si prefieres instalarlo localmente en tu proyecto:

   ```
   npm install --save-dev ts-node typescript
   ```

2. Si lo has instalado localmente, deberías usar `npx` para ejecutarlo:

   ```
   npx ts-node seed.ts
   ```

3. Si aún así no funciona, podemos agregar un script en tu `package.json`:

   ```json:backend/package.json
   "scripts": {
     // ... otros scripts
     "seed": "ts-node prisma/seed.ts"
   },
   ```

   Luego podrías ejecutar:

   ```
   npm run seed
   ```

4. Si sigues teniendo problemas, asegúrate de que estás en el directorio correcto. Deberías estar en la raíz de tu proyecto backend, no dentro de la carpeta `prisma`.

5. Verifica que Node.js está instalado correctamente:

   ```
   node --version
   ```

6. Si todo lo anterior falla, puedes intentar usar `node` directamente con `ts-node/register`:

   ```
   node -r ts-node/register prisma/seed.ts
   ```

7. Finalmente, si nada de esto funciona, podrías compilar el archivo TypeScript a JavaScript y luego ejecutarlo con Node:

   ```
   tsc prisma/seed.ts
   node prisma/seed.js
   ```

Si aún tienes problemas después de intentar estas soluciones, por favor proporciona más detalles sobre tu entorno de desarrollo (versión de Node.js, contenido de tu `package.json`, estructura de directorios, etc.) para que pueda ayudarte mejor.