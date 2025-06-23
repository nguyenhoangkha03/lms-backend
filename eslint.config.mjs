import { configs as eslintConfigs } from '@eslint/js'; // cung cấp config chuẩn của js gốc
import globals from 'globals'; // thư viện gom sẵn các biến toàn cục
import tseslint from 'typescript-eslint'; // eslint dành cho typescript
import pluginPrettier from 'eslint-plugin-prettier'; // biến prettier thành rule ESlint để kiểm tra
import pluginTypescript from '@typescript-eslint/eslint-plugin'; // plugin chính cung cấp rules dành cho ts

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'], // không check file config này
  },
  eslintConfigs.recommended, // kế thừa rule eslint cơ bản
  ...tseslint.configs.recommendedTypeChecked, // kế thừa typescript có kiểm tra kiểu
  {
    // cấu hình chính
    plugins: {
      '@typescript-eslint': pluginTypescript, // kiểm tra quy tắc dành cho typescript
      prettier: pluginPrettier, // kiểm tra định dạng theo prettier
    },
    languageOptions: {
      // cấu hình liên quan đến ngôn ngữ và môi trường thực thi
      parser: tseslint.parser,
      globals: {
        ...globals.node, // gồm các biến như process, require, module, __dirname, __filename
        ...globals.jest, // gồm các biến như it, describe, expect
      },
      parserOptions: {
        project: './tsconfig.json', // dùng đúng tsconfig.js để phân tích loại kiểu
        tsconfigRootDir: new URL('.', import.meta.url).pathname, // thư mục gốc
        sourceType: 'module', // dùng module cơ bản
      },
    },
    settings: {},
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off', // tắt quy tắc tiền tố interface là IMyInterface
      '@typescript-eslint/explicit-function-return-type': 'off', // quy tắt hàm khai báo kiểu trả về
      '@typescript-eslint/explicit-module-boundary-types': 'off', // quy tắc export có kiểu rõ ràng
      '@typescript-eslint/no-explicit-any': 'warn', // cảnh báo sử dụng kiểu any
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // biến không được sử dụng, trừ _
      '@typescript-eslint/prefer-const': 'error', // yêu cầu sử dụng const thay let
      '@typescript-eslint/no-var-requires': 'off', // tắt quy tác sử dụng require

      'prefer-const': 'error',
      'no-var': 'error', // cấm var
      'no-console': 'warn', // cảnh bảo sử dụng console
      'no-debugger': 'error', // cảnh bảo sử dụng debugger
      'no-duplicate-imports': 'error', // lỗi khi nhiều câu lệnh import cho cùng 1 module
      'no-unused-expressions': 'error', // biểu thức không được sử dụng
      'prefer-template': 'error', // yêu cầu sử dụng ``

      'template-curly-spacing': ['error', 'never'], // lỗi nếu có khoảng trắng bên trong dấu ngoặc nhọn của template literals
      'object-curly-spacing': ['error', 'always'], // yêu cầu khoảng trắng bên trong dấu ngoặc nhọn đối tượng
      'array-bracket-spacing': ['error', 'never'], // không có khoảng trắng trong mảng
      'computed-property-spacing': ['error', 'never'], // không có khoảng trắng bên trong dấu ngoặc vuông của thuộc tính được tính toán
      'comma-dangle': ['error', 'always-multiline'], // yêu cầu dấu phẩy cuối cùng (trailing comma) khi các phần tử được trải ra trên nhiều dòng, nhưng không yêu cầu nếu tất cả trên một dòng.
      'comma-spacing': ['error', { before: false, after: true }], // lỗi về khoảng trắng xung quanh dấu phẩy
      'eol-last': ['error', 'always'], // yêu cầu tệp phải kết thúc bằng một ký tự xuống dòng
      'key-spacing': ['error', { beforeColon: false, afterColon: true }], //  lỗi về khoảng trắng xung quanh dấu hai chấm trong định nghĩa key-value của đối tượng
      'keyword-spacing': ['error', { before: true, after: true }], // yêu cầu khoảng trắng xung quanh các từ khóa (ví dụ: if, for, function).
      'no-trailing-spaces': 'error', //  lỗi nếu có khoảng trắng ở cuối dòng
      quotes: ['error', 'single', { avoidEscape: true }], // yêu cầu sử dụng dấu nháy đơn (') cho chuỗi
      semi: ['error', 'always'], // yêu cầu sử dụng dấu chấm phẩy (;) ở cuối mỗi câu lệnh
      'space-before-blocks': 'error', // yêu cầu khoảng trắng trước một khối code
      'space-infix-ops': 'error', // yêu cầu khoảng trắng xung quanh các toán tử infix (ví dụ: a + b, x === y)
    },
  },
);
