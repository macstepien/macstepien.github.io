---
layout: post
title: Furuta pendulum
preview_image: /pics/previews/furuta-pendulum.webp
permalink: /projects/furuta-pendulum
excerpt: |
  I built a rotational inverted pendulum and developed an RL controller.
  <video class="demo-video" width="600" loop muted playsinline controls preload="none" poster="/pics/demos/furuta-pendulum.webp" aria-label="Furuta pendulum controlled by an RL controller"><source src="/pics/demos/furuta-pendulum.mp4" type="video/mp4"></video>
  <br>
date: 2023-04-15
order_number: 2
---

{% include button.html text="Github repository" icon="github" link="https://github.com/macstepien/furuta_pendulum" color="#0366d6" %}
{% include button.html text="Github repository hardware" icon="github" link="https://github.com/macstepien/furuta_pendulum/tree/hardware/hardware" color="#0366d6" %}

{% include video.html id="6VREUts-rxU" title="Deep Reinforcement Learning Controller for a Furuta Pendulum" %}

During this project I constructed a Furuta pendulum device and compered different control strategies: LQR, MPC and DRL.

{% include video.html id="XmboNpksQVI" title="Furuta pendulum (LQR + Swing-up controller)" %}

You can find more information about the simulation part in the blog post [Furuta Pendulum Simulation](/blog/furuta-pendulum-simulation).
