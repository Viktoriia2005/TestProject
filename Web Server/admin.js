import { sendResponse } from "./utils";

    export function handleAdmin (res){
        const content = '<html><body><p>This is admin Page.</p></body></html>';
        sendResponse(res, 200, 'text/html', content);
    }
