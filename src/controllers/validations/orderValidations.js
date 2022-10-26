const moment = require("moment");

const errorMessages = {
    assignedName: "The order must have a name",
    assignedAddress: "The order must have an address",
    invalidPrice: "Price must be a number greater than 0",
    nonexistingId: id => `There is no order with the id '${id}'`,
    invalidDate: "Date not is valid!"
};

const createOrEditOrderValidationFields = body => {
    const { name, address, takeAway, totalPrice } = body;
    if (!name) {
        return errorMessages.assignedName;
    } else if (!takeAway && !address) {
        return errorMessages.assignedAddress;
    } else if (totalPrice < 0) {
        return errorMessages.invalidPrice;
    } else {
        return null;
    }
};

const getSoldQuantityByMonthValidation = date => {
    if (!date || !moment(date).isValid()) {
        return errorMessages.invalidDate;
    } else {
        return null;
    }
};

const existingOrderValidation = (existingOrder, id) => {
    if (!existingOrder) {
        return errorMessages.nonexistingId(id);
    }
    return null;
};

const editOrderValidation = (orderToEdit, id, body) => {
    if (!orderToEdit) {
        return errorMessages.nonexistingId(id);
    }
    return createOrEditOrderValidationFields(body);
};

module.exports = {
    createOrEditOrderValidationFields,
    getSoldQuantityByMonthValidation,
    existingOrderValidation,
    editOrderValidation
};
