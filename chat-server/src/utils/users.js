const users = [];

const addUser = ({ id, customerName, deliveryDate, items, contactNumber }) => {
    customerName = customerName.trim().toLowerCase();
    deliveryDate = String(deliveryDate);

    //validate the data
    if (!customerName || !deliveryDate) {
        return {
            error: "Customer Name and Delivery Date are required!",
        };
    }
    //check for existing user
    const existingUser = users.find((user) => {
        return user.deliveryDate === deliveryDate && user.customerName === customerName;
    });

    //validate user
    if (existingUser) {
        return {
            error: "CustomerName is in use!",
        };
    }

    //store user
    const user = { id, customerName, deliveryDate, items, contactNumber };
    users.push(user);
    return { user };
};

//remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};
const getUser = (id) => {
    return users.find((user) => user.id === id);
};


module.exports = {
    addUser,
    removeUser,
    getUser
};