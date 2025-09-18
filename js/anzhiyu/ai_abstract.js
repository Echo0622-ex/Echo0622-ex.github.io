// (function () {
//   const {
//     randomNum,
//     basicWordCount,
//     btnLink,
//     key: AIKey,
//     Referer: AIReferer,
//     gptName,
//     switchBtn,
//     mode: initialMode,
//   } = GLOBAL_CONFIG.postHeadAiDescription;

//   const { title, postAI, pageFillDescription } = GLOBAL_CONFIG_SITE;

//   let lastAiRandomIndex = -1;
//   let animationRunning = true;
//   let mode = initialMode;
//   let refreshNum = 0;
//   let prevParam;
//   let audio = null;
//   let isPaused = false;
//   let summaryID = null;

//   const post_ai = document.querySelector(".post-ai-description");
//   const aiTitleRefreshIcon = post_ai.querySelector(".ai-title .anzhiyufont.anzhiyu-icon-arrow-rotate-right");
//   let aiReadAloudIcon = post_ai.querySelector(".anzhiyu-icon-circle-dot");
//   const explanation = post_ai.querySelector(".ai-explanation");

//   let aiStr = "";
//   let aiStrLength = "";
//   let delayInit = 600;
//   let indexI = 0;
//   let indexJ = 0;
//   let timeouts = [];
//   let elapsed = 0;

//   const observer = createIntersectionObserver();
//   const aiFunctions = [introduce, aiTitleRefreshIconClick, aiRecommend, aiGoHome];

//   const aiBtnList = post_ai.querySelectorAll(".ai-btn-item");
//   const filteredHeadings = Array.from(aiBtnList).filter(heading => heading.id !== "go-tianli-blog");
//   filteredHeadings.forEach((item, index) => {
//     item.addEventListener("click", () => {
//       aiFunctions[index]();
//     });
//   });

//   document.getElementById("ai-tag").addEventListener("click", onAiTagClick);
//   aiTitleRefreshIcon.addEventListener("click", onAiTitleRefreshIconClick);
//   document.getElementById("go-tianli-blog").addEventListener("click", () => {
//     window.open(btnLink, "_blank");
//   });
//   aiReadAloudIcon.addEventListener("click", readAloud);

//   async function readAloud() {
//     if (!summaryID) {
//       anzhiyu.snackbarShow("摘要还没加载完呢，请稍后。。。");
//       return;
//     }
//     aiReadAloudIcon = post_ai.querySelector(".anzhiyu-icon-circle-dot");
//     aiReadAloudIcon.style.opacity = "0.2";
//     if (audio && !isPaused) {
//       audio.pause();
//       isPaused = true;
//       aiReadAloudIcon.style.opacity = "1";
//       aiReadAloudIcon.style.animation = "";
//       aiReadAloudIcon.style.cssText = "animation: ''; opacity: 1;cursor: pointer;";
//       return;
//     }

//     if (audio && isPaused) {
//       audio.play();
//       isPaused = false;
//       aiReadAloudIcon.style.cssText = "animation: breathe .5s linear infinite; opacity: 0.2;cursor: pointer";
//       return;
//     }

//     const options = {
//       key: AIKey,
//       Referer: AIReferer,
//     };
//     const requestParams = new URLSearchParams({
//       key: options.key,
//       id: summaryID,
//     });

//     const requestOptions = {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Referer: options.Referer,
//       },
//     };

//     try {
//       const response = await fetch(`https://summary.tianli0.top/audio?${requestParams}`, requestOptions);
//       if (response.status === 403) {
//         console.error("403 refer与key不匹配。");
//       } else if (response.status === 500) {
//         console.error("500 系统内部错误");
//       } else {
//         const audioBlob = await response.blob();
//         const audioURL = URL.createObjectURL(audioBlob);
//         audio = new Audio(audioURL);
//         audio.play();
//         aiReadAloudIcon.style.cssText = "animation: breathe .5s linear infinite; opacity: 0.2;cursor: pointer";
//         audio.addEventListener("ended", () => {
//           audio = null;
//           aiReadAloudIcon.style.opacity = "1";
//           aiReadAloudIcon.style.animation = "";
//         });
//       }
//     } catch (error) {
//       console.error("请求发生错误❎");
//     }
//   }
//   if (switchBtn) {
//     document.getElementById("ai-Toggle").addEventListener("click", changeShowMode);
//   }

