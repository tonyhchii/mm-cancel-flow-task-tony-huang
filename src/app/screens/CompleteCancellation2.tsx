"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  closeModal,
  completeCancellation,
  resetModal,
} from "@/lib/features/modal/modalSlice";

export default function SubscriptionCancelledBody() {
  const dispatch = useAppDispatch();
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

  const endIso = user?.subscriptionCurrentPeriodEnd;
  const endDate = endIso ? new Date(endIso) : undefined;

  const endLabel = endDate
    ? endDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "XX date";

  const backToJobs = async () => {
    await dispatch(completeCancellation()).unwrap();
    dispatch(closeModal());
  };

  return (
    <div className="flex-1">
      <div className="mb-3 hidden" />

      <h1 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] text-gray-900">
        Sorry to see you go, mate.
      </h1>

      <p className="mt-2 text-[18px] md:text-[20px] font-semibold leading-snug text-gray-900">
        Thanks for being with us, and you’re
        <br className="hidden md:block" />
        always welcome back.
      </p>

      <div className="mt-3 space-y-1 text-[14px] text-gray-700">
        <p>Your subscription is set to end on {endLabel}.</p>
        <p>
          You’ll still have full access until then. No further charges after
          that.
        </p>
      </div>

      <p className="mt-3 text-[12px] italic text-gray-500">
        Changed your mind? You can reactivate anytime before your end date.
      </p>

      <button
        onClick={backToJobs}
        className="mt-5 w-full rounded-[12px] bg-purple-600 px-4 py-3 text-[15px] font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Back to Jobs
      </button>
    </div>
  );
}
