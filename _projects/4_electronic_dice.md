---
layout: post
title: Electronic dice
permalink: /projects/electronic_dice
excerpt: |
  LED dice based on 555 timer
  <center><img width="600" src="/pics/4_electronic_dice/electronic_dice_compressed.jpg"></center>
  <br>
# date: 2014-03-22
---

Electronic dice based on the example from the book "Electronics. From practice to theory"

{% include figure.html image="/pics/4_electronic_dice/szostka.jpg" width="600" height="800" %}

The circuit uses a 555 timer to generate pulses, which are then counted in sixes. The corresponding numbers are displayed on the LEDs. The process is stopped by pressing a button, as numbers are changing very fast, it isn't possible to choose a number, so it can be treated as "random".

Construction steps:

{% include figure.html image="/pics/4_electronic_dice/prototyp.jpg" width="600" height="800" caption="Prototype on a breadboard" %}

{% include figure.html image="/pics/4_electronic_dice/elementy.jpg" width="600" height="800" caption="Universal board with the components used" %}

{% include figure.html image="/pics/4_electronic_dice/trojka.jpg" width="600" height="800" caption="Finished dice" %}
