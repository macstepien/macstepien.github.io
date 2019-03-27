---
layout: post
title: Robot uniwersalny
categories:
- Roboty
excerpt: |
 Miał robić kawę...
  
 <img width="150" height="150" src="/pics/RobotUniwersalny/robot.jpg"> 
---

Miał robić kawę...

Tutaj wyobraźnia mnie poniosła i chciałem zrobić robota uniwersalnego zdolnego do wykonywania różnych czynności np. przygotować napoje, "chodzić" do sklepu. Oczywiście w zamyśle miała być to pierwsza wersja, na której chciałem zbadać moje możliwości. Podnosić miał jedynie atrapy, a poruszać się jedynie po domu.

{% include figure.html image="/pics/RobotUniwersalny/robot.jpg" width="300" height="800" %}

Piękna była to konstrukcja i bardzo skomplikowana. Do obsługi wszystkich kończyn planowałem zastosować 11 serw. Znacznie przekroczyło to liczbę kanałów PWM w mikrokontrolerze Atmega88Pa. Dlatego właśnie zmuszony byłem zastosować programowe generowanie PWM, które znacznie bardziej obciąża procesor. Z tego właśnie powodu zmuszony byłem użyć drugi mikrokontroler odpowiedzialny za komunikację z komputerem, sterowaniem silnikami oraz zadawanie poprzez SPI położeń serw do drugiego mikrokontrolera. Wiele rzeczy mogło się zepsuć po drodze, dlatego gdy ostatecznie nie mogłem zapanować nad serwami nie wiedziałem co się dzieje. Dopiero po dłuższym czasie doszedłem do wniosku, że musiałem mieć za słabe źródło zasilania, coś czego wcześniej nawet nie brałem pod uwagę. Jednak pomimo niedziałających serw nie porzuciłem tej konstrukcji. Wciąż miałem działające silniki, którymi mogłem sterować z poziomu komputera. Zająłem się w takim razie niezbędnym elementem takiego robota - wykrywaniem przeszkód oraz mapowaniem. W tym celu chciałem zasotosować parę stereowizyjną. Po wielu przygodach udało mi się wreszcie doprowadzić stereowizję do poziomu zadowalającego. Wciąż jednak występowało dużo szumów - szczególnie na podłodze. Nic dziwnego, podłoga, ściana, to mało szczegółów i ciężko jest uzyskać pewny obraz głębi. Udało się zatem mniej więcej wykrywać przeszkody, jednak gdy doszedł do tego ruch to już kompletnie co innego. Zastosowane kamerki internetowe zwracały poruszone obrazy co jeszcze pogarszało wynik wykrywania. Do tego nie zastosowałem enkoderów, ponieważ planowałem wykrywać punkty szczególne i póżniej na podstawie ich oraz uzyskanej mapy głębokości obliczać przesunięcie. Po takich jednak rozczarowujących efektach stereowizji nie próbowałem już tego rozwiązania.

{% include figure.html image="/pics/RobotUniwersalny/parts.jpg" width="600" height="800" %}

Pomimo, że nie spełnił moich oczekiwań to wyszła z niego ciekawa konstrukcja. I mój początek przygody ze stereowizją i mapowaniem. 

W tej konstrukcji wzorowałem się na robocie PR2. Domyślną wersję tej konstrukcji chciałem wykonać 2 razy większą. Zastosowanie tutaj zgięcia w połowie miało na celu zwiększyć zakres chwytania - możliwość schylenia się. Jednak głównym celem była możliwość przetransformowania się w robota jeżdżącego, co umowżliwiłoby wspinanie się po schodach oraz większych przeszkodach. Domyślnie w napędzie chciałem zastosować gąsienice. 

