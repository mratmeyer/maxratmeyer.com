module.exports = {
  analytics: process.env.ANALYTICS || "false",
  imagePath: process.env.IMAGES_PATH || process.env.ASSETS_PATH || "/assets/",
  path: process.env.ASSETS_PATH || "/assets/"
};