# UpLeveled Preflight

A command line tool to check your UpLeveled projects before you submit

<img src="screenshot.png" alt="A command line tool showing various passing tests that have run against a software project" width="390" />

## Install

```bash
yarn global add @upleveled/preflight
```

## Run

```bash
preflight
```

## Install and Run with Docker

Pull and run the image, along with a URL to the GitHub repository that you want to test:

```bash
docker pull ghcr.io/upleveled/preflight
docker run ghcr.io/upleveled/preflight https://github.com/upleveled/preflight-test-project-react-passing
```
