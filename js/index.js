// const delicateDom = {
//   $: (str) => document.querySelectorAll(str),
//   id: (str) => document.getElementById(str),
//   _: (str) => document.createElement(str),
//   dom: function () {
//     return {
//       modeBtn: this.id("mode-btn"),
//       body: document.body || this.$("body")[0],
//     };
//   },
// };

// const delicate = {
//   name: "Delicate",
//   description: "simple but delicate theme for Hexo",
//   author: "Kart Jim",
//   doms: {},
//   init: function () {
//     // 加载进度条
//     this.initProgress();

//     const root = this;
//     // dom 获取
//     this.doms = Object.assign({}, this.doms, delicateDom.dom());
//     // 事件绑定
//     // this.doms.modeBtn.addEventListener("click", (e) => {
//     //     // e.preventDefault();
//     //     root.toggleMode();
//     // });
//   },
//   changeMode: function (type) {
//     // dark to light
//     if (type === "dark") {
//       this.doms.body.classList.add("dark");
//     } else {
//       // light to dark
//       this.doms.body.classList.remove("dark");
//     }
//   },
//   toggleMode: function () {
//     this.doms.body.classList.toggle("dark");
//   },
//   toTop: function () {
//     window.scrollTo(0, 0);
//   },
//   initProgress: initProgress,
// };

// function initProgress() {
//   const resources = window.performance.getEntriesByType("resource");
//   const totalResources = resources.length;
//   let loadingRs = 0;
  
//   resources.forEach((resource) => {
//     console.log(resource)
//     // ajax not count
//     if (resource.initiatorType !== "xmlhttprequest") {

// //       resource.onload = function() {
// //         loadingRs++;
// //         const progress = Math.round((loadingRs / totalResources) * 100);
// //         console.log(progress);
// // 
// //         updateProgress(progress);
// //         // if (loadingRs === totalResources) {
// //         // }
// //       };
//     }
//   });
// }
// function updateProgress(progress) {
//   console.log(progress);
// }

// window.delicate = delicate;

// // 初始化
// delicate.init();
// 封装 DOM 操作函数
const delicateDom = {
  $: (str) => document.querySelectorAll(str),
  id: (str) => document.getElementById(str),
  _: (str) => document.createElement(str),
  dom: function () {
    return {
      modeBtn: this.id("mode-btn"),
      body: document.body || this.$("body")[0],
      toTopBtn: this.id("to-top-btn"),
      progressBar: this.id("progress-bar")
    };
  },
};

const delicate = {
  name: "Delicate",
  description: "simple but delicate theme for Hexo",
  author: "Kart Jim",
  doms: {},
  init: function () {
    // 初始化加载进度条
    this.initProgress();

    const root = this;
    // 获取 DOM 元素
    this.doms = Object.assign({}, this.doms, delicateDom.dom());

    // 绑定切换主题模式事件
    if (this.doms.modeBtn) {
      this.doms.modeBtn.addEventListener("click", (e) => {
        root.toggleMode();
      });
    }

    // 绑定返回顶部按钮事件
    if (this.doms.toTopBtn) {
      this.doms.toTopBtn.addEventListener("click", () => {
        root.toTop();
      });
    }
  },
  changeMode: function (type) {
    // 切换到黑暗模式
    if (type === "dark") {
      this.doms.body.classList.add("dark");
    } else {
      // 切换到明亮模式
      this.doms.body.classList.remove("dark");
    }
  },
  toggleMode: function () {
    this.doms.body.classList.toggle("dark");
  },
  toTop: function () {
    window.scrollTo(0, 0);
  },
  initProgress: function () {
    const resources = window.performance.getEntriesByType("resource");
    const totalResources = resources.length;
    let loadingRs = 0;

    resources.forEach((resource) => {
      if (resource.initiatorType !== "xmlhttprequest") {
        resource.onload = () => {
          loadingRs++;
          const progress = Math.round((loadingRs / totalResources) * 100);
          this.updateProgress(progress);
        };
      }
    });
  },
  updateProgress: function (progress) {
    if (this.doms.progressBar) {
      this.doms.progressBar.style.width = `${progress}%`;
      this.doms.progressBar.textContent = `${progress}%`;
    }
  }
};

window.delicate = delicate;

// 初始化
delicate.init();
