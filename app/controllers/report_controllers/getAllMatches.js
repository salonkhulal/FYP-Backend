import Match from "../../model/report_schema/matchModel.js";

export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("lostItem")
      .populate("foundItem")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    console.error("Get Matches Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
