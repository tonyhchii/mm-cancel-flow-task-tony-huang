"use client";

import CityImage from "./CityImage";
import { useAppDispatch } from "@/lib/hooks";
import { closeModal, resetModal } from "@/lib/features/modal/modalSlice";

export default function ModalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(closeModal());
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center bg-gray-50 justify-center backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-title"
    >
      <div className="relative w-[324px] md:w-[1000px] max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-64px)] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Stacked header mobile, inline desktop */}
        <div className="relative border-b px-4 md:px-6 pt-3 pb-2 md:py-3">
          {/* Close (always top-right) */}
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-2 md:right-4 top-2 text-warm-800 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Title */}
          <div className="flex items-center justify-center">
            <h2
              id="cancel-title"
              className="text-[14px] md:text-[16px] font-medium text-warm-800"
            >
              Subscription Cancellation
            </h2>
          </div>

          {/* Dots + step */}
        </div>

        {/* Body */}
        <div className="p-3 md:p-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row-reverse md:items-stretch md:gap-6">
            {/* Image: hide on mobile when showImageMobile=false; always show on md+ */}
            <div className={`flex`}>
              <CityImage />
            </div>
            {/* Content */}
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
