import Item from "../../model/report_schema/itemModel.js";

export const getAllReports = async (req, res) => {
  try {
    const reports = await Item
      .find()
      .populate({
        path: "reportedBy",
        select: "userName email userImage",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};
