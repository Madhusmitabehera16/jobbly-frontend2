"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resumeController = __importStar(require("../controllers/resume.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const router = (0, express_1.Router)();
router.get("/cloudinary-test", async (req, res) => {
    try {
        const result = await cloudinary_1.default.api.ping();
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
// Protect all resume routes
const handleUpload = (req, res, next) => {
    upload_middleware_1.upload.single("resume")(req, res, (err) => {
        if (err && err.name === 'MulterError') {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    success: false,
                    message: `Unexpected file field: '${err.field}'. Expected 'resume'.`
                });
            }
            return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
        }
        else if (err) {
            return res.status(500).json({ success: false, message: `Upload Error: ${err.message}` });
        }
        next();
    });
};
router.post("/upload", auth_middleware_1.authenticate, handleUpload, resumeController.upload);
router.get("/me", auth_middleware_1.authenticate, resumeController.getMyResume);
router.post("/parse/:resumeId", auth_middleware_1.authenticate, resumeController.parseResume);
exports.default = router;
//# sourceMappingURL=resume.routes.js.map