import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SkillOption {
  id: string;
  name: string;
  category: string;
}

interface SkillsSelectorProps {
  addedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

// Lista predefinida de habilidades populares
const popularSkills: SkillOption[] = [
  { id: "react", name: "React", category: "Frontend" },
  { id: "javascript", name: "JavaScript", category: "Programming" },
  { id: "typescript", name: "TypeScript", category: "Programming" },
  { id: "nodejs", name: "Node.js", category: "Backend" },
  { id: "python", name: "Python", category: "Programming" },
  { id: "ui-design", name: "UI Design", category: "Design" },
  { id: "ux-design", name: "UX Design", category: "Design" },
  { id: "figma", name: "Figma", category: "Design" },
  { id: "content-writing", name: "Content Writing", category: "Writing" },
  { id: "seo", name: "SEO", category: "Marketing" },
  { id: "social-media", name: "Social Media", category: "Marketing" },
  { id: "wordpress", name: "WordPress", category: "CMS" },
  { id: "shopify", name: "Shopify", category: "E-commerce" },
  { id: "mobile-development", name: "Mobile Development", category: "Development" },
  { id: "database", name: "Database", category: "Backend" },
  { id: "api", name: "API Development", category: "Backend" },
  { id: "testing", name: "Testing", category: "Quality Assurance" },
  { id: "devops", name: "DevOps", category: "Infrastructure" },
  { id: "aws", name: "AWS", category: "Cloud" },
  { id: "docker", name: "Docker", category: "Infrastructure" }
];

export function SkillsSelector({ addedSkills, onSkillsChange }: SkillsSelectorProps) {
  const [skillSearch, setSkillSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState<SkillOption[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filtrar habilidades basado en la búsqueda
  useEffect(() => {
    if (skillSearch.trim()) {
      const filtered = popularSkills.filter(skill =>
        skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !addedSkills.includes(skill.name)
      );
      setFilteredSkills(filtered.slice(0, 8)); // Limitar a 8 sugerencias
      setShowSuggestions(true);
    } else {
      setFilteredSkills([]);
      setShowSuggestions(false);
    }
  }, [skillSearch, addedSkills]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !addedSkills.includes(skill.trim()) && addedSkills.length < 10) {
      onSkillsChange([...addedSkills, skill.trim()]);
      setSkillSearch("");
      setShowSuggestions(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(addedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(skillSearch);
    }
  };

  const handleSuggestionClick = (skill: SkillOption) => {
    handleAddSkill(skill.name);
  };

  return (
    <div className="space-y-4">
      {/* Skills Search */}
      <div className="space-y-2">
        <label htmlFor="skillSearch" className="text-sm font-medium text-gray-700">
          Skills required for project
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            ref={inputRef}
            id="skillSearch"
            type="text"
            placeholder="Search and add up to 10 skills"
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => skillSearch.trim() && setShowSuggestions(true)}
            className="w-full pl-10 rounded-lg border border-gray-300"
          />
          
          {/* Sugerencias de autocompletado */}
          {showSuggestions && filteredSkills.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => handleSuggestionClick(skill)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-sm text-gray-900">{skill.name}</div>
                  <div className="text-xs text-gray-500">{skill.category}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Added Skills */}
      {addedSkills.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Added skills ({addedSkills.length}/10)
          </label>
          <div className="flex flex-wrap gap-2">
            {addedSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-300 transition-colors text-sm font-medium"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 