import { Router } from "express";
import * as resumeController from "../controllers/resume.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import cloudinary from "../config/cloudinary";

import app from "../app";

const router = Router();


router.get("/cloudinary-test", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Protect all resume routes
const handleUpload = (req: any, res: any, next: any) => {
  upload.single("resume")(req, res, (err: any) => {
    if (err && err.name === 'MulterError') {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
          success: false, 
          message: `Unexpected file field: '${err.field}'. Expected 'resume'.` 
        });
      }
      return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ success: false, message: `Upload Error: ${err.message}` });
    }
    next();
  });
};

router.post("/upload", authenticate, handleUpload, resumeController.upload);
router.get("/me", authenticate, resumeController.getMyResume);
router.post("/parse/:resumeId", authenticate, resumeController.parseResume);

export default router;
