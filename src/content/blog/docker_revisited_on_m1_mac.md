---
title: "Docker Revisited on M1 Mac"
pubDatetime: 2023-12-11T15:22:00Z
categories:
  - "tech"
tags:
  - "m1-mac"
  - "docker"
  - "containers"
ogImage: "/assets/docker_revisited_on_m1_mac_cover.png"
description: ""
---

## Background

As a mac user, I remember when switching from my old 2015 intel based MBP to my 2020 M1 based macbook air. For the most part, the transition from x86 based intel to arm based apple silicon was easy, however there was a bit of a pain in the Docker transition.

At the time, I figured out the problem, though unfortunetely I forgot about it, and the solution I had setup. Basically on the M1 mac, the more safe bet when using **docker** is to build to an AMD64 architecture rather than the native ARM64 bit architecture. You can do that by using build with buildx. So that I always did it, I added some code into my .zshrc file. It's a file that's run when starting zsh, the shell that replaced bash as the default osx shell a [few versions ago](https://www.theverge.com/2019/6/4/18651872/apple-macos-catalina-zsh-bash-shell-replacement-features).

The snipet was:

```
# useful only for Mac OS Silicon M1
# still works with other platforms, but no changes

docker() {
  if [[`uname -m` == "arm64"]] && [["$1" == "run" || "$1" == "build"]]; then
    /usr/local/bin/docker "$1" --platform linux/amd64 "${@:2}"
  else
    /usr/local/bin/docker "$@"
  fi
}
```

I even added comments to remind myself what was happening, if I ever bothered to look in the zshrc profile again :p.

Basically, whenever i call **docker** from the command line, the script checks to see if it's being run on Apple silicon, if so I call **docker**, pass the first argument, add in an explicit platform definition, and use the next part original parameters. If it's being run on a non-apple silicon based mac, I simply call **docker** normally with all the original arguments.

I had forgotten about this, and recently have been working with various amd64 and arm64 images. I was getting funky behavior due to that alias. I even went through basic **docker** docs. Now I've decided to make myself this quick post, partly to remind myself, to also investigate the current state of arm64 support, and last to serve as a quick cheat sheet for Docker.

## Linux Container History

Thanks to an explanation from my friend Ben years back, I remembered that Docker leverages a process in Linux which sandboxes environments. Remember that Linux was based as a server with multiple users, groups, permissions, etc.

To do a proper explanation: Back in the 70's when mainframe computers were the norm, and users had basic hardware, think monitor/keyboard thin clients, connected to a shared machine. In this environment, processes from a single user, needed to be isolated from those of another user.

Over the years, more tools were built to support this user/process isolation. In 1979 a tool, [chroot](https://man7.org/linux/man-pages/man2/chroot.2.html) enabled changing the root directory of a process, along with children, to a new filestystem location. Later, in 2000, FreeBSD (a unix-like distro) introduced [jails](https://docs.freebsd.org/en/books/handbook/jails/) with more advanced support for OS-System-Level virtualization, allowing for explicit network interface and IP address isolation. A year later [Linux-VServer](http://linux-vserver.org/Welcome_to_Linux-VServer.org) was defining a similar partition system for file system, network addresses, and memory. In 2005 the [OpenVZ](https://openvz.org) was released for operating system level virtualization.

This developments lead up to [Linux Containers (LXC)](https://linuxcontainers.org/), the first implementation of a container manager. It was created and integrated into every linux distro by 2008. It leveraged [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html) and was based on open source contributions from Google.

![Linux Container Architecture](/assets/docker_revisited_on_m1_mac_Linux-Container-Architecture-1.jpg)

## Stage is Set for Docker

While LXC handled all the complicated parts at the userspace level, it was still not easy to use. To address that and promote adoption, Solomon Kykes, during his work with dotCloud, a Platform-as-a-Service (PaaS), develped Docker. In 2013 it was released as an open source project.

Initially it leveraged LXC as it's default environment, however it later developed its own, called [libcontainer](https://github.com/opencontainers/runc/tree/main/libcontainer). It's written in [Go](https://go.dev/), opensource, and is still actively updated.

![Docker](/assets/docker_revisited_on_m1_mac_Docker-Execution-Environment.jpg)

Docker is optimized for deployment of applications, and provided a simple format for bunding apps and their dependencies into easily portable containers.

It also leverages images, and promotes layers of images. This allows for the reuse of parent images, to create more specialized ones. It also adds versioning and allows "diffs" between versions.

The afformentioned features, plus a public registry of images, [Docker Hub](https://hub.docker.com/), promots community adoption. Other tools have been built for it, or integrated with it, for example: [Chef](https://www.chef.io/) and [Puppet](https://www.puppet.com/) for config management, integration with [Jenkins](https://www.jenkins.io/) and [Travis](https://www.travis-ci.com/) for CI, and [Kubernetes](https://kubernetes.io/) for container orchistration.

## Docker CLI Cheat Sheet

Here the most common commands I use.

### Running Containers

```
# Start a new image
  docker run [IMAGE]

# with assigned name
  docker run --name [NAME] [IMAGE]

# with port assignment
  docker run -p [HOST_PORT:CONTAINER_PORT] [IMAGE]

# with all ports assigned
  docker run -P [IMAGE]

# start in background (--detach)
  docker run -d [IMAGE]

# with assinged hostname
  docker run --hostname [HOST_NAME] [IMAGE]

# with mapped local directory
  docker run -v [HOST_DIR]:[TARGET_DIR] [IMAGE]

```

### Managing Containers

```
# list running containers
  docker ps

# list all containers
  docker ps -a

# delete stopped container
  docker rm [CONTAINER_NAME]

# stop and delete container
  docker rm -f [CONTAINER_NAME]

# delete stopped containers
  docker container prune

# start container
  docker start [CONTAINER_NAME]

# stop container
  docker stop [CONTAINER_NAME]

# copy file to container
  docker cp [SOURCE] [CONTAINER_NAME]:[TARGET]

# connect to container and run shell
  docker exec -it [container] [bash|sh|zsh]
```

### Info & Stats

```
# Show logs of running container
  docker logs [CONTAINER_NAME]

# Show stats of running containers
  docker stats

# show all modified files in container
  docker diff [CONTAINER_NAME]
```

### Update to Clear up Similar Commands

Recently I looked at Docker again and noticed two sets of commands that seemingly had the same capabilities, so I was confused why have both.

#### COPY vs ADD

Both have the ability to copy local files to the Docker container, however the ADD command adds the capability to 1) copy from a network source, 2) unpack/extract archives/compressed files.

I was surprise to learn that ADD came first, and COPY was added later. Infact, unless you specifically use the uncompress functionality, it's recommended to use COPY. Even when you need remote file access, it's recommended to use RUN with wget or curl in the docker container to download remote files.

From my research, it seems that ADD can lead to unpredictable behavior, and is not recommended unless you need to copy a compressed file.

#### ENTRYPOINT vs CMD

Basically use CMD for default behavior, which can be overridden if you pass arguments when running the container from the CLI.
For example, suppose you have a container with a python scripts that takes an argument and prints it.

```docker
FROM python:3.8
COPY . /app
WORKDIR /app
CMD ["python", "script.py", "Hello, Docker!"]
```

If you run it with `docker run [image]`, it will print "Hello, Docker!".

However if you run it with
`docker run [image] python script.py "Hello, World!`, it will print `Hello, World!`.

On the other hand, if you want a fixed command to be run everytime you run a container, use ENTRYPOINT. Bear in mind that any command line params will be appended to the end of the ENTRYPOINT command.

For example:

```docker
FROM node:14
COPY . /app
WORKDIR /app
ENTRYPOINT ["node", "app.js"]
```

If you run it with `docker run [image]`, it will always run `node app.js`.

It's common to combine both ENTRYPOINT and CMD to set a fixed executable command, with default arguments. The defaults can be overwridden as we've shown ealier, but the ENTRYPOINT is fixed.

```docker
FROM ubuntu:20.04
COPY . /app
WORKDIR /app
ENTRYPOINT ["./utility-tool"]
CMD ["--help"]
```

By default it will run the image with `docker run [imagename]` and it will run `./utility-tool --help` as defined in ENTRYPOINT and CMD.
or the help param can be overridden with `./utility-tool --version` which runs the fixed ENTRYPOINT, and an overridden CLI argument.
