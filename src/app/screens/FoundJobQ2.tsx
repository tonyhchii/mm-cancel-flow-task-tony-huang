"use client";

import {
  setAnswer,
  setPageName,
  updateCancellationAnswers,
} from "@/lib/features/modal/modalSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import * as React from "react";

const MIN = 25;

export default function FoundJobQ2() {
  const answers = useAppSelector((state) => state.modal.answers);
  const [text, setText] = React.useState(answers.foundFeedback ?? "");
  const count = text.trim().length;
  const dispatch = useAppDispatch();
  const ok = count >= MIN;

  const nextPage = async () => {
    // TODO: save to database
    dispatch(setAnswer({ foundFeedback: text }));
    await dispatch(updateCancellationAnswers({ answers })).unwrap();
    dispatch(setPageName("foundJobQ3"));
  };

  const updateText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    dispatch(setAnswer({ foundFeedback: e.target.value }));
  };

  return (
    <div className="flex-1">
      <div className="mb-3 hidden" />

      <h1 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] text-gray-800">
        What’s one thing you wish we
        <br className="hidden md:block" />
        could’ve helped you with?
      </h1>

      <p className="mt-3 text-[14px] text-gray-600">
        We’re always looking to improve, your thoughts can help us make Migrate
        Mate more useful for others.*
      </p>

      <div className="mt-4 relative">
        <textarea
          value={text}
          onChange={updateText}
          rows={6}
          className="w-full text-gray-800 rounded-[12px] border border-gray-300 bg-white p-3 text-[14px]
                     outline-none focus:border-gray-400"
          placeholder="Type your answer…"
          aria-label="Feedback"
        />
        <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-gray-400">
          Min {MIN} characters ({count}/{MIN})
        </span>
      </div>

      <button
        disabled={!ok}
        onClick={() => {
          if (ok) nextPage();
        }}
        className="mt-4 w-full rounded-[14px] border px-4 py-3 text-[16px] font-semibold
                   border-gray-200 bg-gray-100 text-gray-600
                   disabled:opacity-60
                   data-[ok=true]:bg-white data-[ok=true]:text-gray-900
                   hover:data-[ok=true]:bg-gray-50"
        data-ok={ok}
      >
        Continue
      </button>
    </div>
  );
}
