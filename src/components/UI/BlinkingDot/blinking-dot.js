const BlinkingDot = (props) => {
  const { radius = 5, color = 'red', blink = true } = props;
  const diameter = radius * 2;
  return (
    <div
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        borderRadius: `${radius}px`,
        background: color,
        animation: blink ? 'blink 1s infinite' : 'none'
      }}
    />
  )
};

export default BlinkingDot;
