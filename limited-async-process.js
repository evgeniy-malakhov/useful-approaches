async function fetchData(url) {
    return new Promise((resolve, reject) => {
        // setTimeout imitates long time request
        setTimeout(() => {
            if (Math.random() < 0.7) {
                console.log(`Fetched: ${url}`);
                resolve(`Result from ${url}`);
            } else {
                reject(new Error(`Error fetching ${url}`));
            }
        }, Math.random() * 2000);
    })
}

const processUrls = async (urls, limit) => {
    // Results from each url
    const results = [];
    // Results with errors
    const errors = [];
    // limited queue
    const queue = [];

    for (const url of urls) {
        const promise = fetchData(url)
            .then(result => {
                results.push(result);
            })
            .catch((error) => {
                console.error(`Failed to fetch ${url}:`, error.message);
                errors.push({ url, error: error.message });
            })
            .finally(() => {
                // remove the promise from queue anyway
                queue.slice(queue.indexOf(promise), 1);
            })

        queue.push(promise);

        if (queue.length >= limit) {
            console.log('Limited!')
            await Promise.race(queue);
        }
    }
    await Promise.all(queue);
    return { results, errors };
}

const urls = [
    "https://example.com/api/1",
    "https://example.com/api/2",
    "https://example.com/api/3",
    "https://example.com/api/4",
    "https://example.com/api/5",
    "https://example.com/api/6"
];

processUrls(urls, 3).then(({ results, errors}) => {
    console.log("All URLs processed successfully:", results);
    console.log("Errors encountered:", errors);
});