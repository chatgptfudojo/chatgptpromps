import fetch from 'node-fetch';

(async() => {

  const url = "https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/README.md";

  const response = await fetch(url);
  const body = await response.text();

  console.log(body);
})();
