import nextConnect from "next-connect";
import multer from "multer";
import shortid from "shortid";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads/clients",
    filename: (req, file, cb) =>
      cb(null, shortid.generate() + "-" + file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("clientImage"));

apiRoute.post((req, res) => {
  let file = req.file.filename;
  res.status(200).json({ file });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
