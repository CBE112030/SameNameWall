const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Post = require("./models/Post");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(
  express.json({
    limit: "50mb"
  })
);
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("SameNameWall Server Running!");
});

// GET：取得貼文列表
app.get("/api/posts", async (req, res) => {
  try {
    const username = req.query.username;

    const filter = username ? { username: username } : {};

    const posts = await Post.find(filter).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "取得貼文失敗" });
  }
});

// GET：取得指定名字的統計資料
app.get("/api/stats/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const totalCount =
      await Post.countDocuments({
        username
      });

    // 台灣今天凌晨 → UTC
    const now = new Date();

    const taiwan = new Date(
      now.toLocaleString(
        "en-US",
        {
          timeZone:
            "Asia/Taipei"
        }
      )
    );

    const startOfToday =
      new Date(
        Date.UTC(
          taiwan.getFullYear(),
          taiwan.getMonth(),
          taiwan.getDate(),
          -8,
          0,
          0
        )
      );

    const todayCount =
      await Post.countDocuments({
        username,
        createdAt: {
          $gte:
            startOfToday
        }
      });

    res.json({
      username,
      totalCount,
      todayCount
    });

  } catch {
    res
      .status(500)
      .json({
        message:
          "取得統計資料失敗"
      });
  }
});

// GET：取得今日熱門名字排行榜
app.get("/api/hot-names", async (req, res) => {
  try {

    const now = new Date();

    const taiwan =
      new Date(
        now.toLocaleString(
          "en-US",
          {
            timeZone:
              "Asia/Taipei"
          }
        )
      );

    const startOfToday =
      new Date(
        Date.UTC(
          taiwan.getFullYear(),
          taiwan.getMonth(),
          taiwan.getDate(),
          -8,
          0,
          0
        )
      );

    const hotNames =
      await Post.aggregate([
        {
          $match: {
            createdAt: {
              $gte:
                startOfToday
            }
          }
        },
        {
          $group: {
            _id:
              "$username",
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            count: -1
          }
        },
        {
          $limit: 5
        }
      ]);

    res.json(hotNames);

  } catch {res.status(500).json({message:"取得熱門名字失敗"});}
});

// POST：新增貼文
app.post("/api/posts", async (req, res) => {
  try {
    const newPost = new Post({
      username: req.body.username,
      activity: req.body.activity,
      mood: req.body.mood,
      place: req.body.place,
      tag: req.body.tag,
      images: req.body.images
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: "新增貼文失敗" });
  }
});

// DELETE：刪除貼文
app.delete("/api/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "刪除成功" });
  } catch (error) {
    res.status(500).json({ message: "刪除貼文失敗" });
  }
});

  app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    const imageUrl =
      `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "上傳失敗" });
  }
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});