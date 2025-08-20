"use client";

export default function DotsHeader({
  total,
  active,
}: {
  total: number;
  active: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const cls =
          idx < active
            ? "bg-green-300"
            : idx === active
            ? "bg-gray-800"
            : "bg-gray-200";
        return (
          <span
            key={i}
            className={`inline-block h-2 w-6 rounded-full ${cls}`}
          />
        );
      })}
    </div>
  );
}
