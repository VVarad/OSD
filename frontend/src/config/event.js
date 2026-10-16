/**
 * Event settings — the only file most content changes need.
 * Text on the page (dates, titles, FAQ) lives in index.html.
 */
export const EVENT = {
  /** Countdown target, ISO 8601 with IST offset. Keep in sync with the date shown in index.html. */
  startsAt: '2026-10-25T09:00:00+05:30',

  /** Where every "Register" button points. Replace with the form URL once it exists. */
  registerUrl: '/register.html',

  /** Footer links. Empty string = link stays hidden-safe ("#"). */
  socials: {
    instagram: 'https://www.instagram.com/wcewlug',
    discord: 'https://discord.com/invite/2XESRHNPWt',
    github: 'https://github.com/Walchand-Linux-Users-Group',
    linkedin: 'https://www.linkedin.com/company/wlug-club/',
  },
};
