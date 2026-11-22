// Stand-in for ASP.NET's generated PageMethods proxy. Same calling convention:
//   PageMethods.GetLearners(search, onSuccess, onError)
// and the same response envelope that DataMethods.js expects.
//
// Matching mimics what the server should do: case-insensitive, every word the
// user typed must appear somewhere in the row's search string.
//
// Preview-only test hooks: type "error" to see the failure state; latency is
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

  function respond(rows, search, onSuccess, onError) {
    var delay = 150 + Math.random() * 500;
    setTimeout(function () {
      if (/error/i.test(search)) {
        onSuccess({ Status: 'fail', Type: 'string', Data: 'Demo error: the server could not run the search.' });
        return;
      }
      // Real server may send Data as a JSON string; the app handles both.
      onSuccess({ Status: 'success', Type: 'json', Data: JSON.stringify(strip(rows)) });
    }, delay);
  }

  window.PageMethods = {
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
