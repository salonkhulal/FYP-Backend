import Item from "../../model/report_schema/itemModel.js";
import fs from "fs";
import path from "path";

export const deleteReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Item.findById(id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }


    if (report.images && report.images.length > 0) {
      report.images.forEach((imgPath) => {
        const fullPath = path.join("app", "uploads", imgPath);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await Item.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete report error:", error);
    return res.status(500).json({
      message: "Failed to delete report",
    });
  }
};
