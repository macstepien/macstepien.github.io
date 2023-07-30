---
layout: post
title: 2D Racing
permalink: /projects/2d_racing
excerpt: |
  Top-down racing game created using C++, SFML and Box2D
  <center><img width="600" src="/pics/3_2dracing/2dracing_demo.png"></center>
  <br>
date: 2014-01-18
order_number: 15
---

A 2D racing game with a top-down view. Written in C++ using SFML and Box2D libraries.

{% include figure.html image="/pics/3_2dracing/2dracing1.png" width="500" height="800" %}

This game was made as part of an IT project in Middle School. It allows you to race against opponents on various tracks. 
{% include video.html id="WLTiLirKbhg" title="2DRacing demo" %}

By including information about the squares in the text file and reading the current position of the car, I created a form of artificial intelligence opponents. Opponents react to being on a specific square by turning, accelerating or braking. The entire driving and crash simulation is based on the Box2D library, which resulted in realistic interactions between cars.  

You can also create new tracks in a separate editor, which I also wrote as part of the project. The track is divided into squares of a certain type: straight, left turn, right turn, grass and finish line.
{% include video.html id="HC7pIYXWK9I" title="2DRacing map editor demo" %}

{% include button.html text="2DRacing Github repository" icon="github" link="https://github.com/macstepien/2DRacing" color="#0366d6" %}
{% include button.html text="Map Editor Github repository" icon="github" link="https://github.com/macstepien/2DRacing-Map-Editor" color="#0366d6" %}
