module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/recommended', '@vue/standard'],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 'off',
    // 禁止在计算属性中对属性修改
    'vue/no-side-effects-in-computed-properties': 'off',
    // 属性空格
    'vue/attribute-hyphenation': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'standard/no-callback-literal': 'off',
    'handle-callback-err': 'off',
    'standard/computed-property-even-spacing': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    AMap: true
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
}
