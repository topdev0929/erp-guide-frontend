const LoadingDots = () => {
  return (
    <div className="flex space-x-2 p-2">
      <div className="w-2 h-2 rounded-full bg-white/20 animate-[pulse_1.25s_ease-in-out_infinite] [animation-delay:0ms] hover:bg-white/90" />
      <div className="w-2 h-2 rounded-full bg-white/20 animate-[pulse_1.25s_ease-in-out_infinite] [animation-delay:300ms] hover:bg-white/90" />
      <div className="w-2 h-2 rounded-full bg-white/20 animate-[pulse_1.25s_ease-in-out_infinite] [animation-delay:600ms] hover:bg-white/90" />
    </div>
  );
};

export default LoadingDots;
