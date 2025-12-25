/**
 * Calculates the time for a specific slot based on slot index and configuration
 * @param slotIndex - The index of the slot (0-based)
 * @param startHour - The starting hour of the time block
 * @param slotDurationMinutes - Duration of each slot in minutes
 * @returns Formatted time string (e.g., "8:30 am")
 */
export function getSlotTime(
  slotIndex: number,
  startHour: number,
  slotDurationMinutes: number
): string {
  const totalMinutesFromStart = slotIndex * slotDurationMinutes;
  const hours = startHour + Math.floor(totalMinutesFromStart / 60);
  const minutes = Math.floor(totalMinutesFromStart % 60);
  const period = hours >= 12 ? "pm" : "am";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Calculates slot duration in minutes based on time block configuration
 * @param startHour - The starting hour of the time block
 * @param endHour - The ending hour of the time block
 * @param slots - Total number of slots in the time block
 * @returns Duration of each slot in minutes
 */
export function calculateSlotDuration(
  startHour: number,
  endHour: number,
  slots: number
): number {
  const totalDurationMinutes = (endHour - startHour) * 60;
  return totalDurationMinutes / slots;
}
