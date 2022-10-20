---
layout: post
title: Electronic dice
categories:
  - Elektronika
excerpt: |
  Electronic dice based on the example from the book "Electronics. From practice to theory"
   
  <img width="200" height="200" src="/pics/elektronicznaKostka/miniszostka.jpg">
---

Electronic dice based on the example from the book "Electronics. From practice to theory"

{% include figure.html image="/pics/elektronicznaKostka/szostka.jpg" width="600" height="800" %}

The circuit uses a 555 timer circuit to generate pulses, which are then counted in sixes. The corresponding numbers are displayed on the LEDs. The process is stopped by pressing a button, which stops at a "random" value. The pulses are generated so fast that it is impossible to catch what digit is currently displayed.

Construction steps:

{% include figure.html image="/pics/elektronicznaKostka/prototyp.jpg" width="600" height="800" caption="Prototype on a breadboard" %}

{% include figure.html image="/pics/elektronicznaKostka/elementy.jpg" width="600" height="800" caption="Universal board with the components used" %}

{% include figure.html image="/pics/elektronicznaKostka/trojka.jpg" width="600" height="800" caption="Finished dice" %}
