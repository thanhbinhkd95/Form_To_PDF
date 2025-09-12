/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const admin = require("firebase-admin");
const cors = require("cors")({
  origin: [
    "http://localhost:5175",
    "https://form-to-pdf-52d69.web.app",
    "https://form-to-pdf-52d69.firebaseapp.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
});

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Initialize Admin SDK once
admin.initializeApp();

// HTTP function to upload PDF from base64 and return download URL
exports.uploadPdf = onRequest({ timeoutSeconds: 60, memory: "256MiB" }, (req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
      }
      const { base64, filename } = req.body || {};
      if (!base64 || !filename) {
        return res.status(400).json({ error: "Missing base64 or filename" });
      }

      const buffer = Buffer.from(base64, "base64");
      const bucket = admin.storage().bucket();
      const now = new Date().toISOString().replace(/[:.]/g, "-");
      const objectPath = `application-forms/${now}_${filename}`;

      const file = bucket.file(objectPath);
      await file.save(buffer, {
        contentType: "application/pdf",
        metadata: {
          metadata: {
            uploadedAt: new Date().toISOString(),
            originalName: filename,
          },
        },
        resumable: false,
      });

      // Make file public-read instead of signed URL to avoid IAM permission issues
      await file.makePublic();
      const url = `https://storage.googleapis.com/${bucket.name}/${objectPath}`;

      return res.json({ ok: true, downloadURL: url, path: objectPath });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message || String(err) });
    }
  });
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
