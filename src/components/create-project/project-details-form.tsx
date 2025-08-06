import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "./form-field";
import { SkillsSelector } from "./skills-selector";
import { ProjectTypeSelector } from "./project-type-selector";
import { CategorySelector } from "./category-selector";
import { useCreateProjectStore } from "@/lib/stores/create-project-store";

interface ProjectDetailsFormProps {
  onNext: () => void;
  onBack: () => void;
}

export function ProjectDetailsForm({ onNext, onBack }: ProjectDetailsFormProps) {
  const {
    formData,
    updateStep1Data,
    validateCurrentStep,
    getStepErrors,
    canProceedToNext
  } = useCreateProjectStore();

  const step1Data = formData.step1;
  const errors = getStepErrors(1);

  const handleNext = () => {
    const isValid = validateCurrentStep();
    if (isValid) {
      onNext();
    }
  };

  const canProceed = canProceedToNext();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
          Project details
        </CardTitle>
        <p className="text-sm text-gray-600">
          Create and post project you want to hire for
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        {/* Project Type */}
        <ProjectTypeSelector
          selectedType={step1Data.projectType as 'fixed' | 'hourly' || 'fixed'}
          onTypeChange={(type) => updateStep1Data({ projectType: type })}
        />

        {/* Project Title */}
        <FormField
          label="Project title"
          id="jobTitle"
          placeholder="Give your project a title"
          value={step1Data.jobTitle || ""}
          onChange={(value) => updateStep1Data({ jobTitle: value })}
          type="text"
          textareaProps={{ maxLength: 100 }}
        />

        {/* Category */}
        <CategorySelector
          selectedCategory={step1Data.category || ""}
          onCategoryChange={(category) => updateStep1Data({ category })}
        />

        {/* Project Description */}
        <FormField
          label="Project description"
          id="jobDescription"
          placeholder="Describe your project requirements, goals, and any specific details..."
          value={step1Data.jobDescription || ""}
          onChange={(value) => updateStep1Data({ jobDescription: value })}
          type="textarea"
          textareaProps={{ 
            minHeight: "120px", 
            resize: false,
            maxLength: 1000,
            showCharacterCount: true
          }}
        />

        {/* Skills Required */}
        <SkillsSelector
          addedSkills={step1Data.skills || []}
          onSkillsChange={(skills) => updateStep1Data({ skills })}
        />

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="font-medium">Please fix the following error:</div>
                <div>{error.message}</div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-4 pt-6 items-center">
          <Button 
            className="bg-gray-800 hover:bg-gray-900 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{
              width: '361px',
              height: '44px',
              borderRadius: '32px',
              padding: '16px',
              gap: '10px',
              color: '#FFFFFF'
            }}
            onClick={handleNext}
            disabled={!canProceed}
          >
            Next
          </Button>
          
          <Button 
            className="text-white font-medium hover:bg-opacity-90 transition-colors"
            style={{
              width: '361px',
              height: '44px',
              borderRadius: '32px',
              padding: '16px',
              gap: '10px',
              backgroundColor: '#149A9B',
              color: '#FFFFFF'
            }}
            onClick={onBack}
          >
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 