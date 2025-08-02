const ScrollLayout = ({
  children,
  direction = 'y',
  hideScrollbar = true,
  maxHeight = '100vh',
  className = ''
}) => {
  const scrollClasses = {
    y: 'overflow-y-auto overflow-x-hidden',
    x: 'overflow-x-auto overflow-y-hidden',
    both: 'overflow-auto'
  };

  return (
    <div
      className={`
        ${scrollClasses[direction]}
        ${hideScrollbar ? 'scrollbar-none' : 'scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200'}
        p-4 transition-all
        ${className}
      `}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
};

export default ScrollLayout;
