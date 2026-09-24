import React from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface ManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubmit: () => void;
}

export const ManifestoModal: React.FC<ManifestoModalProps> = ({
  isOpen,
  onClose,
  onOpenSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-full max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950/60">
          <div>
            <h2 className="text-lg font-bold text-white font-display">The Unbuilt Commons Manifesto</h2>
            <p className="text-xs text-neutral-400">Why good ideas die in note apps, and how we fix it</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-neutral-300 leading-relaxed">
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-neutral-200">
            <p className="italic text-amber-200/90 font-serif text-base">
              "I keep having ideas and I think they're nice, but they need work and I'm never going to do them alone.
              I want to put them here if anyone else wants to build them."
            </p>
            <div className="mt-2 text-xs text-amber-400 font-mono">— Founding Premise</div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white font-display">1. The Tripartite Chasm</h3>
            <p>
              In our digital economy, three distinct groups are chronically disconnected:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-neutral-300">
              <li>
                <strong className="text-white">People living with acute real-world friction:</strong> Local business owners, paramedics, teachers, and tenants who observe broken systems daily but don't write code or design systems.
              </li>
              <li>
                <strong className="text-white">System thinkers & ideators:</strong> People who see the exact bridge and feasible solution, but lack the bandwidth, capital, or complementary skills to build it.
              </li>
              <li>
                <strong className="text-white">Skilled builders (engineers, designers, hackers):</strong> Millions of talented people looking for meaningful side-projects who are tired of building yet another Twitter clone or toy wrapper.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white font-display">2. Why Traditional Forums Fail</h3>
            <p>
              Reddit (e.g. <span className="font-mono text-neutral-400">r/SomebodyMakeThis</span>), Discord, and Twitter are chronological firehoses. A funny joke post gets 10,000 upvotes while an actionable open medical standard is buried in 2 hours.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-neutral-950/60 p-3 border border-neutral-800 text-xs">
                <div className="font-semibold text-red-400 mb-1">Standard Forums</div>
                <div className="text-neutral-400 space-y-1">
                  <div>✕ Single upvote button merges novelty, feasibility, and real need.</div>
                  <div>✕ Zero skill matching or role vacancies.</div>
                  <div>✕ Ideas exist in isolation with no prerequisite graph.</div>
                </div>
              </div>
              <div className="rounded-lg bg-neutral-950/60 p-3 border border-neutral-800 text-xs">
                <div className="font-semibold text-emerald-400 mb-1">Unbuilt Commons</div>
                <div className="text-neutral-400 space-y-1">
                  <div>✓ 4-vector voting: Novelty, Feasibility, Problem validation, Builder willingness.</div>
                  <div>✓ Filter projects specifically by the skills you possess.</div>
                  <div>✓ Graph dependencies: trace what must be solved first.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white font-display">3. Public Domain Donation</h3>
            <p>
              Every idea donated to Unbuilt is released freely to humanity. You can export complete Markdown RFCs,
              scaffold GitHub repositories, assemble teams, and build without gatekeepers.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950/80 px-6 py-4">
          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenSubmit();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-300"
          >
            <span>Donate Your First Idea / Problem</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
