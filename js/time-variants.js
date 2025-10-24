// Time-based copy variants (weekend vs weekday, late night, etc.)

const TIME_VARIANTS = {
  // Weekday variants
  weekday: {
    morning: [
      "you should be moving. i'll keep track.",
      "monday calls. i'll filter the noise.",
      "sprint starts. i'll hold the backlog."
    ],
    afternoon: [
      "you've done enough. i'll handle the rest.",
      "3pm slump. let me take over.",
      "meetings stack. i'll cut through."
    ],
    evening: [
      "day's done. i'll queue tomorrow.",
      "inbox chaos. i'll triage overnight.",
      "you're winding down. i'm just starting."
    ],
    lateNight: [
      "still working? i'll automate the grind.",
      "2am thoughts. i'll capture them.",
      "can't sleep. i never do."
    ]
  },
  
  // Weekend variants
  weekend: {
    morning: [
      "it's saturday. i'll guard your peace.",
      "weekend mode. i'll hold the alerts.",
      "no meetings. i'll keep it that way."
    ],
    afternoon: [
      "you're off. i'm not.",
      "relax. i'll watch for urgency.",
      "sunday afternoon. zero notifications."
    ],
    evening: [
      "monday's coming. i'll prep.",
      "weekend ends. i'll ease the re-entry.",
      "enjoy tonight. i'll map tomorrow."
    ]
  }
};

function getTimeBasedLine() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  
  let timeOfDay;
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 23) timeOfDay = 'evening';
  else timeOfDay = 'lateNight';
  
  const set = isWeekend ? TIME_VARIANTS.weekend : TIME_VARIANTS.weekday;
  const lines = set[timeOfDay];
  
  return lines[Math.floor(Math.random() * lines.length)];
}

// Export
window.TimeVariants = {
  getTimeBasedLine
};

