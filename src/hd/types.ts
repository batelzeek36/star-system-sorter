/**
 * Human Design data types
 */

export interface HDExtract {
  type: string; // e.g., "Manifestor", "Generator", "Projector", "Reflector"
  authority: string; // e.g., "Emotional", "Sacral", "Splenic"
  profile: string; // e.g., "1/3", "2/4", "6/2"
  centers: string[]; // Defined centers
  channels: number[]; // Active channel numbers
  gates: number[]; // Active gate numbers (1-64)
}

export interface BirthData {
  dateISO: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string (HH:mm)
  timeZone: string; // IANA timezone (e.g., "America/New_York")
  lat?: number; // Latitude (optional)
  lon?: number; // Longitude (optional)
}
