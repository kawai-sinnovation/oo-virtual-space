# oO Virtual SPACE

新潟・古町モールとコミュニティラウンジ「oO」を再現した 2D バーチャル空間のフロントエンドモックです。ブラウザ単体で動き、Discord SDK や Supabase には接続しません。

## 見本（GitHub Pages）

公開中: [https://kawai-sinnovation.github.io/oo-virtual-space/](https://kawai-sinnovation.github.io/oo-virtual-space/)

ホスティングは **GitHub リポジトリ + GitHub Pages** です。見本公開と試作・少人数実験までは月額 0 円で始められます。本営業・常時稼働などでは月額が発生しうるため、詳細は次の資料を参照してください。

- [公開・費用の目安（GitHub 前提）](./docs/cost-and-hosting.md)

## 起動

```bash
npm install
npm run dev
```

GitHub Pages 向けビルド:

```bash
npm run build:pages
```

## 操作

- マップをクリックすると、自分のアバターがその地点へ約 0.4 秒で移動します
- 矢印キー、または WASD でも移動できます
- 下部バーから一言ステータス（20文字まで）と、各ゾーンへのクイック移動ができます
- 右の参加者一覧から「会いに行く」で、その人の近くへ移動できます
- デモモードをオンにすると、ダミーメンバーが歩き回ります

在席データは `src/types/presence.ts` と `src/hooks/usePresence.ts` に分離してあります。将来 Supabase Realtime へ差し替えるときは、このフックの中だけを置き換えます。
