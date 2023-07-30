---
layout: post
title: 3D Viewer
permalink: /projects/3d_viewer
excerpt: |
  Application for the perspective visualization of point clouds in 3D
  <center><img width="600" src="/pics/6_3dviewer/viewer1_cropped.png"></center>
  <br>
date: 2015-04-09
order_number: 11
---

Application for the perspective visualization of point clouds in 3D.

{% include figure.html image="/pics/6_3dviewer/viewer1.png" width="600" height="800" %}

Point clouds (positions (X, Y, Z), color (R, G, B)) is read from a txt file and then projected on the camera plane in a simulated environment. The camera can be moved around. Point clouds that I visualized were calculated using the stereo vision camera that I constructed. Additionally, it is possible to display simple geometric shapes.

{% include figure.html image="/pics/6_3dviewer/viewer2.png" width="600" height="800" %}

{% include button.html text="3DViewer Github repository" icon="github" link="https://github.com/macstepien/3DViewer" color="#0366d6" %}
