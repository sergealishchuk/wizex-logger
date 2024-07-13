module.exports = async (params = {}) => {
  const { data = {}, connections } = params;
  const { projectId } = data;
  const userIds = Object.keys(connections);
  for (let userIndex = 0; userIndex < userIds.length; ++userIndex) {
    const userSockets = connections[userIds[userIndex]];
    if (userSockets) {
      for (let conn = 0; conn < userSockets.length; ++conn) {
        if (userSockets[conn]) {
          await userSockets[conn].emit(
            'run',
            { command: 'projectStatusesUpdated', params: { projectId } },
            (response) => { }
          );
        }
      }
    }
  }

  return {
    ok: true,
  }
};