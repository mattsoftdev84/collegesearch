// Stand-in for ASP.NET's generated PageMethods proxy. Same calling convention:
//   PageMethods.GetLearners(search, onSuccess, onError)
// and the same response envelope that DataMethods.js expects.
//
// Matching mimics what the server should do: case-insensitive, every word the
// user typed must appear somewhere in the row's search string.
//
// Preview-only test hooks: type "error" to see the failure state, "expired" for the
// session-expired banner (stays expired until reload); latency is
// random (150-650 ms) so out-of-order responses get exercised.
(function () {
  var D = window.SAPIEN_DEMO;

  function strip(rows) {
    return rows.map(function (r) {
      var o = {};
      for (var k in r) if (k.charAt(0) !== '_') o[k] = r[k];
      return o;
    });
  }

  function matcher(search) {
    var words = String(search || '').toLowerCase().split(/\s+/).filter(Boolean);
    return function (text) {
      text = text.toLowerCase();
      return words.length > 0 && words.every(function (w) { return text.indexOf(w) !== -1; });
    };
  }

  // Once "expired" has been searched, the mock session stays expired (KeepAlive
  // included) until the page is reloaded, like the real thing.
  var sessionExpired = false;
  var EXPIRED = { Status: 'expired', Type: 'string', Data: 'Your session has expired' }; // = AccessHelper.Expired()

  function respond(rows, search, onSuccess, onError) {
    var delay = 150 + Math.random() * 500;
    if (/expired/i.test(search)) sessionExpired = true;
    setTimeout(function () {
      if (sessionExpired) {
        onSuccess(EXPIRED);
        return;
      }
      if (/error/i.test(search)) {
        onSuccess({ Status: 'fail', Type: 'string', Data: 'Demo error: the server could not run the search.' });
        return;
      }
      // Real server may send Data as a JSON string; the app handles both.
      onSuccess({ Status: 'success', Type: 'json', Data: JSON.stringify(strip(rows)) });
    }, delay);
  }

  window.PageMethods = {
    KeepAlive: function (onSuccess, onError) {
      console.info('[mock] KeepAlive ' + (sessionExpired ? '-> expired' : '-> ok') + ' at ' + new Date().toLocaleTimeString());
      setTimeout(function () {
        onSuccess(sessionExpired ? EXPIRED : { Status: 'success', Type: 'string', Data: 'ok' });
      }, 100);
    },
    GetLearners: function (search, onSuccess, onError) {
      var m = matcher(search);
      respond(D.learners.filter(function (l) { return m(l._search); }), search, onSuccess, onError);
    },
    GetCourses: function (search, onSuccess, onError) {
      var m = matcher(search);
      respond(D.courses.filter(function (c) { return m(c.searchstring); }), search, onSuccess, onError);
    },
    GetClasses: function (search, onSuccess, onError) {
      var m = matcher(search);
      respond(D.classes.filter(function (c) { return m(c.searchstring); }), search, onSuccess, onError);
    },
  };
})();
