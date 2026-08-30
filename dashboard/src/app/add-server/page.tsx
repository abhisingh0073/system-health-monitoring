// "use client";

// import { generateEnrollmentToken } from "@/services/enrollmentToken.service";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function AddServerPage() {
//   const router = useRouter();

//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [copied, setCopied] = useState(false);

//   async function handleGenerateToken(){
//     try{
//         setLoading(true);
//         setError("");

//         const response = await generateEnrollmentToken();
//         if(!response.success) {
//            throw new Error(response.message);
//         }

//         setToken(response.data.token);

        
//     } catch(error){
//         setError(error instanceof Error ? error.message : "Failed to generate enrollment token");

//     } finally{
//         setLoading(false);
//     }
//   }

 
//   const handleCopy = async () => {
//     try{
//       if(!token) return;
//       await navigator.clipboard.writeText(token);
//       setCopied(true);

//       setTimeout(() => setCopied(false), 2000);
//     } catch(err){
//       console.error("Failed to copy text: ", err);
//     }
//   }

//   return (
//     <main className="space-y-6">
//       {/* Header */}
//       <div>
//         <button
//           type="button"
//           onClick={() => router.back()}
//           className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4"
//         >
//           ← Back
//         </button>

//         <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
//           Add Server
//         </h1>

//         <p className="mt-1 text-sm text-[var(--text-secondary)]">
//           Connect a Linux server to your monitoring dashboard.
//         </p>
//       </div>

//       {/* Installation Card */}
//       <div
//         className="rounded-lg p-6 max-w-3xl"
//         style={{
//           background: "var(--surface)",
//           border: "1px solid var(--border)",
//         }}
//       >
//         <div className="mb-6">
//           <h2 className="text-base font-medium text-[var(--text-primary)]">
//             Connect a Linux server
//           </h2>

//           <p className="mt-1 text-sm text-[var(--text-secondary)]">
//             Generate an enrollment token and run the installation command
//             on your Linux server.
//           </p>
//         </div>

//         {/* Step 1 */}
//         <div className="mb-6">
//           <div className="flex items-center gap-3 mb-3">
//             <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-white text-sm font-medium">
//               1
//             </span>

//             <h3 className="text-sm font-medium">
//               Generate enrollment token
//             </h3>
//           </div>

//           {error && (
//             <div className="mb-3 rounded-md bg-[var(--red-subtle)] p-3 text-sm text-[var(--red)]">
//               {error}
//             </div>
//           )}

//           {!token ? 
//             (
//           <button
//             type="button"
//             disabled={loading}
//             onClick={handleGenerateToken}
//             className="rounded-md cursor-pointer bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
//           >
//             Generate Token
//           </button>
//           ) : (
//             <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4">
//                 <p className="mb-2 text-xs text-[var(--text-secondary)]">
//                     Enrollement token
//                 </p>
//                 <code className="break-all text-sm">
//                     {token}
//                 </code>
//             </div>
//           ) }
//         </div>

//         {/* Step 2 */}
//         <div className="mb-6">
//           <div className="flex items-center gap-3 mb-3">
//             <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-sm font-medium">
//               2
//             </span>

//             <h3 className="text-sm font-medium">
//               Install the monitoring agent
//             </h3>
//           </div>

//           <p className="text-sm text-[var(--text-secondary)] mb-3">
//             Run the following command on your Linux server:
//           </p>

//           <div
//             className="rounded-md p-4 font-mono text-sm overflow-x-auto"
//             style={{
//               background: "var(--surface-2)",
//               border: "1px solid var(--border)",
//             }}
//           >
//             <code>
//               curl -fsSL https://your-domain.com/install.sh | sudo bash
//             </code>
//           </div>
//         </div>

//         {/* Step 3 */}
//         <div>
//           <div className="flex items-center gap-3 mb-3">
//             <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-sm font-medium">
//               3
//             </span>

//             <h3 className="text-sm font-medium">
//               Waiting for server
//             </h3>
//           </div>

//           <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
//             <span className="h-2 w-2 rounded-full bg-[var(--yellow)] animate-pulse" />
//             {token
//               ? "Waiting for the monitoring agent to connect..."
//               : "Generate a token first"}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import { generateEnrollmentToken } from "@/services/enrollmentToken.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, Check } from "lucide-react"; // Imported status feedback icons

export default function AddServerPage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);


  async function handleGenerateToken(){
    try{
        setLoading(true);
        setError("");

        const response = await generateEnrollmentToken();
        if(!response.success) {
           throw new Error(response.message);
        }

        setToken(response.data.token);

        
    } catch(error){
        setError(error instanceof Error ? error.message : "Failed to generate enrollment token");

    } finally{
        setLoading(false);
    }
  }

 
  const handleCopy = async () => {
    try{
      if (!token) return; // in case token is null
      await navigator.clipboard.writeText(token);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch(err){
      console.error("Failed to copy text: ", err);
    }
  }

  return (
    <main className="space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Add Server
        </h1>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Connect a Linux server to your monitoring dashboard.
        </p>
      </div>

      {/* Installation Card */}
      <div
        className="rounded-lg p-6 max-w-3xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="mb-6">
          <h2 className="text-base font-medium text-[var(--text-primary)]">
            Connect a Linux server
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Generate an enrollment token and run the installation command
            on your Linux server.
          </p>
        </div>

        {/* Step 1 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-white text-sm font-medium">
              1
            </span>

            <h3 className="text-sm font-medium">
              Generate enrollment token
            </h3>
          </div>

          {error && (
            <div className="mb-3 rounded-md bg-[var(--red-subtle)] p-3 text-sm text-[var(--red)]">
              {error}
            </div>
          )}

          {!token ? 
            (
          <button
            type="button"
            disabled={loading}
            onClick={handleGenerateToken}
            className="rounded-md cursor-pointer bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {loading ? "Generating..." : "Generate Token"}
          </button>
          ) : (
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-[var(--text-secondary)]">
                      Enrollment token
                  </p>
                  
                  {/* Dynamic Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <code className="break-all text-sm block font-mono bg-[var(--surface)] p-2 rounded border border-[var(--border)] mt-1">
                    {token}
                </code>
            </div>
          ) }
        </div>

        {/* Step 2 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-sm font-medium">
              2
            </span>

            <h3 className="text-sm font-medium">
              Install the monitoring agent
            </h3>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mb-3">
            Run the following command on your Linux server:
          </p>

          <div
            className="rounded-md p-4 font-mono text-sm overflow-x-auto"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
          >
            <code>
              curl -fsSL https://your-domain.com/install.sh | sudo bash
            </code>
          </div>
        </div>

        {/* Step 3 */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-sm font-medium">
              3
            </span>

            <h3 className="text-sm font-medium">
              Waiting for server
            </h3>
          </div>

          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span className="h-2 w-2 rounded-full bg-[var(--yellow)] animate-pulse" />
            {token
              ? "Waiting for the monitoring agent to connect..."
              : "Generate a token first"}
          </div>
        </div>
      </div>
    </main>
  );
}
