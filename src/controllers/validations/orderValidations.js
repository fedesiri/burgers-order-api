const errorMessages = {
    assignedName: "The order must have a name",
    assignedAddress: "The order must have an address",
    invalidPrice: "Price must be a number greater than 0",
    nonexistingId: id => `There is no order with the id '${id}'`
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

const existingOrderValidation = async (existingOrder, id) => {
    if (!existingOrder) {
        return errorMessages.nonexistingId(id);
    }
    return null;
};

const editOrderValidation = async (orderToEdit, body) => {
    if (!orderToEdit) {
        return errorMessages.nonexistingId(id);
    }
    createOrEditOrderValidationFields(body);
};

module.exports = {
    createOrEditOrderValidationFields,
    existingOrderValidation,
    editOrderValidation
};
