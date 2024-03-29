---
layout: post
title: Roomac
permalink: /robots/2022/10/20/roomac/
excerpt: |
  Affordable general-purpose personal robot capable of autonomously fetching objects
  <center><img width="600" src="/pics/16_roomac/roomac_manipulation_navigation.gif"></center>
  <br>
date: 2022-10-20
order_number: 1
---
{% include button.html text="Github repository" icon="github" link="https://github.com/macorobots/roomac_ros" color="#0366d6" %}

Roomac is a low-cost autonomous general-purpose robot that consists of a differential drive mobile base and a 5-DoF manipulator with a gripper. The costs of the whole construction summed up to around 550$ and using this platform I was able to create a proof-of-concept application - fetching a bottle to the user. Below you can find a short summary of this project, in more detail it was described in my [master's thesis](https://raw.githubusercontent.com/macstepien/macstepien.github.io/master/files/masters_thesis_maciej_stepien.pdf).


{% include video.html id="toHzFQhAP44" title="Roomac autonomously fetching bottle demo" %}
<!-- todo type of encoders and imu -->
The robot was designed in Fusion 360, most of the construction was 3D printed. The base consists of DC drill motors, encoders, IMU and STM32BluePill MCU. In the manipulator there are 6 servos: 3 XYZrobot A1-16 and 3 cheaper TowerPro (MG996R and 2xSG-92R) which are controlled by the second STM32BluePill. To detect obstacles and create a map of the environment I used Kinect (the one from Xbox360). The second Kinect was mounted above the table and it is used for the manipulation (robot’s position is detected using ARTags). Navigation computations are run on the laptop placed in the base of the robot.

{% include figure.html image="/pics/16_roomac/frame_design.png" width="400" caption="Robot without panels in Fusion 360" %}

The whole software stack is based on ROS Melodic, system can be divided into two main components: autonomous navigation and manipulation. 

One part of the navigation system is SLAM, for which I used a visual solution ([RTABMap](http://introlab.github.io/rtabmap/)). It is graph-based and uses a bag-of-words approach for detecting loop closures (features are extracted using the SURF algorithm). Based on RGBD data from Kinect dense map of the environment is constructed, which, after conversion to a 2D grid map, is later used in navigation. Odometry, in form of fused information from wheel encoders and orientation from IMU (using EKF implementation from [robot localization](http://docs.ros.org/en/noetic/api/robot_localization/html/index.html) package), is also provided to SLAM algorithm. After initial mapping, a map is saved and later RTABMap works in localization mode and only tries to relocalize the robot, without updating the map.

{% include figure.html image="/pics/16_roomac/map.png" width="800" caption="3D map of the environment" %}

To allow the robot to reach goals autonomously the navigation system uses [move base](http://wiki.ros.org/move_base), which divides the problem into global planning (searching for optimal path using Dijkstra's algorithm) and execution of the global plan (which is called local planning). Local planner ([TEB](http://wiki.ros.org/teb_local_planner)) takes into account the model of the robot (limits on accelerations and velocities) and simplified dimensions to calculate collision free plan and sends velocity commands to the base of the robot. Smooth control of the base was especially challenging due to the cheap drill motors used, but I was able to achieve satisfactory performance.

{% include figure.html image="/pics/16_roomac/costmaps.png" width="800" caption="Costmaps, global and local plan" %}

In the manipulation task first it is necessary to detect the position of the robot in respect to Kinect mounted above the table (using [ARTrackAlvar](http://wiki.ros.org/ar_track_alvar)). Kinect provides information about the scene - obstacles and position of the object (which is detected using point cloud information). To plan the collision-free trajectory of the manipulator I used [MoveIt](https://moveit.ros.org/) with [BioIKKinematics](https://github.com/TAMS-Group/bio_ik.git) (robot’s arm has 5DoF and only with BioIK I was able to achieve desired positions). The calculated plan is then executed by the controller that sends appropriate commands to servos.

Apart from construction I also created a simulation of the robot in the Gazebo. There is a docker image with simulation, so executing the demo is really easy (basically you only need to copy and paste two commands). For further details please refer to the instruction in the README on Github.

{% include figure.html image="/pics/16_roomac/roomac_simulation.gif" width="400" caption="Simulation in Gazebo" %}

{% include button.html text="Dockerhub repository" link="https://hub.docker.com/r/macorobots/roomac" color="#03befc" %}


<!-- Featured:
https://discourse.ros.org/t/ros-news-for-the-week-of-january-16th-2023/29344
https://discourse.ros.org/t/roomac-general-purpose-personal-robot-construction-fetch-a-bottle-demo-application/29272/5
https://www.weeklyrobotics.com/weekly-robotics-232
https://spectrum.ieee.org/video-friday-acromonk -->