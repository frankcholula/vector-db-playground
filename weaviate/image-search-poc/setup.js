import weaviate from 'weaviate-ts-client'
import fs from 'fs'
const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080'
})

const schemaRes = await client.schema.getter().do()


const schemaConfig = {
    'class': 'Meme',
    'vectorizer': 'img2vec-neural',
    'vectorIndexType': 'hnsw',
    'moduleConfig': {
        'img2vec-neural': {
            'imageFields': [
                'image'
            ]
        }
    },
    'properties': [
        {
            'name': 'image',
            'dataType': ['blob']
        },
        {
            'name': 'text',
            'dataType': ['string']
        }
    ]
}

async function addSchema() {
    const res = await client.schema.
        classCreator().
        withClass(schemaConfig).do();
    console.log(res);
}

async function importImages(directoryPath) {
    const files = fs.readdirSync(directoryPath);

    await Promise.all(
        files.map(async (file) => {
            const filePath = `${directoryPath}/${file}`;
            const img = fs.readFileSync(filePath);
            const b64 = Buffer.from(img).toString('base64');
            const txt = file.split('.')[0].split('_').join(' ')
            await client.data.creator()
                .withClassName('Meme')
                .withProperties({
                    image: b64,
                    text: txt,
                })
                .do();
        })
    );
}

async function deleteObject(className, idToDelete) {
    const res = await client.data
        .deleter()
        .withClassName(className)
        .withId(idToDelete)
        .do();
    console.log(res);
}

async function deleteClass(className) {
    const res = client.schema
        .classDeleter()
        .withClassName(className)
        .do()
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.error(err)
        });
}
// await deleteClass('Meme');

async function checkData() {
    const res = await client.data
        .getter()
        .do()
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.error(err)
        });
}

// await addSchema();
// await importImages('./img')
//     .then(() => {
//         console.log('Image import completed.');
//     })
//     .catch((error) => {
//         console.error('Error occurred during image importing:', error);
//     });
await checkData();
