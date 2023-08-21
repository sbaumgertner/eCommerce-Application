# eCommerce-Application

This is the [final project](https://github.com/rolling-scopes-school/tasks/tree/master/tasks/eCommerce-Application) of the [RSSchool JS course](https://rs.school/js/).

Our team Positive Code Crafters:
- [sbaumgertner](https://github.com/sbaumgertner)
- [jully13](https://github.com/jully13)
- [illia-sakharau](https://github.com/illia-sakharau)

The purpose of the project is frontend development skills training and teamwork training. 

## About the project

The result of this project will be the Plant Store eCommerce application. It's a comprehensive online shopping portal that provides an interactive and seamless experience to users. 

Users can browse through a vast range of plants, view detailed descriptions, add items to the basket, and proceed to checkout. It includes features such as user registration and login, product search, product categorization, and sorting to make the shopping experience more streamlined and convenient. An important aspect of our application is that it's responsive, ensuring it looks great on various devices with a minimum resolution of 390px. The application is powered by CommerceTools, a leading provider of commerce solutions.

## Technology Stack

Technologies used:

- HTML5
- CSS, scss
- TypeScript
- Webpack
- Jest
- ESLint, Prettier
- Husky to manage Git hooks
- CommerceTools
 
The application is a Single Page Application (SPA) with an empty index.html

## Setting up and running

Instructions for setting up and running the project locally:

1. Use node 14.x or higher.
2. Clone this repo: $ git clone https://github.com/sbaumgertner/eCommerce-Application.git
3. Go to downloaded folder: $ cd eCommerce-Application
4. Install dependencies: $ npm install
5. Run build: $ npm run dev (or npm run prod)
6. The built application is available in the dist folder. You can open index.html with Live Server.

## Scripts

Available scripts are described here. They defined in package.json and provide a simple way to execute some usefull tasks.
Each script can be run in the terminal using command $ npm run 'script name'.

1. dev - run webpack with development mode (webpack configuration defined in webpack.config.js). Usage: $ npm run dev
2. prod - run webpack with production mode. Usage: $ npm run prod
3. lint - run eslint for src folder (eslint configuration defined in .eslintrc.js). Usage: $ npm run lint
4. format - run prettier for current folder with --write param (configuration defined in .prettierrc). Usage: $ npm run format
5. prepare - run husky for git hooks checking. Usage: $ npm run prepare
6. test - run jest unit tests. Usage: $ npm run test



