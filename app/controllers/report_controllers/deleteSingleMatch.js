import Match from "../../model/report_schema/matchModel.js";
import Item from "../../model/report_schema/itemModel.js";

export const deleteSingleMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }

    await Item.updateMany(
      { _id: { $in: [match.lostItem, match.foundItem] } },
      { $set: { status: "active" } }
    );

    await Match.findByIdAndDelete(matchId);

    return res.status(200).json({
      success: true,
      message: "Match deleted and items reset to active",
    });
  } catch (error) {
    console.error("Delete Match Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
