"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  acceptDownsell,
  closeModal,
  resetModal,
} from "@/lib/features/modal/modalSlice";

const FALLBACK_PRICE = 12.5;

export default function AcceptedOffer() {
  const user = useAppSelector((s) => s.modal.user);
  const discounted =
    typeof user?.subscriptionPrice === "number"
      ? user.subscriptionPrice - 10
      : FALLBACK_PRICE;

  const dispatch = useAppDispatch();
  const endIso: string | undefined = user?.subscriptionCurrentPeriodEnd;

  const endDate = endIso ? new Date(endIso) : undefined;
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft =
    endDate != null
      ? Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / msPerDay))
      : undefined;

  const startDateLabel =
    endDate != null
      ? endDate.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : "XX date";

  const proceed = async () => {
    //close page and undo user cancellation
    await dispatch(acceptDownsell()).unwrap();
    dispatch(closeModal());
    dispatch(resetModal());
  };

  return (
    <div className="flex-1">
      <div className="mb-3 hidden" />

      <h1 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] text-gray-900">
        Great choice, mate!
      </h1>

      <p className="mt-2 text-[18px] md:text-[20px] font-semibold leading-snug text-gray-800">
        You&apos;re still on the path to your dream role.{" "}
        <span className="text-purple-600 underline">
          Let’s make it happen together!
        </span>
      </p>

      <div className="mt-4 space-y-1 text-[14px] text-gray-700">
        <p>
          You&apos;ve got {daysLeft ?? "XX"} days left on your current plan.
        </p>
        <p>
          Starting from {startDateLabel}, your monthly payment will be{" "}
          <span className="font-semibold">${discounted.toFixed(2)}</span>.
        </p>
      </div>

      <p className="mt-3 text-[12px] italic text-gray-500">
        You can cancel anytime before then.
      </p>

      <button
        onClick={proceed}
        className="mt-5 w-full rounded-[12px] bg-purple-600 px-4 py-3 text-[15px] font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Land your dream role
      </button>
    </div>
  );
}
