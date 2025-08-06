// Tipos base para el formulario de creación de proyectos
export interface ProjectFormData {
  jobTitle: string;
  jobDescription: string;
  category: string;
  projectType: 'fixed' | 'hourly';
  skills: string[];
}

export interface BudgetData {
  budgetType: 'fixed' | 'hourly' | 'range';
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
  currency: string;
}

export interface TimelineData {
  deadline: Date;
  estimatedDuration: number;
  durationUnit: 'days' | 'weeks' | 'months';
  isUrgent: boolean;
}

export interface ProjectRequirements {
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  availability: 'full-time' | 'part-time' | 'flexible';
  location: 'remote' | 'onsite' | 'hybrid';
  timezone?: string;
}

export interface ProjectAttachments {
  files: File[];
  maxFileSize: number; // en MB
  allowedTypes: string[];
}

// Tipos para el proceso de creación
export interface CreateProjectState {
  step1: Partial<ProjectFormData>;
  step2: Partial<BudgetData>;
  step3: Partial<TimelineData>;
  step4: Partial<ProjectRequirements>;
  step5: Partial<ProjectAttachments>;
  currentStep: number;
  isSubmitting: boolean;
  errors: ValidationError[];
}

// Tipos para validación
export interface ValidationError {
  field: string;
  message: string;
  step?: number;
}

// Tipos para la API
export interface CreateProjectRequest {
  project: ProjectFormData & BudgetData & TimelineData & ProjectRequirements;
  attachments?: File[];
}

export interface CreateProjectResponse {
  projectId: string;
  status: 'draft' | 'published' | 'error';
  message?: string;
  errors?: ValidationError[];
}

// Tipos para el store
export interface CreateProjectStore {
  // Estado del formulario
  formData: {
    step1: Partial<ProjectFormData>;
    step2: Partial<BudgetData>;
    step3: Partial<TimelineData>;
    step4: Partial<ProjectRequirements>;
    step5: Partial<ProjectAttachments>;
  };
  
  // Estado de navegación
  currentStep: number;
  isSubmitting: boolean;
  errors: ValidationError[];
  
  // Acciones
  updateStep1Data: (data: Partial<ProjectFormData>) => void;
  updateStep2Data: (data: Partial<BudgetData>) => void;
  updateStep3Data: (data: Partial<TimelineData>) => void;
  updateStep4Data: (data: Partial<ProjectRequirements>) => void;
  updateStep5Data: (data: Partial<ProjectAttachments>) => void;
  setCurrentStep: (step: number) => void;
  setErrors: (errors: ValidationError[]) => void;
  clearErrors: () => void;
  resetForm: () => void;
  submitProject: () => Promise<CreateProjectResponse>;
  
  // Acciones de navegación
  nextStep: () => boolean;
  previousStep: () => boolean;
  goToStep: (step: number) => boolean;
  validateCurrentStep: () => boolean;
  
  // Getters
  getCurrentStepData: () => any;
  getStepErrors: (step: number) => ValidationError[];
  isStepValid: (step: number) => boolean;
  canProceedToNext: () => boolean;
  getProgressPercentage: () => number;
}

// Tipos para validación de esquemas
export type CreateProjectFormData = ProjectFormData & BudgetData & TimelineData & ProjectRequirements & ProjectAttachments;

// Tipos para opciones de formulario
export interface ProjectTypeOption {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface SkillOption {
  id: string;
  name: string;
  category: string;
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
} 