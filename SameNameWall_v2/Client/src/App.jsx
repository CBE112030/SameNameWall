import { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import "./App.css";

const API_URL = "https://samenamewall.onrender.com/api/posts";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function ImageCarousel({ images, activity }) {
  const [current, setCurrent] = useState(0);

  function next() {
    if (current < images.length - 1) {
      setCurrent(current + 1);
    }
  }

  function prev() {
    if (current > 0) {
      setCurrent(current - 1);
    }
  }

  return (
    <div className="carousel">
      <img src={images[current]} alt={activity} className="carousel-image" />

      {images.length > 1 && (
        <>
          <button
            className="carousel-arrow left"
            onClick={prev}
            type="button"
            disabled={current === 0}
          >
            ‹
          </button>

          <button
            className="carousel-arrow right"
            onClick={next}
            type="button"
            disabled={current === images.length - 1}
          >
            ›
          </button>

          <div className="carousel-dots">
            {images.map((_, i) => (
              <span key={i} className={i === current ? "dot active" : "dot"} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  const [page, setPage] = useState("home");

  const [username, setUsername] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [posts, setPosts] = useState([]);

  const [activity, setActivity] = useState("");
  const [mood, setMood] = useState("");
  const [place, setPlace] = useState("");
  const [tag, setTag] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0
  });
  const [croppedArea, setCroppedArea] = useState(null);
  const [zoom, setZoom] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [hotNames, setHotNames] = useState([]);

  async function fetchPosts(name) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}?username=${name}`);

      if (!response.ok) {
        throw new Error("取得資料失敗");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError("載入失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats(name) {
    try {
      const response = await fetch(`https://samenamewall.onrender.com/api/stats/${name}`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.log("統計資料載入失敗");
    }
  }

  async function fetchHotNames() {
    try {
      const response = await fetch("https://samenamewall.onrender.com/api/hot-names");
      const data = await response.json();
      setHotNames(data);
    } catch (err) {
      console.log("熱門名字載入失敗");
    }
  }

  function handleEnterWall() {
    if (username.trim() === "") {
      alert("請先輸入一個名字");
      return;
    }

    const name = username.trim();

    setCurrentName(name);
    fetchPosts(name);
    fetchStats(name);
    fetchHotNames();
    setPage("wall");
  }

  async function handleAddPost(e) {
    e.preventDefault();

    if (activity.trim() === "" || mood.trim() === "" || place.trim() === "") {
      alert("活動、心情、地點都是必填");
      return;
    }

    setLoading(true);

    let uploadedImages = [];

    if (imageFiles.length > 0) {
      for (let file of imageFiles) {
        const base64 =
          await fileToBase64(file);

        uploadedImages.push(base64);
      }
    }

    const newPost = {
      username: currentName,
      activity,
      mood,
      place,
      tag,
      images: uploadedImages
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPost)
      });

      if (!response.ok) {
        throw new Error("新增失敗");
      }

      setActivity("");
      setMood("");
      setPlace("");
      setTag("");
      setImageFiles([]);

      fetchPosts(currentName);
      fetchStats(currentName);
      fetchHotNames();

      setPage("wall");
    } catch (err) {
      setError("新增失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(id) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      fetchPosts(currentName);
      fetchStats(currentName);
      fetchHotNames();
    } catch (err) {
      setError("刪除失敗，請稍後再試。");
    }
  }

  if (page === "home") {
    return (
      <main className="app">
        <section className="hero">
          <h1>SameName Wall</h1>
          <p className="hero-text">
            今天的你是誰？輸入一個名字，進入同名者的公共牆。
          </p>

          {hotNames.length > 0 && (
            <div className="home-hot-box">
              <h2>🔥今日熱門名字🔥</h2>
              {hotNames.map((item, index) => (
                <p key={item._id}>
                  {index + 1}. {item._id}：{item.count} 篇
                </p>
              ))}
            </div>
          )}

          <div className="login-card">
            <label>輸入你的名字</label>

            <input
              type="text"
              placeholder="嗨，我今天是……"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button onClick={handleEnterWall}>進入同名牆</button>
          </div>
        </section>
      </main>
    );
  }

  if (page === "create") {
    return (
      <main className="wall-page">
        <section className="wall-header">
          <button className="back-btn" onClick={() => setPage("wall")}>
            ← 回到同名牆
          </button>

          <h1>發布到「{currentName}」的同名牆</h1>
        </section>

        <form className="post-form" onSubmit={handleAddPost}>
          <h2>新增今日狀態</h2>

          <input
            type="text"
            placeholder="你在做什麼？"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />

          <input
            type="text"
            placeholder="今天心情如何？"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />

          <input
            type="text"
            placeholder="地點（當然，你可以在任何地方）："
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />

          <input
            type="text"
            placeholder="標籤，例如：好想躺平🦥"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />

          <div className="upload-box">
            <p className="upload-count">已選 {imageFiles.length} / 3 張</p>

            <div className="preview-grid">
              {imageFiles.map((file, index) => (
                <div
                  key={index}
                  className="preview-item"
                  onClick={() => {
                    const ok = window.confirm("要刪除這張圖片嗎？");
                    if (!ok) return;

                    setImageFiles((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                  }}
                >
                  <img src={URL.createObjectURL(file)} alt="preview" />
                </div>
              ))}

              {imageFiles.length < 3 && (
                <label className="add-box">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // 👉 開始裁切這一張
                      setCropImage(file);

                      // 👉 清空 input，避免同一張不能重選
                      e.target.value = "";
                    }}
                  />

                  <div className="add-btn">+</div>
                </label>
              )}
            </div>

            {cropImage && (
              <div className="crop-modal">

              <Cropper
                image={URL.createObjectURL(cropImage)}

                crop={crop}

                zoom={zoom}

                aspect={1}

                onCropChange={setCrop}

                onZoomChange={setZoom}

                onCropComplete={(
                _,
                croppedPixels
                )=>{
                setCroppedArea(
                croppedPixels
                );
                }}
                />

            <button
              type="button"
              onClick={async () => {
                try {
                  const cropped = await getCroppedImg(
                    URL.createObjectURL(cropImage),
                    croppedArea
                  );

                  setImageFiles((prev) => [
                    ...prev,
                    new File(
                      [cropped],
                      `crop-${Date.now()}.jpg`,
                      {
                        type: "image/jpeg"
                      }
                    )
                  ]);

                  setCropImage(null);

                  setCrop({
                    x: 0,
                    y: 0
                  });

                  setZoom(1);

                } catch (err) {
                  console.log(err);
                }
              

                setCrop({
                x:0,
                y:0
                });

                setZoom(1);

                }}
              >
              完成裁切
            </button>

            </div>
            )}

            <p className="upload-tip">點選照片可刪除</p>
          </div>

          <button type="submit">發佈</button>
        </form>
      </main>
    );
  }

  return (
    <main className="wall-page">
      <section className="wall-header">
        <button className="back-btn" onClick={() => setPage("home")}>
          ← 換名字
        </button>

        <h1>{currentName} 的同名牆</h1>

        {stats && (
          <div className="stats-box">
            {hotNames.length > 0 && (
              <div className="hot-box">
                <h2>🔥 今日熱門名字</h2>

                {hotNames.map((item, index) => (
                  <p key={item._id}>
                    {index + 1}. {item._id}：{item.count} 篇
                  </p>
                ))}
              </div>
            )}

            <p>這面牆總共有 {stats.totalCount} 篇貼文</p>
            <p>今天有 {stats.todayCount} 位「{currentName}」發文</p>
          </div>
        )}

        <button className="create-btn" onClick={() => setPage("create")}>
          去發佈
        </button>
      </section>

      {loading && <p className="message">載入中...</p>}

      {error !== "" && <p className="message error">{error}</p>}

      {!loading && posts.length === 0 && (
        <p className="message">這面牆目前還沒有貼文。</p>
      )}

      <section className="post-list">
        {posts.map((post) => (
          <article className="post-card" key={post._id}>
            {post.images?.length > 0 && (
              <ImageCarousel images={post.images} activity={post.activity} />
            )}

            <h3>{post.activity}</h3>
            <p>心情：{post.mood}</p>
            <p>地點：{post.place}</p>

            {post.tag && <span className="tag">#{post.tag}</span>}

            <p className="time">
              {new Date(post.createdAt).toLocaleString()}
            </p>

            <button
              className="delete-btn"
              onClick={() => handleDeletePost(post._id)}
            >
              刪除
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;