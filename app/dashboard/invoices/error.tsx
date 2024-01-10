'use client'

import { useEffect } from "react";
// Kalau mau ngetes ini coba uncomment line di bawah comment "See error.tsx"
export default function Error({
  error, // instance of JS's native Error object
  reset // function untuk reset error boundary. Ketika dieksekusi, fungsi ini akan mencoba re-render route segment
}: {
  error: Error & { digest?: string };
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  // return (
  //   <main className="flex h-full flex-col items-center justify-center">
  //     <h2 className="text-center">Something went wrong!</h2>
  //     <button
  //       className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
  //       onClick={
  //         // Attempt to recover by trying to re-render the invoices route
  //         () => reset()
  //       }
  //     >
  //       Try again
  //     </button>
  //   </main>
  // )
}