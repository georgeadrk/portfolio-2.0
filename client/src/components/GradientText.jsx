import './GradientText.css';

export default function GradientText({
  children,
  className = '',
  colors = ['#BD8AFF', '#3F2EFF', '#BD8AFF', '#3F2EFF', '#BD8AFF'],
  animationSpeed = 10,
  showBorder = false
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`
  };

  return (
    <div className={`animated-gradient-text ${className}`}>
      {showBorder && <div className="gradient-overlay" style={gradientStyle}></div>}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
  );
}