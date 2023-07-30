---
layout: post
title: General-purpose robot
permalink: /projects/general-purpose-robot
excerpt: |
  My first attempt at creating a general-purpose robot, this construction consisted of 13 servos and a stereo vision camera for navigation
  <center><img width="250" src="/pics/5_general_purpose_robot/robot_compressed.jpg"></center>
  <br>
date: 2014-08-28
order_number: 9
---

It was my first attempt at creating a general-purpose robot. Due to the low budget, it was supposed to be only a scaled version, without many real capabilities, only a proof-of-concept. 

{% include figure.html image="/pics/5_general_purpose_robot/robot.jpg" width="300" height="800" %}

In this construction, I planned to use 11 servos, which were more than the available PWM lines on Atmega88Pa microcontroller that I used. That's why I was generating a PWM signal using a timer, but due to high resource usage, it was necessary to dedicate one microcontroller solely for this purpose. The second microcontroller was used to communicate with a computer, control wheel motors and send commands to the first MCU using SPI. This approach was very complicated and because of additional problems with the power supply, I decided to skip manipulation and focus on navigation. As the only sensor in this task, I used stereo vision. I was able to make it work quite well statically, but when mounted on the robot, motion caused images from cameras to become blurry and as a result detected point cloud wasn't accurate enough.

{% include figure.html image="/pics/5_general_purpose_robot/plytka.jpg" width="600" height="800" %}

{% include figure.html image="/pics/5_general_purpose_robot/parts.jpg" width="600" height="800" %}
