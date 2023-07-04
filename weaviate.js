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

const result = await findRelatedImage('./test.jpeg')
fs.writeFileSync('./result.jpeg', result, 'base64')