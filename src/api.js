// Thin wrappers around window.callWebMethod (library/js/DataMethods.js).
// Each one normalises the rows so the UI doesn't care whether the server sends
// 1/"1"/true or a JSON string vs. an already-parsed array.

function asRows(data) {
  if (data == null || data === '') return [];
  if (typeof data === 'string') data = JSON.parse(data);
  return Array.isArray(data) ? data : [];
}

function isTrue(v) {
  return v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true';
}

function str(v) {
  return v == null ? '' : String(v).trim();
}

async function call(method, search) {
  if (typeof window.callWebMethod !== 'function') {
    throw new Error('callWebMethod is not loaded (library/js/DataMethods.js).');
  }
  try {
    return asRows(await window.callWebMethod(method, { search }));
  } catch (err) {
    // PageMethods errors are objects with get_message(); rejections may be strings.
    const msg = err && typeof err.get_message === 'function' ? err.get_message() : err && err.message ? err.message : String(err);
    throw new Error(msg);
  }
}

export async function searchLearners(search) {
  const rows = await call('GetLearners', search);
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const pcode = str(r.pcode);
    if (!pcode || seen.has(pcode)) continue; // one row per learner
    seen.add(pcode);
    out.push({
      id: pcode,
      pcode,
      active: isTrue(r.active),
      firstname: str(r.firstname),
      lastname: str(r.lastname),
      dob: str(r.dob),
      level: str(r.level),
      classcode: str(r.classcode),
      tutorcode: str(r.tutorcode),
      tutorname: str(r.tutorname),
      endyear: str(r.endyear),
    });
  }
  return out;
}

// `uicyear` is the key ViewCourse.aspx?group= expects. Despite the name it is
// uic-acyear for a course but classcode-acyear for a class.
export async function searchCourses(search) {
  const rows = await call('GetCourses', search);
  return rows.map((r) => ({
    id: str(r.uicyear) || `${str(r.uic)}-${str(r.acyear)}`,
    uicyear: str(r.uicyear) || `${str(r.uic)}-${str(r.acyear)}`,
    acyear: str(r.acyear),
    uic: str(r.uic),
    title: str(r.title),
    qualification: str(r.qualification),
    active: isTrue(r.iscurrent),
  }));
}

export async function searchClasses(search) {
  const rows = await call('GetClasses', search);
  return rows.map((r) => ({
    id: str(r.uicyear) || `${str(r.classcode)}-${str(r.acyear)}`,
    uicyear: str(r.uicyear) || `${str(r.classcode)}-${str(r.acyear)}`,
    acyear: str(r.acyear),
    uic: str(r.uic),
    title: str(r.title),
    qualification: str(r.qualification),
    classcode: str(r.classcode),
    staffcode: str(r.staffcode),
    staffname: str(r.staffname),
    active: isTrue(r.iscurrent),
  }));
}
