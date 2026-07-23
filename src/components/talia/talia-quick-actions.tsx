type TaliaQuickActionsProps = {
  disabled: boolean;
  onSelect: (message: string) => void;
};

const quickActions = [
  "I want to hire",
  "I am looking for work",
  "Explore recruitment services",
  "How does Talvanta Africa work?",
  "Speak to the team",
] as const;

export function TaliaQuickActions({
  disabled,
  onSelect,
}: TaliaQuickActionsProps) {
  return (
    <div aria-label="Suggested questions">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate">
        Try asking
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {quickActions.map((action) => (
          <button
            key={action}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(action)}
            className="min-h-11 shrink-0 rounded-full border border-border-grey bg-white px-3 py-2 text-xs font-bold text-navy hover:border-green hover:text-green disabled:cursor-not-allowed disabled:opacity-60"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
