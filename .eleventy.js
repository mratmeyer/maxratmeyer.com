const assets = require("./src/data/assets");
const CleanCSS = require("clean-css");
const excerpt = require('eleventy-plugin-excerpt');
const htmlmin = require("html-minifier");
const Image = require("@11ty/eleventy-img");
const moment = require('moment-timezone');
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {

    eleventyConfig.setDataDeepMerge(true);

    eleventyConfig.addPlugin(excerpt);
    eleventyConfig.addPlugin(pluginRss);

    eleventyConfig.addFilter("dateformat", function(dateIn) {
        return moment(dateIn).tz('GMT').format('MMM DD, YYYY');
    });
    eleventyConfig.addFilter("toISOString", function(dateIn) {
        return moment(dateIn).tz('GMT').format('YYYY-MM-DD');
    });

    // Minify HTML
    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
      if(outputPath.endsWith(".html") ) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true
        });

        return minified;
      }
      return content;
    });

    // Minify CSS
    eleventyConfig.addFilter("cssmin", function(code) {
      return new CleanCSS({}).minify(code).styles;
    });

    // Set up tags collection
    eleventyConfig.addCollection("tags", function(collection) {
      let tagSet = new Set();

      collection.getAll().forEach(function(item) {
        if("tags" in item.data) {
          let tags = item.data.tags;

          tags = tags.filter(function(item) {
            switch(item) {
            case "posts":
                return false;
            }

            return true;
          });

          for (const tag of tags) {
            tagSet.add(tag);
          }
        }
      });
    
      return [...tagSet];
    });

    // Add 'Image' shortcode
    eleventyConfig.addNunjucksAsyncShortcode("Image", async function(src, alt) {
      src = "./src/assets/media/" + src; // Append the location of the media directory

      if(alt === undefined) {
        throw new Error(`Missing \`alt\` on Image from: ${src}`);
      }
  
      let metadata = await Image(src, {
        widths: [1440],
        formats: ['webp', 'jpeg'],
        urlPath: "ASSETS" + "media/",
        outputDir: "./_site/assets/media/",
      });
  
      let lowsrc = metadata.jpeg[0];
  
      return `<picture>
        ${Object.values(metadata).map(imageFormat => {
          return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}">`.replace('ASSETS', assets.path);
        }).join("\n")}
          <img
            loading="lazy"
            src="${lowsrc.url}"
            alt="${alt}">
        </picture>`.replace('ASSETS', assets.path);
    });

    eleventyConfig.addPassthroughCopy("src/favicon.ico");
    eleventyConfig.addPassthroughCopy("src/robots.txt");
    eleventyConfig.addPassthroughCopy("src/assets/");

    eleventyConfig.addLayoutAlias('base', 'base.njk');
    eleventyConfig.addLayoutAlias('post', 'post.njk');
    eleventyConfig.addLayoutAlias('page', 'page.njk');

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "includes",
            layouts: 'layouts',
            data: 'data'
        },
        templateFormats: ['njk', 'md'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        passthroughFileCopy: true
    };
};
