import React, { useState } from 'react';
import { X, Check, Plus } from 'lucide-react';

interface SkillConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSkills: string[];
  onSaveSkills: (skills: string[]) => void;
}

const COMMON_SKILLS = [
  'Frontend Architecture',
  'UI/UX Design',
  'Backend / API',
  'Embedded / Hardware',
  'Mobile / PWA',
  'Data / ML',
  'Security Auditor',
  'DevOps & Infrastructure',
  'Community & Moderation',
  'Legal & Domain Advisory',
  'Hardware Technician',
  'Emergency Medicine / EMT Advisor',
  'Operations & Logistics',
];

export const SkillConfigModal: React.FC<SkillConfigModalProps> = ({
  isOpen,
  onClose,
  userSkills,
  onSaveSkills,
}) => {
  const [selected, setSelected] = useState<string[]>(userSkills);
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (selected.includes(skill)) {
      setSelected(selected.filter((s) => s !== skill));
    } else {
      setSelected([...selected, skill]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected([...selected, trimmed]);
      setCustomInput('');
    }
  };

  const handleSave = () => {
    onSaveSkills(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Configure Your Skills</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Highlight projects where your domain expertise is actively needed
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-300">Select Common Disciplines</label>
            <div className="mt-2 flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {COMMON_SKILLS.map((skill) => {
                const isSelected = selected.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950 font-semibold'
                        : 'border border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleAddCustom} className="pt-2">
            <label className="text-xs font-medium text-neutral-300">Add Custom Skill or Tooling</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. Rust, WebNFC, GIS Mapping..."
                className="flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="flex items-center gap-1 rounded-md bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </form>

          {selected.length > 0 && (
            <div className="rounded-lg bg-neutral-950/70 p-3 border border-neutral-800/80">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Active Skills ({selected.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {selected.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded bg-neutral-800/80 px-2 py-0.5 text-[11px] text-amber-300"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => toggleSkill(s)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-amber-400 px-4 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300"
          >
            Save Skills
          </button>
        </div>
      </div>
    </div>
  );
};
