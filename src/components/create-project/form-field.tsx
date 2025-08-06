import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "textarea";
  textareaProps?: {
    minHeight?: string;
    resize?: boolean;
    maxLength?: number;
    showCharacterCount?: boolean;
  };
}

export function FormField({
  label,
  id,
  placeholder,
  value,
  onChange,
  type = "text",
  textareaProps = {}
}: FormFieldProps) {
  const { 
    minHeight = "120px", 
    resize = false, 
    maxLength,
    showCharacterCount = false 
  } = textareaProps;

  const characterCount = value.length;
  const isOverLimit = maxLength && characterCount > maxLength;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {type === "text" ? (
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          className="w-full rounded-lg border border-gray-300"
        />
      ) : (
        <div className="relative">
          <Textarea
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength}
            className={`w-full resize-none rounded-lg border border-gray-300 ${
              isOverLimit ? 'border-red-300 focus:border-red-500' : ''
            }`}
            style={{ minHeight }}
          />
          {showCharacterCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              <span className={isOverLimit ? 'text-red-500' : ''}>
                {characterCount}
              </span>
              <span className="text-gray-400">/{maxLength}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 