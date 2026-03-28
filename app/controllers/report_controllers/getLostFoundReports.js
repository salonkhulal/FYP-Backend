import Item from "../../model/report_schema/itemModel.js";

export const getLostFoundReports = async (req, res) => {
  try {
    const {
      type,     
      page = 1,
      limit = 10,
      category,
      search,
      location,
      sort = "-createdAt",
    } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (location) {
      filter["location.address"] = {
        $regex: location,
        $options: "i",
      };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const items = await Item.find(filter)
      .populate("reportedBy", "userName userImage email phoneNumber")
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    const total = await Item.countDocuments(filter);

    return res.status(200).json({
      success: true,
      items,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch items",
    });
  }
};