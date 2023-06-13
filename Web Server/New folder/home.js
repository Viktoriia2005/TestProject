import { sendResponse } from "./utils.js";

export function handleHome(res) {
    const content = '<html><body><p>This is home Page.</p></body></html>';
    sendResponse(res, 200, 'text/html', content);
}
