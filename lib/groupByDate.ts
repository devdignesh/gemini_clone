import { Message } from "@/store/messages";
import { format, isToday, isYesterday } from "date-fns";

export const groupByDate = (messages: Message[]) => {
  const groups: Record<string, Message[]> = {};

  messages.forEach((msg) => {
    const date = new Date(msg.createdAt);
    const label = isToday(date)
      ? "Today"
      : isYesterday(date)
      ? "Yesterday"
      : format(date, "MMMM d, yyyy");

    if (!groups[label]) groups[label] = [];
    groups[label].push(msg);
  });

  return groups;
};
