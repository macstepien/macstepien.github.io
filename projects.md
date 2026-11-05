---
layout: page
title:
permalink: /projects/
---

{% assign ordered_projects = site.projects | sort: "order_number" %}
{% for project in ordered_projects %}
  <h2><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h2>
  {{ project.excerpt }}
{% endfor %}
