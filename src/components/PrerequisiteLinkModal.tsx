import React, { useState } from 'react';
import { Idea, PrerequisiteLink } from '../types';
import { X, Link2 } from 'lucide-react';

interface PrerequisiteLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIdea: Idea;
  allIdeas: Idea[];
  onAddLink: (ideaId: string, link: PrerequisiteLink) => void;
}

export const PrerequisiteLinkModal: React.FC<PrerequisiteLinkModalProps> = ({
  isOpen,
  onClose,
  currentIdea,
  allIdeas,
  onAddLink,
}) => {
  const [targetId, setTargetId] = useState('');
  const [relationship, setRelationship] = useState<PrerequisiteLink['relationship']>('blocked_by');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  // Filter out current idea and ideas already linked
  const eligibleIdeas = allIdeas.filter(
    (i) => i.id !== currentIdea.id && !currentIdea.prerequisites.some((p) => p.targetId === i.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;

    onAddLink(currentIdea.id, {
      targetId,
      relationship,
      note: note.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-sky-400" />
            <h2 className="text-base font-bold text-white font-display">Connect Prerequisite or Related Idea</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-300">
              Target Idea in Commons
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="">-- Choose an idea from commons --</option>
              {eligibleIdeas.map((idea) => (
                <option key={idea.id} value={idea.id}>
                  [{idea.type.toUpperCase()}] {idea.title} ({idea.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">
              Relationship Type
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as PrerequisiteLink['relationship'])}
              className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="blocked_by">Blocked by (Needs target idea built or solved first)</option>
              <option value="prerequisite_for">Prerequisite for (Target idea depends on this)</option>
              <option value="child_of">Child module of (Component or sub-system)</option>
              <option value="alternative_to">Alternative approach to (Different philosophical angle)</option>
              <option value="related">Synergistic / Related problem</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">
              Dependency Context / Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="e.g. Needs the open data schema defined in the target project before UI can parse it."
              className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!targetId}
              className="rounded-md bg-amber-400 px-4 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-40"
            >
              Add Dependency Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
