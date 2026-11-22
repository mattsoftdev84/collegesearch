// Mirror of library/js/DataMethods.js from the main WebForms project.
// Used by the preview only; the deployed page uses the main project's copy.
window.callWebMethod = function (methodName, parameters) {
  parameters = parameters || {};
  return new Promise(function (resolve, reject) {
    window.PageMethods[methodName].apply(null, Object.values(parameters).concat([
      function (response) {
        if (response.Status === 'success') {
          if (response.Type === 'string') resolve(String(response.Data));
          else if (response.Type === 'int') resolve(Number(response.Data));
          else if (response.Type === 'json' || response.Type === 'object') resolve(response.Data);
          else reject('Unknown data type');
        } else reject(response.Data || 'Failed response from server');
      },
      function (error) { reject(error); }
    ]));
  });
};
