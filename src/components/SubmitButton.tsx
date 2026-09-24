"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      {...props}
      type="submit"
      disabled={pending || props.disabled}
      className={`inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-950/40 transition-all duration-150 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${className}`}
    >
      {pending ? (pendingLabel ?? children) : children}
    </button>
  );
}
