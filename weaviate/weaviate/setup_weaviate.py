import weaviate
import logging

client = weaviate.Client(
    url="http://localhost:8080",
)

def add_schema():
    if client.schema.exists("Posts"):
        client.schema.delete_class("Posts")

    class_object = {
        "class": "Posts",
        "vectorizer": "img2vec-neural",
        "vectorIndexType": "hnsw",
        "moduleConfig": {
            "img2vec-neural": {
                "imageFields": [
                    "image",
                ],
            },
        },
        "properties": [
            {
                "name": "image",
                "dataType": ["blob"],
            },
            {
                "name": "text",
                "dataType": ["string"],
            },
        ],
    }
    try:
        client.schema.create(class_object)
        logging.info("Schema created succesfully")
    except Exception as e:
        raise e

def import_images(dir_path):
    def setup_batch():
        client.batch.configure(
            batch_size=10,
            dynamic=True,
            timeout_retries=3,
            callback=None
        )
    def image_to_base64(image_path):
        pass
        
    with client.batch(batch_size=10) as batch:



if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    add_schema()
