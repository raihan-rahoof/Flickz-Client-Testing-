const formatTime12Hour = (time) => {
    if (!time) return ''; // Handle undefined or null values
    const [hours, minutes] = time.toString().split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
};


export default formatTime12Hour;
