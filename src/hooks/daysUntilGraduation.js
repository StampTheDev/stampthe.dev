import { useState } from "react";

const graduationDate = new Date("2026-12-20T00:00:00");

function getDaysUntilGraduation() {
  const currentDate = new Date();
  return Math.max(0, Math.ceil((graduationDate - currentDate) / (1000 * 60 * 60 * 24)));
}

function useDaysUntilGraduation() {
  const [days] = useState(getDaysUntilGraduation);
  return days;
}

export default useDaysUntilGraduation;