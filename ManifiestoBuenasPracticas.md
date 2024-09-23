### Manifesto de Buenas Prácticas Proyecto LTI

1. Domain-Driven Design (DDD)
    - **Entidades**: Objetos con identidad distintiva.

      Antes:
      ```js
      // Ejemplo sin entidad definida
      const candidate = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
          // ...
      };
      ```

      Después:
      ```js
      //typescript:backend/src/domain/models/Candidate.ts
      export class Candidate {
        id?: number;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        address?: string;
        educations: Education[];
        workExperience: WorkExperience[];
        resumes: Resume[];
        applications: Application[];

        constructor(data: any) {
          this.id = data.id;
          this.firstName = data.firstName;
          this.lastName = data.lastName;
          this.email = data.email;
          this.phone = data.phone;
          this.address = data.address;
          this.educations = [];
          this.workExperience = [];
          this.resumes = [];
          this.applications = [];
        }

        async save() {
          // Lógica para guardar el candidato usando Prisma
        }
      }
      ```

      Explicación:

      Definimos la entidad `Candidate` que encapsula toda la información relevante del candidato, asegurando una identidad distintiva y gestionando sus relaciones con otras entidades como `Education`, `WorkExperience`, y `Resume`.

    - **Value Objects**: Objetos que describen aspectos del dominio sin identidad conceptual.

      Antes:
      ```js
      // Uso directo de strings para el email y teléfono
      const email = 'john.doe@gmail.com';
      const phone = '1234567890';
      ```

      Después:
      ```js
      //typescript:backend/src/domain/models/Email.ts
      export class Email {
        private readonly email: string;

        constructor(email: string) {
          const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!EMAIL_REGEX.test(email)) {
              throw new Error('Invalid email');
          }
          this.email = email;
        }

        get value(): string {
          return this.email;
        }
      }
      ```

      Explicación:

      Creamos un `Value Object` para el email que valida el formato y encapsula la lógica de validación, garantizando que todos los emails en el sistema sean consistentes y válidos.

    - **Agregados**: Conjuntos de objetos que deben ser tratados como una unidad.

      Antes:
      ```js
      // Manejo independiente de candidatos y educaciones
      const candidate = new Candidate(data);
      const education = new Education(educationData);
      candidate.educations.push(education);
      await candidate.save();
      ```

      Después:
      ```js
      //typescript:backend/src/application/services/candidateService.ts
      export const addCandidate = async (candidateData: any) => {
        const candidate = new Candidate(candidateData);
        // Agregar educaciones dentro del agregado
        if (candidateData.educations) {
          for (const education of candidateData.educations) {
            const edu = new Education(education);
            candidate.educations.push(edu);
          }
        }
        return await candidate.save();
      };
      ```

      Explicación:

      Agrupamos las operaciones relacionadas dentro del agregado `Candidate`, asegurando que las entidades relacionadas como `Education` se gestionen de manera consistente.

    - **Repositorios**: Interfaces que proporcionan acceso a agregados y entidades.

      Antes:
      ```js
      // Acceso directo a Prisma en los controladores
      const candidate = await prisma.candidate.findUnique({ where: { id } });
      ```

      Después:
      ```js
      //typescript:backend/src/domain/repositories/CandidateRepository.ts
      import { Candidate } from '../models/Candidate';

      export interface ICandidateRepository {
        findById(id: number): Promise<Candidate | null>;
        save(candidate: Candidate): Promise<Candidate>;
        // Otros métodos necesarios
      }

      export class CandidateRepository implements ICandidateRepository {
        async findById(id: number): Promise<Candidate | null> {
          const data = await prisma.candidate.findUnique({ where: { id } });
          return data ? new Candidate(data) : null;
        }

        async save(candidate: Candidate): Promise<Candidate> {
          return await candidate.save();
        }
      }
      ```

      Explicación:

      Introducimos un repositorio para `Candidate` que abstrae el acceso a la base de datos, facilitando la mantenibilidad y testabilidad del código.

    - **Servicios de Dominio**: Lógica de negocio que no pertenece naturalmente a una entidad o valor.

      Antes:
      ```js
      // Lógica de validación en el controlador
      if (!validate(candidateData)) {
        throw new Error('Invalid data');
      }
      ```

      Después:
      ```js
      //typescript:backend/src/domain/services/CandidateDomainService.ts
      import { Candidate } from '../models/Candidate';
      import { validateCandidateData } from '../validator';

      export class CandidateDomainService {
        static createCandidate(data: any): Candidate {
          validateCandidateData(data);
          return new Candidate(data);
        }
      }
      ```

      Explicación:

      Centralizamos la lógica de negocio relacionada con la creación de candidatos en un servicio de dominio, promoviendo una separación clara de responsabilidades.

