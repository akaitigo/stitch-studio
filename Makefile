.PHONY: build test lint format check clean wasm dev

build: wasm
	cd frontend && npm run build

wasm:
	cd wasm && wasm-pack build --target web --out-dir ../frontend/src/wasm-pkg

test:
	cd wasm && cargo test -- --nocapture
	cd frontend && npm test -- --run

lint:
	cd wasm && cargo clippy -- -D warnings
	cd frontend && npx oxlint src/

format:
	cd wasm && cargo fmt
	cd frontend && npx biome format --write src/

check: format lint test build
	@echo "All checks passed."

clean:
	cd wasm && cargo clean
	cd frontend && rm -rf dist node_modules/.vite

dev:
	cd frontend && npm run dev
