---
layout: post
title: "Managing my DNS through DNSControl"
date: 2020-08-31
description: "How I manage my DNS records with git and JavaScript using DNSControl."
tags:
  - projects
---
A few months ago, I was researching some DNS management tools and I came accross DNSControl. Generally speaking, DNS records are a pain to manage because each provider has their own UI, it's hard to make changes to multiple domains on once, and if you make a change that you want to revert it's hard to do so in a provider's UI. DNSControl improves on alot of this, because it allows you to define all of your DNS records and domains in a JavaScript file and save it in git, so you have version history, and you can sync it to the provider with one command.

![DNSControl Records for one of my domains](/assets/media/dnscontrol-records.jpg "DNSControl Records for one of my domains")

## Setting it up

Setting up DNSControl is pretty straightforward. Once [you've installed DNSControl](https://stackexchange.github.io/dnscontrol/getting-started), you need to [create a dnsconfig.js file](https://stackexchange.github.io/dnscontrol/getting-started) and create a new variable for each provider. Then, modify the D() function with the records for each domain. After that you need to go your provider, which in this case is Cloudflare and NS1, and generate a new API key to manage your DNS records. Next, create a new folder or git repo for your DNSControl files, and [create a creds.json file](https://stackexchange.github.io/dnscontrol/getting-started) and paste in your credentials that you generated earlier. After that enter Terminal and go to the folder where your DNSControl files are located and run dnscontrol preview. This will query the records on each provider and compare it to the setup in your configuration file. You can use this to double check that you aren't missing any domains. Finally, you can run dnscontrol push and DNSControl will do it's magic and push the records to each of the providers.

## Neat features

Since the DNS records are defined in JavaScript, we can do neat little tricks that makes it easier to manage the records for our domains. For example, say you have multiple domains for which you want to have the same records for, you can set up a loop in order to set the same DNS records for each of your domains.

![Using loops to repeat records for multiple domains](/assets/media/dnscontrol-repeat-records.jpg "Using loops to repeat records for multiple domains")

If you have multiple servers or change the server IPs regularly, you can also assign different IP addresses to different variables and reference those from within the domains. Since this is JavaScript and code, almost any setup you want will work.

## My first open source contribution

While I was setting up DNSControl, one issue I ran into was that ALIAS records were not supported on DNSControl for one of my providers, NS1. I knew that NS1 officially supported ALIAS records, so I opened an issue in the DNSControl repository about adding ALIAS records on NS1. The maintainers for DNSControl were super friendly and helpful, and they walked me through running integration tests with NS1 and how to test each different record type. I tested PTR, NAPTR, ALIAS, TXTMulti and PTR and TXTMulti worked out of the box, but NAPTR and ALIAS needed work. I wasn't too interested in NAPTR, so I skipped that and went to trying to fix the ALIAS record. 

After I got some more info, I went into the NS1 provider file and found where the code for records and special cases was handled. Normally, for most record types in DNSControl, there's a central class that handles formatting the records, but some records for some providers require special cases. ALIAS for NS1 was one of these, so using the SRV record as a template, I added support for ALIAS records. Once I submitted the pull requests, it got approved and I had my first PR!

A few days later, I realized that for the TXTMulti records, NS1 technically supported them but they merged them into 1 string, so every time DNSControl ran it would try updating the record again. There was also another preexisting issue with MX records, so I had to add another edge cases in the provider config to update that. After that, I was good to go!

## Conclusion

Overall, DNSControl is a super neat tool that makes managing DNS records a lot easier and more intuitive, and it was a great first project for me to contribute to!