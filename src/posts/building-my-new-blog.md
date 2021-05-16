---
title: "Building my new blog"
date: 2020-05-26
description: "My journey building my blog on the JAMStack with Eleventy and Netlify."
tags:
  - projects
---
For a while now, I've wanted to build my own website and blog. The past few years, I've had a generic HTML5Up template up on my domain saying "Coming soon," which has been an ongoing joke to my friends because it has said the same thing for years.

{% Image "maxratmeyer-com-2018.jpg", "My original website according to archive.org"  %}

Before the coronavirus pandemic, basically all of my time was spent doing schoolwork or school related activites. One silver lining for me during this pandemic is that I've had a lot more time to explore on my own and do whatever I wanted because everything else was on hold. 

## Preparing to build

When I was building my website, I knew for sure that I wanted to build it from scratch. It just didn't sit right with me to build my site using someone elses template. If I were going to make my own site, especially since I know I can learn to do it on my own, it's important that I at least try. So, I started looking at what my plan was. Originally, I was thinking I would design my template just using HTML and CSS, and then convert it into a WordPress theme, so having that in mind I jumped in to starting to build my template.

## Building my template

The first thing I checked out was my GitHub Student Starter Pack subscription to see if there was anything there that would help me. GitHub's Student Starter Pack program basically gives students in high school or college access to a lot of tools and services for free, so I assumed there would be something that would help me. When I checked it out, one app that stood out to me was Bootstrap Studio.

Bootstrap Studio seemed to fit the bill for me as it was using Bootstrap which I was planning on using for the layout of the site anyways, so I thought it may help. I downloaded it and set up a basic site, but when I used it the elements seemed too cookie cutter to me. I decided to rebuild what I had created in Bootstrap studio but manually through Visual Studio Code. Once I had done that, I had the first iteration my website. It was functional, but it looked really plain.

{% Image "maxratmeyer-com-first-iteration.jpg", "First template design of my website" %}

## Transitioning to JAMStack

Now that I had a starting point for me to build my site off of, I started looking into how to turn an HTML template into a WordPress theme, but then I remembered a term I'd heard a while back, JAMStack. After looking into it, it seemed to make perfect sense for what I wanted to do with my site. Basically, the idea behind JAMStack is instead of generating your website at the time the user loads it, like WordPress, you pregenerate the HTML and CSS files ahead of time and just serve it over a CDN. By using JAMStack, your site is faster because it's pregenerated ahead of time and served via a CDN, it's more secure because users are just interacting with static files, and its also cheaper because less processing power is used when users visit your website. To host a WordPress website, you need to buy a server for at least a few bucks a month at a decent host and manage that, but with JAMStack you can use free services like [Netlify](https://www.netlify.com/) with extremely generous free tiers.

To start, I looked at which static site generator to use to build my site. Static site generators are basically programs that take your HTML template and your posts and combine it in order to generate the static website files. I started with Jekyll because it seemed to be the most supported and there was a lot of information about it online. I started by creating my site on my MacBook, and I used other custom Jekyll websites on GitHub to get an idea of how the templating language worked. After a few days of grinding, I finally got my template ported into Jekyll and got it deployed to AWS Amplify. 

This setup worked great, but I noticed a newer, faster static site generator called [Eleventy](https://www.11ty.dev/) popped up. A few weeks later, I again spent a few more days converting my Jekyll site into Eleventy, and after a bunch of head scratching and error fixing, I finally switched my blog to Eleventy. Eleventy is a lot more lean and simplistic than Jekyll, and it doesn't have a lot of the bloat with Jekyll. 

## Hosting my site

Hosting wise, one of the great things about JAMStack is how portable everything is. There are not only a ton of different hosting providers built specific for JAMStack that publish your site directly from your Git repository like [Netlify](https://www.netlify.com/) and [Vercel](https://vercel.com/), but you can also use traditional setups like AWS S3 + CloudFront, GitHub Pages, or even CloudFlare Workers Sites. After a few weeks of playing around with hosting, I'm settling on using Netlify on CloudFlare with aggressive caching rules, and my static content like images are hosted in a Google Cloud Storage bucket also with CloudFlare Workers caching in front.

## Final thoughts

Although I'm glad I finally have my own website, there's a lot of work I want to do on the UI. It works and it's minimalistic as I intended it to be, but it doesn't look particularly good. I'm not a designer, but hopefully I can keep iterating through designs until I get something that's clean and functional.

More generally, I also think that the move towards JAMStack and tools like Netlify is a really awesome step in the evolution of the internet. Lots of the barriers to entry for people that want to start a blog or website are now lifted, and it's quicker, cheaper, and faster to build your own site than it has ever been before.