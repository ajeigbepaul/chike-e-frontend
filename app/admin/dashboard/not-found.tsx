export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The dashboard page you're looking for doesn't exist.
      </p>
      <a href="/admin/dashboard" className="text-primary hover:underline">
        Return to Dashboard
      </a>
    </div>
  );
}
