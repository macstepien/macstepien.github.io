---
layout: post
title: Elektroniczna kostka
categories:
- Elektronika
excerpt: |
 Projekt elektronicznej kostki wykonany na podstawie przykładu w książce "Elektronika. Od praktyki do teorii"
  
 <img loading="lazy" decoding="async" width="200" height="200" src="/pics/4_electronic_dice/miniszostka.jpg">
---

Projekt elektronicznej kostki wykonany na podstawie przykładu w książce "Elektronika. Od praktyki do teorii"

{% include figure.html image="/pics/4_electronic_dice/szostka.webp" width="600" height="800" %}

W układzie wykorzystany jest układ czasowy 555 do generacji impulsów, które następnie zliczane są w szóstkach. Odpowiednie liczby są wyświetlane na diodach. Proces zatrzymywany jest przez wciśnięcie przycisku co powoduje zatrzymanie się na "losowej" wartości. Impulsy są generowany na tyle szybko, że nie da sie wychwycić jaka aktualnie cyfra jest wyświetlana.

Proces wykonania:

{% include figure.html image="/pics/4_electronic_dice/prototyp.webp" width="600" height="800" caption="Prototyp na płytce stykowej" %}

{% include figure.html image="/pics/4_electronic_dice/elementy.webp" width="600" height="800" caption="Płytka uniwersalna wraz z użytymi elementami" %}

{% include figure.html image="/pics/4_electronic_dice/trojka.webp" width="600" height="800" caption="Zmontowana kostka" %}