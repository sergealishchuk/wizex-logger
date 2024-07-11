const fs = require('fs');
const path = require('path');
const searchTemplates = require('../../search_templates');
const { els, elsClient, createErrorMessage } = require('../../utils');

const TEMPLATE_PATH = '../../search_templates';

module.exports = async (req, res, tokenPayload) => {
  try {
    for (let index = 0; index < searchTemplates.length; ++index) {
      const { name, template } = searchTemplates[index];
      const temp = fs.readFileSync(path.resolve(__dirname, `${TEMPLATE_PATH}/${template}`), 'utf8');
      await els({
        method: 'PUT',
        url: `/_scripts/${name}`,
        data: {
          script: {
            lang: "mustache",
            source: temp.replace(/\n|\s/g, ''),
          }
        }
      });
    };

    const scripts = await elsClient.getAllScripts();

    return {
      ok: true,
      scripts,
    }
  } catch (e) {
    res.status(400).json(
      { error: createErrorMessage("Error refresh search templates.") }
    );
  }
};
