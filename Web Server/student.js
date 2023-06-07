import { sendResponse } from "./utils.js";

export function handleStudent (res) {
    const content = '<html><body><p>This is student Page.</p></body></html>';
    sendResponse(res, 200, 'text/html', content);
};
