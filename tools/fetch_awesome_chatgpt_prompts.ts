import fetch from 'node-fetch';
const sha1 = require('sha1');

async function main() {

  const url = "https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/README.md";

  const response = await fetch(url);
  const body = await response.text();

  const regex = /^# Prompts(.|[\r\n])*?CC-0$/gm;
  const matches = body.match(regex);

  const matchBlock = matches[0];

  const sections = matchBlock.split("\n##");

  let i;
  for (i = 1; i < sections.length; i++) {
    const matchPromptBody = sections[i].match(/^>.*\n$/gm);
    if (matchPromptBody) {
      const promptPayload = {};
      let lines = sections[i].split("\n");
      let firstLine = lines.shift();
      promptPayload.title = firstLine.trim();
      promptPayload.body = matchPromptBody[0].substr(2);
      console.log(promptPayload);
    }
  } 
};

main();
