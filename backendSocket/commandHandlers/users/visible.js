module.exports = async (params) => {
  const { visible, socket } = params;

  if (socket) {
    socket.data.visible = visible;
  }

  return {
    ok: true,
  };
};
