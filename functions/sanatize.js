module.exports = function(name) {
  name = name.replace(/\n/g, "");
  name = name.replace(/\t/g, "");
  name = name.replace(/\//g, "");
  name = name.replace(/\\/g, "");
  name = name.replace(/:/g, "");
  name = name.replace(/"/g, "'");
  name = name.replace(/\?/g, "");
  return name;
}