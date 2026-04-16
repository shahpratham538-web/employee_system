export default function StatCard({ icon: Icon, label, value, trend, color = "primary" }) {
  const colorMap = {
    primary: "from-primary/10 to-primary-container/30 text-primary-dark",
    tertiary: "from-tertiary/10 to-tertiary-container/30 text-tertiary",
    error: "from-error/10 to-error-container/30 text-error",
    warning: "from-warning/10 to-warning-light/30 text-warning-dark",
  };

  const iconBg = {
    primary: "bg-primary/15 text-primary-dark",
    tertiary: "bg-tertiary/15 text-tertiary",
    error: "bg-error/15 text-error",
    warning: "bg-warning/15 text-warning-dark",
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-ambient stat-glow animate-fade-in relative overflow-hidden">
      {/* Gradient accent stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorMap[color]}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-on-surface-variant text-body-md mb-1">{label}</p>
          <p className="text-display-lg text-on-surface leading-none">{value}</p>
          {trend && (
            <p className="text-label-sm text-primary-dark mt-2 font-medium">
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg[color]}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
}
