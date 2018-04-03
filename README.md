![alt text](https://raw.githubusercontent.com/yashiel/Modern-Web-Boilerplate/master/docs/img/intro.png)
# Modern Front-end Development Boilerplate - v1.3

Easy to use, all-in-one starter boilerplate to develop, build and deploy your next web project

# What's New - v1.3
* Read Sketch files and extract Artboards into icon-fonts.
* Easy to use **Icon-Font Browser** with following features,
    * Ability to **Copy-to-clipboard** HTML(CSS Class), SCSS, SCSS Shorthand and SCSS Unicode Variable
    * Clear documentation about how to use it.
    * Name your icon-font whatever you want.
    * Can manage everything inside **Setting.json** file.

# Features
* Multiple Frontend SCSS frameworks at your disposal ( Eg:- **New Bootstrap 4** and **Foundation 6** )
* Easy to manage folder structure but you can change whatever you want ( Eg:- MVC framework like folder structure )
* Centralized place to manage your js, img, fonts and all project related settings.
* Ability to auto switch remote url, if you prefer.
* For Windows users easy to run dev and build tasks with provided shortcut bat files.
* hassle free font-face generation with ability to switch remote url on build process.
* Integrated project backup feature. ability to get source and build files backup anytime
* Automatic Deployment to production server.
* Hassle free build process
* Secure JS file with JS obfuscation ( **Warning** :- Final Production JS file size may increase significantly )
* Icon-Fonts Genaration - v1.3 ** **New** **

### Other Features

* Auto Browser Refresh.
* Compass Utility Loader (We Love Compass but not Ruby Compass).
* Auto Fetch Library from **CDNJs** or **Google** libraries base on package.json package version number. (Eg : jQuery 3.3.1 will be CDN jQuery 3.3.1, if you wish to change jQuery version please change version number in package.json file.)
* Integrated CDN Fallbacks
* JS Uglify
* Image Minify and Optimization
* Responsive Typography


### Prerequisites

**Yarn** ( Yarn is a replacement for bower).

**Nodejs**

## Getting Started

Download the package from GitHub and start to configure using **setting.json** file.

##### Demo

![alt text](https://raw.githubusercontent.com/yashiel/Modern-Web-Boilerplate/master/docs/img/1.gif)


### Folder Structure
![alt text](https://raw.githubusercontent.com/yashiel/Modern-Web-Boilerplate/master/docs/img/web-boilerplate%20-%20Visual%20Studio%20Code.png)

### Installing

After you download the project files **CD/dir** into folder and run

```
yarn
```

##### Demo

![alt text](https://raw.githubusercontent.com/yashiel/Modern-Web-Boilerplate/master/docs/img/2.gif)


**NOTE:** make sure to install nodejs and yarn before run yarn commands.

### Start Development AKA Start Dev

Once you done with your dependency installation, open your **command prompt/terminal/iterm**, whatever you like and **cd/dir** into the folder and run
```
gulp
```
##### Demo

![alt text](https://raw.githubusercontent.com/yashiel/Modern-Web-Boilerplate/master/docs/img/2.gif)

**NOTE:** For windows users. you can run **start_dev.cmd** file by double clicking it

### Start Build Process

Once you finish with your development, run below command to get final production ready code.
```
gulp build --production
```
For windows users. you can run **start_build.cmd** file by double clicking it


## Deployment

Rename **ftp-config. Json. tpl -> FTP-config. json** and enter your remote host details. once you done with the edit run build command and choose appropriate answer to deploy your project. that’s it !!

#### Deployment Preview
![alt text](https://raw.githubusercontent.com/yashiel/Modern-Web-Boilerplate/master/docs/img/snap2.png)


#### Roadmap / Upcoming Feature

* Ability to read and extract vector data from Adobe Illustrator and Sketch files and generate icon fonts on the fly.
* ++ More useful features
## Author

* **Yashi EL** -  [Github](https://github.com/yashiel)

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details


