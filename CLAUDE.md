# stitch-studio
<!-- メンテナンス指針: 各行に問う「この行を消したらエージェントは間違えるか？」→ No なら削除 -->

## コマンド
- ビルド: `make build`
- テスト: `make test`
- lint: `make lint`
- フォーマット: `make format`
- 全チェック: `make check`
- WASM ビルド: `make wasm`
- フロントエンド開発: `make dev`

## ワークフロー
1. research.md を作成（調査結果の記録）
2. plan.md を作成（実装計画。人間承認まで実装禁止）
3. 承認後に実装開始。plan.md のtodoを進捗管理に使用

## 構造
```
wasm/           Rust/WASM 画像処理エンジン
  src/
    lib.rs      エントリポイント（wasm-bindgen exports）
frontend/       TypeScript/React フロントエンド
  src/
    components/ React コンポーネント
    hooks/      カスタムフック
    types/      型定義
    utils/      ユーティリティ（DMC糸データ等）
docs/
  adr/          Architecture Decision Records
```

## ルール
- ADR: docs/adr/ 参照。新規決定はADRを書いてから実装
- テスト: 機能追加時は必ずテストを同時に書く
- lint設定の変更禁止（ADR必須）
- critical ruleは本ファイルの先頭に配置（earlier-instruction bias対策）

### Rust ルール
- `unwrap()` / `expect()` 禁止 → `?` 演算子または明示的エラーハンドリング
- `unsafe` ブロック禁止
- `todo!()` / `unimplemented!()` 禁止
- `println!` / `eprintln!` 禁止（WASM環境では使わない）
- Clippy pedantic レベル準拠

### TypeScript ルール
- `any` 型の使用禁止。`unknown` + 型ガードまたはジェネリクスを使う
- `as` 型アサーションは最小限に。型推論またはジェネリクスで解決
- `console.log` のコミット禁止

## 禁止事項
- any型(TS) / unwrap(Rust) → 各言語ルール参照
- console.log / print文のコミット
- TODO コメントのコミット（Issue化すること）
- .env・credentials のコミット
- lint設定の無効化（ルール単位の disable 含む）

## Hooks
- 設定: .claude/settings.json 参照
- Rust: PostToolUse で cargo clippy --fix + cargo fmt 自動実行
- TypeScript: PostToolUse で biome format + oxlint --fix 自動実行

## 状態管理
- git log + GitHub Issues でセッション間の状態を管理
- セッション開始: `bash .claude/startup.sh`（ツール自動インストール + ヘルスチェック）

## コンテキスト衛生
- .gitignore / .claudeignore で不要ファイルを除外
- バイナリ、キャッシュ、node_modules、target/ がコンテキストを汚染しないこと
