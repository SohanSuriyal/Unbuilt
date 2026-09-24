import React, { useState } from 'react';
import { Idea, IdeaComplexity, IdeaType, PrerequisiteLink, SkillRequirement } from '../types';
import { X, Plus, Trash2, Compass, Zap, ShieldAlert, Users, Link2, Sparkles } from 'lucide-react';

interface SubmitIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingIdeas: Idea[];
  onSubmitIdea: (newIdea: Idea) => void;
}

const CATEGORIES = [
  'Productivity & Public Tech',
  'Health & Public Safety',
  'Sustainability & Community',
  'Hardware & Right-to-Repair',
  'Civic Infrastructure',
  'Privacy & Elder Care',
  'Education & Access',
  'Developer & Open Source Tools',
];

export const SubmitIdeaModal: React.FC<SubmitIdeaModalProps> = ({
  isOpen,
  onClose,
  existingIdeas,
  onSubmitIdea,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [type, setType] = useState<IdeaType>('problem');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [complexity, setComplexity] = useState<IdeaComplexity>('1-Month MVP');
  const [authorName, setAuthorName] = useState('');
  const [authorHandle, setAuthorHandle] = useState('');

  // Motivation
  const [problemStatement, setProblemStatement] = useState('');
  const [theGap, setTheGap] = useState('');
  const [whoItAffects, setWhoItAffects] = useState('');
  const [impactIfSolved, setImpactIfSolved] = useState('');

  // Feasibility
  const [feasibilityAssessment, setFeasibilityAssessment] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [firstStep, setFirstStep] = useState('');
  const [pitfalls, setPitfalls] = useState('');

  // Existing Solutions
  const [altName, setAltName] = useState('');
  const [altDesc, setAltDesc] = useState('');
  const [alternatives, setAlternatives] = useState<Array<{ name: string; description: string }>>([]);
  const [whyTheyFallShort, setWhyTheyFallShort] = useState('');

  // Skills Needed
  const [skillName, setSkillName] = useState('');
  const [skillRole, setSkillRole] = useState('');
  const [skillsList, setSkillsList] = useState<SkillRequirement[]>([
    { skill: 'Frontend Developer', roleDescription: 'Build reactive UI & state logic', filledCount: 0, targetCount: 1 },
  ]);

  // Prerequisites
  const [selectedPrereqId, setSelectedPrereqId] = useState('');
  const [prereqRelationship, setPrereqRelationship] = useState<PrerequisiteLink['relationship']>('blocked_by');
  const [prereqsList, setPrereqsList] = useState<PrerequisiteLink[]>([]);

  if (!isOpen) return null;

  const handleAddAlternative = () => {
    if (altName.trim()) {
      setAlternatives([...alternatives, { name: altName.trim(), description: altDesc.trim() }]);
      setAltName('');
      setAltDesc('');
    }
  };

  const handleRemoveAlternative = (index: number) => {
    setAlternatives(alternatives.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    if (skillName.trim()) {
      setSkillsList([
        ...skillsList,
        {
          skill: skillName.trim(),
          roleDescription: skillRole.trim() || 'Contributor',
          filledCount: 0,
          targetCount: 1,
        },
      ]);
      setSkillName('');
      setSkillRole('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkillsList(skillsList.filter((_, i) => i !== index));
  };

  const handleAddPrereq = () => {
    if (selectedPrereqId && !prereqsList.some((p) => p.targetId === selectedPrereqId)) {
      setPrereqsList([
        ...prereqsList,
        {
          targetId: selectedPrereqId,
          relationship: prereqRelationship,
        },
      ]);
      setSelectedPrereqId('');
    }
  };

  const handleRemovePrereq = (targetId: string) => {
    setPrereqsList(prereqsList.filter((p) => p.targetId !== targetId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) return;

    const stackArray = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newIdea: Idea = {
      id: `idea-${Date.now()}`,
      title: title.trim(),
      type,
      tagline: tagline.trim(),
      category,
      complexity,
      author: {
        name: authorName.trim() || 'Anonymous Ideator',
        handle: authorHandle.trim()
          ? authorHandle.startsWith('@')
            ? authorHandle.trim()
            : `@${authorHandle.trim()}`
          : '@ideator',
      },
      createdAt: new Date().toISOString().split('T')[0],
      motivation: {
        problemStatement:
          problemStatement.trim() ||
          'Unaddressed real-world friction observed in daily workflows and community practice.',
        theGap:
          theGap.trim() ||
          'The gap between observing the problem and finding engineers with the bandwidth to build.',
        whoItAffects: whoItAffects.trim() || 'Target practitioners and communities.',
        impactIfSolved: impactIfSolved.trim() || 'Removes acute friction and unlocks collaborative efficiency.',
      },
      feasibility: {
        assessment:
          feasibilityAssessment.trim() ||
          'Feasible using modern web standards and modular architectural patterns.',
        suggestedStack: stackArray.length > 0 ? stackArray : ['React', 'TypeScript', 'Node.js'],
        firstStep: firstStep.trim() || 'Publish initial functional schema and scaffold MVP repository.',
        pitfallsAndChallenges: pitfalls.trim() || 'Sustaining user engagement and community trust.',
      },
      existingSolutions: {
        alternatives:
          alternatives.length > 0
            ? alternatives
            : [
                {
                  name: 'Generic Discussion Forums',
                  description: 'Chronological message boards without structured specs or skill matching.',
                },
              ],
        whyTheyFallShort:
          whyTheyFallShort.trim() ||
          'Existing tools lack granular feasibility breakdown, skill-based team recruitment, and prerequisite linking.',
      },
      skillsNeeded: skillsList.length > 0 ? skillsList : [
        { skill: 'Full-Stack Developer', roleDescription: 'Lead MVP implementation', filledCount: 0, targetCount: 1 }
      ],
      prerequisites: prereqsList,
      votes: {
        goodIdea: 1,
        feasible: 1,
        haveThisProblem: type === 'problem' ? 1 : 0,
        wantToBuild: 0,
      },
      userVotes: {
        goodIdea: true,
        feasible: true,
        haveThisProblem: type === 'problem',
      },
      team: {
        status: 'open_for_builders',
        members: [],
      },
      discussions: [],
    };

    onSubmitIdea(newIdea);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-full max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950/60">
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Donate an Idea or Real-World Problem to the Commons
            </h2>
            <p className="text-xs text-neutral-400">
              Provide structured motivation, feasibility, and skill requirements so builders can take it forward
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-5 border-b border-neutral-800/80 bg-neutral-950/40 text-xs">
          {[
            { step: 1, label: 'Overview' },
            { step: 2, label: 'Motivation' },
            { step: 3, label: 'Feasibility' },
            { step: 4, label: 'Alternatives' },
            { step: 5, label: 'Skills & Prereqs' },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step as any)}
              className={`py-2.5 text-center font-medium transition-colors border-b-2 ${
                currentStep === s.step
                  ? 'border-amber-400 text-white font-semibold bg-neutral-900/60'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <span className="font-mono">{s.step}.</span> {s.label}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* STEP 1: OVERVIEW */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300">Submission Classification *</label>
                <div className="mt-1.5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('problem')}
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      type === 'problem'
                        ? 'border-amber-400 bg-amber-400/15 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-400">Real-World Problem</div>
                    <div className="text-[11px] text-neutral-300 mt-0.5">
                      Friction or breakdown observed on the ground looking for solutions
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('idea')}
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      type === 'idea'
                        ? 'border-emerald-400 bg-emerald-400/15 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-400">Solvable Idea / Architecture</div>
                    <div className="text-[11px] text-neutral-300 mt-0.5">
                      A concrete proposed product, protocol, or design ready to be built
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Offline Emergency Triage NFC Card with Revocable QR Encryption"
                  className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">Tagline / 1-Sentence Summary *</label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Briefly describe what this accomplishes and for whom..."
                  className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Domain Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300">Estimated Complexity</label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value as IdeaComplexity)}
                    className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Weekend Prototype">Weekend Prototype (48-hour hack)</option>
                    <option value="1-Month MVP">1-Month MVP (Focused build)</option>
                    <option value="Multi-Month Project">Multi-Month Project (Complex system)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Your Name (or Pseudonym)</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Sohan S."
                    className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Your Handle / Social</label>
                  <input
                    type="text"
                    value={authorHandle}
                    onChange={(e) => setAuthorHandle(e.target.value)}
                    placeholder="@sohan or github"
                    className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MOTIVATION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                <Compass className="h-4 w-4" />
                <span>The Motivation & Gap</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">
                  What is the specific real-world friction? *
                </label>
                <textarea
                  rows={3}
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Describe what goes wrong, the daily annoyance, or the structural breakdown..."
                  className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">
                  Why does the gap persist? (Ideas vs Skills vs Problems)
                </label>
                <textarea
                  rows={2}
                  value={theGap}
                  onChange={(e) => setTheGap(e.target.value)}
                  placeholder="e.g. People who face this don't code; engineers don't know this friction exists; commercial startups find the margin too low..."
                  className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Who it affects most</label>
                  <input
                    type="text"
                    value={whoItAffects}
                    onChange={(e) => setWhoItAffects(e.target.value)}
                    placeholder="e.g. Independent bakery owners, EMTs, tenants"
                    className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Impact if solved</label>
                  <input
                    type="text"
                    value={impactIfSolved}
                    onChange={(e) => setImpactIfSolved(e.target.value)}
                    placeholder="e.g. Diverts 2,000 lbs of food waste / Saves 5 mins in triage"
                    className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FEASIBILITY */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                <Zap className="h-4 w-4" />
                <span>Feasibility & Architecture</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">
                  Why is this realistically doable? *
                </label>
                <textarea
                  rows={3}
                  value={feasibilityAssessment}
                  onChange={(e) => setFeasibilityAssessment(e.target.value)}
                  placeholder="Explain why this does not require 5 years of research, but can be built cleanly using existing web/hardware technologies..."
                  className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">
                  Suggested Tech Stack (Comma separated)
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="e.g. React, WebNFC, Tailwind, SQLite, Node.js"
                  className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Immediate First Step</label>
                  <input
                    type="text"
                    value={firstStep}
                    onChange={(e) => setFirstStep(e.target.value)}
                    placeholder="e.g. Scaffold 1-page reader using WebNFC sample"
                    className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Anticipated Challenges / Pitfalls</label>
                  <input
                    type="text"
                    value={pitfalls}
                    onChange={(e) => setPitfalls(e.target.value)}
                    placeholder="e.g. iOS Safari permission constraints"
                    className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: EXISTING SOLUTIONS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold uppercase tracking-wider">
                <ShieldAlert className="h-4 w-4" />
                <span>Existing Solutions & Why They Fall Short</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">Add an existing alternative</label>
                <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={altName}
                    onChange={(e) => setAltName(e.target.value)}
                    placeholder="Tool / Alternative Name"
                    className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={altDesc}
                    onChange={(e) => setAltDesc(e.target.value)}
                    placeholder="How it works / what it does"
                    className="sm:col-span-2 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddAlternative}
                  disabled={!altName.trim()}
                  className="mt-2 flex items-center gap-1 rounded bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-200 hover:bg-neutral-700 disabled:opacity-40"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Alternative to List</span>
                </button>
              </div>

              {alternatives.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-neutral-400">Recorded Alternatives:</div>
                  {alternatives.map((alt, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded bg-neutral-950/60 p-2 text-xs border border-neutral-800"
                    >
                      <div>
                        <span className="font-semibold text-white">{alt.name}: </span>
                        <span className="text-neutral-400">{alt.description}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAlternative(i)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-neutral-300">
                  Why are current solutions not good enough? *
                </label>
                <textarea
                  rows={3}
                  value={whyTheyFallShort}
                  onChange={(e) => setWhyTheyFallShort(e.target.value)}
                  placeholder="e.g. Existing forums don't have multi-dimensional voting, lack skill matching, are geared for general chatter rather than project handoffs..."
                  className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: SKILLS & PREREQUISITES */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-violet-400 font-semibold uppercase tracking-wider">
                  <Users className="h-4 w-4" />
                  <span>Roles & Skills Needed to Build</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="Skill (e.g. Frontend React, WebNFC)"
                    className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={skillRole}
                    onChange={(e) => setSkillRole(e.target.value)}
                    placeholder="Role responsibilities"
                    className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={!skillName.trim()}
                  className="flex items-center gap-1 rounded bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-200 hover:bg-neutral-700 disabled:opacity-40"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Role Vacancy</span>
                </button>

                <div className="space-y-1.5">
                  {skillsList.map((sn, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded bg-neutral-950/60 p-2 text-xs border border-neutral-800"
                    >
                      <div>
                        <span className="font-semibold text-white">{sn.skill}</span>
                        <span className="text-neutral-400 ml-2">— {sn.roleDescription}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold uppercase tracking-wider">
                  <Link2 className="h-4 w-4" />
                  <span>Connect Prerequisites (Optional)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={selectedPrereqId}
                    onChange={(e) => setSelectedPrereqId(e.target.value)}
                    className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">-- Link to existing idea in Commons --</option>
                    {existingIdeas.map((idea) => (
                      <option key={idea.id} value={idea.id}>
                        {idea.title}
                      </option>
                    ))}
                  </select>

                  <select
                    value={prereqRelationship}
                    onChange={(e) => setPrereqRelationship(e.target.value as PrerequisiteLink['relationship'])}
                    className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="blocked_by">Blocked by (needs it first)</option>
                    <option value="prerequisite_for">Prerequisite for</option>
                    <option value="child_of">Child module of</option>
                    <option value="alternative_to">Alternative approach to</option>
                    <option value="related">Related idea</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleAddPrereq}
                  disabled={!selectedPrereqId}
                  className="flex items-center gap-1 rounded bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-200 hover:bg-neutral-700 disabled:opacity-40"
                >
                  <Plus className="h-3 w-3" />
                  <span>Connect Dependency</span>
                </button>

                {prereqsList.map((p) => {
                  const target = existingIdeas.find((i) => i.id === p.targetId);
                  return (
                    <div
                      key={p.targetId}
                      className="flex items-center justify-between rounded bg-neutral-950/60 p-2 text-xs border border-neutral-800"
                    >
                      <div>
                        <span className="font-mono text-sky-400 mr-2 uppercase text-[10px]">
                          [{p.relationship.replace(/_/g, ' ')}]
                        </span>
                        <span className="text-white">{target?.title || p.targetId}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePrereq(p.targetId)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </form>

        {/* Modal Bottom Controls */}
        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950/80 px-6 py-3.5">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                className="rounded-md border border-neutral-800 bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white"
              >
                Previous Step
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep + 1) as any)}
                className="rounded-md bg-amber-400 px-4 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300"
              >
                Next: {['Overview', 'Motivation', 'Feasibility', 'Alternatives', 'Skills & Prereqs'][currentStep]}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!title.trim() || !tagline.trim()}
                className="rounded-md bg-amber-400 px-5 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-40"
              >
                Publish to Commons
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
