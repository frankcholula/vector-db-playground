import weaviate from 'weaviate-ts-client';
import fs from 'fs';

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

async function findRelatedImages(testImagePath, counts = 1) {
    try {
        const test = Buffer.from(fs.readFileSync(testImagePath)).toString('base64');
        const resImage = await client.graphql.get()
            .withClassName('Meme')
            .withFields(['image'])
            .withNearImage({ image: test })
            .withLimit(counts)
            .do();
        return resImage.data.Get.Meme.map(meme => meme.image);
    } catch (error) {
        console.error(`Failed to find related images: ${error}`);
        throw error; // Rethrow the error for the caller to handle
    }
}

async function writeImageResults(imagePath, resultPath, counts = 1) {
    try {
        const results = await findRelatedImages(imagePath, counts);
        results.forEach((result, index) => {
            const resultFilePath = `${resultPath}_${index + 1}.jpeg`;
            fs.writeFileSync(resultFilePath, result, 'base64');
            console.log(`Image result saved at ${resultFilePath}`);
        });
    } catch (error) {
        console.error(`Failed to write image results: ${error}`);
    }
}

async function main() {
    await writeImageResults('./img/test/test_3.jpeg', './img/results/result', 5);
}

main();
