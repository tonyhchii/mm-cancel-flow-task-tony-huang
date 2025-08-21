"use client";

import CityImage from "./CityImage";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { closeModal, resetModal } from "@/lib/features/modal/modalSlice";
import DotsHeader from "./DotsHeader";

export default function ModalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const progress = useAppSelector((s) => s.modal.step);
  const showImageMobile = useAppSelector(
    (s) => s.modal.showImageMobile ?? true
  );
  const downsellAccepted = useAppSelector(
    (s) => s.modal.answers?.downsellAccepted
  );
  const handleClose = () => {
    dispatch(closeModal());
    dispatch(resetModal());
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
          <div className="flex flex-col gap-2 md:flex-row md:justify-center">
            <h2
              id="cancel-title"
              className="text-[14px] md:text-[16px] font-medium text-warm-800"
            >
              {downsellAccepted
                ? "Subscription Continued"
                : "Subscription Cancellation"}
            </h2>

            {progress ? (
              <div className="mt-1 flex items-center md:justify-center gap-3">
                <DotsHeader total={progress.total} active={progress.active} />
                <span className="text-xs text-gray-500">
                  Step {progress.active} of {progress.total}
                </span>
              </div>
            ) : null}
          </div>

          {/* Dots + step */}
        </div>

        {/* Body */}
        <div className="p-3 md:p-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row-reverse md:items-stretch md:gap-6">
            {/* Image: hide on mobile when showImageMobile=false; always show on md+ */}
            <div className={`${showImageMobile ? "flex" : "hidden"} md:flex`}>
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
