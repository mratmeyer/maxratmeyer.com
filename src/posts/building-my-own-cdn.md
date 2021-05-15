---
title: "Building my own CDN"
date: 2020-07-31
description: "How I built my own CDN for my site from scratch."
tags:
  - projects
---
Last Friday, Cloudflare had a major outage which took down a good portion of the internet for about half an hour. While Cloudflare is an awesome service and they have a generous free tier, it begs the question whether so much of the internet should be centralized under one company, so I wanted to see what it would take for me to make my own CDN.

## What is a CDN?

Say you have a Wordpress server hosted in Atlanta. Every time someone wanted to go to your website they'd have to go to your server in Atlanta, Wordpress would dynamically generate all your content, and send it back over the internet to you. If you're geographically close this works great, but if you're in say France and try to request content from a server hosted in the U.S, you would have to traverse the internet multiple times to get the page along with the pictures and fonts, etc. A CDN is a network of servers that are distributed around the globe so users connect to servers that are geographically close to them.

This blog is built on a static site generator, meaning that I code the template and put the posts in a git repository. When I make changes and publish the static site, the generator builds the site into static HTML files. This is great because there is no always-on central database the web server has to keep talking to so it's easier to make copies across multiple servers and it takes much less resources to scale since the HTML files are decoupled from a database.

## The setup

The first thing I did was make a bash script that handles setting up each of the machines. Once I create the VPS in the dashboard, I SSH in and run the script. It handles setting up my non-privelleged account and adding my SSH keys, updating the packages, installing and confinguring nginx for all of my domains, copying my SSL certificate, and building the latest version of my website from GitHub. 

My CDN consisted of 3 Linode servers, one in Atlanta covering the eastern U.S., one in Fremont covering the western U.S., and one in Frankfurt covering Europe. I used NS1's Managed DNS along with Filter Chains that directed traffic to different servers depending on their uptime and geographic location in order to point users to the optimal CDN node.

## Results

{% Image "custom-cdn-results.jpg", "Results from my custom CDN", "100vw, 100vw" %}

In my test, you can see requests from North America and Europe were pretty fast, since their were CDN nodes nearby. In Asia and Asia Pacific, since there were no nearby nodes the TTFB is much higher as it has to traverse through the internet. If I spun up a few more CDN nodes in Asia and Asia Pacific, I could get pretty solid speeds from almost everywhere in the world. Of course, that's still nowhere near Cloudflare or CloudFront's datacenter amount, but for a static site this is already pretty overkill.

Probably the most difficult problem I ran into was managing the SSL certificates. For this proof of concept, I just generated one LetsEncrypt certificate and copied it to each server in the bash startup script, but since LetsEncrypt certificates expire after 90 days if I were to use this long term that would be an issue. One idea is to have one main server which handles renewing the certificates with LetsEncrypt on a schedule and then automatically sync it the other servers via rsync, or encrypting the keys and storing them in an S3 bucket and have each server periodically download the latest version.

## Other features

NS1, my DNS provider, also has a monitoring feature which can periodically check if each of my nodes are online. The way I have my filter chain setup, whenever a user requests the server for my website, after verifying that the server isn't offline, it will route queries to the closest distance from the user through geographic routing. The failover is especially cool because if one server goes offline, NS1 will automatically stop serving that node's IP and send traffic to the nearest online server so the user will never see the site go offline.

## Conclusion

While this was a cool project, in the long term I don't really want to deal with managing each of the servers, especially when services like Netlify already do this pretty well. In addition, each node costs $5 a month, so if I have multiple nodes across the world the costs could unnecessarily add up over the course of a year. In the long term, I may switch back to Cloudflare in front of an nginx server, go fully to Netlify, or just have a nginx server. Because my website is just static files, even a $5 DigitalOcean droplet should be able to handle a ton of traffic.