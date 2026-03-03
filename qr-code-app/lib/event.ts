export const HACKABULL_EVENT = {
  title: "HackaBull 2026",
  description: "Annual hackathon hosted by SHPE at the University of South Florida.",
  location: "University of South Florida, 4202 E Fowler Ave, Tampa, FL 33620",
  // Eastern Time — Apr 25 08:00 → Apr 26 16:00
  startLocal: "20260425T080000",
  endLocal:   "20260426T160000",
  startIso:   "20260425T120000Z", // UTC (EDT = UTC-4)
  endIso:     "20260426T200000Z",
  tzid:       "America/New_York",
}

export function googleCalendarUrl(): string {
  const e = HACKABULL_EVENT
  const params = new URLSearchParams({
    action:   "TEMPLATE",
    text:     e.title,
    dates:    `${e.startLocal}/${e.endLocal}`,
    details:  e.description,
    location: e.location,
    ctz:      e.tzid,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function icsContent(): string {
  const e = HACKABULL_EVENT
  const escape = (s: string) => s.replace(/,/g, "\\,").replace(/\n/g, "\\n")
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HackaBull//HackaBull 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART;TZID=${e.tzid}:${e.startLocal}`,
    `DTEND;TZID=${e.tzid}:${e.endLocal}`,
    `SUMMARY:${escape(e.title)}`,
    `DESCRIPTION:${escape(e.description)}`,
    `LOCATION:${escape(e.location)}`,
    `UID:hackabull-2026@hackabull.com`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}
