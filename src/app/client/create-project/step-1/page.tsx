"use client";

import { useRouter } from "next/navigation";
import { CreateProjectLayout } from "@/components/create-project/create-project-layout";
import { ProjectDetailsForm } from "@/components/create-project/project-details-form";
import { useCreateProjectStore } from "@/lib/stores/create-project-store";

export default function CreateProjectStep1() {
  const router = useRouter();
  const { nextStep } = useCreateProjectStore();

  const handleNext = () => {
    const success = nextStep();
    if (success) {
      router.push("/client/create-project/step-2");
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <CreateProjectLayout>
      <ProjectDetailsForm
        onNext={handleNext}
        onBack={handleBack}
      />
    </CreateProjectLayout>
  );
} 