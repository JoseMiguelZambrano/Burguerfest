import { Router, type IRouter } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth";
import { uploadBuffer } from "../lib/cloudinary";

const router: IRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.post("/uploads", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  try {
    const folder = `burger-fest/${req.user!.id}`;
    const isVideo = req.file.mimetype.startsWith("video/");
    const result = await uploadBuffer(req.file.buffer, {
      folder,
      resource_type: isVideo ? "video" : "image",
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    req.log?.error({ err }, "cloudinary upload failed");
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
