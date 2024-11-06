
const withRetry = async (fn, timeout= 1000, retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await Promise.race([
                fn(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Timeout exceeded")), timeout)
                )
            ])
        } catch (error) {
            if (error.message === "Timeout exceeded") {
                console.log(`Attempt ${attempt + 1} failed due to timeout.`);
                if (attempt === retries) {
                    throw new Error("Max retries reached");
                }
            } else {
                throw error;
            }
        }
    }
}


const task = async () => {
    return new Promise((resolve) => setTimeout(resolve, 0000, "Task completed!"))
}


(async () => {
    try {
        const result = await withRetry(task, 1000);
        console.log(result);
    } catch (error) {
        console.error("Failed:", error.message);
    }
})();