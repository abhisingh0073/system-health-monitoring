// "use client";

// import { Alert } from "@/types/alert";

// type AlertToastProps = {
//   alert: Alert;
//   onClose: () => void;
// };

// export default function AlertToast({
//   alert,
//   onClose,
// }: AlertToastProps) {
//   return (
//     <div className="w-96 border border-[var(--border)] rounded-lg bg-[var(--background)] shadow-lg p-4">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <p className="text-sm font-semibold">
//             {alert.alert_type}
//           </p>

//           <p className="text-xs text-[var(--text-secondary)] mt-1">
//             {alert.hostname}
//           </p>

//           <p className="text-sm mt-2">
//             {alert.message}
//           </p>
//         </div>

//         <button
//           onClick={onClose}
//           className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
//         >
//           ×
//         </button>
//       </div>

//       <div className="flex items-center justify-between mt-3">
//         <span className="text-xs uppercase font-medium text-[var(--yellow)]">
//           {alert.severity}
//         </span>

//         <span className="text-xs text-[var(--text-secondary)]">
//           Just now
//         </span>
//       </div>
//     </div>
//   );
// }




"use client";

import { Alert } from "@/types/alert";

type AlertToastProps = {
  alert: Alert;
  onClose: () => void;
};

export default function AlertToast({
  alert,
  onClose,
}: AlertToastProps) {
  return (
    /* Added positioning classes: fixed top-4 right-4 z-50 */
    <div className="fixed top-4 right-4 z-50 w-96 border border-[var(--border)] rounded-lg bg-[var(--background)] shadow-lg p-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">
            {alert.alert_type}
          </p>

          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {alert.hostname}
          </p>

          <p className="text-sm mt-2">
            {alert.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          ×
        </button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs uppercase font-medium text-[var(--yellow)]">
          {alert.severity}
        </span>

        <span className="text-xs text-[var(--text-secondary)]">
          Just now
        </span>
      </div>
    </div>
  );
}
