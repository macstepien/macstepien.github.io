---
layout: post
title: General-purpose robot
categories:
  - Robots
excerpt: |
  <img width="150" height="150" src="/pics/5_general_purpose_robot/minirobot.jpg">
---

It was supposed to make coffee...

This is where my imagination got carried away and I wanted to make a multipurpose robot capable of performing various activities, e.g. prepare drinks, do the groceries. Of course, this was supposed to be the first version, on which I wanted to test my capabilities. It was to lift only dummies, and move only around the house.

{% include figure.html image="/pics/5_general_purpose_robot/robot.jpg" width="300" height="800" %}

It was a beautiful design and very complicated. I planned to use 11 servos to operate all the limbs. This greatly exceeded the number of PWM channels in the Atmega88Pa microcontroller. That is why I was forced to use software PWM generation, which puts much more load on the processor. It was for this reason that I was forced to use a second microcontroller responsible for communicating with the computer, controlling the motors, and setting servo positions to the second microcontroller via SPI. A lot of things could have gone wrong along the way, so when I finally couldn't control the servos I didn't know what was going on. Only after a long time did I come to the conclusion that I must have had a power supply that was too weak, something I hadn't even considered before. However, despite the non-functioning servos, I did not abandon the design. I still had working motors that I could control from the computer. Then I took care of an essential element of such a robot - obstacle detection and mapping. For this purpose, I wanted to use stereo vision pair. After many experiments, I finally managed to bring the stereo vision to a satisfactory level. However, there was still a lot of noise - especially on the floor. Not surprisingly, the floor, the wall, is not much detail and it's hard to get a reliable depth image. So it was more or less successful in detecting obstacles, but when it came to motion it was a completely different matter. The webcams used returned moving images which made the detection result even worse. I did not use encoders, because I planned to detect landmarks and later calculate the displacement based on them and the resulting depth map. However, after such disappointing stereo vision results I did not try this solution anymore.

{% include figure.html image="/pics/5_general_purpose_robot/plytka.jpg" width="600" height="800" %}

Despite the fact that it did not meet my expectations, it was an interesting construction. And my introduction to stereo vision and SLAM.

PR2 was my inspiration for this robot. In the final version of this robot I wanted to make it 2 times larger. The use of a rotational joint in the waist was to increase the gripping range - the ability to bend down. However, the main goal was to be able to transform, which would enable it to climb stairs and larger obstacles. By default, I wanted to use tracks.

{% include figure.html image="/pics/5_general_purpose_robot/parts.jpg" width="600" height="800" %}
