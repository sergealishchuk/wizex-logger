const fs = require('fs');
const path = require('path');
const searchTemplates = require('../../search_templates');
const { els, elsClient, createErrorMessage } = require('../../utils');

const TEMPLATE_PATH = '../../search_templates';

module.exports = async (req, res, tokenPayload) => {
  const scripts = await elsClient.getAllScripts();
  
  const { metadata: { stored_scripts } } = scripts;

  const templatesList = [];
  let needRefresh = false;
  try {
    for (let index = 0; index < searchTemplates.length; ++index) {
      const { name, template } = searchTemplates[index];
      const temp = fs.readFileSync(path.resolve(__dirname, `${TEMPLATE_PATH}/${template}`), 'utf8');
      const existContent = stored_scripts[name] ? stored_scripts[name].source : '';
      const changed = existContent !== temp.replace(/\n|\s/g, '');
      if (changed) {
        needRefresh = true;
      }
      templatesList.push({
        name,
        template,
        exists: !!stored_scripts[name],
        changed,
        params: searchTemplates[index].params,
        temp,
      });
    };

    return {
      ok: true,
      templatesList,
      needRefresh,
      searchTemplates,
    }
  } catch (e) {
    res.status(400).json(
      { error: createErrorMessage("Error refresh search templates.") }
    );
  }
};
