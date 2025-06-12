build:
	bun install; \
	bunx lerna run build;

publish: build
	bunx lerna publish;
