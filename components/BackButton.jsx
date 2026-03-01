"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <button
      onClick={handleBack}
      className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition"
      aria-label="Go back"
    >
      ← Back
    </button>
  );
}
