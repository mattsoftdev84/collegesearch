// Demo data for the preview, shaped like the CSVs the real WebMethods return.
// Generated with a seeded RNG so it's the same every load.
(function () {
  var seed = 20261122;
  function rnd() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }
  function pick(a) { return a[Math.floor(rnd() * a.length)]; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  var staff = [
    ['CHR', 'Chloe Reynals'], ['MZI', 'Mario Zola'], ['DPA', 'Dev Patel'], ['SKO', 'Sofia Kowalski'],
    ['JOB', 'James O\'Brien'], ['AMA', 'Aisha Mahmood'], ['TNG', 'Tom Nguyen'], ['RHU', 'Rachel Hughes'],
    ['BEV', 'Ben Evans'], ['LMO', 'Lucy Morgan'], ['KAD', 'Kwame Adeyemi'], ['HFI', 'Hannah Fisher'],
  ];
  var tutors = staff.slice(0, 8);

  var firstNames = ['Isla', 'Oliver', 'Amelia', 'Noah', 'Ava', 'Leo', 'Mia', 'Arthur', 'Freya', 'Muhammad', 'Grace',
    'George', 'Lily', 'Harry', 'Ella', 'Jack', 'Sophie', 'Oscar', 'Evie', 'Theo', 'Zara', 'Ethan', 'Chloe', 'Kai',
    'Maya', 'Finley', 'Ruby', 'Aaron', 'Priya', 'Daniel', 'Hana', 'Samuel', 'Imogen', 'Yusuf', 'Poppy', 'Liam'];
  var lastNames = ['Edmonds', 'Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Patel',
    'Wright', 'Robinson', 'Thompson', 'Walker', 'White', 'Hughes', 'Green', 'Hall', 'Khan', 'Clarke', 'Lewis',
    'Harris', 'Smithson', 'Ahmed', 'Martin', 'Cooper', 'Ward', 'Morris', 'King', 'Baker', 'Okafor', 'Novak'];
  var levels = ['L2', 'L3', 'AS', 'A2'];

  var learners = [];
  for (var i = 0; i < 160; i++) {
    var t = pick(tutors);
    var level = pick(levels);
    var endyear = pick(['23/24', '24/25', '25/26', '26/27', '26/27', '26/27', '27/28']);
    var active = (endyear === '26/27' || endyear === '27/28') ? (rnd() < 0.93 ? 1 : 0) : 0;
    learners.push({
      pcode: String(9800000 + Math.floor(rnd() * 199999)),
      active: active,
      firstname: pick(firstNames),
      lastname: pick(lastNames),
      dob: pad(1 + Math.floor(rnd() * 28)) + '/' + pad(1 + Math.floor(rnd() * 12)) + '/' + (2007 + Math.floor(rnd() * 4)),
      level: level,
      classcode: t[0] + (level === 'A2' ? '2' : '1') + pick(['A', 'B', 'C', 'D']) + '1',
      tutorcode: t[0],
      tutorname: t[1],
      endyear: endyear,
    });
  }
  // The sample row from collegelearners.csv
  learners.push({ pcode: '9881405', active: 0, firstname: 'Isla', lastname: 'Edmonds', dob: '00:00.0', level: 'A2', classcode: 'CHR2D1', tutorcode: 'CHR', tutorname: 'Chloe Reynals', endyear: '25/26' });

  var subjects = [
    ['BI', 'Biology'], ['CH', 'Chemistry'], ['PH', 'Physics'], ['MA', 'Mathematics'], ['FM', 'Further Mathematics'],
    ['EL', 'English Literature'], ['HI', 'History'], ['GE', 'Geography'], ['PS', 'Psychology'], ['SO', 'Sociology'],
    ['FR', 'French'], ['SP', 'Spanish'], ['CS', 'Computer Science'], ['AR', 'Art and Design'], ['EC', 'Economics'],
  ];
  var years = ['22/23', '23/24', '24/25', '25/26', '26/27'];
  var CURRENT = '26/27';

  var courses = [];
  var classes = [];
  subjects.forEach(function (s, si) {
    var quals = [['ASL', 'A Level Year 1'], ['A2L', 'A Level Year 2']];
    if (s[0] === 'FR' || s[0] === 'SP') quals.push(['ADVPLS', 'Plus']);
    quals.forEach(function (q) {
      var uic = s[0] + q[0];
      var title = q[1] === 'Plus' ? s[1] + ' Year 2 Plus' : s[1] + ' ' + q[1];
      years.forEach(function (y) {
        if (rnd() < 0.15 && y !== CURRENT) return; // some courses didn't run every year
        var iscurrent = y === CURRENT ? 1 : 0;
        courses.push({
          acyear: y, uic: uic, title: title, qualification: q[1], iscurrent: iscurrent,
          uicyear: uic + '-' + y, searchstring: uic + ' ' + title,
        });
        var n = 1 + Math.floor(rnd() * 3);
        for (var c = 0; c < n; c++) {
          var st = staff[(si + c * 5 + years.indexOf(y)) % staff.length];
          var classcode = s[0] + (q[0] === 'ASL' ? '1' : '2') + (q[1] === 'Plus' ? 'PLS' : '') + 'AB'.charAt(c % 2) + (c + 1) + 'B' + (c + 1);
          classes.push({
            acyear: y, uic: uic, title: title, qualification: q[1], iscurrent: iscurrent, uicyear: uic + '-' + y,
            searchstring: uic + ' ' + title + ' ' + classcode + ' ' + st[0] + ' ' + st[1],
            classcode: classcode, staffcode: st[0], staffname: st[1],
          });
        }
      });
    });
  });

  learners.forEach(function (l) {
    l._search = [l.pcode, l.firstname, l.lastname, l.firstname + ' ' + l.lastname, l.classcode, l.tutorcode, l.tutorname].join(' ').toLowerCase();
  });

  window.SAPIEN_DEMO = { learners: learners, courses: courses, classes: classes };
})();
