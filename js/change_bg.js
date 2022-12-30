// 存数据
// name：命名 data：数据
function saveData(name, data) {
    localStorage.setItem(name, JSON.stringify({ 'time': Date.now(), 'data': data }))
}

// 取数据
// name：命名 time：过期时长,单位分钟,如传入30,即加载数据时如果超出30分钟返回0,否则返回数据
function loadData(name, time) {
    let d = JSON.parse(localStorage.getItem(name));
    // 过期或有错误返回 0 否则返回数据
    if (d) {
        let t = Date.now() - d.time
        if (t < (time * 60 * 1000) && t > -1){
            return d.data;
        }
    }
    return 0;
}

// 上面两个函数如果你有其他需要存取数据的功能，也可以直接使用

// 读取背景
try {
    let data = loadData('blogbg', 1440)
    if (data) changeBg(data, 1)
    else localStorage.removeItem('blogbg');
} catch (error) { localStorage.removeItem('blogbg'); }

// 切换背景函数
// 此处的flag是为了每次读取时都重新存储一次,导致过期时间不稳定
// 如果flag为0则存储,即设置背景. 为1则不存储,即每次加载自动读取背景.
function changeBg(s, flag) {
    let bg = document.getElementById('web_bg')
    if (s.charAt(0) == '#') {
        bg.style.backgroundColor = s
        bg.style.backgroundImage = 'none'
    } else bg.style.backgroundImage = s
    if (!flag) { saveData('blogbg', s) }
}

//读取字体
try {
    let data = loadData('font', 1440)
    if (data) changeFont(data, 1)
    else localStorage.removeItem('font');
} catch (error) { localStorage.removeItem('font'); }

//设置字体
function changeFont(n,flag){ 
    document.body.style.fontFamily=`${n}, -apple-system, 'Quicksand', 'Nimbus Roman No9 L', 'PingFang SC', 'Hiragino Sans GB', 'Noto Serif SC', 'Microsoft Yahei', 'WenQuanYi Micro Hei', 'ST Heiti', sans-serif`
    if (!flag) { saveData('font', n) }
}
//字体回调
function fontListener(n){
    let rect = document.getElementById(n+'')
    //清空其他字体背景色
    let allFont = document.getElementById('allFont').children;
    for(let i = 0;i < allFont.length;i++){
        allFont[i].style.backgroundColor = '';
    }
    rect.style.backgroundColor = loadData('themeColor',1440)
    changeFont(n,0)
}
if(localStorage.getItem('themeColor')==null){
    saveData('themeColor','#49B1F5')
}
//读取主题色
try {
    let data = loadData('themeColor', 1440)
    if (data){
        changeCol(data,1);
    }
    else localStorage.removeItem('themeColor');
} catch (error) { localStorage.removeItem('themeColor'); }

//设置主题色
function changeCol(c,flag){
    var style = document.getElementById("themeColor").innerText=`:root{--lyx-theme:${c}!important}`;
    if (!flag) { saveData('themeColor', c) }

}
if(localStorage.getItem('opacity')==null){
    saveData('opacity',100)
}
//读取透明度
try {
    let data = loadData('opacity', 1440)
    if (data){
        changeOpa(parseInt(data),1)
    }
    else localStorage.removeItem('opacity');
} catch (error){
    localStorage.removeItem('opacity'); 
}
//设置透明度
function changeOpa(c,flag){
    document.body.style.opacity = parseInt(c) / 100.0
    if (!flag){
         saveData('opacity', c)
    }
}
//透明度回调事件
function opacityListener(){
    var opa = document.getElementById("opacity");
    document.getElementById("透明度").innerText = '透明度(0% ~ 100%) ' + opa.value + '%';
    changeOpa(opa.value,0);
}

//初始化樱花特效
if(localStorage.getItem('sakura')==null){
    localStorage.setItem('sakura','true')
}

function changeSakura(sakura){
    if(sakura == "true"){
        stopp(0)
        localStorage.setItem('sakura','false')
    }else{
        stopp(1);
        localStorage.setItem('sakura','true')
    }
}
function sakuraListener(){
    let isSakura = localStorage.getItem('sakura')
    changeSakura(isSakura);
    document.getElementById('sakuraBtn').innerText = '樱花特效:['+ (isSakura == "true" ? '关' : '开') +']'
}

// 以下为2.0新增内容

// 创建窗口
var winbox = ''

