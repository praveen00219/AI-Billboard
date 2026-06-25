// Utility Helper Functions

// Clean request body
export const cleanBody = (body) => JSON.parse(JSON.stringify(body));

// Format response
export const formatResponse = (success, message, data = null) => {
    const response = { success, message };
    if (data) Object.assign(response, data);
    return response;
};

// Validate required fields
export const validateRequiredFields = (data, requiredFields) => {
    const missingFields = requiredFields.filter(field => !data[field]);
    return { isValid: missingFields.length === 0, missingFields };
};

// Pagination helper
export const paginate = (page = 1, limit = 10) => ({ limit, offset: (page - 1) * limit });

export default { cleanBody, formatResponse, validateRequiredFields, paginate };
