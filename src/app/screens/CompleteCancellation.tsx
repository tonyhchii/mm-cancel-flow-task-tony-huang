"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  closeModal,
  completeCancellation,
} from "@/lib/features/modal/modalSlice";
import Image from "next/image";

export default function CompleteCancellation() {
  const dispatch = useAppDispatch();
  const answers = useAppSelector((s) => s.modal.answers);
  const needVisa = answers.visaLawyerProvided;

  const avatarUrl = "/mihailo-profile.jpeg";
  const agentName = "Mihailo Bozic";
  const agentEmail = "mihailo@migratemate.co";
  const initials = "MB";

  const finishCancellation = async () => {
    // TODO: DB UPDATE and other logic
    await dispatch(completeCancellation()).unwrap();
    dispatch(closeModal());
  };

  return (
    <div className="flex flex-col md:flex-row-reverse md:items-stretch md:gap-6">
      <div className="flex-1">
        {!needVisa ? (
          <div>
            <h1 className="text-[26px] md:text-[32px] font-semibold leading-[1.15] text-warm-800 tracking-[-0.02em]">
              All done, your cancellation's
              <br className="hidden md:block" />
              been processed.
            </h1>

            <p className="mt-3 text-[14px] md:text-[16px] text-warm-600 leading-[1.55]">
              We're stoked to hear you've landed a job and sorted your visa.
              <br className="hidden md:block" />
              Big congrats from the team. 🙌
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-[26px] md:text-[32px] font-semibold leading-[1.15] text-warm-800 tracking-[-0.02em]">
              Your cancellation's all sorted, mate,
              <br className="hidden md:block" />
              no more charges.
            </h1>
            <div className="mt-4 rounded-[16px] border bg-warm-200 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-black/5 flex items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100 text-[12px] font-semibold text-gray-700">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={`${agentName} avatar`}
                      width={36}
                      height={36}
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="leading-tight">
                  <div className="text-[13px] font-semibold text-gray-800">
                    {agentName}
                  </div>
                  <div className="text-[12px] text-gray-500">
                    &lt;{agentEmail}&gt;
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-3 text-[14px] text-gray-700">
                <p className="font-medium">
                  I'll be reaching out soon to help with the visa side of
                  things.
                </p>
                <p>
                  We've got your back, whether it's questions, paperwork, or
                  just figuring out your options.
                </p>
                <p>
                  Keep an eye on your inbox, I'll be in touch{" "}
                  <a
                    href="#"
                    className="underline decoration-gray-400 underline-offset-2 hover:decoration-gray-600"
                    onClick={(e) => e.preventDefault()}
                  >
                    shortly
                  </a>
                  .
                </p>
              </div>

              <hr className="my-3 border-gray-200" />
            </div>
          </div>
        )}

        <button
          onClick={finishCancellation}
          className="mt-5 w-full rounded-[14px] px-4 py-3 text-[16px] font-semibold text-white
                     bg-[#8952fc] hover:bg-[#7b40fc] transition-colors"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
