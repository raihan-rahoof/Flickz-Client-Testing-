function formatDateString(dateString) {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export default formatDateString