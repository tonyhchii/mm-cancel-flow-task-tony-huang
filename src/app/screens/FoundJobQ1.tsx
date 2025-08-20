"use client";

import Question from "../components/Question";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setAnswer, setPageName } from "@/lib/features/modal/modalSlice";

export default function FoundJobQ1() {
  const answers = useAppSelector((state) => state.modal.answers);
  const dispatch = useAppDispatch();
  const ready =
    answers.foundViaMM !== undefined &&
    !!answers.rolesApplied &&
    !!answers.emailedDirectly &&
    !!answers.interviews;

  const nextPage = () => {
    // TODO: save to database
    dispatch(setAnswer(answers));
    // Go to next page
    dispatch(setPageName("foundJobQ2"));
  };

  return (
    <div className="mx-auto max-w-[296px] md:max-w-none">
      <h1 className="text-[24px] md:text-[28px] font-semibold leading-[1.2] text-gray-800">
        Congrats on the new role! 🎉
      </h1>

      <hr className="my-3 border-gray-200" />

      <div className="space-y-6">
        <Question
          label="Did you find this job with MigrateMate?*"
          options={["Yes", "No"]}
          value={
            answers.foundViaMM === undefined
              ? undefined
              : answers.foundViaMM == true
              ? "Yes"
              : "No"
          }
          onChange={(v: "Yes" | "No") =>
            dispatch(setAnswer({ foundViaMM: v === "Yes" }))
          }
        />
        <Question
          label="How many roles did you apply for through Migrate Mate?*"
          options={["0", "1-5", "6-20", "20+"]}
          value={answers.rolesApplied}
          onChange={(v: "0" | "1-5" | "6-20" | "20+") =>
            dispatch(setAnswer({ rolesApplied: v }))
          }
        />
        <Question
          label="How many companies did you email directly?*"
          options={["0", "1-5", "6-20", "20+"]}
          value={answers.emailedDirectly}
          onChange={(v: "0" | "1-5" | "6-20" | "20+") =>
            dispatch(setAnswer({ emailedDirectly: v }))
          }
        />
        <Question
          label="How many different companies did you interview with?*"
          options={["0", "1-2", "3-5", "5+"]}
          value={answers.interviews}
          onChange={(v: "0" | "1-2" | "3-5" | "5+") =>
            dispatch(setAnswer({ interviews: v }))
          }
        />
      </div>

      <hr className="my-4 border-gray-200" />

      <button
        disabled={!ready}
        onClick={() => {
          if (ready) nextPage();
        }}
        className="w-full rounded-[14px] border border-gray-200 px-4 py-4 text-[16px] font-semibold
                   bg-gray-100 text-gray-600 disabled:opacity-60 data-[ok=true]:bg-white data-[ok=true]:text-gray-900
                   hover:data-[ok=true]:bg-gray-50"
        data-ok={ready}
      >
        Continue
      </button>
    </div>
  );
}
