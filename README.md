# Chess tactics trainer

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/zatonix/chess-tactics-trainer/graphs/commit-activity)
![Maintainer](https://img.shields.io/badge/maintainer-zatonix-blue)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://GitHub.com/zatonix)
[![made-with-python](https://img.shields.io/badge/Made%20with-Python-1f425f.svg)](https://www.python.org/)
[![PyPI status](https://img.shields.io/pypi/status/ansicolortags.svg)](https://github.com/zatonix/chess-tactics-trainer)
[![GitHub license](https://badgen.net/github/license/zatonix/chess-tactics-trainer)](https://github.com/zatonix/chess-tactics-trainer/blob/main/LICENSE)
[![GitHub contributors](https://badgen.net/github/contributors/zatonix/chess-tactics-trainer)](https://GitHub.com/zatonix/chess-tactics-trainer/graphs/contributors/)
[![GitHub latest commit](https://badgen.net/github/last-commit/zatonix/chess-tactics-trainer)](https://GitHub.com/zatonix/chess-tactics-trainer/commit/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
![Made with love in France](https://madewithlove.now.sh/fr?heart=true)

## Description

This is a chess tactics trainer. It is a software for lichess game analysis and tactics training.

<img src="images/example.png" width="520" height="680" />


## Getting Started

### Dependencies

* Python >= 3.9
* node >= 18
* docker
* docker-compose

### Installing

```bash
cd api/
make init # to build api docker image

cd ../app
npm install # to install app dependencies
```

### How to Backend

```bash
cd api/
make run # to launch api
make test # to launch tests
make lint # to check linter
```

### How to Frontend

```bash
cd app/
npm run dev # to launch app
npm run build # to build app
npm run test # to launch tests
npm run lint # to check linter
```
