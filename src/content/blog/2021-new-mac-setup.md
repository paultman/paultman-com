---
title: "2021 New Mac Setup"
pubDatetime: 2021-07-22T15:22:00Z
categories:
  - "tech"
tags:
  - "m1-mac"
  - "mac-setup"
ogImage: "/assets/2021-new-mac-setup_cover.jpg"
description: ""
---

So, i've finally made the move to an M1 based mac. I've had a ton of Macs but always found myself returning to the 15" 2015 macbook pro. It has a great keyboard, 16GB of ram, lots of ports, i7 processors, and a very fast 1TB ssd (Later i'll write a post on how I upgraded my 256GB to 1TB for only $106).

I still have it the 15" mbp, but after reading all the reviews on the m1's mac's performance and noticing that many programs are now updated to use the M1/ARM architecture, I decided it was time for a change.

Earlier, many programs needed to relying on the [rosetta 2 transpiler](https://support.apple.com/en-us/HT211861) to use programs written for x86 architectures. The main program I waited for was [homebrew](https://www.macrumors.com/2021/02/05/homebrew-apple-silicon-support/), a command line app/package installer, it makes installing mac apps very easy and should install the proper (ARM) versions of apps. Now that a native m1/arm version has been released and other programs have also been updated, I can now transition w/o the headache of running x86 programs on my ARM-based mac.

So, here are my setup notes for a new mac in July of 2021 . This guide will be for a general mac user, and I will mention sections specific to my personal usage as a developer. The full guide will be divided into two parts:

- System Preferences
- Apps

I have also made a screencast of the setup process, you can find it on [youtube](https://youtu.be/IuCAJMU8cNg).  
For developers interested in developer tool configuration, see this [post](https://paultman.wordpress.com/?p=2465) for how to mange dotfiles.

## System Preferences & Basics

This is the easiest and most useful part of the process, so we start here first. We will look at:

- Trackpad
- Keyboard
- Display
- Finder View
- Dock

First, open System Properties by clicking on the Apple Symbol in the upper left corner of your screen and selecting, "System Preferences"  
Click the Trackpad icon, look at the Point & Click tab near the top and make sure that Secondary Click and Tap to Click are checked. Under that, i suggest moving the tracking speed as far right as you are comfortable with. Personally I go to right edge. Under that, I leave Force Click checked.

![](/assets/2021-new-mac-setup-trackpad1.png)

For the "More Gestures" tab, I have the first 3 checked and for the last 4, I prefer to use hot corners which I will show you next. Update: i do also check the Launchpad option since it's not useful enough to be in my Hot Cornes triggers.

![](/assets/2021-new-mac-setup-trackpad2.png)

Next, return to the main preferences by click the left/back arrow, and then select Mission Control.  
Leave the defaults then click Hot Corners at the bottom left. These might take some time to get used to, but to invoke each function, simply drag your curser to a corner of the screen. Always freaks out a windows user who uses my computer and windows fly around, but they can be very helpful since most of the time we have our hand/finger on the trackpad/mouse anyway.

![](/assets/2021-new-mac-setup-hotcorners.png)

Return to main preferences by again clicking the left/back arrow and select Keyboard.  
I move the Key Repeat to the right, Fast, and the delay to one left of Short. For the Text tab, I also uncheck all the corrections and smart quotes. Unlike when I'm using a cell phone, I don't need those automatic changes when I am typing using a keyboard.

![](/assets/2021-new-mac-setup-keyboard.png)

Return to main preferences by again clicking the left/back arrow and select Display.  
When not connected to a monitor, I typically prefer as much desktop space as possible, I select Scaled, then More Space. I also make sure that on the Night Shift tab, the Schedule is Sunset to Sunrise.

![](/assets/2021-new-mac-setup-display.png)

Return to main preferences by again clicking the left/back arrow and select Dock.  
Because most displays are more wide than high, i prefer to save vertical space for content. Therefore i position on dock to the left side of the screen, rather than the bottom.

![](/assets/2021-new-mac-setup-dock.png)

From the main System Preferences screen, I assume you have signed in with your Apple ID. From there, under iCloud i typically turn off iCloud Drive because I prefer to manage that manually, rather than syncing data in the background, and I also turn off Photos for the same reason. The rest are small and I leave the defaults checked.

![](/assets/2021-new-mac-setup-icloud.png)

If you are on a network with others, or you might also use airdrop, you can change your computer name from the "Sharing" option in System Preferences. The first input box will have the default name like "Paul's Macbook Air," I update that to a single word name.

Update: I almost forgot about having bluetooth in the menubar. From System Preferences, click Bluetooth, then besides pairing any devices, on the bottom check the box for "Show Bluetooth in menubar".

Last, though not in System Properties, is finder settings. You can update them in one of two ways:

Finder Window: Open the finder app, first app in your dock. In the left in the "Favorites" list, I like to also place my home folder/directory, and any other folder(s) that I want easy access to. Like Desktop, Applications, and a custom storage folder. You can drag them in after browsing to the folder on the right. Besides the finder folder, you can also drag them directly into the bottom part of your dock, just before the trashcan.  
or  
Finder Properties: Go to the Finder menu bar option for preferences, then Sidebar. From there, add any additional shortcuts to the Favorites section by checking the box next to the item you want, for example, pictures, your home folder, Desktop, etc. Also, personally I uncheck Tags if you (like me), never use them.

In the finder preferences, Advanced, I also like to select the options to keep folders on top, and change the search to start in the current folder (I simply go up a few levels if I want a more global search).

![](/assets/2021-new-mac-setup-finder1.png)

The last part of setting up Finder is to set the default view. Open finder, then choose the item layout: icon, list, column or gallery. Then from: menubar->view select Show View Options.

![](/assets/2021-new-mac-setup-view-props.png)

Select the options that make sense for you, and be sure to select "Use as Defaults" on the bottom.

## Applications

This part is a bit more tricky than past setups because now I'm on an M1 Mac. Because of that, I want to ensure that I'm installing apps based on the ARM architecture rather than the traditional x86 based ones. Therefore, I use an application installer called [Homebrew](https://brew.sh) which will automatically select the best and latest version of the apps I want. You can [read more](https://geekflare.com/homebrew-intro-installing/) about it, and how it works. So, whatever type of mac you are using (intel or apple silicon), Homebrew is the fastest way to get all your programs installed. You can also find a cheat sheet of commands [here](https://devhints.io/homebrew).

The alternative is to use the Apple store and/or direct downloads from product websites. That manual process is easy, but takes more time.

Either way, here are the basic programs I recommend installing (all have been checked and natively support both x86 and M1/Arm architectures).

- [Evernote](https://evernote.com) - An easy to use note taking app. Free version allows for 2 devices, ie laptop and phone
- [Google-Chrome](https://www.google.com/chrome/) - While Safari is more efficient on a mac, Chrome is slightly better supported and has more extensions.
- [Grand Perspective](http://grandperspectiv.sourceforge.net) - This is a graphic view of space on disk. At a glance see what's taking space and clean up. While reviewing a few others like Disk Inventory X, it's the most recently updated and supports Big Sur (the current version of osx). Tip: Be sure to download it from [sourceforge](http://grandperspectiv.sourceforge.net) or brew for free, else the apple store changes $2.99
- [Zoom](https://zoom.us) - While I enjoy FaceTime, it's hard to avoid the ubiquitous presence of the biggest pandemic app. Use it for video meetings, one-on-one or in groups.

Install them via Appstore or website. If you want to use Homebrew, you'll need to install it first. Open the terminal (in application/utilities/) and paste this [command](https://brew.sh) to the command line and execute.  
`> /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`  
Next, use it to install your programs:  
`> brew install --cask evernote google-chrome grandperspective zoom`

For general apps, that's a pretty short list. Why? Well many others are already included by Apple in OSX which I often default to using, rather than replacing. Apps like: Mail, Office-like (Pages, Numbers, Keynote), Podcasts, iPhoto, iMovie, Preview (for PDFs), News..

That being said, there are a few apps which come with your mac which you might want to delete, like: GarageBand (1GB), iMovie (3GB), and keynote (.7GB) to name a few. If you do delete them and change your mind, they can easily be installed again from the App Store.

In my case, there are a few other communication and development apps which I install, feel free to cherry pick the apps that work best for you.

- [Slack](https://slack.com) - Messaging app for teams.
- [Whatsapp](https://www.whatsapp.com) - Desktop client for commonly used mobile messaging/chat.
- [Discord](https://discord.com) - Chatroom style app for product development and support.
- [Firefox](https://www.mozilla.org/en-US/firefox/) - Alternate web browser.
- [NordVPN](https://nordvpn.com) - Popular VPN client.
- [iTerm2](https://iterm2.com/downloads.html) - Nice replacement for the Terminal app which comes with OSX.
- [Postman](https://www.postman.com) - For developers who need to test network requests.
- [Sourcetree](https://www.sourcetreeapp.com) - Nice visual Git GUI for repo tracking and visual branches.
- [Visual Studio Code](https://code.visualstudio.com) - The current top dog among programmer IDE's.

Again, the Homebrew command would be:  
`> brew install --cask slack whatsapp discord firefox nordvpn iterm2 postman sourcetree visual-studio-code`  
In the future, to update all apps installed with brew, simply type: `brew update`

July 26, 2022: Update - In setting up Sourcetree on Monterey, it seems to ship with it's own version of Git, which it defaults to. If when u open it you get a "git status with error 1" try going into properties, Git, and switch to the system version. I found the solution [here](https://jira.atlassian.com/browse/SRCTREE-7530) and it worked for me.

This it for the basic new mac setup. I'll keep updating this guide as I learn of new tools and installation setups. For developers who want to more easily manage dev tool configuration, check out my [followup post](https://paultman.wordpress.com/?p=2465) on dot files and Homebrew scripts for automated app installations.

Inspiration/references:

- [https://www.taniarascia.com/setting-up-a-brand-new-mac-for-development/](https://www.taniarascia.com/setting-up-a-brand-new-mac-for-development/)
- [https://www.stuartellis.name/articles/mac-setup/](https://www.stuartellis.name/articles/mac-setup/)
- [https://github.com/webpro/awesome-dotfiles](https://github.com/webpro/awesome-dotfiles)
