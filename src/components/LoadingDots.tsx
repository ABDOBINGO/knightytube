'use client';

export default function LoadingDots({ color = 'currentColor' }: { color?: string }) {
  return (
    <span className="space-x-1 ml-2 inline-flex items-center">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="inline-flex h-1.5 w-1.5 rounded-full animate-loading-dot"
          style={{
            backgroundColor: color,
            animationDelay: `${index * 150}ms`,
          }}
        />
      ))}
    </span>
  );
}