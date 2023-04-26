---
layout: post
title: Furuta pendulum
categories:
  - Robots
excerpt: |
  Affordable general-purpose personal robot capable of autonomously fetching objects
  <center><img width="600" src="/pics/16_roomac/roomac_manipulation_navigation.gif"></center>
  <br>
---

After graduating I missed a bit all this pendulums and control stuff so I decided to build my own. As I originaly inteded to make it more as a desktop toy, I decided to do rotational variant as it is more compact (and a bit more difficult). While waiting for parts to arrive I started playing around with different control approaches, and in this part I will summarize my advantures.

## Classical approach

I will begin with something more classical, as it was taught in my uni courses. So first we derive differential equations that describe dynamics of our system, linearize it around upward position point and based on this design LQR controller. [Here](https://www.hindawi.com/journals/jcse/2011/528341/) you can find a great resource that I used to get equations and linearized system. One slight simplification that I made was assuming torque control of the motor (so I didn't model motor's equations and used torque as a control value). This assumption is also present in the other approaches. After getting A and B matrices of the system, it was necessary to choose some weights (Q and R). As I plan to use slip ring to allow pendulum to rotate freely, without limits, I put 0.0 weight on the first angle. Then I set the highest weight on second angle, as it is most imprtant. For remaining velocity weights I used 1.0 and input value also to 1.0 (that was more of playing around, what worked best). Then to get K gains I used control python library (all code is in the `lqr.ipynb`). Now to verify controller I implemented differential equations in the simulation node. Controller worked well when stabilizing pendulum, when it was near upward position and responded well to some disturbance torque (tau2 in equations), which is equall to pushing pendulum. But, as this controller was based only on linearization around upward position, it doesn't work in other positions. So to get our pendulum upward from being in the down position, we need something more - that is swingup. I used approach described in [Swing-up time analysis of pendulum](http://bulletin.pan.pl/(52-3)153.pdf) namely *Energy based swing-up control*. Now our controller has to parts - in initial down position it uses swingup and once angle is close enough to upward position it switches to LQR.

Well using the same equations to design controller and then validate them may not be the best option. To further verify it, I also created simulation in Ignition and surprisingly, it also worked there!

## Drake

Well derivation of motion equations and linearizing is quite a lot of hustle, maybe there is some way to omit it? Of course there is! Drake toolbox allow you to load model from URDF and based on it, it can design LQR controller automatically. Similarly to previous approach, now it is only necessary to add swingup and once again we have controller, but now faster!

<!-- TODO: compare A and B and K -->

## Control toolbox

So now we have our LQR with swingup, and we can create quite efficiently. But you know what is not yet efficient? Movement of the pendulum! We need something better, something optimal. And why not, this time we will use different library. [Control toolbox](https://github.com/ethz-adrl/control-toolbox) got you covered not only in terms of linearity, but also non-linear optimal control. But first, before creating controller we have to import our pendulum. Once again, we won't need hand derived motion equations, we will use model of the pendulum. Unfortunatelly, this time it won't be that straightforward. First it is necessary to convert URDF to kindsl and drdsl files. I also had to edit them a bit manually. Then using this files it was necessary to generate code. After finally getting our model to work, we can move on to designing controller.
<!-- TODO -->
And now look at this motion, it sure is more impressive.

## Deep Reinforcement Learning

So now we have our optimal controller, what can we do more? Make RL agent teach itself to do it! It may not be as optimal, but for sure it will be fun! I decided to use Mujoco for simulation and Stablebaselines3 for RL algorithms implementation. First crutial thing is that we want approach with continuous action space here we have few options: A2C, DDPG, PPO, SAC, TD3. After some experiments, I was able to achieve working controller with SAC.

## Verification

So every approach worked, but every single one used different simulation. To better compare them and verify, it would be best to use single simulator.