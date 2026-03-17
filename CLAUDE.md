# yakyuu

野球中継スコアボードオーバーレイ。OBSブラウザソース用。

## 構成
- `/overlay` — OBS用オーバーレイ（透明背景・読み取り専用）
- `/control` — スコアキーパー操作パネル

## 技術
- React + Vite + TypeScript + Tailwind CSS + Zustand
- BroadcastChannel API でタブ間リアルタイム同期
- localStorage で状態永続化

## 開発
```bash
npm run dev    # http://localhost:5173
npm run build  # 本番ビルド
```

## ルール
- オーバーレイの背景は必ず透明（`background: transparent`）
- パネルスタイル: `bg-black/80 backdrop-blur-sm rounded-lg`
- アクセントカラー: `#538bb0`
- BSO色: Ball=緑, Strike=黄, Out=赤
