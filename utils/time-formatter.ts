export const formatTime = (dateString: string): string => {
  let date: Date;
  // ** if date is in standard format, we don't need to fix it */
  if (dateString.includes("T") && dateString.includes("Z")) {
    date = new Date(dateString);
  } else {
    // ** if date is not in standard format, we need to fix it */
    const fixedDateString = dateString.replace(" ", "T") + ":00Z";
    date = new Date(fixedDateString);
  }

  if (isNaN(date.getTime())) {
    return "Invalid time";
  }

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const isHour12 = Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    timeZone: userTimeZone,
  }).resolvedOptions().hour12;

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: userTimeZone,
    hour12: isHour12,
  };

  const formattedTime = date.toLocaleTimeString(undefined, options);

  return formattedTime;
};
