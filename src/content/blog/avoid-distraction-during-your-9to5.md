---
author: Paul
pubDatetime: 2022-03-08T15:33:05.569Z
title: Avoid Distraction during your 9to5
categories:
  - lessons-learned
  - life
  - tech
tags:
  - avoid-distraction
  - hosts
  - shell-script
ogImage: /assets/avoid-distraction-during-your-9to5_cover.jpeg
description: One way for mac users to avoid distracting websites during their workday by automatically blocking or redirecting them to an inspirational destination.
---

## Background

We've all been there, you've finished lunch, decided to check a few news websites before getting back to work, and before you know it, it's 5pm, your work day is over. Unfortunately I wish I could say it's a rare occurrence, but I can't.

## Possible Solutions

There are many browser extensions available, tools like [StayFocused](https://chrome.google.com/webstore/detail/stayfocusd/laankejkbhbdhmipfmgcngdelahlfoji?hl=en), [Intention](https://www.getintention.com/), and [Tab Limiter](https://chrome.google.com/webstore/detail/tab-limiter/pbpfchnddjilendkobiabenojlniemoh/). But I was looking for a more simple solution, one that wasn't specific to a single web browser, nor did crazy things to my macbook network configuration. The former because I appreciate the lower power usage of Safari, but as a developer, I often need dev tools on Chrome, and the later due to issues when running a vpn and often after standby, having that block or hold network traffic while it reconnects.

### My Solution

Since I'm on a Mac, I decided to write a quick script to block certain websites which I frequent, and also routinely run it during the work day, and turn it off afterwards. To make it automated, I'll be using a [cronjob](https://www.geeksforgeeks.org/crontab-in-linux-with-examples/) to switch between modes, work and free.

To do the actually blocking, I'll update the computers /etc/hosts file. That's how you can explicitly route network traffic, maping one network destination to another.

Therefore, there are three parts to this: a .free and .work hosts files, and a shell script to switch the host file, and you'll need to edit your crontab to schedule running the change host script.

Using the terminal (/System/Applications/Utilities/Terminal.app), we will start by cd'ing into your /etc directory and copying your existing host file to your free and your work versions.

```shell
cd /etc
cp hosts hosts.free
cp hosts hosts.work
```

You should then edit the hosts.work file, adding lines near the bottom to route the websites you want to avoid during the day, to your loopback adapter, meaning that network requests to those websites, don't actually leave your computer.

for example:

```shell
127.0.0.1 localhost
255.255.255.255 broadcasthost
::1 localhost

127.0.0.1 facebook.com www.facebook.com
127.0.0.1 9to5mac.com www.9to5mac.com
127.0.0.1 macrumors.com www.macrumors.com
127.0.0.1 money.cnn.com edition.cnn.com
```

As mentioned, your computer uses the /etc/hosts file for manually routing requests to IP addresses. In my case, u can see I've told my computer to route facebook, 9to5mac, macrumos, and cnn to my local network adapter rather than going out to the network to get the content.
Rather then sending traffic to the loopback address (127.0.0.1), you can also send it to an inspirational website like: [everydaypower](https://everydaypower.com) simply replace the 127.0.0.1 with whatever website you want.

You can leave your hosts.free file as it is, because that's your default network configuration.

Second, create a shell script to my home directory, you can call it "changehost.sh":

```shell
#!/bin/bash

# this script is to change the hosts file, should have hosts.free and hosts.work ready in the /etc directory

cd /etc/

freeFile="hosts.free"
workFile="hosts.work"
if \[\[ $1 = "work" \]\]; then
cp $workFile hosts
else
cp $freeFile hosts
fi
echo "updated /etc/hosts file. $1"
```

Basically, if the script is run with a "work" argument, it will overwrite the current hosts file with the hosts.work version, else it will overwrite it will the hosts.free version. It will also give standard output for which action it took.

You can manually run it from your home directory to block those distracting websites by using:

```shell
sudo ./changeHost work
```

and to reset, meaning go back to your default network configuration, simply run the script without the "work" argument:

```shell
sudo ./changeHost
```

Last, to configure your mac to run the script on a regular basis.
The syntax for crontab jobs is:

<div style="color:white"><pre tabindex="0" style="color:white; -moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code style="color:white !important;" class="language-html" data-lang="html"><span style="display:flex;">
<span>┌───────────── minute (0 - 59)
</span></span><span style="display:flex;"><span>│ ┌───────────── hour (0 - 23)
</span></span><span style="display:flex;"><span>│ │ ┌───────────── day of the month (1 - 31)
</span></span><span style="display:flex;"><span>│ │ │ ┌───────────── month (1 - 12)
</span></span><span style="display:flex;"><span>│ │ │ │ ┌───────────── day of the week (0 - 6) 
</span></span><span style="display:flex;"><span>│ │ │ │ │
</span></span><span style="display:flex;"><span>│ │ │ │ │
</span></span><span style="display:flex;"><span>│ │ │ │ │
</span></span><span style="display:flex;"><span>
</span></span><span style="display:flex;"><span>* * * * * command</span></span></code></pre></div>

edit your crontab:

```shell
sudo crontab -e
```

and add these two lines:

```shell
30,59 9 * * 1-5 ~/changeHosts.sh work
30,59 17 * * 1-5 ~/changeHosts.sh
```

That means, at 9am, monday-friday, run the script to change your host file, and pass it the work argument, then at 5pm do the same, but without an argument. Feel free to use whatever hours work for you, besides the typical 9-5pm used above.
