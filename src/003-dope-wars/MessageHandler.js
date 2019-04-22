class MessageHandler {
    constructor() {
        this.lastMessage = '';
        this.lastError = '';
    }
    printError(message) {
        this.lastError = message;
        console.error(message);
    }
    print(message) {
        this.lastMessage = message;
        console.log(message);
    }
    getLastMessage() {
        return this.lastMessage();
    }
    getLastError() {
        return this.lastError();
    }
}

let messageHandler = new MessageHandler();

export {
    messageHandler
};

export default messageHandler;
