---
layout: post
title: "Unihack 2020: Building Study Generator"
permalink: /blog/unihack-2020-building-study-generator/
date: 2020-11-29
description: "My experience building Study Generator at my first hackathon."
tags:
  - projects
  - experiences
---
This past weekend, my friend Akash and I attended Unihack, an international hackathon with a focus on solving civic issues. I've never attended a hackathon, so this was all new to me, but this was Akash's fourth hackathon. Going in, I was looking forward to building another project and playing around with some web development.

Since this hackathon was international and based in Romania, the time zone was 7 hours off. This meant that for some events, we had to wake up earlier than I would've liked. The Sunday that we were judged, I had to get up at 5 AM to be ready for the judges at 6.

## Finding project ideas

Unihack had multiple tracks we could choose to compete from. These tracks included more generic categories like Best Mobile App or Best Web App, but also included some specific issues like Digital Education and Safe Urban Mobility. Going in, we knew we wanted to build our project as a web app, since that was territory neither of us were too familiar with. We also opted to build our app in Digital Education, since that was a topic we were interested in since it affects our daily lives.

After brainstorming for a few hours, we had the basis of an idea. What if we could build a platform where we could generate flashcards and questions for content they need to study? Maybe if they need to review an article, they could paste the text into the platform and get automatically generated questions to help them check their comprehension.

## Enter: Study Generator

Study Generator is a web app we built where a user can insert any text, think an article to study or a Wikipedia entry, and the app will generate flash cards. This could be a quick way to check comprehension of an article, or make sure you understand all of the concepts in a PowerPoint. In the backend, Google's Natural Language Processing API is running and determining which words in the text are important, and based on an algorithm, questions are generated and sent back to the client via an API.

{% Image "./src/assets/media/study-generator.jpg", "Study Generator UI", "" %}

We also added a feature where if a user wants to print their flashcards to go, they could press the print button and a formatted PDF will be generated to be printed.

## Our tech stack

The frontend of our application, which in this case was the website studygenerator.com, was built in Vue.js as a single page app and hosted on Netlify. The backend was built in Node.js using the Express framework. This was then dockerized and hosted in Google Cloud Run. 

Going into this project, neither of us had any experience working with Vue or web development in general. We came from working in the backend and the Java world, so jumping into the JavaScript library world was a little annoying. Many times we ran into issues where something wouldn't work due to quirks in the language or framework. We also ran into issues with JavaScript being very inconsistent. Sometimes, the app would work and sometimes it wouldn't

## Next steps

Overall, we are happy with how the project turned out. In the future, we hope to develop it further and make it an open source project. We also hope to pick up some machine learning and see if we could implement that into the project to develop better questions. In addition, we are planning to add more features, such as the ability to upload files and a testing mode.

If you would like to view the project live, you can visit [www.studygenerator.com](https://www.studygenerator.com/) and view [frontend](https://github.com/MLHUnihack2020/StudyGuideFrontend) and [backend](https://github.com/MLHUnihack2020/StudyGuideBackend) source code here.