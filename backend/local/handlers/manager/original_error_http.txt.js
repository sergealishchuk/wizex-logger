if (typeof window !== 'undefined') {
  if (!window.Wizex) {
    window.Wizex = {
      log: function () {
        console.error('LOGGER: Invalid key or token is corrupted. Contact the administrator for help.');
      }
    };
  }
}
