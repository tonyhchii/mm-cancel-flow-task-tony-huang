"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  acceptDownsell,
  setAnswer,
  setPageName,
  updateCancellationAnswers,
} from "@/lib/features/modal/modalSlice";

type Bucket4 = "0" | "1-5" | "6-20" | "20+";
type BucketInterview = "0" | "1-2" | "3-5" | "5+";

// Route keys

export default function NoJobQ2() {
  const dispatch = useAppDispatch();

  const answers = useAppSelector((s) => s.modal.answers ?? {});
  const user = useAppSelector((s) => s.modal.user);

  const fullPrice = user?.subscriptionPrice ?? 25;
  const discounted = (fullPrice / 2).toFixed(2);

  const allAnswered = Boolean(
    answers.rolesApplied && answers.emailedDirectly && answers.interviews
  );

  const acceptDiscount = async () => {
    await dispatch(acceptDownsell()).unwrap();
    dispatch(setAnswer({ downsellAccepted: true }));
    dispatch(setPageName("acceptedOffer"));
  };

  const onContinue = async () => {
    if (allAnswered) {
      await dispatch(updateCancellationAnswers({ answers })).unwrap();
      dispatch(setPageName("noJobQ3"));
    }
  };

  return (
    <div className="flex-1">
      <div className="mb-3 hidden" />

      <h1 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] text-gray-900">
        Help us understand how you
        <br className="hidden md:block" />
        were using Migrate Mate.
      </h1>

      <Question
        label="How many roles did you apply for through Migrate Mate?"
        name="roles-applied"
        value={answers.rolesApplied as Bucket4 | undefined}
        options={["0", "1-5", "6-20", "20+"] as const}
        onChange={(v) => dispatch(setAnswer({ rolesApplied: v }))}
      />

      <Question
        className="mt-4"
        label="How many companies did you email directly?"
        name="emailed-directly"
        value={answers.emailedDirectly as Bucket4 | undefined}
        options={["0", "1-5", "6-20", "20+"] as const}
        onChange={(v) => dispatch(setAnswer({ emailedDirectly: v }))}
      />

      <Question
        className="mt-4"
        label="How many different companies did you interview with?"
        name="interview-count"
        value={answers.interviews as BucketInterview | undefined}
        options={["0", "1-2", "3-5", "5+"] as const}
        onChange={(v) => dispatch(setAnswer({ interviews: v }))}
      />

      {/* Re-offer CTA */}
      {user.userVariant == "B" && (
        <button
          onClick={acceptDiscount}
          className="mt-5 w-full rounded-[12px] bg-green-600 px-4 py-3 text-[15px] font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Get 50% off | ${discounted}{" "}
          <span className="ml-1 text-white/80 line-through">${fullPrice}</span>
        </button>
      )}
      {/* Continue (disabled until all answered) */}
      <button
        disabled={!allAnswered}
        onClick={onContinue}
        className="mt-3 w-full rounded-[12px] border border-gray-300 bg-gray-100 px-4 py-3 text-[15px] font-medium text-gray-700
                   disabled:opacity-60 hover:enabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Continue
      </button>
    </div>
  );
}

function Question<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  name: string;
  options: readonly T[];
  value?: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="mb-2 text-[13px] text-gray-700">{label}</legend>
      <div className="grid grid-cols-4 gap-3">
        {options.map((opt) => {
          const id = `${name}-${opt}`;
          const checked = value === opt;
          return (
            <label
              key={opt}
              htmlFor={id}
              className={`flex items-center justify-center rounded-[10px] border px-3 py-2 text-[14px] cursor-pointer
                ${
                  checked
                    ? "border-gray-800 bg-gray-900/5 text-gray-900"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt}
                checked={checked}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              {opt}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
