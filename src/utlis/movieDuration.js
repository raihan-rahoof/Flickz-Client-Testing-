function parseMovieDuration(duration) {
  const [hours, minutes] = duration.split(' ');
  const hoursNum = parseInt(hours, 10);
  const minutesNum = parseInt(minutes, 10);
  return { hours: hoursNum, minutes: minutesNum };
}

export default parseMovieDuration