const statusStyles = {
  PENDING: "bg-warning-light text-warning-dark",
  APPROVED: "bg-primary-container text-primary-on-container",
  REJECTED: "bg-error-container/20 text-error-on-container",
  DENIED: "bg-tertiary-container/20 text-tertiary-on-container",
  PRESENT: "bg-primary-container text-primary-dark",
  ABSENT: "bg-error-container/20 text-error",
  LATE: "bg-warning-light text-warning-dark",
  ACTIVE: "bg-primary-container text-primary-dark",
  INACTIVE: "bg-surface-container text-on-surface-variant",
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status?.toUpperCase()] || "bg-surface-container text-on-surface-variant";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm font-medium tracking-wide ${style}`}
    >
      {status}
    </span>
  );
}
