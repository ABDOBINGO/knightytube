export default function ScriptSkeleton() {
  return (
    <div className="space-y-6 bg-dark-secondary/50 backdrop-blur-sm p-8 rounded-2xl border border-luxury-gold/20 shadow-xl animate-pulse">
      <div className="h-8 bg-luxury-gold/10 rounded-lg w-3/4"></div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="h-4 bg-luxury-gold/5 rounded w-full"
            style={{ width: `${Math.random() * 30 + 70}%` }}
          ></div>
        ))}
      </div>
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="h-4 bg-luxury-gold/5 rounded w-full"
            style={{ width: `${Math.random() * 20 + 80}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}