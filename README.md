# SameName Wall — 同名牆系統

## 一、專案簡介

SameName Wall 是一個匿名公共牆平台，使用者輸入任意名字即可進入該名字的公共牆，查看與發布貼文，與同名者共享每日生活。
本系統以「名字作為公共交流入口」為概念，不需登入即可快速參與，並透過每日熱門名字排行榜與貼文統計功能，呈現同名使用者的活動情況。

系統提供：
    * 查看同名者貼文
    * 發布生活紀錄
    * 上傳圖片（最多 3 張）
    * 圖片裁切功能
    * 熱門名字排行榜
    * 發文統計
    * 刪除貼文
    * 圖片輪播顯示


## 二、系統架構

### 前端（Client）

* React
* HTML / CSS
* Fetch API
* react-easy-crop

負責：
    * 使用者介面
    * 圖片裁切
    * API 串接
    * 貼文顯示

---

### 後端（Server）

* Node.js
* Express.js
* RESTful API

負責：
    * 接收前端請求
    * 處理貼文資料
    * 統計熱門名字
    * 資料存取

---

### 資料庫

* MongoDB Atlas

負責：

    * 儲存貼文資料
    * 統計與查詢


## 三、專案部署（Deployment）

### 原始碼管理

GitHub

功能：
    * 專案版本控制
    * Commit 開發紀錄
    * 與部署平台串接

---

### 前端部署

Vercel

功能：
    * 部署 React 網站
    * 與 GitHub 自動同步
    * Push 後自動重新建置

---

### 後端部署

Render

功能：
    * 部署 Express API
    * 提供公開 API

* API： https://samenamewall.onrender.com
* 取得貼文列表： https://samenamewall.onrender.com/api/posts
* 取得指定名字的統計資料： https://samenamewall.onrender.com/api/stats/:username
* 取得今日熱門名字排行榜： https://samenamewall.onrender.com/api/hot-names

---

### 資料庫部署

MongoDB Atlas

功能：
    * 雲端儲存貼文資料

---

### 部署流程

本機開發
↓
Git Commit
↓
Push → GitHub
↓
Vercel 部署前端
↓
Render 部署後端
↓
MongoDB Atlas 儲存資料


## 四、系統教學

### Step1 進入首頁

輸入想查看的名字。

例如：小明

點擊：【進入同名牆】

---

### Step2 查看貼文

系統顯示：
    * 活動內容
    * 心情
    * 地點
    * 標籤
    * 上傳照片
    * 發文時間

---

### Step3 發布貼文

點選：【去發布】

填寫：
    活動 → 今天在做什麼

    心情 → 開心／難過...

    地點 → 目前所在地

    標籤(hashtag) → 自由填寫

    照片 → 最多 3 張
    可使用：
        * 圖片裁切
        * 預覽刪除

完成後：【發布】

---

### Step4 管理貼文

功能：
    * 查看圖片輪播
    * 刪除貼文


## 五、API 路由表

| Method | Route                | 功能    |
| ------ | -------------------- | --------|
| GET    | /api/posts           | 查詢貼文 |
| POST   | /api/posts           | 新增貼文 |
| DELETE | /api/posts/:id       | 刪除貼文 |
| GET    | /api/stats/:username | 統計資料 |
| GET    | /api/hot-names       | 熱門名字 |
| POST   | /api/upload          | 圖片上傳 |

* /api/upload 僅在 vscode 裡執行才會存進 upload


## 六、資料格式

POST /api/posts

{
 "username":"Amy",
 "activity":"吃火鍋",
 "mood":"開心",
 "place":"高雄",
 "tag":"週末",
 "images":[
   "base64..."
 ]
}


## 七、資料庫設計

Collection：

    posts

    | 欄位      | 型別   |
    | --------- | ------ |
    | username  | String |
    | activity  | String |
    | mood      | String |
    | place     | String |
    | tag       | String |
    | images    | Array  |
    | createdAt | Date   |


## 八、環境變數（.env.example）

Server/.env

PORT=3000

MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/samenamewall


## 九、組員分工

### CBE112030 楊詠晴

* 優化 UI 與介面調整
* 圖片裁切功能
* 測試與除錯
* 固定貼文版面尺寸，避免內容長短造成版面跑版
* 導入 react-easy-crop 套件實作圖片裁切功能
* 實作多張圖片上傳
* 建立圖片預覽、刪除與重新選取流程
* 修正圖片連結失效與圖片載入問題
* API 串接
* 完成前後端正式環境整合
* GitHub 專案管理與上傳
* 整合 MongoDB Atlas 與網站資料流程
* 使用 Render 完成後端部署
* 使用 Vercel 完成前端部署
* 配置環境變數（Environment Variables）

---

### CBE112052 林映昀

* 發想 SameName Wall 專案主題與核心概念
* 規劃「輸入名字進入同名牆」的使用流程
* 建立前後端專案初始架構
* 建立 React 前端基本頁面與狀態切換流程
* 規劃首頁、同名牆瀏覽頁與發布頁的功能架構
* 設計 MongoDB 貼文資料欄位
* 建立 Mongoose Schema 初版
* 實作貼文列表顯示、新增貼文與刪除貼文功能
* 串接 Express API 與 React 前端資料流程
* 實作 Loading、Error、Empty state 等狀態處理
* 規劃圖片上傳、與多張圖片顯示方式，實作圖片輪播
* 實作熱門名字排行與同名牆貼文統計功能
* 協助前後端整合測試與功能除錯



## 十、未來改善方向

* 圖片改為更好的方式儲存(base64太大)
* JWT 登入驗證
* 留言功能
* 按讚功能
* 圖片壓縮
* Lazy Loading


## 十一、專案成果

已完成：
    ✅ React 前端建置
    ✅ Express 後端 API
    ✅ MongoDB Atlas 整合
    ✅ GitHub 版本控制
    ✅ Vercel 前端部署
    ✅ Render 後端部署
    ✅ 圖片上傳與裁切
    ✅ 同名公共牆功能
    ✅ 熱門名字統計
    ✅ 貼文刪除功能
