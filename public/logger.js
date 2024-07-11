const name = 'WIZEX Logger';

if (typeof window !== 'undefined') {
  if (!window.Wizex) {
    window.Wizex = {
      log: function(data) {
        console.log('wizex log', data);
      },
      debug: function(data) {
        console.log('wizex debug', data);
      },
      warn: function(data) {
        console.log('wizex warn', data);
      }
    };
  }
}