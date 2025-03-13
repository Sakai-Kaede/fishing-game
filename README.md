<div id="top"></div>

## 遊び方

以下のリンクからゲームをプレイできます！  
🔗 [釣りゲームをプレイする](https://fishing-game-frontend.vercel.app/)

## 使用技術一覧

<p style="display: inline">
  <!-- フロントエンドのフレームワーク一覧 -->
  <img src="https://img.shields.io/badge/-Nuxt-EEEEEE.svg?logo=Nuxt&style=flat-square">

  <!-- バックエンドのフレームワーク一覧 -->
  <img src="https://img.shields.io/badge/-Express-4FC08D.svg?logo=Express&style=flat-square">
  <img src="https://img.shields.io/badge/-MongoDB-EEEEEE.svg?logo=MongoDB&style=flat-square">
</p>

## 目次

1. プロジェクトについて
2. 環境
3. ディレクトリ構成

## 釣りゲーム

魚を釣って、集めるゲーム

## プロジェクトについて

ユーザーは魚を釣ることで図鑑を完成させながら、所持金を増やしていきます。所持金は、釣竿のレベルアップやポーカーでさらに所持金を増やすチャレンジに使えます。また、捕まえた魚の種類や数、ポーカーでのスコアに応じて実績が解除されます。さらに、ランキング機能を活用して、他のユーザーと所持金を競い合うことができます。


## 環境

| 言語・フレームワーク  | バージョン |
| --------------------- | ---------- |
| Nuxt.js             　| 3.14.1592  |
| Vue.js                | 3.5.13     |
| Node.js               | 20.11.0    |

その他のパッケージのバージョンは package.json を参照してください

## ディレクトリ構成

<pre>
.
|-- backend
|   |-- .env
|   |-- .gitignore
|   |-- package-lock.json
|   |-- package.json
|   |-- src
|   |-- tsconfig.json
|   `-- vercel.json
`-- frontend
    |-- .gitignore
    |-- README.md
    |-- app.vue
    |-- assets
    |-- components
    |-- composable
    |-- constants
    |-- layouts
    |-- nuxt.config.ts
    |-- package-lock.json
    |-- package.json
    |-- pages
    |-- plugins
    |-- public
    |-- repositories
    |-- server
    |-- store
    |-- tsconfig.json
    `-- types
</pre>
