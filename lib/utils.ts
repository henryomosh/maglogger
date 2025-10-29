import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (time: string) => {
  if (time === "") {
    return "Nill";
  }
  const [hours, minutes] = time.split(":");
  const hour = Number.parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "en-US"
) => {
  if (dateStr === "") {
    return;
  }
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Nairobi",
    minute: "numeric",
    hour: "numeric",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatDateToTimeOnly = (
  dateStr: string,
  locale: string = "en-US"
) => {
  if (dateStr === "") {
    return;
  }
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Nairobi",
    minute: "numeric",
    hour: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatDateToDateOnly = (
  dateStr: string,
  locale: string = "en-US"
) => {
  if (dateStr === "") {
    return;
  }
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Nairobi",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};
