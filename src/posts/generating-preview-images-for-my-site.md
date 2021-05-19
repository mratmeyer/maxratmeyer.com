---
title: "Generating Preview Images for My Site"
date: 2021-05-18
description: "How I generate custom image previews for apps like iMessage and Signal."
tags:
  - projects
repository: https://github.com/mratmeyer/open-graph-preview-generator/
---
A few weeks ago, GitHub started showing nicely formatted preview images with the repository name and a few different stats like stars and contributors. I thought it looked cool, so I decided to build my own implementation for my blog posts.

{% Image "open-graph-preview-image.jpg", "Performance test with Worker fetching straight from S3." %}

## Goals

As you may have noticed throughout my site, I like minimalist design. I wanted my preview cards to also have a clean design along with some useful info like the title and date for each post, along with some branding related to my website like a profile picture and my site name. Whenever someone shares a link of my site, it should generate and render that card using open graph in the app that it's being sent with.

## Tech stack

When I was researching possible ways to generate the preview images, a common method I found was using CSS and Puppeteer. Essentially, you make a miniature website using HTML and style it with CSS, and using Puppeteer(a Node.js program that lets you run a programmable version of Chrome) you would start up a virtual browser and take a screenshot of it. This would work but because it involves Puppeteer and the Chrome rendering engine it would be more heavy than it needs to be and theoretically slower because of the browser start time.

Another method I found was using node-canvas, a Node.js implementation of the Canvas API. The Canvas API uses JavaScript in order to draw text and objects on a blank canvas. This should be faster because its not having to fire up an instance of a browser just to draw a single picture.

## How it works

Say someone sends a link to my site on iMessage, the first thing the messaging client will do is download a copy of the webpage. The main thing it's looking for are open graph tags. These are directions in the header telling the client some data about my site. It includes the title, description, preview image, and some other info. When the client gets the open graph image tag for a blog post, it will point to my open graph Node.js server hosted on the domain *opengraph.maxnet.work*.

Once the client knows where to look for the open graph image tag, it sends a request to download the image from the open graph server. Upon the open graph server receiving the request, the first step it takes is getting the information from the post. Using the URL path of the blog post, the program will fire off a request to the API for my website, receiving a JSON request with the title, date, and tags for the corresponding post.

Once it has this information, we have all we need to go ahead and generate the image. Generating a canvas image is pretty simple, and adding each line of text or picture is a matter of using the drawText function and specifying the x and y coordinates of each line. Because Canvas is only taking commands and outputting results without intelligent checks on when to split a new line, I had to implement my own functionality for that. The helper function tries to fit as many words on a line as possible, and then indents the text and starts over with the next line.

Once the image has been generated, it is then sent back as a PNG using Express.js and rendered on the client.

## Hosting

Originally, I was thinking I would drop the code in a AWS Lambda or Netlify Function and call it a day. However, because node-canvas uses some external dependencies that are tricky to deal with, I opted to stick with Docker containers. Especially in a case like this, having one docker image that I know has all of the right dependencies installed solves a lot of issues.

When I was setting up the Docker container, I ran into an issue where sometimes the Docker container would deploy and run and sometimes it wouldn't. I later figured out this was because the node dependencies I was using on my Mac were being copied over to the new Docker container and the server needed different dependencies. Presumably because I'm using an ARM device now and the server was using x86, this caused compatibility issues. I had to create a Dockerignore file in order to tell Docker to not copy my local dependencies to to the Docker container.

## Wrap-up

All in all this project was pretty fun to work on and it looks cool! You should be able to send a link to one of my posts in iMessage or Instagram in order to see it, or you can look for the *og:image* meta tag in the source code. If you're interested in checking out the source code for this project click on the View Repository button below.