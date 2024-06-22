const formatTime12HourInput = ({ hour, minute }) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const adjustedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  const adjustedMinute = minute.toString().padStart(2, '0');
  return `${adjustedHour}:${adjustedMinute} ${suffix}`;
};

export default formatTime12HourInput;