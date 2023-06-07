import { sendResponse } from "./utils.js";


export function handleCalc (param1, param2) {
    const result = param1 + param2;
    const response = JSON.stringify({ result });

    sendResponse(res,200, 'application/json', response);
};
