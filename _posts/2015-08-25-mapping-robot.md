---
layout: post
title: Mapping robot
categories:
  - Robots
excerpt: |
  Robot that drives around and creates a map of the environment.
   
  <img width="200" height="200" src="/pics/RobotMapujacy/minifront.jpg">
---

Robot that drives around and creates a map of the environment.

{% include figure.html image="/pics/RobotMapujacy/front.jpg" width="600" height="800" %}

This robot was a simplified version of a previously created general-purpose robot. In this construction I simplified requirements and focused only on mapping and navigation. Instead of stereo vision I decided to use a Kinect sensor because results achieved previously with only cameras weren't satisfactory. I also added custom-made wheel encoders based on optocouplers and black and white patterns on wheels.

{% include figure.html image="/pics/RobotMapujacy/test.jpg"  width="600" height="800" caption="Prototype of electronic components connections" %}

On this robot I implemented a PID controller for driving up to the point:

{% include button.html text="PID" icon="github" link="https://github.com/macstepien/MappingRobotPID" color="#0366d6" %}

{% include googleDrivePlayer.html id="1SI5PMQt-zXZ0vf6xvoXPK_p1-t72E7ty/preview" %}

To create a map of the environment first it was necessary to remove floor points from data from Kinect. I tested two approaches - fitting the plane using the RANSAC algorithm and the UV-disparity method (which required lower computational load - instead of plane line was fitted).

{% include figure.html image="/pics/RobotMapujacy/side.jpg" width="600" height="800" %}

Then obstacle points were projected onto grid map, robot position was calculated using wheel encoders.
{% include figure.html image="/pics/RobotMapujacy/map.jpg" width="500" height="800" %}

{% include button.html text="Kinect mapping" icon="github" link="https://github.com/macstepien/MappingRobotKinect" color="#0366d6" %}

{% include googleDrivePlayer.html id="11cBjTDrB67s6sojRpdoVRc-anlgDSwj5/preview" %}

{% include button.html text="Stereo vision mapping" icon="github" link="https://github.com/macstepien/MappingRobotStereovision" color="#0366d6" %}

I also tried to run a SLAM algorithm to correct errors from encoders but wasn't able to run any available implementation on Windows (which I was using at that time).

{% include figure.html image="/pics/RobotMapujacy/pcb.jpg" width="600" height="800" %}

To control the robot I used an Atmega88Pa microcontroller, which was connected using a USB-UART converter to the computer. It controlled motors (continuous rotation servos) and measured optocouplers voltage to detect wheel rotations. Additionally, I used an infrared proximity sensor. As a power source, I used a 6V gel battery, which voltage was measured and monitored by MCU. A 12V Step-Up voltage converter was used to power Kinect. 

{% include button.html text="Mapping robot controller" icon="github" link="https://github.com/macstepien/MappingRobotControler" color="#0366d6" %}
