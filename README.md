# Starter kit for [Alembic](https://alembic.darn.es/)

This is a very simple starting point if you wish to use Alembic [as a Jekyll theme gem](https://alembic.darn.es/#as-a-jekyll-theme) or as a [GitHub Pages remote theme](https://github.com/daviddarnes/alembic-kit/tree/remote-theme) (see `remote-theme` branch).

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/daviddarnes/alembic-kit)

or

**[Download the GitHub Pages kit](https://github.com/daviddarnes/alembic-kit/archive/remote-theme.zip)**

## Runing
Use devcontainer (all gems should be automatically installed on the first run). Then use:
```
bundle exec jekyll serve
```
to start.
To have access on other devices on the network it necessary to start devcontainer in net host mode and then:
```
bundle exec jekyll serve --host 0.0.0.0
```
It is also possible to change port:
```
bundle exec jekyll serve --host 0.0.0.0 --port 5000
```