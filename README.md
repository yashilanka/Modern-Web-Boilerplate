![Intro](https://raw.githubusercontent.com/yashiel/gifs/master/intro.png)
# Modern Front-end Development Boilerplate - *v1.3*
#### Easy to use, all-in-one starter boilerplate to develop, build and deploy your next web project

## :pushpin: What's New - *v1.3*
* Read **Sketch** files and extract Artboards into icon-fonts.
* Easy to use **Icon-Font Browser** with following features,
    * Ability to **Copy-to-clipboard** HTML(CSS Class), SCSS, SCSS Shorthand and SCSS Unicode Variable
    * Clear documentation about how to use it.
    * Name your icon-font whatever you want.
    * Can manage everything inside **setting.json** file.

## :pushpin: Features
* Multiple Frontend SCSS frameworks at your disposal ( Eg:- ***New* Bootstrap 4** and **Foundation 6** )
* Easy to manage folder structure but you can change whatever you want ( Eg:- MVC framework like folder structure )
* Centralized place to manage your js, img, fonts and all project related settings.
* Ability to auto switch remote url, if you prefer.
* For Windows users easy to run dev and build tasks with provided shortcut bat files.
* hassle free font-face generation with ability to switch remote url on build process.
* Integrated project backup feature. ability to get source and build files backup anytime
* Automatic Deployment to production server.
* Hassle free build process
* Secure JS file with JS obfuscation ( **Warning** :- Final Production JS file size may increase significantly )
* Icon-Fonts Generation - ***v1.3*** :star: ***New***

### Other Features

* Auto Browser Refresh.
* Compass Utility Loader (We Love Compass but not Ruby Compass).
* Auto Fetch Library from **CDNJs** or **Google** libraries base on package.json package version number. (Eg : jQuery 3.3.1 will be CDN jQuery 3.3.1, if you wish to change jQuery version please change version number in package.json file.)
* Integrated CDN Fallbacks
* JS Uglify
* Image Minify and Optimization
* Responsive Typography

___


### Prerequisites

**Yarn** ( Yarn is a replacement for bower).

**Nodejs**

---
## :pushpin: Getting Started
#### :point_right: *Step 01*

Download the package from GitHub and start to configure using **setting.json** file.

### Folder Structure
![Folder Structure](https://raw.githubusercontent.com/yashiel/gifs/master/web-boilerplate%20-%20Visual%20Studio%20Code.png)

---
#### :point_right: *Step 02*
### Installing

After you download the project files, open your **command prompt/terminal/iTerm** or whatever you like and **cd/dir** into the folder and run

```
yarn
```

##### Demo

![Yarn Demo](https://raw.githubusercontent.com/yashiel/gifs/master/2.gif)


**NOTE:** make sure to install **nodejs** and **yarn** before run yarn commands.


---
#### :point_right: *Step 03*
### Start Development AKA Start Dev

Once you done with your dependency installation, then run
```
gulp
```
##### Demo

![Gulp Demo](https://raw.githubusercontent.com/yashiel/gifs/master/3.gif)

**NOTE:** For windows users. you can run **start_dev.cmd** file by double clicking it

---
#### :point_right: *Step 04*
### Start Build Process

To get Production ready code, run below command.

**Tip:** You can skip build questions by pressing **enter/return** key :smile:

```
gulp build --production
```

##### Demo

![Gulp Demo](https://raw.githubusercontent.com/yashiel/gifs/master/4.gif)

For windows users. you can run **start_build.cmd** file by double clicking it


---
#### :point_right: *Step 05*
## :pushpin: Deployment

Rename **ftp-config.json.tpl -> ftp-config.json** and enter your remote host details. once you done with the edit run build command and choose appropriate answer to deploy your project. that’s it !!

#### Deployment Preview
![Deploy Preview](https://raw.githubusercontent.com/yashiel/gifs/master/deploy-prev.png)

---
## :pushpin: Icon-Font Generator & Browser - *v1.3* - *New* :fire:

When you start your dev server, icon generator will read the sketch file and extract all contain art-boards into icon fonts. you can change the icon-font name with other settings by editing ***setting. json*** file. 

#### To view Icon-Font Browser go to

```
http://localhost:3000/iconfonts.html
```

##### Demo

![Iconfont Demo](https://raw.githubusercontent.com/yashiel/gifs/master/iconfont-prev.png)

![Iconfont Demo](https://raw.githubusercontent.com/yashiel/gifs/master/iconfonts.gif)
#### Roadmap / Upcoming Feature

* Ability to read and extract vector data from Adobe Illustrator ~~*and Sketch files*~~ and generate icon fonts on the fly.
* Easy to use SVG Sprite based Icon Generation system
* ++ More useful features
## Author

* **Yashi EL** - [Github](https://github.com/yashiel)

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details


