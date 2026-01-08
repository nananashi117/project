const mainImage = document.getElementById("mainImage");
const bgm = document.getElementById("bgm");
const surpriseText = document.getElementById("surpriseText");
const titleArea = document.getElementById("titleArea");
const warningText = document.getElementById("warningText");


const images = [
  "img1.png",
  "img2.gif",
  "img3.gif",
  "img4.gif",
  "img5.gif",
];

let lastImage = null;

// 連打判定用
let clickTimes = [];
let triggered = false;
let bgmStarted = false;

const pugyaText = document.getElementById("pugyaText");


// 固定音声
const fixedAudio = new Audio("sound.mp3");

mainImage.addEventListener("click", () => {
  // 最初のクリックでBGM再生
  if (!bgmStarted) {
    bgm.play();
    bgmStarted = true;
  }

  if (triggered) return;

  const now = Date.now();
  clickTimes.push(now);
  clickTimes = clickTimes.filter(t => now - t <= 2000);

  // 2秒間に8回以上
  if (clickTimes.length >= 8) {
    triggered = true;

    // 引っかかった回数を保存
    fetch("/api/trap", {
      method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

    // 別タブ 
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>プギャー</title>
        <style>
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
           justify-content: center;
           align-items: center;
            background: #000;
         }
          img {
            max-width: 80vw;
           max-height: 70vh;
          }
          .text {
            margin-top: 20px;
            font-size: 32px;
            font-weight: bold;
            color: #fff;
          }
        </style>
      </head>
      <body>
        <img src="fixed.png">
        <div class="text">プギャーm9(^д^)</div>
      </body>
      </html>
    `);

    // 元ページ 
    mainImage.src = "200w.gif";
    surpriseText.style.display = "block";
    pugyaText.style.display = "block";

    // タイトルと注意文を消す
    titleArea.style.display = "none";
    warningText.style.display = "none";

    bgm.pause();
    fixedAudio.play();

    return;
  }


  // ランダム画像切り替え
  let nextImage;
  do {
    nextImage = images[Math.floor(Math.random() * images.length)];
  } while (nextImage === lastImage && images.length > 1);

  lastImage = nextImage;
  mainImage.src = nextImage;
});
