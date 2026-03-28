import path from "path";
import fs from "fs";
import Item from "../../model/report_schema/itemModel.js";
import Match from "../../model/report_schema/matchModel.js";
import User from "../../model/user_schema/index.js";
import * as tf from "@tensorflow/tfjs-node";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { sendNotification } from "../../services/socket/index.js";


const cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
};

const getImageEmbedding = async (imagePath, model) => {
  try {
    const buffer = fs.readFileSync(imagePath);
    let imageTensor = tf.node.decodeImage(buffer, 3);
    imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]); 
    imageTensor = imageTensor.div(255.0); 
    const batched = imageTensor.expandDims(0);

    const embeddingTensor = model.infer(batched, true); 
    const embedding = Array.from(embeddingTensor.dataSync());

    tf.dispose([imageTensor, batched, embeddingTensor]); 
    return embedding;
  } catch (err) {
    console.error("Error in getImageEmbedding:", err);
    throw err;
  }
};

export const handleReport = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      date,
      status,
      contactPhone,
      contactEmail,
    } = req.body;

    const latitude = req.body.location?.latitude;
    const longitude = req.body.location?.longitude;
    const address = req.body.location?.address;

    if (
      !type ||
      !title ||
      !category ||
      !latitude ||
      !longitude ||
      !date ||
      !contactPhone ||
      !contactEmail
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const images = req.files?.map((file) => `items/${file.filename}`) || [];

    const model = await mobilenet.load({ version: 2, alpha: 1.0 });

    
    const uploadedEmbeddings = [];
    for (const file of req.files || []) {
      const fullPath = path.join(process.cwd(), "app/uploads/items", file.filename);
      const embedding = await getImageEmbedding(fullPath, model);
      uploadedEmbeddings.push(embedding);
    }

    const newItem = await Item.create({
      reportedBy: req.user.id,
      type,
      title,
      description,
      category,
      date,
      status: status || "active",
      images,
      location: { latitude, longitude, address },
      contactPhone,
      contactEmail,
      imageEmbeddings: uploadedEmbeddings,
    });

    const admin = await User.findOne({ userRole: "admin" });
    if (admin) {
      await sendNotification({
        userId: admin._id,
        title: type === "lost" ? "Lost Item Reported" : "Found Item Reported",
        content: `A ${type} item titled "${title}" has been reported.`,
        relatedTo: newItem._id,
      });
    }

    const oppositeType = type === "lost" ? "found" : "lost";
    const candidates = await Item.find({
      type: oppositeType,
      category,
      status: "active",
    });

    let bestMatch = null;
    let highestScore = 0;

    for (const candidate of candidates) {
      if (!candidate.imageEmbeddings?.length) continue;
      for (const uploadedEmb of uploadedEmbeddings) {
        for (const candidateEmb of candidate.imageEmbeddings) {
          const score = cosineSimilarity(uploadedEmb, candidateEmb);
          if (score > highestScore) {
            highestScore = score;
            bestMatch = candidate;
          }
        }
      }
    }

    const MATCH_THRESHOLD = 0.75;
    let matchResult = null;

    if (bestMatch && highestScore >= MATCH_THRESHOLD) {
      const lostItemId = type === "lost" ? newItem._id : bestMatch._id;
      const foundItemId = type === "found" ? newItem._id : bestMatch._id;

      const match = await Match.create({
        lostItem: lostItemId,
        foundItem: foundItemId,
        confidence: highestScore,
      });

      await Item.updateMany(
        { _id: { $in: [lostItemId, foundItemId] } },
        { $set: { status: "matched" } }
      );

      const finderUserId = type === "found" ? newItem.reportedBy : bestMatch.reportedBy;
      await User.findByIdAndUpdate(finderUserId, { $inc: { rewardPoints: 10 } });

      await sendNotification({
        userId: newItem.reportedBy,
        title: "Item Match Found 🎯",
        content: "We found a possible match for your reported item. Please contact the user.",
        relatedTo: bestMatch._id,
      });

      await sendNotification({
        userId: bestMatch.reportedBy,
        title: "Item Match Found 🎯",
        content: "A reported item matches something you posted. Please contact the user.",
        relatedTo: newItem._id,
      });

      matchResult = {
        matchId: match._id,
        lostItem: lostItemId,
        foundItem: foundItemId,
        confidence: highestScore,
      };
    }

    return res.status(201).json({
      message: "Item reported successfully",
      item: newItem,
      matchedItem: matchResult,
    });
  } catch (error) {
    console.error("Handle Report Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
