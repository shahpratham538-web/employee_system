export default function LoadingSpinner({ size = "md", message }) {
  const sizeMap = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className={`${sizeMap[size]} border-primary border-t-transparent rounded-full animate-spin`}
      />
      {message && (
        <p className="text-body-md text-on-surface-variant">{message}</p>
      )}
    </div>
  );
}
