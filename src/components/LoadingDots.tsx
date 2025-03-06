export default function LoadingDots() {
  return (
    <span className="space-x-1 ml-2">
      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-current opacity-75 animate-bounce [animation-delay:-0.3s]"></span>
      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-current opacity-75 animate-bounce [animation-delay:-0.15s]"></span>
      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-current opacity-75 animate-bounce"></span>
    </span>
  );
}