var posts=["2022/12/25/Acwing蓝桥杯辅导课之双指针、BFS和图论/","2022/12/29/Acwing蓝桥杯辅导课之数论/","2022/12/27/Acwing蓝桥杯辅导课之贪心/","2022/12/27/Docker最详细的实战教程/","2022/12/23/ES6部分新特性/","2022/12/29/Hexo魔改之主题美化（一）/","2022/12/25/Hexo魔改之评论系统/","2022/12/27/Hexo魔改之追番列表/","2023/02/07/原神抽卡日记一/","2023/01/05/复杂DP专题/","2022/12/26/双指针,BFS和图论习题课/","2023/01/03/数论习题课/","2022/12/23/线段树与树状数组/","2023/01/09/新春主题魔改/","2023/02/05/网易云插件管理/","2022/12/28/贪心习题课/","2022/12/29/需要熟稔于心的考研数学公式/"];function toRandomPost(){pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);};