import weaviate from 'weaviate-ts-client';
import fs from 'fs';

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

const schemaConfig = {
    'class': 'MSRC',
    'vectorizer': 'img2vec-neural',
    'vectorIndexType': 'hnsw',
    'moduleConfig': {
        'img2vec-neural': {
            'imageFields': [
                'image',
            ],
        },
    },
    'properties': [
        {
            'name': 'image',
            'dataType': ['blob'],
        },
        {
            'name': 'text',
            'dataType': ['string'],
        },
    ],
};

async function addSchema(schemaConfig) {
    try {
        const res = await client.schema.classCreator().withClass(schemaConfig).do();
        logSuccess(`schema '${schemaConfig.class}' successfully created.`);
    } catch (error) {
        logError(error);
    }
}

async function importImages(directoryPath) {
    try {
        const files = fs.readdirSync(directoryPath);

        await Promise.all(
            files.map(async (file) => {
                const filePath = `${directoryPath}/${file}`;
                const img = fs.readFileSync(filePath);
                const b64 = Buffer.from(img).toString('base64');
                const txt = file.split('.')[0].split('_').join(' ');
                await client.data.creator()
                    .withClassName('MSRC')
                    .withProperties({
                        image: b64,
                        text: txt,
                    })
                    .do();
            }),
        );
        logSuccess('Image import completed.');
    } catch (error) {
        logError(`Error occurred during image importing: ${error}`);
    }
}

async function deleteObject(className, idToDelete) {
    try {
        const res = await client.data
            .deleter()
            .withClassName(className)
            .withId(idToDelete)
            .do();
        logSuccess('Object deleted successfully.');
    } catch (error) {
        logError(error);
    }
}

async function deleteClass(className) {
    try {
        const res = await client.schema
            .classDeleter()
            .withClassName(className)
            .do();
        logSuccess(`class '${className}' successfully deleted.`);
    } catch (error) {
        logError(error);
    }
}

async function checkData() {
    try {
        const res = await client.data.getter().do();
        logSuccess(res);
    } catch (error) {
        logError(error);
    }
}

function logSuccess(message) {
    console.log(message);
}

function logError(error) {
    console.error(error);
}

async function main() {
    // await deleteClass('MSRC');
    await addSchema(schemaConfig);
    for (let i = 1; i <= 20; i++) {
        await importImages(`./img/samples/class_${i}`);
    }
    // await checkData();
}
// Run the main function
main();