//   aiAbstract();
//   showAiBtn();

//   function createIntersectionObserver() {
//     return new IntersectionObserver(
//       entries => {
//         let isVisible = entries[0].isIntersecting;
//         animationRunning = isVisible;
//         if (animationRunning) {
//           delayInit = indexI === 0 ? 200 : 20;
//           timeouts[1] = setTimeout(() => {
//             if (indexJ) {
//               indexI = 0;
//               indexJ = 0;
//             }
//             if (indexI === 0) {
//               explanation.innerHTML = aiStr.charAt(0);
//             }
//             requestAnimationFrame(animate);
//           }, delayInit);
//         }
//       },
//       { threshold: 0 }
//     );
//   }

//   function animate(timestamp) {
//     if (!animationRunning) {
//       return;
//     }
//     if (!animate.start) animate.start = timestamp;
//     elapsed = timestamp - animate.start;
//     if (elapsed >= 20) {
//       animate.start = timestamp;
//       if (indexI < aiStrLength - 1) {
//         let char = aiStr.charAt(indexI + 1);
//         let delay = /[,.，。!?！？]/.test(char) ? 150 : 20;
//         if (explanation.firstElementChild) {
//           explanation.removeChild(explanation.firstElementChild);
//         }
//         explanation.innerHTML += char;
//         let div = document.createElement("div");
//         div.className = "ai-cursor";
//         explanation.appendChild(div);
//         indexI++;
//         if (delay === 150) {
//           post_ai.querySelector(".ai-explanation .ai-cursor").style.opacity = "0.2";
//         }
//         if (indexI === aiStrLength - 1) {
//           observer.disconnect();
//           explanation.removeChild(explanation.firstElementChild);
//         }
//         timeouts[0] = setTimeout(() => {
//           requestAnimationFrame(animate);
//         }, delay);
//       }
//     } else {
//       requestAnimationFrame(animate);
//     }
//   }

//   function clearTimeouts() {
//     if (timeouts.length) {
//       timeouts.forEach(item => {
//         if (item) {
//           clearTimeout(item);
//         }
//       });
//     }
//   }

//   function startAI(str, df = true) {
//     indexI = 0;
//     indexJ = 1;
//     clearTimeouts();
//     animationRunning = false;
//     elapsed = 0;
//     observer.disconnect();
//     explanation.innerHTML = df ? "生成中. . ." : "请等待. . .";
//     aiStr = str;
//     aiStrLength = aiStr.length;
//     observer.observe(post_ai);
//   }

//   async function aiAbstract(num = basicWordCount) {
//     if (mode === "tianli") {
//       await aiAbstractTianli(num);
//     } else {
//       aiAbstractLocal();
//     }
//   }

//   async function aiAbstractTianli(num) {
//     indexI = 0;
//     indexJ = 1;
//     clearTimeouts();
//     animationRunning = false;
//     elapsed = 0;
//     observer.disconnect();

//     num = Math.max(10, Math.min(2000, num));
//     const options = {
//       key: AIKey,
//       Referer: AIReferer,
//     };
//     const truncateDescription = (title + pageFillDescription).trim().substring(0, num);

//     const requestBody = {
//       key: options.key,
//       content: truncateDescription,
//       url: location.href,
//     };

