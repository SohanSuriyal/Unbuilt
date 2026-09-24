import React, { useState } from 'react';
import { Idea, TeamMember } from '../types';
import { X, Users, Check } from 'lucide-react';

interface TeamJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea;
  userSkills: string[];
  onJoinTeam: (ideaId: string, member: TeamMember) => void;
}

export const TeamJoinModal: React.FC<TeamJoinModalProps> = ({
  isOpen,
  onClose,
  idea,
  userSkills,
  onJoinTeam,
}) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [selectedRole, setSelectedRole] = useState(
    idea.skillsNeeded.length > 0 ? idea.skillsNeeded[0].roleDescription : 'Contributor'
  );
  const [selectedSkill, setSelectedSkill] = useState(
    idea.skillsNeeded.length > 0 ? idea.skillsNeeded[0].skill : userSkills[0] || 'Engineering'
  );
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: name.trim(),
      handle: handle.trim() ? (handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`) : '@contributor',
      role: selectedRole,
      skill: selectedSkill,
      joinedAt: new Date().toISOString().split('T')[0],
      message: message.trim() || undefined,
    };

    onJoinTeam(idea.id, newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-400" />
            <div>
              <h2 className="text-base font-bold text-white font-display">Join Builder Team</h2>
              <p className="text-xs text-neutral-400 line-clamp-1">{idea.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-300">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-300">Handle / Contact</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@github or discord"
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">Select Role or Vacancy</label>
            <div className="mt-1.5 space-y-1.5">
              {idea.skillsNeeded.map((sn, idx) => (
                <label
                  key={idx}
                  onClick={() => {
                    setSelectedRole(sn.roleDescription);
                    setSelectedSkill(sn.skill);
                  }}
                  className={`flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                    selectedSkill === sn.skill
                      ? 'border-violet-500/70 bg-violet-500/10'
                      : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      selectedSkill === sn.skill
                        ? 'border-violet-400 bg-violet-500 text-white'
                        : 'border-neutral-600'
                    }`}
                  >
                    {selectedSkill === sn.skill && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span>{sn.skill}</span>
                      <span className="font-mono text-[10px] text-neutral-400 tabular-nums">
                        {sn.filledCount}/{sn.targetCount} filled
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400">{sn.roleDescription}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">What would you like to build or contribute?</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Can prototype the frontend parser and test offline caching this weekend..."
              className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
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
              disabled={!name.trim()}
              className="rounded-md bg-amber-400 px-4 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-40"
            >
              Confirm & Join Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
