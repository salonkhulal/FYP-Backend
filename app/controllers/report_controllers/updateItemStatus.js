import Item from "../../model/report_schema/itemModel.js";

export const updateItemStatus = async (req, res) => {
  try {
    const { itemId, userId } = req.params;
    const { status } = req.body;
    // console.log("Update Item Status Request:", { itemId, userId, status });

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const allowedStatus = ["claimed", "closed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }


    if (item.reportedBy.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to update this item",
      });
    }

    item.status = status;
    await item.save();

    return res.status(200).json({
      message: "Item status updated successfully",
      item,
    });

  } catch (error) {
    console.error("Update Item Status Error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
