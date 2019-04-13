---
layout: post
title: Robot mapujący
categories:
- Roboty
excerpt: |
 Robot laptopa wożący pokój mapujący.
  
 <img width="200" height="200" src="/pics/RobotMapujacy/minifront.jpg"> 
---

Robot laptopa wożący pokój mapujący.

{% include figure.html image="/pics/RobotMapujacy/front.jpg" width="600" height="800" %}

Ten robot jest drugą, uproszczoną wersją robota uniwersalnego. Wyciągając wnioski z poprzedniej konstrukcji uprościłem robota i jego jedynym zadaniem było mapowanie pomieszczeń. Także aby zadanie się udało zamieniłem Stereowizję na Kinecta, ponieważ rezultaty z niej osiągane nie były zadowalające. Dodałem także enkodery na koła, jednak wciąż zbyt pewny siebie zrobiłem swoje - inkrementalne bazujące na transoptorach. Nie sprawdzały się one idealnie, ale jednak pozwoliły osiągnąć rezultaty.

{% include figure.html image="/pics/RobotMapujacy/test.jpg"  width="600" height="800" caption="Prototypowanie eletkroniki" %}

Także w ramach zabawy z robotem zrealizowałem regulator PID i zadawałem punkt, do którego robot dojeżdżał.

{% include button.html text="PID" icon="github" link="https://github.com/TheDarkPhoenix/MappingRobotPID" color="#0366d6" %}

{% include googleDrivePlayer.html id="1SI5PMQt-zXZ0vf6xvoXPK_p1-t72E7ty/preview" %}

Aby stworzyć mapę najpierw podrzebowałem odpowiednio obrobić dane. W danych głębi z Kinecta zawarte były informacje o podłodze oraz obiektach. Musiałem pozbyć się podłogi. Do osiągnięcia tego testowałem 2 metody: dopasowywanie płaszczyzny oparte na RANSACu z OpenCV oraz metodą UV-disparity, która przyspieszała obliczenia - wykrywałem linię zamiast płaszczyzny. 

{% include figure.html image="/pics/RobotMapujacy/side.jpg" width="600" height="800" %}

Na tworzoną mapę typu Grid map nakładałem następnie wykryte obiekty. Do wyliczenia przesunięcia robota używałem wyłącznie enkoderów. 
{% include figure.html image="/pics/RobotMapujacy/map.jpg" width="500" height="800" %}

{% include button.html text="Mapowanie Kinect" icon="github" link="https://github.com/TheDarkPhoenix/MappingRobotKinect" color="#0366d6" %}

{% include googleDrivePlayer.html id="11cBjTDrB67s6sojRpdoVRc-anlgDSwj5/preview" %}

{% include button.html text="Mapowanie Stereowizja" icon="github" link="https://github.com/TheDarkPhoenix/MappingRobotStereovision" color="#0366d6" %}

Próbowałem także wykorzystać SLAMa, aby zniwelować niedoskonałości enkoderów. Jednak tutaj barierą był system operacyjny - Windows, na którym nie udało mi się uruchomić żadnej implementacji. Było to także zbyt skomplikowane zadanie jak na wiedzę, którą posiadałem, aby stworzyć własną implementację.

{% include figure.html image="/pics/RobotMapujacy/pcb.jpg" width="600" height="800" %}

Do sterowania robotem użyłem mikrokontrolera Atmega88Pa. Komunikował się on z komputerem poprzez interfejs UART, wykorzystałem tutaj przejściówkę na USB. Sterował on silnikami - serwami pracy ciągłej. Także mierzył napięcie z transoptorów, zliczając impulsy poprzez zastowanie odpowiedniego progu. Także dla testu wykorzystałem podczerwony czujnik odległości. Do zasilenia całej konstrukcji użyłem akumulatora żelowego. Poprzez mikrokontroler mierzyłem jego napięcie, sprawdzając czy się rozładował. Musiałem także zastosować przetwornicę Step-Up, aby zasilić Kinecta, który wymaga 12V.

{% include button.html text="Sterownik Robota" icon="github" link="https://github.com/TheDarkPhoenix/MappingRobotControler" color="#0366d6" %}