2. Principios SOLID y DRY
    - **S - Single Responsibility Principle (SRP)**:

      Antes:
      ```js
      // Controlador manejando lógica de negocio y respuestas HTTP
      export const addCandidateController = async (req: Request, res: Response) => {
        try {
          const candidateData = req.body;
          const candidate = await addCandidate(candidateData);
          res.status(201).json({ message: 'Candidate added successfully', data: candidate });
        } catch (error) {
          res.status(400).json({ message: 'Error adding candidate', error: error.message });
        }
      };
      ```

      Después:
      ```js
      //typescript:backend/src/presentation/controllers/candidateController.ts
      import { addCandidate } from '../../application/services/candidateService';

      export const addCandidateController = async (req: Request, res: Response) => {
        try {
          const candidateData = req.body;
          const candidate = await addCandidate(candidateData);
          res.status(201).json({ message: 'Candidate added successfully', data: candidate });
        } catch (error: unknown) {
          if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
          } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
          }
        }
      };
      ```

      Explicación:

      Separar la lógica de negocio en servicios dedicados permite que los controladores se enfoquen únicamente en manejar las solicitudes y respuestas HTTP, respetando el SRP.

    - **O - Open/Closed Principle (OCP)**:

      Antes:
      ```js
      // Método modificado para cada nueva condición
      if (type === 'A') { /* ... */ }
      else if (type === 'B') { /* ... */ }
      ```

      Después:
      ```js
      //typescript:backend/src/domain/models/InterviewStep.ts
      export class InterviewStep {
          // ...
        async save() {
          // Implementación abierta para extensión pero cerrada para modificación
          if (this.id) {
            return await prisma.interviewStep.update({
              where: { id: this.id },
              data: this.toPrismaData(),
            });
          } else {
            return await prisma.interviewStep.create({
                data: this.toPrismaData(),
            });
          }
        }

        private toPrismaData() {
          return {
            interviewFlowId: this.interviewFlowId,
            interviewTypeId: this.interviewTypeId,
            name: this.name,
            orderIndex: this.orderIndex,
          };
        }
      }
      ```

      Explicación:

      Al encapsular la conversión de datos en métodos privados, permitimos que la clase se extienda sin modificar su lógica interna, cumpliendo con el OCP.

    - **L - Liskov Substitution Principle (LSP)**:

      Antes:
      ```js
      // Subclases que no respetan el contrato de la clase base
      class SpecializedCandidate extends Candidate {
        validate() {
            // Validación adicional que falla en ciertos casos
        }
      }
      ```

      Después:
      ```js
      //typescript:backend/src/domain/models/Candidate.ts
      export class Candidate {
        // ...
        validate() {
          validateCandidateData(this);
        }
      }

      export class SpecializedCandidate extends Candidate {
        validate() {
          super.validate();
          // Validaciones adicionales sin romper el contrato
        }
      }
      ```

      Explicación:

      Las subclases extienden la funcionalidad de la clase base sin alterar su comportamiento esperado, asegurando que puedan substituirse sin errores.

    - **I - Interface Segregation Principle (ISP)**:

      Antes:
      ```js
      interface IModel {
        save(): void;
        delete(): void;
        validate(): void;
      }
      ```

      Después:
      ```js
      //typescript:backend/src/domain/repositories/IReadRepository.ts
      export interface IReadRepository<T> {
        findById(id: number): Promise<T | null>;
        findAll(): Promise<T[]>;
      }

      export interface IWriteRepository<T> {
        save(entity: T): Promise<T>;
        delete(id: number): Promise<void>;
      }
      ```

      Explicación:

      Dividir interfaces en segmentos específicos evita que las clases implementen métodos que no utilizan, cumpliendo con el ISP.

    - **D - Dependency Inversion Principle (DIP)**:

      Antes:
      ```js
      // Clase de servicio que depende directamente de una implementación concreta
      class CandidateService {
        private repo = new CandidateRepository();
        // ...
      }
      ```

      Después:
      ```js
      //typescript:backend/src/application/services/candidateService.ts
      export const addCandidate = async (candidateData: any, repo: ICandidateRepository) => {
        const candidate = CandidateDomainService.createCandidate(candidateData);
        return await repo.save(candidate);
      };
      ```

      Explicación:

      Dependemos de abstracciones (interfaces) en lugar de implementaciones concretas, facilitando la inyección de dependencias y mejorando la testabilidad.

    2. DRY (Don't Repeat Yourself)

       Antes:
       ```js
       // Validación similar en múltiples controladores
       if (!validate(data)) {
          throw new Error('Invalid data');
       }
       ```

       Después:
       ```js
       //typescript:backend/src/application/validator.ts
       export const validateCandidateData = (data: any) => {
          // Implementación de validaciones centralizadas
       };
       ```

       Explicación:

       Centralizamos la lógica de validación en un solo lugar, evitando la duplicación de código y facilitando el mantenimiento.

3. Patrones de Diseño
    - **Singleton**: Garantiza que una clase tenga solo una instancia y proporciona un punto global de acceso a ella.

      Antes:
      ```js
      // Múltiples instancias de PrismaClient
      const prisma1 = new PrismaClient();
      const prisma2 = new PrismaClient();
      ```

      Después:
      ```js
      //typescript:backend/src/domain/database/prismaClient.ts
      import { PrismaClient } from '@prisma/client';

      const prisma = new PrismaClient();

      export default prisma;
      ```

      ```js
      //typescript:backend/src/domain/models/Candidate.ts
      import prisma from '../database/prismaClient';

      export class Candidate {
        // Uso de la instancia singleton de PrismaClient
        async save() {
          return await prisma.candidate.create({ data: this });
        }
      }
      ```

      Explicación:

      Utilizamos una única instancia de `PrismaClient` a través de un módulo singleton, evitando conexiones múltiples y mejorando el rendimiento.

    - **Factory Method**: Permite a una clase delegar la creación de objetos a sus subclases.

      Antes:
      ```js
      // Creación directa de instancias en los servicios
      const candidate = new Candidate(data);
      ```

      Después:
      ```js
      //typescript:backend/src/domain/factories/CandidateFactory.ts
      import { Candidate } from '../models/Candidate';

      export class CandidateFactory {
        static create(data: any): Candidate {
          return new Candidate(data);
        }
      }
      ```

      ```js
      //typescript:backend/src/application/services/candidateService.ts
      import { CandidateFactory } from '../../domain/factories/CandidateFactory';

      export const addCandidate = async (candidateData: any) => {
        const candidate = CandidateFactory.create(candidateData);
        return await candidate.save();
      };
      ```

      Explicación:

      Encapsulamos la creación de `Candidate` en una fábrica, permitiendo una mayor flexibilidad y facilitando la inclusión de lógica adicional durante la creación.

    - **Observer**: Define una dependencia uno a muchos entre objetos, de modo que cuando uno cambia de estado, todos sus dependientes son notificados automáticamente.

      Antes:
      ```js
      // Notificaciones manuales después de guardar el candidato
      const candidate = new Candidate(data);
      await candidate.save();
      notifyAdmins(candidate);
      ```

      Después:
      ```js
      //typescript:backend/src/domain/models/Candidate.ts
      import { EventEmitter } from 'events';

      export class Candidate extends EventEmitter {
        // ...
        async save() {
          const saved = await prisma.candidate.create({ data: this });
          this.emit('saved', saved);
          return saved;
        }
      }
      ```

        ```js
      //typescript:backend/src/domain/listeners/CandidateListener.ts
      import { Candidate } from '../models/Candidate';

      export const setupCandidateListener = (candidate: Candidate) => {
        candidate.on('saved', (savedCandidate) => {
          // Lógica para notificar a los administradores
          notifyAdmins(savedCandidate);
          });
      };
      ```

      Explicación:

      Implementamos el patrón Observer utilizando `EventEmitter` para que los cambios en `Candidate` notifiquen automáticamente a los oyentes interesados, como la notificación a administradores.
