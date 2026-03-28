
export const uploadChatImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    const imageUrl = `chat-images/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });

  } catch (error) {
    console.error("Error uploading chat image:", error);
    
    if (error.message === "Only images are allowed") {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed (PNG, JPG, JPEG, GIF, WEBP)"
      });
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image size should be less than 5MB"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message
    });
  }
};

export default uploadChatImage;