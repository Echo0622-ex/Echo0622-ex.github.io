// // AI构造函数
// new ChucklePostAI({
//   /* 必须配置 */
//   // 文章内容所在的元素属性的选择器，也是AI挂载的容器，AI将会挂载到该容器的最前面
//   el: '#post>#article-container',
//   // 驱动AI所必须的key
//     key:'sk-a0b828c36f8d4a43aad0083bfbc1822b',
//   /* 非必须配置 */
//   // 文章标题所在的元素属性的选择器，默认获取当前网页的标题
//   title_el: '.post-title',
//   // 文章推荐方式，all：匹配数据库内所有文章进行推荐，web：仅当前站内的文章，默认all
//   rec_method: 'web',
//   // 获取文章内容时，需要排除的元素及其子元素，默认如下
//   exclude: ['highlight', 'Copyright-Notice', 'post-ai', 'post-series', 'mini-sandbox']
// })

new ChucklePostAI({
  /* 必须配置 */
  el: '#post>#article-container',
  key:'sk-a0b828c36f8d4a43aad0083bfbc1822b',
  /* 非必须配置 */
  title_el: '.post-title',
  rec_method: 'web',
  exclude: ['highlight', 'Copyright-Notice', 'post-ai', 'post-series', 'mini-sandbox'],
  // 新增：指定主题中post_head_ai_description的选择器
  post_head_ai_selector: '#post_head_ai_description' // 根据主题实际选择器修改
})