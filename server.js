const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// JSON受信
app.use(express.json());

// 静的ファイル
app.use(express.static("public"));

// DB作成
const db = new sqlite3.Database("./doro.db");

// テーブル作成
db.run(`
  CREATE TABLE IF NOT EXISTS trap_count (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count INTEGER
  )
`);

// 初期データ
db.get("SELECT * FROM trap_count", (err, row) => {
  if (!row) {
    db.run("INSERT INTO trap_count (count) VALUES (0)");
  }
});

// API：引っかかった回数を +1
app.post("/api/trap", (req, res) => {
  db.run(
    "UPDATE trap_count SET count = count + 1",
    () => {
      res.json({ status: "ok" });
    }
  );
});

// 回数取得（確認用）
app.get("/api/trap", (req, res) => {
  db.get("SELECT count FROM trap_count", (err, row) => {
    res.json(row);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
