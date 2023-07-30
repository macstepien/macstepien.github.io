---
layout: post
title: Mapping robot
permalink: /projects/mapping-robot
excerpt: |
  Mobile robot with Kinect 360 and place for laptop, used for testing various mapping and navigation techniques 
  <center><img width="600" src="/pics/7_mapping_robot/mapping_robot_compressed.jpg"></center>
  <br>
date: 2015-08-25
order_number: 10
---

Robot that drives around and creates a map of the environment.

{% include video.html id="iwo5ig7E9Z4" title="Mapping robot mapping demo" %}
{% include figure.html image="/pics/7_mapping_robot/front.jpg" width="600" height="800" %}

This robot was a simplified version of a previously created general-purpose robot. In this construction I simplified requirements and focused only on mapping and navigation. Instead of stereo vision I decided to use a Kinect sensor because results achieved previously with only cameras weren't satisfactory. I also added custom-made wheel encoders based on optocouplers and black and white patterns on wheels.

{% include figure.html image="/pics/7_mapping_robot/test.jpg"  width="600" height="800" caption="Prototype of electronic components connections" %}

On this robot I implemented a PID controller for driving up to the point:

{% include button.html text="PID Github repository" icon="github" link="https://github.com/macstepien/MappingRobotPID" color="#0366d6" %}

{% include video.html id="W4FkBKJvG38" title="Mapping robot PID demo" %}

To create a map of the environment first it was necessary to remove floor points from data from Kinect. I tested two approaches - fitting the plane using the RANSAC algorithm and the UV-disparity method (which required lower computational load - instead of plane line was fitted).

{% include figure.html image="/pics/7_mapping_robot/side.jpg" width="600" height="800" %}

Then obstacle points were projected onto grid map, robot position was calculated using wheel encoders.
{% include figure.html image="/pics/7_mapping_robot/map.jpg" width="500" height="800" %}

{% include button.html text="Kinect Mapping Github repository" icon="github" link="https://github.com/macstepien/MappingRobotKinect" color="#0366d6" %}

{% include button.html text="Stereo Vision Mapping Github repository" icon="github" link="https://github.com/macstepien/MappingRobotStereovision" color="#0366d6" %}

I also tried to run a SLAM algorithm to correct errors from encoders but wasn't able to run any available implementation on Windows (which I was using at that time).

{% include figure.html image="/pics/7_mapping_robot/pcb.jpg" width="600" height="800" %}

To control the robot I used an Atmega88Pa microcontroller, which was connected using a USB-UART converter to the computer. It controlled motors (continuous rotation servos) and measured optocouplers voltage to detect wheel rotations. Additionally, I used an infrared proximity sensor. As a power source, I used a 6V gel battery, voltage on battery was measured and monitored by MCU. A 12V Step-Up voltage converter was used to power Kinect. 

{% include button.html text="Mapping Robot Controller Github repository" icon="github" link="https://github.com/macstepien/MappingRobotControler" color="#0366d6" %}
