const CleanCSS = require("clean-css");
const excerpt = require('eleventy-plugin-excerpt');
const htmlmin = require("html-minifier");
const moment = require('moment-timezone');
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {

    eleventyConfig.setDataDeepMerge(true);

    eleventyConfig.addPlugin(excerpt);

    eleventyConfig.addFilter("dateformat", function(dateIn) {
        return moment(dateIn).tz('GMT').format('MMM DD, YYYY');
    });
    eleventyConfig.addFilter("toISOString", function(dateIn) {
        return moment(dateIn).tz('GMT').format('YYYY-MM-DD');
    });

    eleventyConfig.addPlugin(pluginRss);

    eleventyConfig.addFilter("cssmin", function(code) {
        return new CleanCSS({}).minify(code).styles;
    });

    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
        if( outputPath.endsWith(".html") ) {
          let minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true
          });
          return minified;
        }
    
        return content;
    });

    eleventyConfig.addCollection("tags", function(collection) {
        let tagSet = new Set();
        collection.getAll().forEach(function(item) {
            if( "tags" in item.data ) {
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

    eleventyConfig.addPassthroughCopy("src/favicon.ico");
    eleventyConfig.addPassthroughCopy("src/robots.txt");
    eleventyConfig.addPassthroughCopy("src/assets/");

    eleventyConfig.addLayoutAlias('base', 'base.njk')
    eleventyConfig.addLayoutAlias('post', 'post.njk')
    eleventyConfig.addLayoutAlias('page', 'page.njk')

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "includes",
            layouts: 'layouts'
        },
        templateFormats: ['njk', 'md'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        passthroughFileCopy: true
    };
};