//     const requestOptions = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Referer: options.Referer,
//       },
//       body: JSON.stringify(requestBody),
//     };
//     console.info(truncateDescription.length);
//     try {
//       let animationInterval = null;
//       let summary;
//       if (animationInterval) clearInterval(animationInterval);
//       animationInterval = setInterval(() => {
//         const animationText = "生成中" + ".".repeat(indexJ);
//         explanation.innerHTML = animationText;
//         indexJ = (indexJ % 3) + 1;
//       }, 500);
//       const response = await fetch(`https://summary.tianli0.top/`, requestOptions);
//       let result;
//       if (response.status === 403) {
//         result = {
//           summary: "403 refer与key不匹配。",
//         };
//       } else if (response.status === 500) {
//         result = {
//           summary: "500 系统内部错误",
//         };
//       } else {
//         result = await response.json();
//       }

//       summary = result.summary.trim();
//       summaryID = result.id;

//       setTimeout(() => {
//         aiTitleRefreshIcon.style.opacity = "1";
//       }, 300);
//       if (summary) {
//         startAI(summary);
//       } else {
//         startAI("摘要获取失败!!!请检查Tianli服务是否正常!!!");
//       }
//       clearInterval(animationInterval);
//     } catch (error) {
//       console.error(error);
//       explanation.innerHTML = "发生异常" + error;
//     }
//   }

//   function aiAbstractLocal() {
//     const strArr = postAI.split(",").map(item => item.trim());
//     if (strArr.length !== 1) {
//       let randomIndex = Math.floor(Math.random() * strArr.length);
//       while (randomIndex === lastAiRandomIndex) {
//         randomIndex = Math.floor(Math.random() * strArr.length);
//       }
//       lastAiRandomIndex = randomIndex;
//       startAI(strArr[randomIndex]);
//     } else {
//       startAI(strArr[0]);
//     }
//     setTimeout(() => {
//       aiTitleRefreshIcon.style.opacity = "1";
//     }, 600);
//   }

//   function aiRecommend() {
//     indexI = 0;
//     indexJ = 1;
//     clearTimeouts();
//     animationRunning = false;
//     elapsed = 0;
//     explanation.innerHTML = "生成中. . .";
//     aiStr = "";
//     aiStrLength = "";
//     observer.disconnect();
//     timeouts[2] = setTimeout(() => {
//       explanation.innerHTML = recommendList();
//     }, 600);
//   }

//   function recommendList() {
//     let thumbnail = document.querySelectorAll(".relatedPosts-list a");
//     if (!thumbnail.length) {
//       const cardRecentPost = document.querySelector(".card-widget.card-recent-post");
//       if (!cardRecentPost) return "";

//       thumbnail = cardRecentPost.querySelectorAll(".aside-list-item a");

//       let list = "";
//       for (let i = 0; i < thumbnail.length; i++) {
//         const item = thumbnail[i];
//         list += `<div class="ai-recommend-item"><span class="index">${
//           i + 1
//         }：</span><a href="javascript:;" onclick="pjax.loadUrl('${item.href}')" title="${
//           item.title
//         }" data-pjax-state="">${item.title}</a></div>`;
//       }

//       return `很抱歉，无法找到类似的文章，你也可以看看本站最新发布的文章：<br /><div class="ai-recommend">${list}</div>`;
//     }

//     let list = "";
//     for (let i = 0; i < thumbnail.length; i++) {
//       const item = thumbnail[i];
//       list += `<div class="ai-recommend-item"><span>推荐${
//         i + 1
//       }：</span><a href="javascript:;" onclick="pjax.loadUrl('${item.href}')" title="${
//         item.title
//       }" data-pjax-state="">${item.title}</a></div>`;
//     }

//     return `推荐文章：<br /><div class="ai-recommend">${list}</div>`;
//   }

//   function aiGoHome() {
//     startAI("正在前往博客主页...", false);
//     timeouts[2] = setTimeout(() => {
//       if (window.pjax) {
//         pjax.loadUrl("/");
//       } else {
//         location.href = location.origin;
//       }
//     }, 1000);
//   }

//   function introduce() {
//     if (mode == "tianli") {
//       startAI("我是文章辅助AI: TianliGPT，点击下方的按钮，让我生成本文简介、推荐相关文章等。");
//     } else {
//       startAI(`我是文章辅助AI: ${gptName} GPT，点击下方的按钮，让我生成本文简介、推荐相关文章等。`);
//     }
//   }

