module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-order'],
  /* null  => 关闭该规则 */
  rules: {
    'scss/at-import-partial-extension': null, // 解决不能引入scss文件
    'scss/at-rule-no-unknown': null,
    // 位置->布局方式->Box Model->文本相关->视觉效果->其他顺序书写以提高代码的可读性
    'order/properties-order': [
      'content',

      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',

      'display',
      'flex-direction',
      'justify-content',
      'align-items',
      'float',

      'width',
      'height',
      'max-width',
      'max-height',
      'min-width',
      'min-height',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'border',
      'border-top',
      'border-right',
      'border-bottom',
      'border-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',

      'overflow',
      'overflow-x',
      'overflow-y',

      'font',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'letter-spacing',
      'word-spacing',
      'text-align',
      'text-decoration',
      'text-indent',
      'text-overflow',
      'text-rendering',
      'text-size-adjust',
      'text-shadow',
      'text-transform',
      'word-break',
      'word-wrap',
      'white-space',
      'vertical-align',
      'list-style',

      'background',
      'background-color',
      'background-image',
      'background-position',
      'background-repeat',
      'background-size',
      'color',
      'opacity',
      'filter',
      'transform',
      'box-shadow',
      'box-sizing',
      'animation',
      'animation-name',
      'animation-duration',
      'animation-timing-function',
      'animation-delay',
      'animation-iteration-count',
      'animation-direction',
      'animation-fill-mode',
      'animation-play-state',
      'transition',
      'transition-property',
      'transition-duration',
      'transition-timing-function',
      'transition-delay',
    ],
  },
}
