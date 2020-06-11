---
layout: post
title: "GHBuddies Progress Update 1"
date: 2020-03-23
description: "Progress Update for GHBuddies, a project I started at GHP last summer."
tags:
  - projects
---
Last summer, I attended Georgia's Governor's Honors program and I started a project with my friend Akash called GHBuddies. Essentially, after hall checks at 7:30 PM, you are required to have a buddy if you want to leave your dorm room. Most of the time, everyone split up and it could be hard to coordinate with other people if you wanted to go somewhere. Sometimes I got stuck at the dorm room and had to do something on my own or wait and see if anyone else was planning on leaving the dorms, hence we got the idea for GHBuddies.

The idea behind GHBuddies is simple, you open the app, put in your current location and destination that you would like to go to, and it would put you in a database. If anyone else also had the same starting and ending location, it would match them together, and send them both a message to meet in the lobby. This of course isn't a perfect solution because if no one else also wants to leave with the same starting and ending destination, you would never be matched with anybody. For this problem, we're looking at solutions like an "Uber" system, but that's a topic for another day.

Once we had a basic idea of what we wanted to do, we were planning on building a server less web app using Firebase and Twilio. Firebase would handle the web app hosting and cloud functions, and Twilio would send an SMS message to the user once they had been matched. At this point we had maybe two and a half weeks to complete this project, and to try to roll it out to the entire GHP. We built the web app pretty quickly using HTML and Bootstrap, and then we integrated the web app with Firebase by adding the backend Javascript to call the cloud functions.

![Original GHBuddies Web App](https://static.maxratmeyer.com/media/ghbuddies-web-screenshot.jpg "Original GHBuddies Web App")

Once we got a prototype of cloud functions set up, it was functional but we ran into a problem. Every time a user would submit their information into the system, once it matched them it would duplicate and send the messages twice. At this point we had maybe a little more than a week left in the program, so we were scrambling to get it working. After countless hours of debugging, we thought we would have a solution and then a few minutes later it would break again.

![GHBuddies Notification](https://static.maxratmeyer.com/media/ghbuddies-notification-screenshot.jpg "GHBuddies Notification")

When we got GHBuddies to a point where it was stable enough, we announced it to the GHP group chat and got ready for release night. Of course an hour before we were planning on opening it, Google Cloud went down so that made the app unusable for a good while. :( Anyways, at that point we decided this is a long term project, and we would have to make it into a more stable full fledged app and release it at the next GHP if we wanted it to go anywhere. So, that bring's me to my progress so far.

## Our Progress so Far

This has been my first iOS app, and while there's been a pretty big learning curve I'm slowly but surely getting the hang of it. We still have a lot of work to do, but we're getting closer to a usable product.

This screenshot shows our login screen. When the user first downloads the app, they will be presented with this screen. There is also a registration button that takes them through a registration process, but that is currently disabled while I update it. Once the user puts their information in this screen, they will be taken to the home page.

![GHBuddies Login Screen](https://static.maxratmeyer.com/media/ghbuddies-ios-1.jpg "GHBuddies Login Screen")

And this is the home page. Here the user taps in their starting location and ending location and presses the request button in order to get matched with a buddy.

![Beta GHBuddies Home Screen](https://static.maxratmeyer.com/media/ghbuddies-ios-2.jpg "Beta GHBuddies Home Screen")

The good news is now that school is out for a while I have more time to work on this project and see where we can take it. However, by the same token, depending on how the coronavirus pandemic plays out, GHP may be cancelled this summer and we won't be able to release it this year.