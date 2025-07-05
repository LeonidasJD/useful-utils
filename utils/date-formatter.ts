export const formatDate = (dateString: string, locale?: string): string => {
  let date: Date;

  // ** if date is in standard format, we don't need to fix it */
  if (dateString.includes("T") && dateString.includes("Z")) {
    date = new Date(dateString);
  } else {
    // ** if date is not in standard format, we need to fix it */
    // Check if the date already has seconds
    if (dateString.split(":").length === 3) {
      // Date already has seconds, just add T and Z
      const fixedDateString = dateString.replace(" ", "T") + "Z";
      date = new Date(fixedDateString);
    } else {
      // Date doesn't have seconds, add :00 and Z
      const fixedDateString = dateString.replace(" ", "T") + ":00Z";
      date = new Date(fixedDateString);
    }
  }

  if (isNaN(date.getTime())) return "Invalid date";

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: userTimeZone,
  }).format(date);
};
