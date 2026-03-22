import React from 'react';

const STEPS = [
  { label: 'Night\nActions' },
  { label: 'Night\nResult'  },
  { label: 'Discussion'     },
  { label: 'Voting'         },
  { label: 'Vote\nResult'   },
];

/**
 * currentStep: 0-indexed — 0=night actions, 1=night result, 2=discussion, 3=voting, 4=vote result
 */
export default function StepIndicator({ currentStep }) {
  return (
    <div className="step-indicator">
      {STEPS.map((s, i) => (
        <div key={i} className="step-item" style={{ flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`step-dot ${i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending'}`}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-line ${i < currentStep ? 'done' : ''}`} />
            )}
          </div>
          <div className={`step-label ${i === currentStep ? 'active' : ''}`}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
