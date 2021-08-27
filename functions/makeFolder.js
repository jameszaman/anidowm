const os = require('os');
const fs = require('fs');

module.exports = function(names = []) {
  // Start creating folders from here. This is home path.
  let targetFolder = os.homedir();
  // Creating all the folders. Each folder will be inside the directory
  // previous folder.
  let dirList = ['Downloads', 'Anidown', ...names]
  dirList.forEach(dir => {
    targetFolder += '/' + dir;
  });
  fs.mkdirSync(targetFolder, {recursive: true});
  return targetFolder;
}
