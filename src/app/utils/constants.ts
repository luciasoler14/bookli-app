import { ReadingStatus } from "../hooks/useReadingList";

export const STATUS_LABELS: Record<ReadingStatus, string> = {
  want: "Want to Read",
  reading: "Reading",
  read: "Read",
  dropped: "Didn't finish",
};
