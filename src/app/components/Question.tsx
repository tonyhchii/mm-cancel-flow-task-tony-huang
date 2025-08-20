"use client";

import React from "react";

export default function Question<T extends string>({
  label,
  options,
  value,
  onChange,
  render,
}: {
  label: string;
  options: T[];
  value?: T;
  onChange: (v: T) => void;
  render?: (v: T) => React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[14px] font-medium text-gray-800">{label}</p>
      {/* Equal width for any number of options */}
      <div className="grid grid-flow-col auto-cols-fr gap-3">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt as string}
              type="button"
              onClick={() => onChange(opt)}
              className={`min-w-0 whitespace-normal text-center rounded-[12px] px-3 py-3 text-[14px] font-semibold border transition
                ${
                  active
                    ? "bg-gray-700 text-white border-gray-900"
                    : "bg-gray-200 text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
            >
              {render ? render(opt) : (opt as string)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