//   function aiTitleRefreshIconClick() {
//     aiTitleRefreshIcon.click();
//   }

//   function onAiTagClick() {
//     if (mode === "tianli") {
//       post_ai.querySelectorAll(".ai-btn-item").forEach(item => (item.style.display = "none"));
//       document.getElementById("go-tianli-blog").style.display = "block";
//       startAI(
//         "你好，我是Tianli开发的摘要生成助理TianliGPT，是一个基于GPT-4的生成式AI。我在这里只负责摘要的预生成和显示，你无法与我直接沟通，如果你也需要一个这样的AI摘要接口，可以在下方购买。"
//       );
//     } else {
//       post_ai.querySelectorAll(".ai-btn-item").forEach(item => (item.style.display = "block"));
//       document.getElementById("go-tianli-blog").style.display = "none";
//       startAI(
//         `你好，我是本站摘要生成助理${gptName} GPT，是一个基于GPT-4的生成式AI。我在这里只负责摘要的预生成和显示，你无法与我直接沟通。`
//       );
//     }
//   }

//   function onAiTitleRefreshIconClick() {
//     const truncateDescription = (title + pageFillDescription).trim().substring(0, basicWordCount);

//     aiTitleRefreshIcon.style.opacity = "0.2";
//     aiTitleRefreshIcon.style.transitionDuration = "0.3s";
//     aiTitleRefreshIcon.style.transform = "rotate(" + 360 * refreshNum + "deg)";
//     if (truncateDescription.length <= basicWordCount) {
//       let param = truncateDescription.length - Math.floor(Math.random() * randomNum);
//       while (param === prevParam || truncateDescription.length - param === prevParam) {
//         param = truncateDescription.length - Math.floor(Math.random() * randomNum);
//       }
//       prevParam = param;
//       aiAbstract(param);
//     } else {
//       let value = Math.floor(Math.random() * randomNum) + basicWordCount;
//       while (value === prevParam || truncateDescription.length - value === prevParam) {
//         value = Math.floor(Math.random() * randomNum) + basicWordCount;
//       }
//       aiAbstract(value);
//     }
//     refreshNum++;
//   }

//   function changeShowMode() {
//     mode = mode === "tianli" ? "local" : "tianli";
//     if (mode === "tianli") {
//       document.getElementById("ai-tag").innerHTML = "TianliGPT";

//       aiReadAloudIcon.style.opacity = "1";
//       aiReadAloudIcon.style.cursor = "pointer";
//     } else {
//       aiReadAloudIcon.style.opacity = "0";
//       aiReadAloudIcon.style.cursor = "auto";
//       if ((document.getElementById("go-tianli-blog").style.display = "block")) {
//         document.querySelectorAll(".ai-btn-item").forEach(item => (item.style.display = "block"));
//         document.getElementById("go-tianli-blog").style.display = "none";
//       }
//       document.getElementById("ai-tag").innerHTML = gptName + " GPT";
//     }
//     aiAbstract();
//   }

//   function showAiBtn() {
//     if (mode === "tianli") {
//       document.getElementById("ai-tag").innerHTML = "TianliGPT";
//     } else {
//       document.getElementById("ai-tag").innerHTML = gptName + " GPT";
//     }
//   }
// })();

