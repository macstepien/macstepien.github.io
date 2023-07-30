---
layout: page
title:
---

{% assign ordered_projects = site.projects | sort:"order_number" %}
{% for project in ordered_projects %}
  <h2><a href="{{ project.url }}">{{ project.title }}</a></h2>
  <p>{{ project.excerpt }}</p>
{% endfor %}