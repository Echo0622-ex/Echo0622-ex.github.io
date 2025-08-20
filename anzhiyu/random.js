var posts=["2025/08/01/MarkDown语法使用测试/","2025/08/01/MarkDown语法学习（自用）/","2025/08/01/next博客美化/","2025/07/31/第一篇博客/","2025/08/20/hello-world/","2025/07/31/第二篇博客文章/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };