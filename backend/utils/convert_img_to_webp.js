const fs = require('fs');
const webp = require('webp-converter');
webp.grant_permission();

module.exports = async (props) => {
  const { path, fileType, extra_path = '/tmp/', q = 75 } = props;
  try {
    const destFile = `${path}.webp`;
    const fileSource = await fs.promises.readFile(path);
    const imbBuffer = await webp.buffer2webpbuffer(fileSource, fileType, `-q ${q}`, extra_path);
    await fs.promises.writeFile(destFile, imbBuffer);
    return destFile;
  } catch (e) {
    return false;
  }
};
