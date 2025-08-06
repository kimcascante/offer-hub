import { Clock, DollarSign } from "lucide-react";

interface ProjectTypeSelectorProps {
  selectedType: 'fixed' | 'hourly';
  onTypeChange: (type: 'fixed' | 'hourly') => void;
}

export function ProjectTypeSelector({ selectedType, onTypeChange }: ProjectTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Project Type
      </label>
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedType === 'fixed'
              ? "border-gray-800 bg-gray-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onClick={() => onTypeChange('fixed')}
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Fixed Price</h3>
          </div>
          <p className="text-sm text-gray-600">
            Set a fixed budget for your project
          </p>
        </div>
        
        <div
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedType === 'hourly'
              ? "border-gray-800 bg-gray-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onClick={() => onTypeChange('hourly')}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Hourly</h3>
          </div>
          <p className="text-sm text-gray-600">
            Pay by the hour for work completed
          </p>
        </div>
      </div>
    </div>
  );
} 