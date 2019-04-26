class MessageHandler {
    constructor() {
        this.debugMode = true;
        this.lastMessage = '';
        this.lastError = '';
        this.lastLog = '';
    }
    printLog(message) {
        this.lastLog = message;
        if (this.debugMode) {
            console.log('DEBUG: ' + message);
        }
    }
    printError(message) {
        this.lastError = message;
        if (this.debugMode) {
            console.error('DEBUG: ' + message);
        }
    }
    print(message) {
        this.lastMessage = message;
        console.log(message);
    }
    getLastLog() {
        return this.lastLog();
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
