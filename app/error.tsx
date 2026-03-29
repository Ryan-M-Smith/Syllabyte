"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 text-navy-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-slate-200 bg-white rounded-2xl p-8 shadow-sm text-center">
        <img
          src="/horizontal-mark-registered-symbol.png"
          alt="Penn State"
          className="h-8 w-auto object-contain mx-auto mb-5"
        />
        <img
          src="/penn-state-shield.jpg"
          alt="Penn State shield"
          className="w-12 h-12 rounded-lg object-cover mx-auto mb-4 ring-1 ring-slate-200"
        />
        <h2 className="text-xl font-semibold text-navy-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-slate-500 mb-6">
          The Penn State AI assistant hit an unexpected issue.
        </p>
        <button
          className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white gradient-bg hover:opacity-90 transition-opacity cursor-pointer"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </button>
      </div>
    </div>
  );
}
