import { claimTask } from '../../api/talent';

const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};

const getDueBadge = (dueDate, status) => {
  if (!dueDate || status === 'Approved') return null;

  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();

  if (diffTime < 0) {
    return (
      <span className="shrink-0 inline-block px-2 py-[2px] rounded-full text-[10px] font-bold tracking-[0.3px] bg-red-500/10 text-red-500 border border-red-500/20">
        Overdue
      </span>
    );
  } else if (diffTime <= 24 * 60 * 60 * 1000) {
    return (
      <span className="shrink-0 inline-block px-2 py-[2px] rounded-full text-[10px] font-bold tracking-[0.3px] bg-amber-500/10 text-amber-500 border border-amber-500/20">
        Due Soon
      </span>
    );
  }
  return null;
};

const TaskCard = ({ task, showClaimButton = false, onClaimed }) => {

  const handleClaim = async () => {
    try {
      await claimTask(task._id);
      if (onClaimed) onClaimed();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim task');
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-border-light hover:-translate-y-0.5 transition-all cursor-default">

      {/* Header: title + status */}
      <div className="flex items-start justify-between gap-2.5">
        <p className="text-[15px] font-semibold text-text-primary leading-snug">{task.title || 'Untitled Task'}</p>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {task.status && (
            <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold tracking-[0.3px] ${STATUS_CLASS[task.status] || ''}`}>
              {task.status}
            </span>
          )}
          {getDueBadge(task.dueDate, task.status)}
        </div>
      </div>

      
      {task.description && (
        <p className="text-[13px] text-text-muted leading-relaxed">{task.description}</p>
      )}

      {/* Meta row */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
        
        <span className="text-[12px] text-text-faint">
          {task.dueDate ? `Due: ${task.dueDate}` : 'No due date'}
        </span>
        {task.createdBy?.name && (
          <span className="text-[12px] text-text-faint">By {task.createdBy.name}</span>
        )}
      </div>

      {showClaimButton && (
        <button onClick={handleClaim}
          className="w-full py-2.5 rounded-lg border-none text-[13px] font-semibold text-white cursor-pointer btn-gradient font-sans mt-1">
          Claim Task →
        </button>
      )}
    </div>
  );
};

export default TaskCard;
