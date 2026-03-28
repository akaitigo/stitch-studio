# Harvest: stitch-studio

> Stage 6 (Harvest) チェックリスト。プロジェクト完了後に記入し、テンプレート改善に活用する。

## プロジェクト概要

- **アイデアID**: #350
- **ドメイン**: 刺繍/クロスステッチ
- **テンプレートバージョン**: v5.0 (Layer-0 + Layer-1 Rust + Layer-1 TypeScript)
- **特記事項**: Rust Layer-1テンプレートの初実戦投入。モノレポ（Rust WASM + TypeScript/React）構成。

## 使えたもの

- [x] Makefile - モノレポ統合ビルドに有効。wasm/frontend両方を`make check`で一括検証
- [x] lint設定 (clippy.toml + rustfmt.toml) - pedantic設定がCI失敗を早期検出。cast_sign_loss等の修正を強制
- [x] CI YAML (.github/workflows/ci.yml) - Rust + Frontend の2ジョブ構成で正常動作
- [x] CLAUDE.md - Rust + TypeScript両ルールを統合記載。モノレポでも1ファイルで運用可能
- [x] ADR テンプレート - 0001 (Rust/WASM選定) を初期段階で記録
- [x] 品質チェックリスト (quality-checklist.md) - 5項目チェックで漏れ防止
- [x] Hooks (PostToolUse) - post-lint.sh をモノレポ用にRust+TS両対応にカスタマイズ
- [x] startup.sh - ツール自動検出・インストールが有効に機能

## 使えなかったもの（理由付き）

- lefthook: モノレポでwasm-pack buildが必要なため、pre-commitフックでの実行が重い。CIに任せた方が良い
- bats / E2E テスト: CLI不要なWebアプリのため。PlaywrightによるE2Eは将来的に有効だが、MVPスコープ外

## テンプレートへの改善提案

1. **Rust Layer-1: wasm-opt 互換性問題**: Cargo.toml テンプレートに `[package.metadata.wasm-pack.profile.release] wasm-opt = false` をデフォルト追加すべき。wasm-opt のバージョン不整合でビルド失敗するケースが多い
2. **Rust Layer-1: cast_possible_truncation 対策**: テンプレートのサンプルコードで `u8::try_from().unwrap_or()` パターンを示すべき。`as u8` は clippy pedantic で即座に弾かれる
3. **モノレポ対応**: post-lint.sh テンプレートにモノレポ用の分岐パターンを追加。ファイル拡張子でwasm/ or frontend/ のどちらのlinterを呼ぶか切り替える
4. **CI テンプレート**: Rust + Frontend の2ジョブ構成テンプレートがあると良い（wasm-pack build を Frontend ジョブの前段に入れる定型パターン）

## 次のPJへの申し送り

- Rust 1.94.1 でedition 2024 が安定。テンプレートの `rust-version` を更新すべき
- `wasm-pack` は npm 版（0.14.0）で問題なく動作。cargo install 版は依存関係の edition 2024 要求でインストール失敗するケースあり
- clippy pedantic は `cast_sign_loss` と `cast_possible_truncation` が最も頻繁にヒットする。事前に `abs_diff()` + `try_from()` パターンを把握しておくとスムーズ
- モノレポの WASM パッケージは `.gitignore` に入れず、生成物をコミットする方がCIが単純になる（ただし今回は CI で毎回ビルドする方針を選択）

## 品質チェックリスト結果

- [x] READMEのクイックスタートがコピペで動く
- [x] デモ画像がREADMEにある (2枚: welcome + editor)
- [x] ハッピーパスのテストがCIで通る (Rust 7 + Frontend 11 = 18 tests)
- [x] ADRが1つ以上ある (0001: Rust/WASM選定)
- [x] grep -rn "TODO|console.log" で0件

## 数値

| 指標 | 値 |
|------|-----|
| テスト数 | 18 (Rust 7 + Frontend 11) |
| Clippy warnings | 0 |
| oxlint errors | 0 (warnings: wasm-pkg auto-generated only) |
| CI ジョブ | 2 (Rust, Frontend) |
| DMC色数 | 72 |
| ADR数 | 1 |
| Issues | 5 (全Close) |
| PRs | 1 (全Merge) |
