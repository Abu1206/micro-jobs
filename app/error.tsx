"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
          Oops!
        </h1>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-gray-300 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          {error.message ||
            "An unexpected error occurred. Please try again later."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Try Again
          </button>
          <a href="/">
            <button className="px-6 py-3 bg-gray-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-white/20 transition-colors font-semibold">
              Go Home
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
