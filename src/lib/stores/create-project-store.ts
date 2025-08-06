import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  CreateProjectStore, 
  ProjectFormData, 
  BudgetData, 
  TimelineData, 
  ProjectRequirements, 
  ProjectAttachments,
  ValidationError,
  CreateProjectResponse 
} from '../types/create-project-types';
import { validateStep, validateFullForm } from '../schemas/create-project-schema';

// Función para enviar el proyecto al backend
const submitProjectToAPI = async (formData: any): Promise<CreateProjectResponse> => {
  try {
    // Aquí iría la llamada real a tu API
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit project');
    }

    const data = await response.json();
    return {
      projectId: data.projectId,
      status: 'published',
      message: 'Project created successfully'
    };
  } catch (error) {
    return {
      projectId: '',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const useCreateProjectStore = create<CreateProjectStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      formData: {
        step1: {},
        step2: {},
        step3: {},
        step4: {},
        step5: {}
      },
      currentStep: 1,
      isSubmitting: false,
      errors: [],

      // Acciones para actualizar datos de cada paso
      updateStep1Data: (data: Partial<ProjectFormData>) => {
        set((state) => ({
          formData: { 
            ...state.formData, 
            step1: { ...state.formData.step1, ...data } 
          },
          errors: state.errors.filter(error => error.step !== 1)
        }));
      },

      updateStep2Data: (data: Partial<BudgetData>) => {
        set((state) => ({
          formData: { 
            ...state.formData, 
            step2: { ...state.formData.step2, ...data } 
          },
          errors: state.errors.filter(error => error.step !== 2)
        }));
      },

      updateStep3Data: (data: Partial<TimelineData>) => {
        set((state) => ({
          formData: { 
            ...state.formData, 
            step3: { ...state.formData.step3, ...data } 
          },
          errors: state.errors.filter(error => error.step !== 3)
        }));
      },

      updateStep4Data: (data: Partial<ProjectRequirements>) => {
        set((state) => ({
          formData: { 
            ...state.formData, 
            step4: { ...state.formData.step4, ...data } 
          },
          errors: state.errors.filter(error => error.step !== 4)
        }));
      },

      updateStep5Data: (data: Partial<ProjectAttachments>) => {
        set((state) => ({
          formData: { 
            ...state.formData, 
            step5: { ...state.formData.step5, ...data } 
          },
          errors: state.errors.filter(error => error.step !== 5)
        }));
      },

      // Acciones para navegación
      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      // Acciones para manejo de errores
      setErrors: (errors: ValidationError[]) => {
        set({ errors });
      },

      clearErrors: () => {
        set({ errors: [] });
      },

      // Acción para resetear el formulario
      resetForm: () => {
        set({
          formData: {
            step1: {},
            step2: {},
            step3: {},
            step4: {},
            step5: {}
          },
          currentStep: 1,
          isSubmitting: false,
          errors: []
        });
      },

      // Acción para validar un paso específico
      validateCurrentStep: () => {
        const state = get();
        const currentStepData = state.formData[`step${state.currentStep}` as keyof typeof state.formData];
        
        const validation = validateStep(state.currentStep, currentStepData);
        
        if (!validation.success) {
          const errors: ValidationError[] = validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            step: state.currentStep
          }));
          
          set({ errors });
          return false;
        }
        
        // Limpiar errores del paso actual si la validación es exitosa
        set({ 
          errors: state.errors.filter(error => error.step !== state.currentStep) 
        });
        return true;
      },

      // Acción para ir al siguiente paso
      nextStep: () => {
        const state = get();
        const isValid = state.validateCurrentStep();
        
        if (isValid && state.currentStep < 5) {
          set({ currentStep: state.currentStep + 1 });
          return true;
        }
        return false;
      },

      // Acción para ir al paso anterior
      previousStep: () => {
        const state = get();
        if (state.currentStep > 1) {
          set({ currentStep: state.currentStep - 1 });
          return true;
        }
        return false;
      },

      // Acción para ir a un paso específico
      goToStep: (step: number) => {
        if (step >= 1 && step <= 5) {
          set({ currentStep: step });
          return true;
        }
        return false;
      },

      // Acción para enviar el proyecto
      submitProject: async () => {
        const state = get();
        
        // Validar todo el formulario antes de enviar
        const fullValidation = validateFullForm(state.formData);
        
        if (!fullValidation.success) {
          const errors: ValidationError[] = fullValidation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }));
          
          set({ errors, isSubmitting: false });
          throw new Error('Form validation failed');
        }

        set({ isSubmitting: true });

        try {
          const response = await submitProjectToAPI(state.formData);
          
          if (response.status === 'error') {
            throw new Error(response.message || 'Failed to submit project');
          }

          // Resetear el formulario después de un envío exitoso
          state.resetForm();
          
          return response;
        } catch (error) {
          set({ isSubmitting: false });
          throw error;
        }
      },

      // Getters útiles
      getCurrentStepData: () => {
        const state = get();
        return state.formData[`step${state.currentStep}` as keyof typeof state.formData];
      },

      getStepErrors: (step: number) => {
        const state = get();
        return state.errors.filter(error => error.step === step);
      },

      isStepValid: (step: number) => {
        const state = get();
        const stepData = state.formData[`step${step}` as keyof typeof state.formData];
        const validation = validateStep(step, stepData);
        return validation.success;
      },

      canProceedToNext: () => {
        const state = get();
        return state.isStepValid(state.currentStep);
      },

      getProgressPercentage: () => {
        const state = get();
        return (state.currentStep / 5) * 100;
      }
    }),
    {
      name: 'create-project-store',
      // Solo persistir ciertos campos
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep
      })
    }
  )
); 