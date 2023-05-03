---
layout: post
title: Furuta pendulum
categories:
  - Robots
excerpt: |
  <center><img width="600" src="/pics/16_roomac/roomac_manipulation_navigation.gif"></center>
  <br>
---

After graduating I missed a bit all this pendulumsx and control stuff so I decided to build my own. As I wanted to also use it as a desktop toy, I decided to do rotational variant as it is more compact (and a bit more difficult). While waiting for parts to arrive I started playing around with different control approaches, and in this part I will summarize my advantures.

## Classical approach

I will begin with something more classical, as it was taught in my uni courses. So first we derive differential equations that describe dynamics of our system, linearize it around upward position point and based on this design LQR controller. [Here](https://www.hindawi.com/journals/jcse/2011/528341/) you can find a great resource that I used to get equations and linearized system. One slight simplification that I made was assuming torque control of the motor (so I didn't model motor's equations and used torque as a control value). This assumption is also present in the other approaches. 

After getting A and B matrices of the system, it was necessary to choose weights (Q and R). As I plan to use slip ring to allow pendulum to rotate freely, without limits, I put 0.0 weight on the first angle. Then I set the highest weight on second angle, as it is most important. For remaining velocity and control weights I put 1.0 (that was more of playing around, what worked best). Then to get K gains I used control python library (all code is in the `lqr.ipynb`). 

Now to verify controller I implemented differential equations as the simulation node. Controller worked well when stabilizing pendulum, when it was near upward position and responded well to some disturbance torque (tau2 in equations), which is equall to pushing pendulum. But, as this controller was based only on linearization around upward position, it doesn't work in other positions. So to get our pendulum upward from being in the down position, we need something more - that is swing-up. I used approach described in [Swing-up time analysis of pendulum](http://bulletin.pan.pl/(52-3)153.pdf) namely *Energy based swing-up control*. Now our controller has two parts - in initial down position it uses swing-up and once angle is close enough to upward position it switches to LQR.

{% include figure.html image="/pics/17_furuta_pendulum/1_de_simulation_de_controller.gif" width="400" caption="LQR + Swing-up controller simulated using implemented DEs" %}

Well using the same equations to design controller and then validate them may not be the best option. To further verify it, I also created simulation in Gazebo and surprisingly, it also worked there!

{% include figure.html image="/pics/17_furuta_pendulum/2_gazebo_de_controller.gif" width="400" caption="LQR + Swing-up controller simulated using Gazebo" %}


<!-- A: [ [ 0.00000000e+00  0.00000000e+00  1.00000000e+00  0.00000000e+00]
     [ 0.00000000e+00  0.00000000e+00  0.00000000e+00  1.00000000e+00]
     [ 0.00000000e+00  1.71389430e+00 -2.80773642e-03 -4.40857682e-03]
     [ 0.00000000e+00  2.07426310e+01 -1.57449172e-03 -5.33553802e-02] ]

B: [0.0, 0.0, 28.07736417, 15.7449172 ] -->

<!-- K: [-3.117e-15, 19.270, -1.000, 4.352] -->
## Drake

Well derivation of motion equations and linearizing is quite a lot of hustle, maybe there is some way to omit it? Of course there is! Drake toolbox allow you to load model from URDF and based on it, it can design LQR controller automatically. Similarly to previous approach, now it is only necessary to add swing-up and once again we have controller, but now faster! K gains achieved are quite close to previous ones:

| Manual      | Drake |
| ----------- | ----------- |
| K: [-3.117e-15, 19.270, -1.000, 4.352]      | K: [-2.922e-17, 18.931, -0.980, 4.265]       |

<!-- TODO: compare A and B and K -->

<!-- K: [-2.922e-17, 18.931, -0.980, 4.265] -->

{% include figure.html image="/pics/17_furuta_pendulum/3_drake.gif" width="400" caption="Drake LQR" %}

## Control toolbox

So now we have our LQR with swingup, that we created quite efficiently. But you know what is not yet efficient? Movement of the pendulum! We need something better, something optimal. And why not, this time we will use different library. [Control toolbox](https://github.com/ethz-adrl/control-toolbox) got you covered not only in terms of linearity, but also non-linear optimal control. But first, before creating controller we have to import our pendulum. Once again, we won't need hand derived motion equations, we will use model of the pendulum. Unfortunatelly, this time it won't be that straightforward. First it is necessary to convert URDF to `kindsl` and `drdsl` files, then using this files it was necessary to generate code. After finally getting our model to work, we can move on to designing controller.

First I decided to calculate LQR once again, comparing gains, they are again quite close:

| Manual      | Drake | Control Toolbox |
| ----------- | ----------- | ----------- |
| K: [-3.117e-15, 19.270, -1.000, 4.352]      | K: [-2.922e-17, 18.931, -0.980, 4.265]       | K: [-6.869e-15, 19.182, -1.000, 4.356] |

<!-- A: 
      0       0       1       0
      0       0       0       1
      0 1.71443       0       0
      0 20.7497       0       0

B: 
      0
      0
28.0766
15.7445 -->

<!-- K: [-6.869e-15, 19.182, -1.000, 4.356] -->

<!-- TODO MPC description -->
Now we can...

And now look at this motion, it sure is more impressive.

{% include figure.html image="/pics/17_furuta_pendulum/4_mpc.gif" width="400" caption="MPC" %}

## Reinforcement Learning

So now we have our optimal controller, what can we do more? Make RL agent teach itself to do it! It may not be as optimal, but for sure it will be fun! I decided to use Mujoco for simulation and StableBaselines3 for RL algorithms implementation. 

As full control problem, from bottom position, to upward stabilization is quite complex, I decided to first take smaller steps. In result I created 3 environments:
1. Upward stabilization - pendulum is started with angle a little off upward position, and with some small velocity (both values are drawn from uniform distribution). Agent's task is keeping absolute value of pendulum's angle below certain threshold, for every step it receives reward, if angle is greater, then episode is terminated. I was able to solve this problem with PPO algorithm, the only thing I tuned was number of total timesteps.
2. Swing up - this time pendulum every time started in downward position, and agent's task was getting angle below certain threshold (so that pendulum will be near upward position). After getting below threshold episode was terminated. This time as a reward I used quadratic cost function (the same as is used in LQR, but wiht minus) with weights that I used previously in LQR. Once again I was able to solve it with PPO, I only had to increase number of timesteps.
3. Full control problem - pendulum started in downward position, agent had to swingup and then also stabilize pendulum. Basically the only difference from previous environment was that episode didn't terminate after getting to upward position, as a matter of fact it doesn't terminate until it reaches max episode length. Reward function was the same as in previous step. This time solving the problem was as straightforward, I tried different algorithms (A2C, DDPG, PPO, SAC, TD3), mainly tunning number of episodes and network architecture. I was able to achieve satisfactory result only with SAC, with increase size of network (512, 512, 512).

<!-- First crutial thing is that we want approach with continuous action space here we have few options: A2C, DDPG, PPO, SAC, TD3. After some experiments, I was able to achieve working controller with SAC. -->

{% include figure.html image="/pics/17_furuta_pendulum/5_rl.gif" width="400" caption="RL" %}

## Verification

So every approach worked, but every single one used different simulation. To better compare them and verify, it would be best to use single simulator.

{% include video.html id="" title="Comparison of different approaches using Gazebo simulation" %}
{% include video.html id="" title="Comparison of different approaches using simulation based on Differential Equations" %}

In the Gazebo simulation every approach worked, but in RL method difference is visible, controller is much slower in getting to the upward position. Interesting thing is that it got the general idea how to swing it up, and even with differences in the behaviour of pendulum, it was still able to achieve the goal.

In the simulation based on DEs I found problem with MPC method, as it didn't work at all. I tried tunning it's parameters, but still was unsuccessful. 

## Next steps

Now it is time to construct pendulum! I hope that testing 3 different approaches across 5 simulations will result in at least one working solution