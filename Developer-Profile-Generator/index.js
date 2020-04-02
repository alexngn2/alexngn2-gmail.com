const axios = require('axios');
const inquirer = require('inquirer')
const puppeteer = require('puppeteer');
const generateHTML = require("./generateHTML.js");

//Questions asked to the user
const questions = [
    {
        type: "input",
        name: "userName",
        message: "What is you GitHub user name? "
    },
    {
        type: "list",
        message: "What colour would you like to use? ",
        name: "color",
        choices:[
            "green",
            "blue",
            "pink",
            "red"
        ]
    }
];

// PDF gets created using puppeteer
function writeToFile(fileName, data,) {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const html = data;
        let pdfPath = {path: fileName};
        await page.setContent(html);
        await page.pdf(pdfPath);
        await browser.close();
    })();
}; 

//main function
function init() {
    inquirer.prompt(questions) //asks the user the 2 questions
    .then( answers => { 
        const  userName = answers.userName; 
        const queryUrl = `https://api.github.com/users/${userName}`; //calls the git hub api useing the username
        axios.get(queryUrl)
            .then(function (response){
                const info = response.data; //once a respnce from the api is returned it saves all the info
                const pdfPath = info.name.toLowerCase().split(' ').join('')+".pdf"; //creates the file name using the user's name
                writeToFile(pdfPath, generateHTML(answers, info), ); //calls the function to create the pdf
            });
        
        })
}

init();
