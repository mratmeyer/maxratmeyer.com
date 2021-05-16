---
title: "Caching Images on the Edge with S3 and Workers KV"
date: 2020-06-08
description: "My setup using Cloudflare Workers and Workers' KV database to cache files on Amazon S3."
tags:
  - guides
  - projects
repository: https://github.com/mratmeyer/workers-asset-cache/
---
When I was building this blog, one of the decisions I had to make was where to host my media. One of the options was to just upload everything to my GitHub repository and deploy it along with the site, but in the long term that can get clunky because Git isn't ideal for handling tons of media. I also wanted to manage my media and photos separately from my website's GitHub repository, so I went with Amazon S3, Amazon's object storage service.

My website is behind Cloudflare, a free service that sits in front of it and protects it from DDoS attacks and caches it to make it load faster. One of their more recent product offerings is Cloudflare Workers, a service that allows you to run JavaScript code on their servers that runs when someone requests a file on your site. They also offer an additional product called Workers KV, which is a key-value database that is ran inside their network, so latency is super low and it's instantly avaliable around the globe in all of their data centers.

## The problem with a traditional Cloudflare setup

Normally, when you go to a website on Cloudflare, it acts as a reverse proxy. That means that requests won't be cached at their edge servers until someone loads the website. This is fine, but it means that the first request will still have to travel to the origin, get processed, and get sent back before the user will receive the content. Caching with Cloudflare normally also usually lasts at most a few days because it's often cleared to make room for new content. This setup works well for high traffic websites, but in order for a visitor to get a cached request someone else would have had to have visited the website in the last day at the same data center to avoid having to go back to the origin.

My solution to this is to use Workers KV in order to cache files as they are recieved and store it on Cloudflare's network, so even when the local caches of each data center is cleared, it would already be on the Cloudflare network so it wouldn't have to make any extra trips around the internet.

## Performance testing

In order to measure the performance of the assets worldwide, I used [KeyCDN's Performance Test](https://tools.keycdn.com/performance) to query each file from multiple locations throughout the world. We will specifically be looking at the TTFB(Time to First Byte) result, which shows how long it took before the server starts sending the data packets back to the client.

The first test I ran was an uncached request with worker querying Amazon S3 directly.

{% Image "workers-fetch-origin.jpg", "Performance test with Worker fetching straight from S3." %}

When we fetch the files directly from Amazon, you can see in the TTFB that in the United States the content gets transfered quickly, but in almost every other location it takes anywhere from half a second to 1.5 seconds in order to start delivering content. This is because my Amazon S3 bucket is located only in us-east-1, Amazon's North Virginia location. Any other region has to go through the open internet before it is delivered to the user.

{% Image "workers-fetch-kv.jpg", "Performance test with Worker fetching from Workers KV" %}

With Workers KV deployed, the first request in Germany has a long TTFB with about 800ms, but almost all of the sequential requests are around the 200-300ms mark. This is because after the first Worker fetches the asset from S3 in Germany, it not only caches it locally at Cloudflare's Germany colocation, but it also uploads the file to Workers KV, which immediately pushes it to all of Cloudflare's other data centers worldwide. When the sequential requests are sent, instead of being fetched from the origin, they are being fetched from Workers KV, so latency is reduced significantly.

{% Image "workers-fetch-node.jpg", "Performance test with Worker fetching from node cache" %}

Once the image has been cached not only on Workers KV but also on the local Cloudflare servers, the TTFB is halved yet again. This is super fast, but if the files aren't requested regularly by users, it will revert back to the speeds from fetching directly from Workers KV, which is still pretty fast.

## Setting it up

There are two ways to set this up, you can either copy and paste the code below into a new Worker, or you can clone [this GitHub repository](https://github.com/MaxRatmeyer/workers-asset-cache) and use Wrangler to publish it.

To use the Cloudflare dashboard, first go to the Workers page and create a new Worker. Once you're there, paste the script below and save and deploy it. Go to back to the Workers dashboard, click on the Worker you setup and then click Settings. Once you are in the Settings option, the first thing you need to do is create an environmental variable which contains the endpoint where your files are stored. For example, if you are using Amazon S3, make a variable called 'SERVICE' and assign the value to 'https://BUCKET.s3.amazonaws.com'. (Also make sure you've configured the correct S3 access policy settings.) 

<script src="https://gist.github.com/mratmeyer/4bf0da0d23fe634c30972e6eafe4605e.js"></script>

Next, you need to assign the KV Namespace binding. At the top of the screen, click KV, and create a new namespace. Once you've done that, go back to the Worker's settings, and create a binding for the variables 'ASSETS' to whatever KV space name you just created. Once you're done, your Settings page should look like this.

{% Image "workers-settings.jpg", "Example Workers Settings Page" %}

Once you've set up the Worker, all you need to do is go into your domain's settings and assign the Workers to a route. For example, mine looks like this.

{% Image "workers-domain-settings.jpg", "Example Workers Domain Settings Page" %}

## Conclusion

Done! That wasn't too bad. Now you have Cloudflare caching all of the images on your site. About pricing, Cloudflare Workers has a free tier that offers 100,000 requests per day for free, but since this requires Workers KV, you have to get their Workers Unlimited plan. It's $5, and comes with 10 million requests and access to store 1GB in Workers KV. You can also pay more for 50 cents per extra gigabyte. If you have a static site, you can also host your entire site on Workers KV as well included in the same subscription.

If you have any questions, comments, or suggestions, feel free to reach out to me in the About tab.

_Update (2-25-21): Cloudflare now offers a free tier for Workers KV. It includes 1GB of storage space and 100,000 reads per day. [View pricing here.](https://www.cloudflare.com/products/workers-kv/)_
