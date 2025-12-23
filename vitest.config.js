import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // 전역 테스트 API 사용 (describe, test, expect 등)
        globals: true,

        // 테스트 환경 (node 또는 jsdom)
        environment: 'node',

        // 커버리지 설정
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],

            // 커버리지에서 제외할 파일
            exclude: [
                'src/scripts/ui.js',
                'src/scripts/main.js',
                'src/index.html',
                '**/*.config.js',
                '**/node_modules/**',
                '**/dist/**',
                '**/.{idea,git,cache,output,temp}/**'
            ],

            // 커버리지 임계값
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80
            }
        },

        // 테스트 파일 패턴
        include: ['tests/**/*.test.js', 'src/**/*.test.js'],

        // 테스트 타임아웃
        testTimeout: 10000
    }
});
