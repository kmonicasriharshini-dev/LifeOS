import React from 'react';
import { Check, X, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { ActionProposal } from '../types';
import { useLifeOS } from '../context/LifeOSContext';

interface Props {
  proposal: ActionProposal;
  isInline?: boolean;
}

export const ActionProposalCard: React.FC<Props> = ({ proposal, isInline = false }) => {
  const { applyProposal, cancelProposal } = useLifeOS();

  return (
    <div
      className={`rounded-2xl border transition-all ${
        proposal.applied
          ? 'bg-[#F2FAF4] border-[#BEE8CA]'
          : 'bg-gradient-to-br from-[#FCFAFF] via-white to-[#FFF9FB] border-[#E9DDFB] shadow-sm'
      } p-5 my-3`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#E9DDFB] text-[#553C78]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#735399]">
                Proposed Dynamic Plan Adaptation
              </span>
              {proposal.applied && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DDF3E4] text-[#245C38] font-bold border border-[#BDE5C8]">
                  Applied to System
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[#2F3142]">{proposal.summary}</h3>
          </div>
        </div>
        <span className="text-[11px] text-[#8F91A3]">{proposal.timestamp}</span>
      </div>

      <p className="text-xs text-[#5D5F74] mb-4 leading-relaxed">{proposal.explanation}</p>

      {/* Diffs comparison table/cards */}
      <div className="space-y-2.5 mb-5">
        {proposal.diffs.map((diff, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-white border border-[#EFE9F5] shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#4B3968] px-2 py-0.5 rounded-md bg-[#F4EEFB]">
                {diff.area}
              </span>
              <span className="text-[11px] font-medium text-[#467A58] italic">{diff.impact}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-[#FAF9FC] border border-[#F0EDF5]">
                <div className="text-[10px] uppercase font-bold text-[#8C8EA0] mb-0.5">Previous</div>
                <div className="text-[#646678] line-through">{diff.before}</div>
              </div>
              <div className="p-2 rounded-lg bg-[#F5FCF7] border border-[#DDF3E4]">
                <div className="text-[10px] uppercase font-bold text-[#2A6D41] mb-0.5">Proposed</div>
                <div className="text-[#1F4C30] font-medium">{diff.after}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {!proposal.applied ? (
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F2ECF7]">
          <button
            onClick={() => cancelProposal(proposal.id)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#66687C] hover:text-[#2F3142] hover:bg-[#F3EFF8] transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" />
              Cancel
            </span>
          </button>

          <button
            onClick={() => applyProposal(proposal.id)}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#DDF3E4] to-[#C9EED3] hover:from-[#CEECC6] hover:to-[#BDE8C6] text-[#1E4E2F] border border-[#BFE5C9] shadow-xs hover:shadow transition cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-[#1E4E2F]" />
            <span>Apply Changes</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-[#DDEFE2] text-xs text-[#2A663F]">
          <span className="flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4 text-[#2E7A4A]" />
            Your LifeOS is synchronized with these updates.
          </span>
        </div>
      )}
    </div>
  );
};