(function () {
  const {
    randomNum,
    basicWordCount,
    btnLink,
    key: AIKey, // Deepseek API密钥
    Referer: AIReferer, // 可选，Deepseek可不填
    gptName,
    switchBtn,
    mode: initialMode, // 改为默认'deepseek'
  } = GLOBAL_CONFIG.postHeadAiDescription;

  const { title, postAI, pageFillDescription } = GLOBAL_CONFIG_SITE;

  let lastAiRandomIndex = -1;
  let animationRunning = true;
  let mode = initialMode || 'deepseek'; // 默认为deepseek模式
  let refreshNum = 0;
  let prevParam;
  let audio = null; // Deepseek无语音接口，后续会移除相关逻辑
  let isPaused = false;
  let summaryID = null; // Deepseek无需此ID

  const post_ai = document.querySelector(".post-ai-description");
  const aiTitleRefreshIcon = post_ai.querySelector(".ai-title .anzhiyufont.anzhiyu-icon-arrow-rotate-right");
  let aiReadAloudIcon = post_ai.querySelector(".anzhiyu-icon-circle-dot");
  const explanation = post_ai.querySelector(".ai-explanation");

  // 隐藏语音朗读按钮（Deepseek无此功能）
  if (aiReadAloudIcon) {
    aiReadAloudIcon.style.display = 'none';
  }

  let aiStr = "";
  let aiStrLength = "";
  let delayInit = 600;
  let indexI = 0;
  let indexJ = 0;
  let timeouts = [];
  let elapsed = 0;

  const observer = createIntersectionObserver();
  const aiFunctions = [introduce, aiTitleRefreshIconClick, aiRecommend, aiGoHome];

  const aiBtnList = post_ai.querySelectorAll(".ai-btn-item");
  const filteredHeadings = Array.from(aiBtnList).filter(heading => heading.id !== "go-tianli-blog");
  // 隐藏Tianli购买按钮
  document.getElementById("go-tianli-blog").style.display = "none";
  
  filteredHeadings.forEach((item, index) => {
    item.addEventListener("click", () => {
      aiFunctions[index]();
    });
  });

  document.getElementById("ai-tag").addEventListener("click", onAiTagClick);
  aiTitleRefreshIcon.addEventListener("click", onAiTitleRefreshIconClick);
  // 移除Tianli购买按钮事件
  // 移除语音朗读事件（Deepseek无此功能）
  if (aiReadAloudIcon) {
    aiReadAloudIcon.removeEventListener("click", readAloud);
  }

  if (switchBtn) {
    document.getElementById("ai-Toggle").addEventListener("click", changeShowMode);
  }

  aiAbstract();
  showAiBtn();

  function createIntersectionObserver() {
    return new IntersectionObserver(
      entries => {
        let isVisible = entries[0].isIntersecting;
        animationRunning = isVisible;
        if (animationRunning) {
          delayInit = indexI === 0 ? 200 : 20;
          timeouts[1] = setTimeout(() => {
            if (indexJ) {
              indexI = 0;
              indexJ = 0;
            }
            if (indexI === 0) {
              explanation.innerHTML = aiStr.charAt(0);
            }
            requestAnimationFrame(animate);
          }, delayInit);
        }
      },
      { threshold: 0 }
    );
  }

  function animate(timestamp) {
    if (!animationRunning) {
      return;
    }
    if (!animate.start) animate.start = timestamp;
    elapsed = timestamp - animate.start;
    if (elapsed >= 20) {
      animate.start = timestamp;
      if (indexI < aiStrLength - 1) {
        let char = aiStr.charAt(indexI + 1);
        let delay = /[,.，。!?！？]/.test(char) ? 150 : 20;
        if (explanation.firstElementChild) {
          explanation.removeChild(explanation.firstElementChild);
        }
        explanation.innerHTML += char;
        let div = document.createElement("div");
        div.className = "ai-cursor";
        explanation.appendChild(div);
        indexI++;
        if (delay === 150) {
          post_ai.querySelector(".ai-explanation .ai-cursor").style.opacity = "0.2";
        }
        if (indexI === aiStrLength - 1) {
          observer.disconnect();
          explanation.removeChild(explanation.firstElementChild);
        }
        timeouts[0] = setTimeout(() => {
          requestAnimationFrame(animate);
        }, delay);
      }
    } else {
      requestAnimationFrame(animate);
    }
  }

  function clearTimeouts() {
    if (timeouts.length) {
      timeouts.forEach(item => {
        if (item) {
          clearTimeout(item);
        }
      });
    }
  }

  function startAI(str, df = true) {
    indexI = 0;
    indexJ = 1;
    clearTimeouts();
    animationRunning = false;
    elapsed = 0;
    observer.disconnect();
    explanation.innerHTML = df ? "生成中. . ." : "请等待. . .";
    aiStr = str;
    aiStrLength = aiStr.length;
    observer.observe(post_ai);
  }

  async function aiAbstract(num = basicWordCount) {
    // 移除tianli模式，只保留deepseek和local
    if (mode === "deepseek") {
      await aiAbstractDeepseek(num); // 新增Deepseek逻辑
    } else {
      aiAbstractLocal();
    }
  }

  // 新增：Deepseek API调用逻辑
  async function aiAbstractDeepseek(num) {
    indexI = 0;
    indexJ = 1;
    clearTimeouts();
    animationRunning = false;
    elapsed = 0;
    observer.disconnect();

    // 限制截取长度（1000-2000字符）
    num = Math.max(1000, Math.min(2000, num));
    // 截取文章内容（标题+正文）
    const truncateContent = (title + "。" + pageFillDescription).trim().substring(0, num);
    
    // Deepseek提示词（要求生成简洁摘要）
    const prompt = `请为以下文章生成简洁的中文摘要（约150字），只总结内容，不添加额外建议：\n\n${truncateContent}`;

    try {
      // 加载动画
      let animationInterval = setInterval(() => {
        const animationText = "生成中" + ".".repeat(indexJ);
        explanation.innerHTML = animationText;
        indexJ = (indexJ % 3) + 1;
      }, 500);

      // 调用Deepseek API
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AIKey}` // Deepseek认证方式
        },
        body: JSON.stringify({
          model: "deepseek-chat", // Deepseek模型
          messages: [{"role": "user", "content": prompt}],
          temperature: 0.7, // 随机性
          max_tokens: 300 // 最大生成字数
        })
      });

      clearInterval(animationInterval);
      aiTitleRefreshIcon.style.opacity = "1";

      if (!response.ok) {
        // 处理API错误
        const error = await response.json();
        throw new Error(`Deepseek API错误: ${error.error?.message || response.statusText}`);
      }

      const result = await response.json();
      const summary = result.choices[0].message.content.trim(); // 提取摘要
      startAI(summary);

    } catch (error) {
      console.error("Deepseek调用失败:", error);
      startAI(`摘要生成失败: ${error.message}`);
    }
  }

  // 本地模式逻辑（不变）
  function aiAbstractLocal() {
    const strArr = postAI.split(",").map(item => item.trim());
    if (strArr.length !== 1) {
      let randomIndex = Math.floor(Math.random() * strArr.length);
      while (randomIndex === lastAiRandomIndex) {
        randomIndex = Math.floor(Math.random() * strArr.length);
      }
      lastAiRandomIndex = randomIndex;
      startAI(strArr[randomIndex]);
    } else {
      startAI(strArr[0]);
    }
    setTimeout(() => {
      aiTitleRefreshIcon.style.opacity = "1";
    }, 600);
  }

  // 推荐文章逻辑（不变）
  function aiRecommend() {
    indexI = 0;
    indexJ = 1;
    clearTimeouts();
    animationRunning = false;
    elapsed = 0;
    explanation.innerHTML = "生成中. . .";
    aiStr = "";
    aiStrLength = "";
    observer.disconnect();
    timeouts[2] = setTimeout(() => {
      explanation.innerHTML = recommendList();
    }, 600);
  }

  function recommendList() {
    let thumbnail = document.querySelectorAll(".relatedPosts-list a");
    if (!thumbnail.length) {
      const cardRecentPost = document.querySelector(".card-widget.card-recent-post");
      if (!cardRecentPost) return "";

      thumbnail = cardRecentPost.querySelectorAll(".aside-list-item a");

      let list = "";
      for (let i = 0; i < thumbnail.length; i++) {
        const item = thumbnail[i];
        list += `<div class="ai-recommend-item"><span class="index">${
          i + 1
        }：</span><a href="javascript:;" onclick="pjax.loadUrl('${item.href}')" title="${
          item.title
        }" data-pjax-state="">${item.title}</a></div>`;
      }

      return `很抱歉，无法找到类似的文章，你也可以看看本站最新发布的文章：<br /><div class="ai-recommend">${list}</div>`;
    }

    let list = "";
    for (let i = 0; i < thumbnail.length; i++) {
      const item = thumbnail[i];
      list += `<div class="ai-recommend-item"><span>推荐${
        i + 1
      }：</span><a href="javascript:;" onclick="pjax.loadUrl('${item.href}')" title="${
        item.title
      }" data-pjax-state="">${item.title}</a></div>`;
    }

    return `推荐文章：<br /><div class="ai-recommend">${list}</div>`;
  }

  // 回到主页逻辑（不变）
  function aiGoHome() {
    startAI("正在前往博客主页...", false);
    timeouts[2] = setTimeout(() => {
      if (window.pjax) {
        pjax.loadUrl("/");
      } else {
        location.href = location.origin;
      }
    }, 1000);
  }

  // AI自我介绍（更新为Deepseek）
  function introduce() {
    if (mode === "deepseek") {
      startAI(`我是文章辅助AI: ${gptName}，基于Deepseek大语言模型。点击下方按钮生成摘要或推荐相关文章。`);
    } else {
      startAI(`我是文章辅助AI: ${gptName}，点击下方的按钮，让我生成本文简介、推荐相关文章等。`);
    }
  }

  function aiTitleRefreshIconClick() {
    aiTitleRefreshIcon.click();
  }

  // AI标签点击事件（更新为Deepseek）
  function onAiTagClick() {
    if (mode === "deepseek") {
      // 隐藏Tianli购买按钮，显示Deepseek说明
      document.getElementById("go-tianli-blog").style.display = "none";
      startAI(
        `你好，我是基于Deepseek模型的摘要生成助理${gptName}。我负责生成本文摘要和推荐相关文章，无法直接对话。`
      );
    } else {
      document.querySelectorAll(".ai-btn-item").forEach(item => (item.style.display = "block"));
      document.getElementById("go-tianli-blog").style.display = "none";
      startAI(
        `你好，我是本站摘要生成助理${gptName}，点击按钮获取摘要或推荐文章。`
      );
    }
  }

  // 刷新摘要逻辑（适配Deepseek）
  function onAiTitleRefreshIconClick() {
    const truncateDescription = (title + pageFillDescription).trim().substring(0, basicWordCount);

    aiTitleRefreshIcon.style.opacity = "0.2";
    aiTitleRefreshIcon.style.transitionDuration = "0.3s";
    aiTitleRefreshIcon.style.transform = "rotate(" + 360 * refreshNum + "deg)";
    
    // 随机调整截取长度，避免重复
    if (truncateDescription.length <= basicWordCount) {
      let param = truncateDescription.length - Math.floor(Math.random() * randomNum);
      while (param === prevParam || truncateDescription.length - param === prevParam) {
        param = truncateDescription.length - Math.floor(Math.random() * randomNum);
      }
      prevParam = param;
      aiAbstract(param);
    } else {
      let value = Math.floor(Math.random() * randomNum) + basicWordCount;
      while (value === prevParam || truncateDescription.length - value === prevParam) {
        value = Math.floor(Math.random() * randomNum) + basicWordCount;
      }
      aiAbstract(value);
    }
    refreshNum++;
  }

  // 模式切换逻辑（改为deepseek和local）
  function changeShowMode() {
    mode = mode === "deepseek" ? "local" : "deepseek";
    if (mode === "deepseek") {
      document.getElementById("ai-tag").innerHTML = `${gptName} (Deepseek)`;
    } else {
      document.getElementById("ai-tag").innerHTML = `${gptName} (本地)`;
    }
    aiAbstract();
  }

  // 显示AI名称（更新为Deepseek）
  function showAiBtn() {
    if (mode === "deepseek") {
      document.getElementById("ai-tag").innerHTML = `${gptName} (Deepseek)`;
    } else {
      document.getElementById("ai-tag").innerHTML = `${gptName} (本地)`;
    }
  }
})();
