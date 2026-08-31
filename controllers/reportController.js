import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  try {
    const { recipeId, reason } = req.body;
    const userId = req.user?.userId || req.user?.id;

    const newReport = new Report({
      recipeId,
      userId,
      reason,
    });

    await newReport.save();
    res.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    console.error("❌ Create Report Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("recipeId")
      .populate("userId", "name email") 
      .sort({ createdAt: -1 });
      
    res.status(200).json(reports);
  } catch (error) {
    console.error("❌ Get All Reports Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Report dismissed" });
  } catch (error) {
    console.error("❌ Delete Report Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};