import { z } from "zod";

// Esquema para el paso 1 - Detalles básicos del proyecto
export const step1Schema = z.object({
  jobTitle: z
    .string()
    .min(1, "Project title is required")
    .max(100, "Project title must be less than 100 characters")
    .trim(),
  jobDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .trim(),
  category: z
    .string()
    .min(1, "Category is required"),
  projectType: z.enum(['fixed', 'hourly'], {
    required_error: "Project type is required"
  }),
  skills: z
    .array(z.string())
    .min(1, "At least one skill is required")
    .max(10, "Maximum 10 skills allowed")
    .refine(skills => skills.every(skill => skill.trim().length > 0), {
      message: "All skills must be non-empty"
    })
});

// Esquema para el paso 2 - Presupuesto
export const step2Schema = z.object({
  budgetType: z.enum(['fixed', 'hourly', 'range'], {
    required_error: "Budget type is required"
  }),
  amount: z.number().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  currency: z
    .string()
    .min(1, "Currency is required")
}).refine(data => {
  if (data.budgetType === 'fixed') {
    return data.amount && data.amount > 0;
  }
  if (data.budgetType === 'range') {
    return data.minAmount && data.maxAmount && 
           data.minAmount > 0 && data.maxAmount > data.minAmount;
  }
  if (data.budgetType === 'hourly') {
    return data.amount && data.amount > 0;
  }
  return true;
}, {
  message: "Invalid budget configuration"
});

// Esquema para el paso 3 - Cronograma
export const step3Schema = z.object({
  deadline: z
    .date()
    .min(new Date(), "Deadline must be in the future"),
  estimatedDuration: z
    .number()
    .min(1, "Duration must be at least 1")
    .max(365, "Duration cannot exceed 365"),
  durationUnit: z.enum(['days', 'weeks', 'months'], {
    required_error: "Duration unit is required"
  }),
  isUrgent: z.boolean().default(false)
});

// Esquema para el paso 4 - Requisitos
export const step4Schema = z.object({
  experienceLevel: z.enum(['beginner', 'intermediate', 'expert'], {
    required_error: "Experience level is required"
  }),
  availability: z.enum(['full-time', 'part-time', 'flexible'], {
    required_error: "Availability is required"
  }),
  location: z.enum(['remote', 'onsite', 'hybrid'], {
    required_error: "Location type is required"
  }),
  timezone: z.string().optional()
});

// Esquema para el paso 5 - Archivos adjuntos
export const step5Schema = z.object({
  files: z
    .array(z.instanceof(File))
    .max(10, "Maximum 10 files allowed")
    .optional(),
  maxFileSize: z.number().default(10), // 10MB por defecto
  allowedTypes: z.array(z.string()).default(['.pdf', '.doc', '.docx', '.jpg', '.png'])
}).refine(data => {
  if (!data.files) return true;
  
  const maxSizeInBytes = data.maxFileSize * 1024 * 1024; // Convertir MB a bytes
  
  return data.files.every(file => {
    const isValidSize = file.size <= maxSizeInBytes;
    const isValidType = data.allowedTypes.some(type => 
      file.name.toLowerCase().endsWith(type.toLowerCase())
    );
    return isValidSize && isValidType;
  });
}, {
  message: "One or more files exceed size limit or have invalid type"
});

// Esquema completo para todo el formulario
export const createProjectSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema.optional()
});

// Esquemas individuales para validación por pasos
export const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema
};

// Tipos inferidos de los esquemas
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type CreateProjectSchemaData = z.infer<typeof createProjectSchema>;

// Función helper para validar un paso específico
export const validateStep = (step: number, data: any) => {
  const schema = stepSchemas[step as keyof typeof stepSchemas];
  if (!schema) {
    throw new Error(`Invalid step number: ${step}`);
  }
  return schema.safeParse(data);
};

// Función helper para validar todo el formulario
export const validateFullForm = (data: any) => {
  return createProjectSchema.safeParse(data);
}; 