// "Dashboards & Tools": quick links to other parts of the site.
// `href` is null while a page is a placeholder; set it to the real URL once the
// page exists and the card will link there instead of #/tool/<id>.

export const TOOLS = [
  { id: 'staff-dashboard', title: 'Staff Dashboard', icon: 'gauge', blurb: 'Your classes, tasks and alerts at a glance', href: null },
  { id: 'tutor-dashboard', title: 'Tutor Dashboard', icon: 'users', blurb: 'Tutor group overview, attendance and concerns', href: null },
  { id: 'enrolment', title: 'Enrolment System', icon: 'clipboard', blurb: 'Applications, enrolments and transfers', href: null },
  { id: 'attendance', title: 'Attendance Tracker', icon: 'check', blurb: 'Registers, absences and attendance trends', href: null },
  { id: 'staff-timetables', title: 'Staff Timetables', icon: 'calendar', blurb: 'Look up any staff member’s timetable', href: null },
  { id: 'access-arrangements', title: 'Access Arrangements Dashboard', icon: 'shield', blurb: 'Exam access arrangements and support needs', href: null },
  { id: 'parent-portal', title: 'Parent Portal Accounts', icon: 'home', blurb: 'Manage parent and carer portal access', href: null },
  { id: 'custom-cohorts', title: 'Manage Custom Cohorts', icon: 'layers', blurb: 'Build and maintain custom groups of learners', href: null },
];

export const toolById = (id) => TOOLS.find((t) => t.id === id);

// Every typed word must appear in the title or blurb (same rule as the server search).
export function filterTools(q) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return TOOLS;
  return TOOLS.filter((t) => {
    const hay = (t.title + ' ' + t.blurb).toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
