"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setAnswer,
  setPageName,
  updateCancellationAnswers,
} from "@/lib/features/modal/modalSlice";
import { useState } from "react";

export default function FoundJobQ3() {
  const dispatch = useAppDispatch();
  const answers = useAppSelector((s) => s.modal.answers);
  const usedMM = answers.foundViaMM;
  const [hasLawyer, setHasLawyer] = useState(answers.visaLawyerProvided);
  const [visaType, setVisaType] = useState("");

  const choose = (value: boolean) => {
    if (hasLawyer !== value) {
      dispatch(setAnswer({ visaLawyerProvided: value }));
      setHasLawyer(value);
    } else {
      dispatch(setAnswer({ visaLawyerProvided: undefined }));
      setHasLawyer(undefined);
    }
  };

  const onVisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisaType(e.target.value);
    dispatch(setAnswer({ visaType: e.target.value }));
  };

  const complete = async () => {
    // TODO: persist to DB if needed
    await dispatch(updateCancellationAnswers({ answers })).unwrap();
    if (hasLawyer) dispatch(setPageName("completeCancellation"));
  };

  const ok = hasLawyer !== null;

  return (
    <div className="flex-1">
      <div className="mb-3 hidden" />
      {usedMM ? (
        <h1 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] text-gray-800">
          We helped you land the job, now
          <br className="hidden md:block" />
          let’s help you secure your visa.
        </h1>
      ) : (
        <div>
          <h1 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] text-gray-800">
            You landed the job!
            <br className="hidden md:block" />
            <span className="italic">That&apos;s what we live for.</span>
          </h1>
          <h2 className="mt-2 text-[20px] md:text-[16px] w-[70%] font-semibold leading-[1.15] text-gray-800">
            Even if it wasn&apos;t through Migrate Mate, let us help get your
            visa sorted.
          </h2>
        </div>
      )}

      <p className="mt-3 text-[14px] text-gray-600">
        Is your company providing an immigration lawyer to help with your visa?
      </p>

      <fieldset className="mt-4" aria-label="Immigration lawyer provided?">
        <legend className="sr-only">Choose one</legend>
        {(hasLawyer === undefined || hasLawyer == true) && (
          <label
            htmlFor="visa-yes"
            className="flex items-center gap-3 rounded-[12px] p-2 cursor-pointer"
          >
            <input
              id="visa-yes"
              name="visa-lawyer"
              type="radio"
              value="yes"
              checked={hasLawyer === true}
              onClick={() => choose(true)}
              onChange={() => {}}
              className="h-4 w-4 accent-gray-800"
            />
            <span className="text-[14px] text-gray-800">Yes</span>
          </label>
        )}
        {(hasLawyer == undefined || hasLawyer == false) && (
          <label
            htmlFor="visa-no"
            className="flex items-center gap-3 rounded-[12px] p-2 cursor-pointer"
          >
            <input
              id="visa-no"
              name="visa-lawyer"
              type="radio"
              value="no"
              checked={hasLawyer === false}
              onClick={() => choose(false)}
              onChange={() => {}}
              className="h-4 w-4 accent-gray-800"
            />
            <span className="text-[14px] text-gray-800">No</span>
          </label>
        )}
      </fieldset>

      {hasLawyer !== undefined && (
        <div className="mt-4">
          {hasLawyer == false ? (
            <>
              <p className="text-[14px] text-gray-800">
                We can connect you with one of our trusted partners.
              </p>
              <p className="text-[14px] text-gray-800 mt-1">
                Which visa would you like to apply for?*
              </p>
            </>
          ) : (
            <p className="text-[14px] text-gray-800">
              What visa will you be applying for?*
            </p>
          )}

          <input
            type="text"
            value={visaType}
            onChange={onVisaChange}
            placeholder="Enter visa type..."
            aria-label="Visa type"
            className="mt-2 w-full text-gray-800 rounded-[12px] border border-gray-300 bg-white p-3 text-[14px]
                       outline-none focus:border-gray-400"
          />
        </div>
      )}

      <button
        disabled={!ok}
        onClick={complete}
        className="mt-4 w-full rounded-[14px] border px-4 py-3 text-[16px] font-semibold
                   border-gray-200 bg-gray-100 text-gray-600
                   disabled:opacity-60
                   data-[ok=true]:bg-white data-[ok=true]:text-gray-900
                   hover:data-[ok=true]:bg-gray-50"
        data-ok={ok}
      >
        Complete cancellation
      </button>
    </div>
  );
}
