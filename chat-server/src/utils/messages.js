const messages = [];
const generateMessage = (username, message, deliveryDate) => {
    let generatedMessage = {
        username,
        message,
        deliveryDate,
        createdAt: new Date().getTime(),
    }
    messages.push(generateMessage)
    return generatedMessage
};



module.exports = {
    generateMessage,
};