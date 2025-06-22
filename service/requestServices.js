const sendRequest = async (Request) => {
    const {
        method = 'GET',
        url,
        headers = {},
        queryParams = {},
        bodyType,
        body = {},
    } = Request;

    try {
        // 1. Build URL with query params
        let finalUrl = url;
        if (Object.keys(queryParams).length > 0) {
            const queryString = new URLSearchParams(queryParams).toString();
            finalUrl += url.includes('?') ? `&${queryString}` : `?${queryString}`;
        }

        // 2. Set fetch options
        const options = {
            method: method.toUpperCase(),
            headers: { ...headers },
        };

        // 3. Add request body
        if (method !== 'GET' && method !== 'HEAD') {
            if (bodyType === 'json') {
                options.body = JSON.stringify(body);
                options.headers['Content-Type'] = 'application/json';
            } else if (bodyType === 'x-www-form-urlencoded') {
                options.body = new URLSearchParams(body).toString();
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            } else if (bodyType === 'form-data') {
                const formData = new FormData();
                for (const key in body) {
                    if (
                        body[key]?.hasOwnProperty('value') &&
                        body[key]?.hasOwnProperty('fileName')
                    ) {
                        formData.append(key, body[key].value, body[key].fileName);
                    } else {
                        formData.append(key, body[key]);
                    }
                }
                options.body = formData;
                delete options.headers['Content-Type']; // Let browser set correct form-data boundary
            }
        }

        // 4. Start timer
        const startTime = performance.now();

        // 5. Send request
        const response = await fetch(finalUrl, options);
        const endTime = performance.now();

        // 6. Time taken
        const responseTime = Math.round(endTime - startTime); // ms

        // 7. Read body as text to calculate size
        const rawData = await response.clone().text();
        const responseSize = new TextEncoder().encode(rawData).length;

        // 8. Parse data based on content-type
        const contentType = response.headers.get('content-type') || '';
        let data;
        try {
            data = contentType.includes('application/json')
                ? JSON.parse(rawData)
                : rawData;
        } catch (e) {
            data = rawData;
        }

        // 9. Get and parse headers
        const rawHeaders = Object.fromEntries(response.headers.entries());

        const parsedHeaders  = {};
        for (const [key, value] of Object.entries(rawHeaders)) {
            try {
                // Try parsing only if it starts and ends like a JSON object or array
                if (
                    (value.startsWith('{') && value.endsWith('}')) ||
                    (value.startsWith('[') && value.endsWith(']'))
                ) {
                    parsedHeaders [key] = JSON.stringify(JSON.parse(value));
                } else {
                    parsedHeaders [key] = value;
                }
            } catch {
                parsedHeaders[key] = value; // fallback to original string
            }
        }

        return {
            success: true,
            status: response.status,
            statusText: response.statusText,
            responseTime,
            responseSize,
            responseSizeHuman: formatBytes(responseSize),
            responseType: contentType,
            parsedHeaders,
            data,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// Convert bytes to readable size
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
    sendRequest,
};
