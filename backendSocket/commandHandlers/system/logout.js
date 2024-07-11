module.exports = async (params, socketData) => {
  const { connections, socket } = params;
  const { id: UserID } = socketData;

  const userSockets = connections[UserID];
  if (userSockets) {
    for (conn = 0; conn < userSockets.length; ++conn) {
      if (userSockets[conn] !== socket) {
        await userSockets[conn].emit(
          'run',
          { command: 'logout', params: { forceLogout: true } },
          (response) => {
            // console.log('logout response from client', response);
          }
        );
      }
    }
  }

  return {
    ok: true,
  };
};
