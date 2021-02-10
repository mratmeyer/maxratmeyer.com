const config = require("./src/data/config");
const CleanCSS = require("clean-css");
const excerpt = require('eleventy-plugin-excerpt');
const htmlmin = require("html-minifier");
const { minify } = require("terser");
const Image = require("@11ty/eleventy-img");
const moment = require('moment-timezone');
const pluginRss = require("@11ty/eleventy-plugin-rss");

async function imageShortcode(src, alt, sizes) {
  src = "./src/assets/media/" + src;
  
  let metadata = await Image(src, {
    widths: [720, 1440],
    formats: ['webp', 'jpeg'],
    urlPath: "ASSETS" + "media/",
    outputDir: "./_site/assets/media/",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  let result = Image.generateHTML(metadata, imageAttributes);

  result = result.replace(/ASSETS/g, config.imagePath);

  return result;
}

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
    eleventyConfig.addFilter("stripHTML", function(text) {
      return text.replace(/(&lt;.*?&gt;)/gi, '').replace(/\.|\,|\?|-|—|\n/g, '');
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

    // Minify JS
    eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
      code,
      callback
    ) {
      try {
        const minified = await minify(code);
        callback(null, minified.code);
      } catch (err) {
        console.error("Terser error: ", err);
        callback(null, code);
      }
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

    eleventyConfig.addNunjucksAsyncShortcode("Image", imageShortcode);

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
