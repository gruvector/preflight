# UpLeveled Preflight

A command line tool to check your UpLeveled projects before you submit

<img src="screenshot.png" alt="A command line tool showing various passing tests that have run against a software project" width="390" />

## Install

```bash
pnpm add --global @upleveled/preflight
```

## Run

```bash
preflight
```

## Install and Run with Docker

```bash
# Pull the image
docker pull ghcr.io/upleveled/preflight

# Run the image against a GitHub repo URL
docker run ghcr.io/upleveled/preflight https://github.com/upleveled/preflight-test-project-react-passing

# Or run the image against a specific branch in a GitHub repo URL
docker run ghcr.io/upleveled/preflight https://github.com/upleveled/preflight-test-project-react-passing fix-tests
```

## Run Preflight with GitHub Actions workflow

To run Preflight on every commit in your repository, you can use the following GitHub Actions workflow:

`.github/workflows/preflight.yml`

```yaml
name: Preflight
on: [push]

jobs:
  preflight:
    name: Preflight
    runs-on: ubuntu-latest

    steps:
      - name: Pull latest Preflight image
        run: docker pull ghcr.io/upleveled/preflight
      - name: Run Preflight
        run: docker run ghcr.io/upleveled/preflight https://github.com/${{ github.repository}} ${{ github.ref_name }}
```
