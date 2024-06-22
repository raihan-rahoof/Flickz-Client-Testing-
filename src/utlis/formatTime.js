 const formatTime = (time) => {
  const padZero = (num) => String(num).padStart(2, '0');
  return `${padZero(time.hour)}:${padZero(time.minute)}:${padZero(time.second)}`;
};

export default formatTime