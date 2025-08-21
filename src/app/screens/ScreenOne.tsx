"use client";

import {
  setAnswer,
  setPageName,
  setStep,
  setShowImageMobile,
} from "@/lib/features/modal/modalSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function ScreenOne() {
  const dispatch = useAppDispatch();
  const variant = useAppSelector((state) => state.modal.user?.userVariant);

  const stillLooking = () => {
    dispatch(setAnswer({ foundJob: false }));
    dispatch(setShowImageMobile(false));
    if (variant == "A") {
      dispatch(setPageName("noJobQ2"));
      dispatch(setStep({ total: 2, active: 1 }));
    } else {
      dispatch(setPageName("noJobQ1"));
      dispatch(setStep({ total: 3, active: 1 }));
    }
  };

  const goFoundJob = () => {
    dispatch(setShowImageMobile(false));
    dispatch(setAnswer({ foundJob: true }));
    dispatch(setPageName("foundJobQ1"));
    dispatch(setStep({ total: 3, active: 1 }));
  };
  return (
    <div className="flex-1">
      <h3 className="text-[24px] md:text-[36px] font-semibold text-warm-800 leading-[1.2] tracking-[-0.01em] md:tracking-[-0.05em]">
        Hey mate,
        <br />
        Quick one before you go.
      </h3>
      <p className="mt-2 italic text-[24px] md:text-[36px] font-semibold text-warm-800 leading-[1.2] tracking-[-0.01em] md:tracking-[-0.05em]">
        Have you found a job yet?
      </p>
      <p className="mt-4 text-[14px] md:text-[16px] font-medium text-warm-600 leading-[1.5] tracking-[-0.01em]">
        Whatever your answer, we just want to help you take the next step. With
        visa support, or by hearing how we can do better.
      </p>
      <hr className="my-4 border-t border-warm-300" />

      {/* Buttons fill row evenly */}
      <div className="grid auto-cols-fr gap-3">
        <button
          className="min-w-0 whitespace-normal text-center rounded-md border border-warm-300 bg-white px-3 py-3
                     text-[16px] font-semibold text-warm-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          onClick={() => {
            goFoundJob();
          }}
        >
          Yes, I’ve found a job
        </button>
        <button
          className="min-w-0 whitespace-normal text-center rounded-md border border-warm-300 bg-white px-3 py-3
                     text-[16px] font-semibold text-warm-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          onClick={stillLooking}
        >
          Not yet — I’m still looking
        </button>
      </div>
    </div>
  );
}
