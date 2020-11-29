---
layout: post
title: "Caching Images on the Edge with S3 and Workers KV"
date: 2020-06-08
description: "How I set up CloudFlare Workers to cache Amazon S3 files on CloudFlare Workers KV."
tags:
  - guides
  - projects
---
When I was building this blog, one of the decisions I had to make was where to host my media. One of the options is to just upload everything to my GitHub repository and deploy it along with the site, but that wouldn't be efficient because Git isn't built to handle tons of media. I also wanted to manage my media and photos separately from my GitHub website repository, so I went with Amazon S3, Amazon's object storage service.

My website is behind CloudFlare, a free service that sits in front of it and protects it from DDoS attacks and caches it to make it load faster. One of their more recent product offerings is Workers, a service that allows you to run JavaScript code on their servers that runs when someone requests a file on your site. They also offer an addon product called Workers KV, which is a database that is ran inside their network, so latency is super low and it's instantly avaliable around the globe in all of their data centers.

## The problem with a traditional CloudFlare setup

Normally, when you go to a website on CloudFlare, it acts as a reverse proxy. That means that requests won't be served at their edge servers until someone loads the website first, and sequential requests at the same edge server then get answered from the cache. This is fine, but it means that the first request will still have to travel all the way back to the origin, get processed, and returned before the user will receive the content. In addition, normal caching with CloudFlare usually lasts at most a few days, because it's often cleared to make room for new content. This setup works well for high traffic websites, but there are a few criteria a visitor would have to meet if they were to get a cached request: out of the 200ish CloudFlare data centers around the world, their data center would have to have someone else who visited the website in the last day otherwise they will have to go back to the origin.

My solution to this is to use Workers KV in order to cache files as they are recieved on the entire network, so even when the local caches of each data center is cleared, it would already be on the CloudFlare network so it wouldn't have to make any extra trips through the internet.

## Performance testing

In order to measure the performance of the assets worldwide, I used [KeyCDN's Performance Test](https://tools.keycdn.com/performance) to try and query each file from multiple locations throughout the world. We will be looking at the TTFB(Time to First Byte) result, which shows how long it took before the server starts sending data to the client.

The first test I ran was an uncached request from CloudFlare directly to Amazon S3.

{% Image "./src/assets/media/workers-fetch-origin.jpg", "Performance test with Worker fetching straight from S3." %}

When we fetch the files directly from Amazon, you can see in the TTFB that generally speaking in the United States, the content gets transfered quickly but in almost every other place in the world, it takes anywhere from half a second to 1.5 seconds in order to start delivering content. This is because my Amazon S3 bucket is located only in us-east-1, Amazon's North Virginia location. Any other region has to go through the internet before it is delivered to the user.

{% Image "./src/assets/media/workers-fetch-kv.jpg", "Performance test with Worker fetching from Workers KV" %}

Here you can see with Workers KV deployed, the first request in Germany has a long TTFB with about 800ms, but almost all of the sequential requests are around the 200-300ms mark. This is because after the first Worker fetches the asset from S3 in Germany, it not only caches it locally at CloudFlare's Germany colocation, but it also uploads the file to Workers KV, which then pushes it to all of CloudFlare's data centers worldwide. When the sequential requests are sent, instead of being fetched from the origin, they are being fetched from Workers KV, so the latency is reduced significantly.

{% Image "./src/assets/media/workers-fetch-node.jpg", "Performance test with Worker fetching from node cache" %}

Here, you can see once the image has been cached not only on Workers KV but also on the local CloudFlare servers, the TTFB is halved yet again. This is super fast, but if the files aren't used regularly by users, it will revert back to the speeds from fetching directly from Workers KV, which is still pretty fast.

## Setting it up

There are two ways to set this up, you can either copy and paste the code below into a new Worker, or you can clone [this GitHub repository](https://github.com/MaxRatmeyer/workers-asset-cache) and use Wrangler to publish it. To use the CloudFlare dashboard, first go to the Workers page and create a new Worker. Once you've done that, paste the script below and save and deploy it. Next, go to back to the Workers dashboard, and click on the Worker and click Settings. Once you are in the Settings option, the first thing you need to do is create an environmental variable which contains the endpoint where your files are stored. For example, if you are using Amazon S3, make a variable called 'SERVICE' and assign the value to 'https://BUCKET.s3.amazonaws.com'. (Also make sure you've configured the correct S3 policy settings.) 

<script src="https://gist.github.com/MaxRatmeyer/4bf0da0d23fe634c30972e6eafe4605e.js"></script>

Next, you need to assign the KV Namespace binding. At the top of the screen, click KV, and create a new namespace. Once you've done that, go back to the Worker's settings, and create a binding for the variables 'ASSETS' to whatever KV space name you just created. Once you're done, your Settings page should look like this.

{% Image "./src/assets/media/workers-settings.jpg", "Example Workers Settings Page" %}

Once you've set it up, all you need to do is go into your domain's settings and assign the Workers to a route. For example, mine looks like this.

{% Image "./src/assets/media/workers-domain-settings.jpg", "Example Workers Domain Settings Page" %}

## Conclusion

Done! That wasn't too bad. Now you have CloudFlare caching all of the images on your site. About pricing, CloudFlare Workers has a free tier that offers 100,000 requests per day for free, but since this requires Workers KV, you have to get their Workers Unlimited plan. It's $5, and comes with 10 million requests and access to store 1GB in Workers KV. You can also pay more for 50 cents per extra gigabyte. If you have a static site, you can also host your entire site on Workers KV as well included in the same subscription.

If you have any questions, comments, or suggestions, feel free to reach out to me in the About tab.