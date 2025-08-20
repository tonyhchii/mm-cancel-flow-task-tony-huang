"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setAnswer, setPageName } from "@/lib/features/modal/modalSlice";

type ReasonKey =
  | "too_expensive"
  | "platform_not_helpful"
  | "not_enough_jobs"
  | "decided_not_to_move"
  | "other";

export default function NoJobQ3() {
  const dispatch = useAppDispatch();
  const answers = useAppSelector((s) => s.modal.answers ?? {});
  const user = useAppSelector(
    (s) =>
      s.modal.user as
        | {
            userId: string;
            subscriptionPrice: number;
            subscriptionCurrentPeriodEnd: string;
            userVariant: "A" | "B";
          }
        | undefined
  );

  const selected = answers.cancelReason as ReasonKey | undefined;

  const fullPrice = user?.subscriptionPrice ?? 25;
  const discounted = (fullPrice / 2).toFixed(2);

  const setReason = (r: ReasonKey) => dispatch(setAnswer({ cancelReason: r }));

  const acceptDiscount = () => {
    dispatch(setAnswer({ downsellAccepted: true }));
    dispatch(setPageName("acceptedOffer"));
  };

  const completeCancel = () => {
    if (!selected) return;
    // TODO: call your cancel API, then navigate:
    dispatch(setPageName("cancellationComplete2"));
  };

  const reasons: { key: ReasonKey; label: string }[] = [
    { key: "too_expensive", label: "Too expensive" },
    { key: "platform_not_helpful", label: "Platform not helpful" },
    { key: "not_enough_jobs", label: "Not enough relevant jobs" },
    { key: "decided_not_to_move", label: "Decided not to move" },
    { key: "other", label: "Other" },
  ];

  return (
    <div className="flex-1">
      <div className="mb-3 hidden" />

      <h1 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] text-gray-900">
        What’s the main
        <br className="hidden md:block" />
        reason for cancelling?
      </h1>

      <p className="mt-2 text-[13px] text-gray-600">
        Please take a minute to let us know why:
      </p>

      <fieldset className="mt-3 space-y-2" aria-label="Cancellation reason">
        {reasons.map(({ key, label }) => {
          const id = `reason-${key}`;
          const checked = selected === key;
          return (
            <label
              key={key}
              htmlFor={id}
              className={`flex items-center gap-3 rounded-[12px] border px-3 py-2 cursor-pointer
                ${
                  checked
                    ? "border-gray-800 bg-gray-900/5 text-gray-900"
                    : "border-gray-300 text-gray-800 hover:bg-gray-50"
                }`}
            >
              <input
                id={id}
                type="radio"
                name="cancel-reason"
                value={key}
                checked={checked}
                onChange={() => setReason(key)}
                className="h-4 w-4 accent-gray-800"
              />
              <span className="text-[14px]">{label}</span>
            </label>
          );
        })}
      </fieldset>

      {/* subtle divider like the mock */}
      <div className="my-4 h-px w-full bg-gray-200" />

      {/* Re-offer CTA */}
      <button
        onClick={acceptDiscount}
        className="w-full rounded-[12px] bg-green-600 px-4 py-3 text-[15px] font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Get 50% off | ${discounted}{" "}
        <span className="ml-1 text-white/80 line-through">${fullPrice}</span>
      </button>

      {/* Complete cancellation */}
      <button
        disabled={!selected}
        onClick={completeCancel}
        className="mt-3 w-full rounded-[12px] border border-gray-300 bg-gray-100 px-4 py-3 text-[15px] font-medium text-gray-600 disabled:opacity-60 hover:enabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Complete cancellation
      </button>
    </div>
  );
}
