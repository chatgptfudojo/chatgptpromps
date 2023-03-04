import fetch from 'node-fetch';
const sha1 = require('sha1');

(async() => {

  const url = "https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/README.md";

  const response = await fetch(url);
  const body = await response.text();

  const regex = /^>.*\n$/gm;

  const matches = body.match(regex);

  const promptArr = [];

  matches.forEach(match => {
    let promptText = match.substr(2);
    const promptSha1 = sha1(promptText);
    const promptSentences = promptText.split(".");
    const shortName = promptSentences[0].toLowerCase();

    promptArr.push({
      sha1: promptSha1
    }); 
  });

  console.log(JSON.stringify(promptArr));
})();
