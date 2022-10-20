---
layout: post
title: Mapping robot
categories:
  - Robots
excerpt: |
  Robot that drives around and creates a map of the environment.
   
  <img width="200" height="200" src="/pics/RobotMapujacy/minifront.jpg">
---

Robot that drives around and creates a map of the environment.

{% include figure.html image="/pics/RobotMapujacy/front.jpg" width="600" height="800" %}

This robot is the second, simplified version of the general-purpose robot. Learning from the previous design, I simplified the robot and its only task was to map rooms. Also to make the task successful I replaced the Stereovision with Kinect, as the results from it were not satisfactory. I also added encoders to the wheels, but still I made my own - incremental based on optocouplers. They didn't work perfectly, but still allowed to achieve good results.

{% include figure.html image="/pics/RobotMapujacy/test.jpg"  width="600" height="800" caption="Prototypowanie eletkroniki" %}

Also, as part of this project, I realized a PID controller and set a point which the robot would reach.

{% include button.html text="PID" icon="github" link="https://github.com/macstepien/MappingRobotPID" color="#0366d6" %}

{% include googleDrivePlayer.html id="1SI5PMQt-zXZ0vf6xvoXPK_p1-t72E7ty/preview" %}

Aby stworzyć mapę najpierw podrzebowałem odpowiednio obrobić dane. W danych głębi z Kinecta zawarte były informacje o podłodze oraz obiektach. Musiałem pozbyć się podłogi. Do osiągnięcia tego testowałem 2 metody: dopasowywanie płaszczyzny oparte na RANSACu z OpenCV oraz metodą UV-disparity, która przyspieszała obliczenia - wykrywałem linię zamiast płaszczyzny.

{% include figure.html image="/pics/RobotMapujacy/side.jpg" width="600" height="800" %}

Na tworzoną mapę typu Grid map nakładałem następnie wykryte obiekty. Do wyliczenia przesunięcia robota używałem wyłącznie enkoderów.
{% include figure.html image="/pics/RobotMapujacy/map.jpg" width="500" height="800" %}

{% include button.html text="Mapowanie Kinect" icon="github" link="https://github.com/macstepien/MappingRobotKinect" color="#0366d6" %}

{% include googleDrivePlayer.html id="11cBjTDrB67s6sojRpdoVRc-anlgDSwj5/preview" %}

{% include button.html text="Mapowanie Stereowizja" icon="github" link="https://github.com/macstepien/MappingRobotStereovision" color="#0366d6" %}

Próbowałem także wykorzystać SLAMa, aby zniwelować niedoskonałości enkoderów. Jednak tutaj barierą był system operacyjny - Windows, na którym nie udało mi się uruchomić żadnej implementacji. Było to także zbyt skomplikowane zadanie jak na wiedzę, którą posiadałem, aby stworzyć własną implementację.

{% include figure.html image="/pics/RobotMapujacy/pcb.jpg" width="600" height="800" %}

Do sterowania robotem użyłem mikrokontrolera Atmega88Pa. Komunikował się on z komputerem poprzez interfejs UART, wykorzystałem tutaj przejściówkę na USB. Sterował on silnikami - serwami pracy ciągłej. Także mierzył napięcie z transoptorów, zliczając impulsy poprzez zastowanie odpowiedniego progu. Także dla testu wykorzystałem podczerwony czujnik odległości. Do zasilenia całej konstrukcji użyłem akumulatora żelowego. Poprzez mikrokontroler mierzyłem jego napięcie, sprawdzając czy się rozładował. Musiałem także zastosować przetwornicę Step-Up, aby zasilić Kinecta, który wymaga 12V.

{% include button.html text="Sterownik Robota" icon="github" link="https://github.com/macstepien/MappingRobotControler" color="#0366d6" %}