function createWinbox() {
    let div = document.createElement('div')
    document.body.appendChild(div)
    winbox = WinBox({
        id: 'changeBgBox',
        index: 999,
        title: "切换背景",
        x: "center",
        y: "center",
        minwidth: '300px',
        height: "60%",
        background: 'var(--lyx-theme)',
        onmaximize: () => { div.innerHTML = `<style>body::-webkit-scrollbar {display: none;}div#changeBgBox {width: 100% !important;}</style>` },
        onrestore: () => { div.innerHTML = '' },
    });
    winResize();
    window.addEventListener('resize', winResize)
    let tc = loadData("themeColor",1440)
    let fs = loadData('font',1440)
    let isSakura =  localStorage.getItem('sakura')
    console.log(isSakura)
    // 每一类我放了一个演示，直接往下复制粘贴 a标签 就可以，需要注意的是 函数里面的链接 冒号前面需要添加反斜杠\进行转义
    winbox.body.innerHTML = `
    <div id="article-container" style="padding:10px;">
    
    <p><button onclick="localStorage.removeItem('blogbg');localStorage.removeItem('font');localStorage.removeItem('themeColor');location.reload();" style="background:var(--lyx-theme);display:block;width:100%;padding: 15px 0;border-radius:6px;color:white;"><i class="fa-solid fa-arrows-rotate"></i> 点我恢复默认背景</button></p>
    <h2 id="特效">特效</h2>
        <div>
            <div id="sakuraBtn" style="width:120px;height:30px;line-height:30px;background-color:pink;text-align:center;font-size:16px;border-radius:2px 2px 2px 2px;" onclick="sakuraListener()"/>樱花特效:[${isSakura == 'true' ? '开' : '关'}]</div>
        </div>
    <h2 id="透明度">透明度(0% ~ 100%) ${loadData("opacity",1440)}%</h2>
    <input id="opacity" type="range" min="1" max="100" step="1" value="${loadData("opacity",1440)}" onmouseup="opacityListener()"/>
    <h2 id="主题色">主题色</h2>
    <span class="content">
        <input type="radio" id="blue" name="colors" value="#49B1F5" onclick="changeCol('#49B1F5')" ${tc == "#49B1F5" ? "checked" : ""}>
        <input type="radio" id="pink" name="colors" value="#FFC0CB" onclick="changeCol('#FFC0CB')" ${tc == "#FFC0CB" ? "checked" : ""}>
        <input type="radio" id="purple" name="colors" value="#DA70D6" onclick="changeCol('#DA70D6')" ${tc == "#DA70D6" ? "checked" : ""}>
        <input type="radio" id="green" name="colors" value="#00FA9A" onclick="changeCol('#00FA9A')" ${tc == "#00FA9A" ? "checked" : ""}>
        <input type="radio" id="yellow" name="colors" value="#FFD700" onclick="changeCol('#FFD700')" ${tc == "#FFD700" ? "checked" : ""}>
        <input type="radio" id="red" name="colors" value="#FF6347" onclick="changeCol('#FF6347')" ${tc == "#FF6347" ? "checked" : ""}>
        <input type="radio" id="orange" name="colors" value="#FFA500" onclick="changeCol('#FFA500')" ${tc == "#FFA500" ? "checked" : ""}>
    </span>
    <h2 id="字体">字体</h2>
    <div id="allFont" class="content" style="display:flex;">
        <div id="XWWK" style="width:100px;height:60px;font-family:'XWWK';text-align:center;line-height:60px;font-size:19px;border-radius:3px 3px 3px 3px;border:1px solid var(--lyx-theme);margin-left:1%;${fs == 'XWWK' ? 'background-color:'+tc : ''}" onclick="fontListener('XWWK')">霞鹜文楷</div>
        <div id="YSHST" style="width:100px;height:60px;font-family:'YSHST';text-align:center;line-height:60px;font-size:19px;border-radius:3px 3px 3px 3px;border:1px solid var(--lyx-theme);margin-left:1%;${fs == 'YSHST' ? 'background-color:'+tc : ''}" onclick="fontListener('YSHST')">优设好身体</div>
        <div id="HYTMR" style="width:100px;height:60px;font-family:'HYTMR';text-align:center;line-height:60px;font-size:19px;border-radius:3px 3px 3px 3px;border:1px solid var(--lyx-theme);margin-left:1%;${fs == 'HYTMR' ? 'background-color:'+tc : ''}" onclick="fontListener('HYTMR')">汉仪唐美人</div>
        <div id="DYZMT" style="width:100px;height:60px;font-family:'DYZMT';text-align:center;line-height:60px;font-size:19px;border-radius:3px 3px 3px 3px;border:1px solid var(--lyx-theme);margin-left:1%;${fs == 'DYZMT' ? 'background-color:'+tc : ''}" onclick="fontListener('DYZMT')">电影字幕体</div>
        <div id="JXZK" style="width:100px;height:60px;font-family:'JXZK';text-align:center;line-height:60px;font-size:19px;border-radius:3px 3px 3px 3px;border:1px solid var(--lyx-theme);margin-left:1%;${fs == 'JXZK' ? 'background-color:'+tc : ''}" onclick="fontListener('JXZK')">江西拙楷</div>
    </div>
    <h2 id="图片（手机）">图片（手机）</h2>
    <divclass="content" style="display:flex;flex-wrap: wrap;">
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz1.jpg)" class="pimgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz1.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz2.png)" class="pimgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz2.png)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz3.png)" class="pimgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz3.png)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz4.jpg)" class="pimgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz4.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz5.jpg)" class="pimgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz5.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz6.jpg)" class="pimgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz6.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz7.jpeg)" class="pimgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz7.jpeg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz8.jpg)" class="pimgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/phone/bz8.jpg)')"></a>
        </div>
    </div>

    
    <h2 id="图片（电脑）">图片（电脑）</h2>
    <div class="content" style="display:flex;flex-wrap: wrap;">
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz31.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz31.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz20.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz20.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz21.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz21.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz1.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz1.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz2.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz2.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz5.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz5.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz6.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz6.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz8.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz8.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz28.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz28.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz30.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz30.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz33.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz33.jpg)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz35.jpg)" class="imgbox" onclick="changeBg('url(https://gray-read.oss-cn-shanghai.aliyuncs.com/hexo-demo/cover/bz35.jpg)')"></a>
        </div>
    </div>
    
    
    
    <h2 id="渐变色"><a href="#渐变色" class="headerlink" title="渐变色"></a>渐变色</h2>
    <div class="content" style="display:flex;flex-wrap: wrap;">
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #eecda3, #ef629f)" onclick="changeBg('linear-gradient(to right, #eecda3, #ef629f)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #85FFBD, #FFFB7D)" onclick="changeBg('linear-gradient(to right, #85FFBD, #FFFB7D)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #8BC6EC, #9599E2)" onclick="changeBg('linear-gradient(to right, #8BC6EC, #9599E2)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #4158D0, #C850C0,#FFCC70)" onclick="changeBg('linear-gradient(to right,#4158D0, #C850C0,#FFCC70)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #FFDEE9, #B5FFFC)" onclick="changeBg('linear-gradient(to right,#4158D0, #FFDEE9, #B5FFFC)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #FA8BFF, #2BD2FF,#2BFF88)" onclick="changeBg('linear-gradient(to right,#FA8BFF, #2BD2FF,#2BFF88)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #FF9A8B, #FF6A88,#FF99AC)" onclick="changeBg('linear-gradient(to right,#FF9A8B, #FF6A88,#FF99AC)')"></a>
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #FAACA8,#DDD6F3)" onclick="changeBg('linear-gradient(to right,#4158D0, #FAACA8,#DDD6F3)')"></a>
        </div>
    </div>
    
    <h2 id="纯色"><a href="#纯色" class="headerlink" title="纯色"></a>纯色</h2>
    <div class="content" style="display:flex;flex-wrap: wrap;">
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #7D9D9C" onclick="changeBg('#7D9D9C')"></a> 
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #EE82EE" onclick="changeBg('#EE82EE')"></a> 
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #6495ED" onclick="changeBg('#6495ED')"></a> 
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#D4F2E7" onclick="changeBg('#D4F2E7')"></a> 
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#98FB98" onclick="changeBg('#98FB98')"></a> 
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#CD853F" onclick="changeBg('#CD853F')"></a> 
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#FFA07A" onclick="changeBg('#FFA07A')"></a> 
        </div>
        <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#A9A9A9" onclick="changeBg('#A9A9A9')"></a> 
        </div>
    </div>
`;
}

// 适应窗口大小
function winResize() {
    var offsetWid = document.documentElement.clientWidth;
    if (offsetWid <= 768) {
        winbox.resize(offsetWid * 0.95 + "px", "90%").move("center", "center");
    } else {
        winbox.resize(offsetWid * 0.6 + "px", "70%").move("center", "center");
    }
}

// 切换状态，窗口已创建则控制窗口显示和隐藏，没窗口则创建窗口
function toggleWinbox() {
    if (document.querySelector('#changeBgBox')) winbox.toggleClass('hide');
    else createWinbox();
}











