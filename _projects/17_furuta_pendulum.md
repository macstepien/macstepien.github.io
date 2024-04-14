---
layout: post
title: Furuta pendulum
permalink: /projects/furuta-pendulum
excerpt: |
  Rotational inverted pendulum I'm building as a testbench for different control algorithms
  <center><img width="600" src="/pics/17_furuta_pendulum/fp_mpc_ignition.gif"></center>
  <br>
date: 2023-04-15
order_number: 2
---

{% include button.html text="Github repository" icon="github" link="https://github.com/macstepien/furuta_pendulum" color="#0366d6" %}

To refresh my knowledge about dynamical systems and to try out different control approaches in practice I decided to build Furuta Pendulum. I started the project with simulation, in this part I created LQR, MPC and RL controllers and tested them on simulation (Gazebo), about this part of the project you can find out more in my blog post [Furuta Pendulum Simulation](/blog/furuta-pendulum-simulation).

Currently I'm transitioning all the code to the pendulum that I built. This is a work in progress, I plan to update this series so stay tuned.
Meanwhile, here you can see the first successful run (LQR + Swing-up) and a more recent update with the Deep Reinforcement Learning controller:

{% include video.html id="XmboNpksQVI" title="Furuta pendulum (LQR + Swing-up controller)" %}
{% include video.html id="6VREUts-rxU" title="Deep Reinforcement Learning Controller for a Furuta Pendulum" %}