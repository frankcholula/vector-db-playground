import weaviate from 'weaviate-ts-client'
import fs from 'fs'
const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080'
})

async function findRelatedImage(testImagePath) {
    const test = Buffer.from(fs.readFileSync(testImagePath)).toString('base64')
    const resImage = await client.graphql.get()
        .withClassName('Meme')
        .withFields(['image'])
        .withNearImage({ image: test })
        .withLimit(1)
        .do();
    return resImage.data.Get.Meme[0].image;
}

const result1 = await findRelatedImage('./test_1.jpeg')
const result2 = await findRelatedImage('./test_2.jpeg')

fs.writeFileSync('./result_1.jpeg', result, 'base64')
fs.writeFileSync('./result_2.jpeg', result, 'base64')
