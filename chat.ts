const fs = require('fs/promises');
const { ChatGPTAPI } = require('chatgpt');
const dotenv = require('dotenv');

dotenv.config();

class ChatGPTClient {
  constructor(
    promptTemplate, 
    apiKey, 
    model, 
    temperature, 
    top_p, 
    enableStreaming, 
    continueChat
  ) {
    this.buffer = "";
    this.promptTemplate = promptTemplate;
    this.parentMessageId = null;
    this.enableStreaming = enableStreaming;
    this.continueChat = continueChat;

    this.api = new ChatGPTAPI({
      apiKey,
      completionParams: {
        model,
        temperature,
        top_p
      }
    });
  }

  async init() {
    const promptTemplateContent = await fs.readFile(this.promptTemplate, 'utf-8');
    let messageToChatGPT = promptTemplateContent;

    process.stdin.on('data', this.handleInput.bind(this));

    await this.sendMessage(messageToChatGPT);
  }

  async sendMessage(messageToChatGPT) {
    this.buffer = "";
    process.stdout.write("chatgpt: ");
    let options = {
      parentMessageId: this.parentMessageId,
      onProgress: this.handleProgress.bind(this)
    };

    if (!this.enableStreaming) {
      options = {
        parentMessageId: this.parentMessageId,
      }
    }

    const res = await this.api.sendMessage(messageToChatGPT, options);
    if (!this.enableStreaming) {
      process.stdout.write(res.text);
    }
    process.stdout.write("\n\n");

    if (!this.continueChat) {
      process.exit(1);
    }

    process.stdout.write("me: ");
    this.parentMessageId = res.id;
  }

  handleProgress(partialResponse) {
    const bufferDiff = partialResponse.text.substr(this.buffer.length);
    this.buffer = partialResponse.text;
    process.stdout.write(bufferDiff);
    this.buffer = partialResponse.text;
  }

  async handleInput(data) {
    let messageToChatGPT = data.toString().trim();
    await this.sendMessage(messageToChatGPT);
  }
}

const apiKey = process.env.OPENAI_API_KEY;
const model = "gpt-3.5-turbo";
const temperature = 0.5;
const top_p = 0.8;
const enableStreaming = process.argv[3] && process.argv[3] == 0 ? false : true;
const continueChat = process.argv[4] && process.argv[4] == 0 ? false : true;

const client = new ChatGPTClient(process.argv[2] || 'prompts/default.txt', apiKey, model, temperature, top_p, enableStreaming, continueChat);
client.init();
