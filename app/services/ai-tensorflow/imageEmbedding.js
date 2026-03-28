import * as tf from "@tensorflow/tfjs-node";
import mobilenet from "@tensorflow-models/mobilenet";
import fs from "fs";

let model;

export const loadModel = async () => {
  if (!model) {
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
  }
  return model;
};

export const getImageEmbedding = async (imagePath) => {
  const model = await loadModel();

  const imageBuffer = fs.readFileSync(imagePath);
  const imageTensor = tf.node
    .decodeImage(imageBuffer)
    .resizeNearestNeighbor([224, 224])
    .expandDims(0)
    .toFloat()
    .div(255);

  const embedding = model.infer(imageTensor, true);
  const vector = await embedding.array();

  tf.dispose([imageTensor, embedding]);

  return vector[0]; // 1D array
};
