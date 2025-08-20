"use client";

import * as React from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setAnswer, setPageName } from "@/lib/features/modal/modalSlice";

// Tweak these to match your flow
// next step if they say "No thanks"

const FULL_PRICE = 25;
const DISCOUNTED = 12.5;

export default function NoJobQ1() {
  const dispatch = useAppDispatch();

  const accept = () => {
    dispatch(setAnswer({ downsellAccepted: true }));
    dispatch(setPageName(""));
  };

  const decline = () => {
    dispatch(setAnswer({ downsellAccepted: false }));
    dispatch(setPageName(""));
  };

  return (
    <div className="flex-1">
      {/* Top spacing matches other screens */}
      <div className="mb-3 hidden" />

      <h1 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] text-gray-900">
        We built this to help you land the
        <br className="hidden md:block" />
        job, this makes it a little easier.
      </h1>

      <p className="mt-3 text-[14px] text-gray-600">
        We’ve been there and we’re here to help you.
      </p>

      {/* Offer card */}
      <div className="mt-4 rounded-[14px] border border-purple-300 bg-purple-50 px-4 py-5 shadow-inner">
        <p className="text-[18px] md:text-[20px] font-semibold text-gray-800 text-center leading-snug">
          Here’s <span className="underline">50% off</span> until you find a
          job.
        </p>

        <div className="mt-2 flex items-baseline justify-center gap-3">
          <div className="text-[18px] md:text-[20px] font-semibold text-purple-700">
            ${DISCOUNTED.toFixed(2)}
            <span className="text-[14px] font-normal text-purple-700">
              /month
            </span>
          </div>
          <s className="text-[14px] text-gray-500">${FULL_PRICE}/month</s>
        </div>

        <button
          onClick={accept}
          className="mt-4 w-full rounded-[12px] bg-green-600 px-4 py-3 text-[15px] font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Get 50% off
        </button>

        <p className="mt-2 text-center text-[11px] italic text-gray-500">
          You won’t be charged until your next billing date.
        </p>
      </div>

      {/* Divider (subtle line like in the mock) */}
      <div className="my-4 h-px w-full bg-gray-200" />

      {/* No thanks */}
      <button
        onClick={decline}
        className="w-full rounded-[12px] border border-gray-300 bg-white px-4 py-3 text-[15px] font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        No thanks
      </button>
    </div>
  );
}
