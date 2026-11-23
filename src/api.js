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

// Must match the Data text of AccessHelper.Expired() on the server. DataMethods.js
// rejects with response.Data only, so the Status ("expired") never reaches us.
export const EXPIRED_TEXT = 'Your session has expired';

// Turns whatever DataMethods.js / PageMethods rejected with into an Error.
// err.expired is true when the session or login has gone: the server's Expired()
// response, an HTTP 401/403, or the page's PrincipalPermission check failing.
function toError(err) {
  let msg;
  let status = 0;
  let type = '';
  if (err && typeof err.get_message === 'function') {
    // Sys.Net.WebServiceError (the call itself failed)
    msg = err.get_message();
    if (typeof err.get_statusCode === 'function') status = err.get_statusCode();
    if (typeof err.get_exceptionType === 'function') type = err.get_exceptionType() || '';
  } else {
    msg = err && err.message ? err.message : String(err);
  }
  const e = new Error(msg);
  e.expired = msg.indexOf(EXPIRED_TEXT) !== -1 || status === 401 || status === 403 || /SecurityException/.test(type);
  return e;
}

async function callRaw(method, params) {
  if (typeof window.callWebMethod !== 'function') {
    throw new Error('callWebMethod is not loaded (library/js/DataMethods.js).');
  }
  try {
    return await window.callWebMethod(method, params);
  } catch (err) {
    throw toError(err);
  }
}

async function call(method, search) {
  return asRows(await callRaw(method, { search }));
}

// Keeps the server session alive. Resolves on success; rejects with err.expired
// when the session can't be restored.
export async function keepAlive() {
  await callRaw('KeepAlive', {});
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
