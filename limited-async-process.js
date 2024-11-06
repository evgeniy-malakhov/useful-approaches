async function fetchData(url) {
    return new Promise((resolve, reject) => {
        // setTimeout imitates long time request
        setTimeout(() => {
            console.log(`Fetched: ${url}`);
            resolve(`Result from ${url}`);
        }, Math.random() * 2000);
    })
}

const processUrls = async (urls, limit) => {
    // Results from each url
    const results = [];
    // limited queue
    const queue = [];

    for (const url of urls) {
        const promise = fetchData(url).then(result => {
            results.push(result);
            console.log(queue.indexOf(promise));
            // remove the promise from queue
            queue.slice(queue.indexOf(promise), 1);
        })

        queue.push(promise);

        if (queue.length >= limit) {
            console.log('Limited!')
            await Promise.race(queue);
        }
    }
    await Promise.all(queue);
    return results;
}

const urls = [
    "https://example.com/api/1",
    "https://example.com/api/2",
    "https://example.com/api/3",
    "https://example.com/api/4",
    "https://example.com/api/5",
    "https://example.com/api/6"
];

processUrls(urls, 3).then((results) => {
    console.log("All URLs processed:", results);
});