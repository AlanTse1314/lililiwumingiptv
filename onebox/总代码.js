######写入规则1
eval(readStr("QJS"));
var iptvfile="一个盒子直播规则.js";
var webfile="一个盒子站源规则.js";
if(getVar("按钮")=="添加远程订阅"){
    var filename=iptvfile;
    var 记录=[];
    if(getVar("iptvtext").indexOf(",http")!=-1){
        var 输入条目=getVar("iptvtext").match(/.+,http.+/g);
        for(var j in 输入条目){
           var title=输入条目[j].split(",")[0];
           var url=输入条目[j].split(",")[1];
           记录.push("####\n###type\niptv\n###分类\niptv\n###数据\n"+title+"\n##\n远程$"+url+"\n####");
        }
    }else{
        alert("格式输入错误");
    }
}else if(getVar("按钮")=="添加源文本"){
    var filename=iptvfile;
    var 记录=[];
    if(getVar("iptvtext").indexOf(",http")!=-1){
        var 输入条目=getVar("iptvtext").match(/.+,http.+/g).join("\n");
        var sort=getVar("iptvsort")||"未分类";
        记录.push("####\n###type\niptv\n###分类\niptv\n###数据\n"+sort+"\n##\n"+输入条目+"\n####");
    }else{
        alert("格式输入错误");
    }
}else if(getVar("按钮")=="添加cms"){
    var filename=webfile;
    var 记录=[];
    if(getVar("cmstext").indexOf(",http")!=-1){
        var 输入条目=getVar("cmstext").match(/.+,http.+/g);
        var type="cms";var sort=getVar("cmssort")||"未分类";
        for(var j in 输入条目){
           var title=输入条目[j].split(",")[0];
           var url=输入条目[j].split(",")[1];
           var baseURL='"'+url+'";';var img="http://1.117.152.239:39000/tupian.php?text="+title;
           if(baseURL.indexOf("?")!=-1){
            var 分类地址='getVar("baseURL")+"&ac=videolist分类&pg=翻页";';
            var 首页地址='getVar("baseURL")+"&ac=list&pg=1";';
            var 搜索地址='getVar("baseURL")+"&wd=关键字&ac=显示&pg=翻页";';
           }else{
            var 分类地址='getVar("baseURL")+"?ac=videolist分类&pg=翻页";';
            var 首页地址='getVar("baseURL")+"?ac=list&pg=1";';
            var 搜索地址='getVar("baseURL")+"?wd=关键字&ac=显示&pg=翻页";';
           }
           记录.push("####\n###type\n"+type+"\n###分类\n"+sort+"\n###标题\n"+title+"\n###图片\n"+img+"\n###BaseURL\n"+baseURL+"\n###首页地址\n"+首页地址+"\n###分类地址\n"+分类地址+"\n###搜索地址\n"+搜索地址+"\n###rule\n####");
        }
    }else{
        alert("格式输入错误");
    }
}else if(getVar("按钮")=="添加站源"){
    var filename=webfile;
    var 记录=[];
    if(getVar("webtext").indexOf("####")!=-1){
        记录.push(getVar("webtext"));
    }else{
        alert("格式输入错误");
    }
}
if(记录[0]){
if(_.read(filename).indexOf("#####")!=-1){
    var 新记录=_.read(filename).match(/#####[\s\S]+?#####/g);
}else{
    var 新记录=[];
}
for(var i in 记录){
var 当前条目=[];当前条目.push(记录[i]);
if(新记录.length==0) {
    var 分类=记录[i].split(/####/)[1].split(/###.*/)[2].replace(/\s+/g,"");
    新记录.push("#####"+分类+"\n"+记录[i]+"\n#####");
}else{
    let res=新记录.some(item=>{
    //判断类型，有就添加到当前项
      var 当前分类=item.match(/#####(.+)/)[1];
      var 分类=记录[i].split(/####/)[1].split(/###.*/)[2].replace(/\s+/g,"");
      if(当前分类 == 分类){
      return true
      }
    });
    if (!res) {
    //如果没找相同类型添加一个类型
    新记录.push("#####"+分类+"\n"+记录[i]+"\n#####");
    }else{
        新记录=新记录.map((item)=>{
            //判断类型，有就添加到当前项
              var 当前分类=item.match(/#####(.+)/)[1];
              var 分类=记录[i].split(/####/)[1].split(/###.*/)[2].replace(/\s+/g,"");
              if(当前分类 == 分类){
              var data=item.replace(/#####.*/g,"").match(/####[\s\S]+?####/g);
              data=当前条目.concat(data);
              item="#####"+当前分类+"\n"+data.join("\n")+"\n#####";
              return item
              }else{
              return item
              }
            });
    }
}
}
_.write(新记录.join("\n"),filename);
alert("写入成功");
}else{
alert("写入失败");
}
######直播选集列表2
eval(readStr("QJS"));
if(getVar("地址").indexOf("远程$")!=-1){
    var u=getVar("地址").split("远程$")[1];
    var code=getHttp(u);
}else{
    var code=getVar("地址");
}
function 选集列表(){
    var res={};var items=[];
    var d = [];
    for (let index = 0; index < 分类.length; index++) {
            function fn(i) {
              return function () {
        var 分类CODE=分类[i];
        var 列表=e2Arr(分类CODE,列表规则).filter(Boolean);
        if(线路){
        var 标题=e2Rex(线路[i],标题规则);
        }else{
        var 标题=e2Rex(分类CODE,标题规则);
        }
        var LIST=[];
        for(var j=0;j<列表.length;j++){
            var 选集=e2Rex(列表[j],选集规则);
            var 选集地址=e2Rex(列表[j],选集地址规则);
            LIST.push({title:选集,url:选集地址});
        }
    var play_={};
    play_.title=标题;
    play_.list=LIST;
    return items.push(play_);
    };
    }
    d.push(fn(index));
  }
    _.submit(d, 分类.length); //n 改为你想开启的线程数
    res.data=items;
    return JSON.stringify(res);
}
if(code.indexOf("#genre#")!=-1){
    var 分类=code.split(/.+?#genre#.*/).filter(item=>item.indexOf("://")!=-1);
    var 线路=code.match(/.+?#genre#.*/g);
    var 列表规则=".z(.+?,.+)";
    var 标题规则=".tz(#genre#)";
    var 选集地址规则=".c(http://ip111.cn/?wd=).ty(,)";
    var 选集规则=".tz(,)";选集列表();
}else if(code.indexOf("#EXTINF:")!=-1){
    var code=code.match(/#EXTINF:.+[\s]+.+/g);
    var res={};var items=[];
for(var i in code){
    var 选集=code[i].match(/,(.*)/)[1]||"无选集名称";var 选集地址=code[i].match(/,.*[\s]+(.+)/)[1]||"无播放地址";
    if(code[i].search(/group-title=".*?"/)!=-1){
        var type=code[i].match(/group-title="(.*?)"/)[1]||"不规范分类";
    }else{
        var type="未分类";
    }
var 当前条目=[];当前条目.push({title:选集,url:"http://ip111.cn/?wd="+选集地址});
if(items.length==0) {
    items.push({title:type,list:当前条目});
}else{
    let 寻找=items.some(item=>{
    //判断类型，有就添加到当前项
      if(item.title == type){
      item.list=item.list.concat(当前条目);
      return true
      }
    });
    if (!寻找) {
    //如果没找相同类型添加一个类型
      items.push({title:type,list:当前条目});
    }
}
}
res.data=items;
JSON.stringify(res);
}else if(code.search(/\$c_start.+?\$c_end/)!=-1){
    var 分类=code.split(/\$c_start.+?\$c_end/).filter(item=>item.indexOf("://")!=-1);
    var 线路=code.match(/\$c_start.+?\$c_end/g);
    var 列表规则=".z(.+?,.+)";
    var 标题规则=".ty(c_start).tz($c_end)";
    var 选集地址规则=".c(http://ip111.cn/?wd=).ty(,)";
    var 选集规则=".tz(,)";选集列表();
}else{
    var code=code.match(/.+?,.+/g);
    var res={};var items=[];
for(var i in code){
    var 选集=code[i].match(/(.+),/)[1];var 选集地址=code[i].match(/,[\s]*?(.+)/)[1];
    if(code[i].indexOf("|")!=-1){
        var type=选集.split("|")[0];
        var 选集标题=选集.split("|")[1];
    }else{
        var type=getVar("name")+"-无子分类";
        var 选集标题=选集;
    }
var 当前条目=[];当前条目.push({title:选集标题,url:"http://ip111.cn/?wd="+选集地址});
if(items.length==0) {
    items.push({title:type,list:当前条目});
}else{
    let 寻找=items.some(item=>{
    //判断类型，有就添加到当前项
      if(item.title == type){
      item.list=item.list.concat(当前条目);
      return true
      }
    });
    if (!寻找) {
    //如果没找相同类型添加一个类型
      items.push({title:type,list:当前条目});
    }
}
}
res.data=items;
JSON.stringify(res);
}
######直播免嗅探3
var uu=getVar("地址").split("/?wd=")[1];
if(uu.indexOf("#")!=-1){
var urls=uu.split("#");
var items=[];
for(var i=0;i<urls.length;i++){
    if(urls[i].indexOf(".php")!=-1){
        var resp = JZ(JSON.stringify({ url: urls[i], redirect: false }));
        var u = resp.head.Location || resp.head.location;
        if(!u){
            u=uu+"&type=.m3u8";
        }
    }else if(urls[i].indexOf("mitv://")!=-1){
        var u=urls[i].replace("mitv://","P2p://");
    }else{
        var u=urls[i];
    }
    items.push({name:"地址"+(i+1),url:u}); 
}
JSON.stringify(items);
}else{
    if(uu.indexOf(".php")!=-1){
        var resp=JZ(JSON.stringify({url:uu,redirect:false}));
        var u=resp.head.Location||resp.head.location;
        if(!u){
            u=uu+"&type=.m3u8";
        }
    }else if(uu.indexOf("mitv://")!=-1){
        var u=uu.replace("mitv://","P2p://");
    }else{
        var u=uu;
    }
JSON.stringify({name:"地址",url:u});
}
######通用免嗅探4
var uu=getVar("地址");
if(uu.indexOf("ip111.cn/?wd=")!=-1){
var playurl=uu.split("ip111.cn/?wd=")[1];
    if(playurl.indexOf("duoduozy.com")!=-1||playurl.indexOf("m3u8.cache.suoyo.cc")!=-1){
    /*var uuu="https://bo.movie06.com/ddplay/play.php?url="+playurl;
    var resp=getHttp(JSON.stringify({url:uuu,head:{"referer":"https://www.duoduozy.com/"}}));
    var uuuu=resp.match(/var urls.+?"(.+?)"/)[1];
    JSON.stringify({url:uuuu});*/
    "web=https://jhpc.manduhu.com/duoduo/?url="+playurl+'@{"Referer":"https://555dy3.com"}';
    }else if(playurl.indexOf("1080p.one/mogai_api.php/v1.api/Index?list=")!=-1){
        uu="https://zy.youhuima.vip/?url="+playurl.split("url=")[1];
        "web="+uu;
    }else if(playurl.indexOf("cat.wkfile.com")!=-1){
        JSON.stringify({name:"地址",url:playurl,head:{"User-Agent":"Lavf/58.12.100","Referer":"wkfile.com"}});
    }else if(playurl.indexOf(".m3u8")>15||playurl.indexOf(".mp4")>15||playurl.indexOf("/obj/tos")!=-1){
        if(playurl.indexOf("hsl.ysgc.xyz")!=-1){
        var cccc=JZ(JSON.stringify({url:"https://play.dushe520.com/m3u8.php?url="+playurl}));
        JSON.stringify({name:"地址",url:JSON.parse(cccc.code).url,head:{"Referer":"https://ysgc.cc"}});
        }else{
        JSON.stringify({name:"地址",url:playurl.match(/.*(http.*)/)[1]});
        }
    }else if(playurl.indexOf("=")!=-1){
            var resp=JZ(JSON.stringify({url:playurl,redirect:false}));
            if(resp.head.location||resp.head.Location){
                   var a=resp;
                   while(a.head.location||a.head.Location){
                    var finalurl=a.head.location||a.head.Location;
                    if(finalurl.indexOf(".mp4")>30){
                        var a={"head":{"cookie":"ccccc"}};
                    }else{
                        var a=JZ(JSON.stringify({url:finalurl,redirect:false,head:{"User-Agent":"Mozilla/5.0 Android"}}));
                    }
                   }
                   var realurl=finalurl;
                if(realurl.indexOf("=http")!=-1||realurl.indexOf("url=")!=-1){
                    if(a.code.indexOf("<html")!=-1){
                        "web="+realurl;
                    }else{
                        var ppurl=JSON.parse(a.code).url;
                        if(realurl.indexOf("mgtv.com")!=-1){
                            JSON.stringify({name:"地址",url:ppurl,head:{"User-Agent":"Mozilla/5.0","Referer":""}});
                        }else if(realurl.indexOf("bilibili.com")!=-1){
                            JSON.stringify({name:"地址",url:ppurl});
                        }else{
                            JSON.stringify({name:"地址",url:ppurl});
                        }
                    }
                }else{
                    if(playurl.indexOf("www.mgtv.com")!=-1){
                    JSON.stringify({name:"地址",url:realurl,head:{"User-Agent":"Mozilla/5.0","Referer":""}}); 
                    }else{
                    JSON.stringify({name:"地址",url:realurl});
                    }
                }
            }else{
                function 切换解析(data){
                        if(data.split("url=")[1].indexOf("http")!=-1){
                            return "web=http://1.117.152.239:39000/?url="+data.split("url=")[1];
                        }else if(data.split("url=")[1].indexOf("renrenmi")!=-1){
                            return "web=https://jx.blbo.cc:4433/?url="+data.split("url=")[1];
                        }else if(data.split("url=")[1].indexOf("LT-")!=-1){
                            return "web=https://analysis.yikan.one/analysis/player/?uid=8&my=fjkmoqFJLORTVZ1359&url="+data.split("url=")[1];
                        }else{
                            var 全能="http://jx.jisujiexi.vip/home/api?type=ys&uid=5196896&key=ajortuvxzRTUWXZ037&url="+data.split("url=")[1];
                            var link=e2Rex(getHttp(全能),".json(url).or().json(data).json(url)");
                            return JSON.stringify({name:"地址",url:link});
                        }
                }
                if(resp.code.indexOf("<html")!=-1){
                    if(resp.code.search(/player=new/)!=-1||resp.code.search(/<div id="video"/)!=-1||resp.code.search(/<div id="[^"]*?player"/)!=-1||resp.code.search(/\/\/视频链接/)!=-1||resp.code.search(/<iframe[\s\S]*?src="[^"]+?"/)!=-1||resp.code.search(/<video[\s\S]*?src="[^"]+?"/)!=-1){
                       "web="+playurl;
                    }else{
                       切换解析(playurl);
                    }
                }else{
                    if(e2Rex(resp.code,".json(url).or().json(data).json(url)").length>1){
                        var realurl=e2Rex(resp.code,".json(url).or().json(data).json(url)");
                        if(playurl.indexOf("mgtv.com")!=-1){
                            JSON.stringify({name:"地址",url:realurl,head:{"User-Agent":"Mozilla/5.0","Referer":""}});
                        }else if(playurl.indexOf("bilibili.com")!=-1){
                            JSON.stringify({name:"地址",url:realurl});
                        }else{
                            JSON.stringify({name:"地址",url:realurl});
                        }
                    }else{
                        切换解析(playurl);
                    }
                }
            }
        
    }
}else if(uu.indexOf("https://www.nfjx.xyz/player/?url=")!=-1){
    var resp=JZ(JSON.stringify({url:uu,head:{"Referer":"http://yanaifei.cn/","User-Agent":"Mozilla/5.0 Android"}})).code;
    var playurl=resp.match(/var config[\s\S]+?"url":"(.+?)"/)[1];
    JSON.stringify({name:"地址",url:playurl});
}else{
"web="+uu;
}
######CMSrule规则5
##首页规则
if(getVar("源码").indexOf("<rss")!=-1){var 列表=e2Arr(getVar("源码"),".xml(list video)");var 标题规则=".xml(name).ty(CDATA).tz2(])";var 地址规则=".c(?ac=videolist&ids=).xml(id).z(\\d+)";var 图片规则=".xml(pic).t().z(\\S.*\\S)";var 简介规则=".c(<font color='#0997F7'><b>).xml(dt).t().ct(</b></font><br>)";var 图片底部规则=".xml(last).t()";var 左上规则=".tx(<p style='background-color:#7091fc'><font color='#FFFFFF' size='40px'>).xml(type).t().ct(</font></p>)";var 右上规则=".tx(<p style='background-color:#CC00FF'><font color='#FFFFFF'>).xml(note).t().ct(</font></p>)";var NEXTPAGE="";var PREPAGE="";}else if(baseURL.indexOf("?")!=-1){var 列表=e2Arr(getVar("源码"),".json(list)");var 标题规则=".json(vod_name)";var 地址规则=".c(&ac=videolist&ids=).json(vod_id)";var 图片规则=".json(vod_pic)";var 简介规则=".c(<font color='#0997F7'><b>).json(vod_play_from).ct(</b></font><br>)";var 图片底部规则=".json(vod_time)";var 左上规则=".tx(<p style='background-color:#7091fc'><font color='#FFFFFF' size='40px'>).json(type_name).ct(</font></p>)";var 右上规则=".tx(<p style='background-color:#CC00FF'><font color='#FFFFFF'>).json(vod_remarks).ct(</font></p>)";var NEXTPAGE="";var PREPAGE="";}else{var 列表=e2Arr(getVar("源码"),".json(list)");var 标题规则=".json(vod_name).or().json(art_name)";var 地址规则=".c(?ac=videolist&ids=).json(vod_id).or().json(art_id)";var 图片规则=".json(vod_pic).or().json(art_pic)";var 简介规则=".c(<font color='#0997F7'><b>).json(vod_play_from).or().json(art_from).ct(</b></font><br>)";var 图片底部规则=".json(vod_time).or().json(art_time)";var 左上规则=".tx(<p style='background-color:#7091fc'><font color='#FFFFFF' size='40px'>).json(type_name).ct(</font></p>)";var 右上规则=".tx(<p style='background-color:#CC00FF'><font color='#FFFFFF'>).json(vod_remarks).or().json(art_remarks).ct(</font></p>)";var NEXTPAGE="";var PREPAGE="";}
##筛选数据
try{var 源码=getHttp(getVar("首页地址"));}catch(err){alert("筛选数据获取失败，错误描述："+err.message);}var baseURL=getVar("baseURL");alert("筛选数据获取成功");if(源码.indexOf("<rss")!=-1){var 列表=e2Arr(源码,".xml(class ty)");var a="";for(var i in 列表){var t=e2Rex(列表[i],".t()");var id=e2Rex(列表[i],".a(id)");a=a+"+"+t+"=&t="+id;}var b="";for(var i=1;i<50;i++){b=b+"+第"+i+"页="+i;}var a="分类+全部="+a;var b="翻页"+b;a+"\n"+b;}else if(baseURL.indexOf("?")!=-1){var 列表=e2Arr(源码,".json(class)");var a="";for(var i in 列表){var t=e2Rex(列表[i],".json(type_name)");var id=e2Rex(列表[i],".json(type_id)");a=a+"+"+t+"=&t="+id;}var b="";for(var i=1;i<50;i++){b=b+"+第"+i+"页="+i;}var a="分类+全部="+a;var b="翻页"+b;a+"\n"+b;}else{var 列表=e2Arr(源码.replace(/<.*?>/g,""),".json(class)");if(列表[0]){var a="";for(var i in 列表){var t=e2Rex(列表[i],".json(type_name).or().json(type_title)");var id=e2Rex(列表[i],".json(type_id)");a=a+"+"+t+"=&t="+id;}}else{var a="+电影=&t=1+电视剧=&t=2+综艺=&t=3+动漫=&t=4+动作片=&t=6+喜剧片=&t=7+爱情片=&t=8+科幻片=&t=9+恐怖片=&t=10+剧情片=&t=11+国产剧=&t=13+港台剧=&t=14+日韩剧=&t=15+欧美剧=&t=16";}var b="";for(var i=1;i<50;i++){b=b+"+第"+i+"页="+i;}var a="分类+全部="+a;var b="翻页"+b;a+"\n"+b;}
##分类规则
if(getVar("源码").indexOf("<rss")!=-1){var 列表=e2Arr(getVar("源码"),".xml(list video)");var 标题规则=".xml(name).ty(CDATA).tz2(])";var 地址规则=".c(?ac=videolist&ids=).xml(id).z(\\d+)";var 图片规则=".xml(pic).t().z(\\S.*\\S)";var 简介规则=".c(<font color='#0997F7'><b>).xml(dt).t().ct(</b></font><br>)";var 图片底部规则=".xml(last).t()";var 左上规则=".tx(<p style='background-color:#7091fc'><font color='#FFFFFF' size='40px'>).xml(type).t().ct(</font></p>)";var 右上规则=".tx(<p style='background-color:#CC00FF'><font color='#FFFFFF'>).xml(note).t().ct(</font></p>)";var NEXTPAGE="";var PREPAGE="";}else if(baseURL.indexOf("?")!=-1){var 列表=e2Arr(getVar("源码"),".json(list)");var 标题规则=".json(vod_name)";var 地址规则=".c(&ac=videolist&ids=).json(vod_id)";var 图片规则=".json(vod_pic)";var 简介规则=".c(<font color='#0997F7'><b>).json(vod_play_from).ct(</b></font><br>)";var 图片底部规则=".json(vod_time)";var 左上规则=".tx(<p style='background-color:#7091fc'><font color='#FFFFFF' size='40px'>).json(type_name).ct(</font></p>)";var 右上规则=".tx(<p style='background-color:#CC00FF'><font color='#FFFFFF'>).json(vod_remarks).ct(</font></p>)";var NEXTPAGE="";var PREPAGE="";}else{var 列表=e2Arr(getVar("源码"),".json(list)");var 标题规则=".json(vod_name).or().json(art_name)";var 地址规则=".c(?ac=videolist&ids=).json(vod_id).or().json(art_id)";var 图片规则=".json(vod_pic).or().json(art_pic)";var 简介规则=".c(<font color='#0997F7'><b>).json(vod_play_from).or().json(art_from).ct(</b></font><br>)";var 图片底部规则=".json(vod_time).or().json(art_time)";var 左上规则=".tx(<p style='background-color:#7091fc'><font color='#FFFFFF' size='40px'>).json(type_name).ct(</font></p>)";var 右上规则=".tx(<p style='background-color:#CC00FF'><font color='#FFFFFF'>).json(vod_remarks).or().json(art_remarks).ct(</font></p>)";var NEXTPAGE="";var PREPAGE="";}
##选集规则
var type="CMS";var baseURL=getVar("baseURL");if(getVar("源码").indexOf("<rss")!=-1){var 分类=e2Arr(getVar("源码"),".get(dd)");var 简介=e2Rex(getVar("源码"),".c(类型:).xml(type).c(<br>演员表:).xml(actor).c(<br>简介:).xml(des)");var 列表规则=".z2(CDATA\\[\\([\\s\\S]*?\\)[#]*?\\]).fg(#)";var 标题规则=".a(flag)";var 选集规则=".tz($)";var 选集地址规则=".z2(\\$\\([^\$|&]*\\)).or().z(.*)";}else{if(baseURL.indexOf("61783.xyz")!=-1){var 分类=e2Arr(getVar("源码").replace(/<.*?>/g,""),".json(list).json(art_remarks).fg(\\$\\$\\$)");var 线路=e2Arr(getVar("源码").replace(/<.*?>/g,""),".json(list).json(art_name).fg(\\$\\$\\$)");var 选集地址规则=".z2(\\$\\(.*\\)).or().z(.*)";var 简介=e2Rex(getVar("源码"),".c(演员表:).json(list).json(art_author).c(<br>简介:).json(list).json(art_name)");var 列表规则=".fg(#)";var 标题规则=".t()";var 选集规则=".tz($)";}else{var 分类=e2Arr(getVar("源码").replace(/<.*?>/g,""),".json(list).json(vod_play_url).fg(\\$\\$\\$)");var 线路=e2Arr(getVar("源码").replace(/<.*?>/g,""),".json(list).json(vod_play_from).fg(\\$\\$\\$)");var 选集地址规则=".z2(\\$\\(.*\\)).or().z(.*)";var 简介=e2Rex(getVar("源码"),".c(演员表:).json(list).json(vod_actor).c(<br>简介:).json(list).json(vod_content)");var 列表规则=".fg(#)";var 标题规则=".t()";var 选集规则=".tz($)";}}
##搜索规则
var 源码=getVar("源码");if(源码.indexOf("<rss")!=-1){var 列表=e2Arr(源码,".xml(video)");var 标题规则=".xml(name).ty(CDATA).tz2(])";var 地址规则=".c(?ac=videolist&ids=).xml(id).z(\\d+)";var 图片规则=".xml(pic).t().z(http.*\\S)";var 简介规则=".c(<font color='#0997F7'><b>).xml(dt).t().c(</b></font><br>).xml(last).t()";var NEXTPAGE="";var PREPAGE="";}else{var 列表=e2Arr(源码.replace(/<.*?>/g,""),".json(list)");var 标题规则=".json(vod_name).or().json(art_name)";var 地址规则=".c(?ac=videolist&ids=).json(vod_id).or().json(art_id)";var 图片规则=".json(vod_pic).or().json(art_pic)";var 简介规则=".json(type_name).c().json(vod_time).or().json(art_time).c().json(vod_remarks).or().json(art_remarks)";var 图片底部规则="";var 左上规则="";var 右上规则="";var NEXTPAGE="";var PREPAGE="";}
##搜索翻页
var b="";for(var i=1;i<50;i=i+1){b=b+"+第"+i+"页="+i;}
"翻页"+b;
##免嗅探规则
eval(getVar("通用免嗅探"));
######普通列表6
function 通用列表(){
    var res={};var items=[];
    var LIMIT=列表.length;
    for(var j=0;j<LIMIT;j++){
        var CODE=列表[j];
        var 预地址=e2Rex(CODE,地址规则);
        var 地址=预地址.indexOf("http")!=-1?预地址:baseURL+预地址;
        if(地址.search(/\.php\/.+?\.vod/)!=-1){
            var 日期=e2Rex(getVar("TIME_"),".time(MMdd)");
            var 地址=地址+"&key="+日期+"&keytime="+getVar("TIME_");
        }
        var 标题=e2Rex(CODE,标题规则);
        var 预图片=e2Rex(CODE,图片规则);
        if(预图片.indexOf("/mac:")!=-1){
            var 图片="http:"+预图片.split("/mac:")[1];
        }else if(预图片.indexOf("=http")!=-1){
            var 图片=预图片.match(/.*(http.*)/)[1];
        }else if(预图片.indexOf("http")==0){
            var 图片=预图片;
        }else if(预图片==""){
            var 图片="https://gitcode.net/egwang186/iptv/-/raw/master/onebox/kongbai.gif";
        }else{
            var 图片=baseURL+预图片;
            if(baseURL.indexOf("1090ys2.com")!=-1){
            var 图片=图片+'@{"user-agent":"Mozilla/5.0","referer":"http://1090ys2.com/"}';
            }
        }
        var 简介=e2Rex(CODE,简介规则);
        var 图片底部=e2Rex(CODE,图片底部规则);
        var 左上=e2Rex(CODE,左上规则);
        var 右上=e2Rex(CODE,右上规则);
        items.push({title:标题,url:地址,img:图片,detail:简介,td:图片底部,zs:左上,ys:右上});
    }
    res.data=items;
    if(NEXTPAGE){
        res.nextpage=NEXTPAGE;
    }
    if(PREPAGE){
        res.prepage=PREPAGE;
    }
    return JSON.stringify(res);
}
eval(readStr("QJS"));
var baseURL=getVar("baseURL");
eval(getVar("列表规则"));通用列表();
######选集列表7
function CMS选集列表(){
    var res={};var items=[];var detail=[];
    var d = [];
    for (let index = 0; index < 分类.length; index++) {
            function fn(i) {
              return function () {
        var 分类CODE=分类[i];
        var 列表=e2Arr(分类CODE,列表规则).filter(Boolean);
        if(线路){
        var 标题=e2Rex(线路[i],标题规则);
        }else{
        var 标题=e2Rex(分类CODE,标题规则);
        }
        var LIST=[];
        for(var j=0;j<列表.length;j++){
            if(列表[j].indexOf("$")!=-1){
                var 选集=e2Rex(列表[j],选集规则);
                if(选集==""){
                选集=j+1;
                }
            }else{
              var 选集=j+1;
            }
            var 选集地址=e2Rex(列表[j],选集地址规则);
    //开始根据网址，线路判断前缀
    if(标题=="xhzy"){
          选集地址=选集地址;
    }else if(baseURL.indexOf("api.yunboys.cn")!=-1){
          选集地址="https://jx.yunboys.cn/?url="+选集地址;
    }else if(baseURL.indexOf("ttky8.com")!=-1){
          选集地址="http://ip111.cn/?wd="+选集地址;
    }else if(标题.indexOf("Tcm3u8")!=-1){
          选集地址="https://api.iopenyun.com:88/vips/?url="+选集地址;
    }else if(标题.indexOf("bjhu")!=-1){
        选集地址="http://124.223.69.144:8999/web/115?url="+选集地址;
    }else if(baseURL.indexOf("ujuba.com")!=-1){
          选集地址="https://www.dmplay.xyz/j0?url="+选集地址;
    }else if(baseURL.indexOf("xinlangapi.com")!=-1){
        if(标题=="xlm3u8"){
        选集地址="https://www.xinlangjiexi.com/m3u8/?url="+选集地址;
        }else{
        选集地址=选集地址;  
        }
    }else if(标题=="ddzy"){
        选集地址="http://qiqi.520say.cn/json/dd.php?url="+选集地址;
    }else if(标题=="autue"){
        选集地址=e2Rex(选集地址,".dn64()");
    }else if(标题=="Mika"){
        选集地址="https://mika.ovooa.com/api/player/xg.php?key=200OK&url="+选集地址;
    }else if(baseURL.indexOf("app.netflixmi.com")!=-1){
        选集地址="https://player.naifeimi.com/?url="+选集地址;
    }else if(baseURL.indexOf("yanaifei.cn")!=-1||baseURL.indexOf("45.125.46.41:4433")!=-1){
        /*if(标题=="VIP"){
            选集地址="http://ip111.cn/?wd=http://www.yanaifei.cn/addons/dplayer/?pid="+选集地址;
        }else if(标题=="qq"){
            选集地址="http://ip111.cn/?wd=http://www.yanaifei.cn/addons/dplayer/qq.php?url="+选集地址;
        }else if(标题=="VIP3"){
            选集地址="http://ip111.cn/?wd=http://www.yanaifei.cn/addons/dplayer/rrjx.php?fid="+选集地址;
        }else if(标题=="VIP2"){
            选集地址="http://ip111.cn/?wd=http://www.yanaifei.cn/addons/dplayer/ddjx.php?url="+选集地址;
        }else if(标题=="LIBVIO"){
            选集地址="http://ip111.cn/?wd=http://www.yanaifei.cn/addons/dplayer/lbjx.php?url="+选集地址;
        }else{
            选集地址=选集地址;
        }*/
        选集地址="https://www.nfjx.xyz/player/?url="+选集地址;
  }else if(baseURL.indexOf("apicdn.vipm3u8.com")!=-1){
          选集地址="https://player.vipparsing.com/player?token=4732bUERfVb60lWNSLrsd5-2s1r70KeA89C3VwrGYYdByboQT9o4OzxIr5-8/cX9-sO6&vid="+选集地址;
    }else if(选集地址.indexOf("html")!=-1||选集地址.indexOf("www.bilibili.com")!=-1||选集地址.indexOf("share.weiyun.")!=-1){
          选集地址="http://1.117.152.239:39000/?url="+选集地址;
    }else if(选集地址.indexOf(":6688/player")!=-1){
        var hash=选集地址.split("player/")[1];
        var dd=hash.substring(0,2);
        选集地址="http://ip111.cn/?wd=https://qq.iqiyi3.b555b.com:7777/"+dd+"/"+hash+"/hd.m3u8";
  }else if(baseURL.indexOf("api.yparse.com")!=-1){
          选集地址="https://yparse.jn1.cc/index.php?url="+选集地址;
    }else if(标题.indexOf("rrm3u8")!=-1){
      选集地址="https://www.meiju11.com/ckplayerx/m3u8.php?url="+选集地址;
    }else if(标题=="dmplay"||标题=="base"){
    选集地址="https://play.omofun.tv/m3u8.php?url="+选集地址;
    }else if(标题.indexOf("ltnb")!=-1){
      //选集地址="https://jifei.longtengzy.fun/video/?url="+选集地址;
      //选集地址="http://jx.yinliub.cn/home/api?type=ys&uid=51213&key=chiprvyFHJNOTUVZ39&url="+选集地址;
      选集地址="https://analysis.yikan.one/analysis/player/?uid=8&my=fjkmoqFJLORTVZ1359&url="+选集地址;
    }else if(选集地址.indexOf(".ruifenglb.com")!=-1){
       选集地址="http://ip111.cn/?wd=https://js.jisujiexi.vip/home/api?type=ys&uid=196395&key=aejlnoprsABDNUZ159&url="+选集地址;
    }else if(选集地址.indexOf(".m3u8")>15||选集地址.indexOf(".mp4")>15){
          选集地址="http://ip111.cn/?wd="+选集地址;
    }else if(标题=="4kdym"||标题=="8kvod"){
          选集地址="http://ip111.cn/?wd="+decodeURIComponent(选集地址);
    }else if(标题=="789pan"||标题=="pll"){
        选集地址="https://dp.jiexi.work/bfq.php?url="+选集地址;
    }else if(标题=="zbkplayer"){
          选集地址="http://analysis.yikan.one/analysis/player/?uid=8&my=fjkmoqFJLORTVZ1359&url="+选集地址;
    }else if(标题=="lekanzyw"){
          //选集地址="https://bfq.ikan6.vip/m3u8.php?url="+选集地址+'@{"Referer":"https://ikan6.vip/","User-Agent":"Mozilla/5.0 Android"}';
          选集地址='https://play.ekvod.com/play/?url='+选集地址;
    }else if(标题.indexOf("miaoparty2")!=-1){
      选集地址="https://vip5.jiexi.one?url="+选集地址;
    }else if(标题.indexOf("miaoparty")!=-1){
      选集地址="https://jx.yingciyuan.cn/?url="+选集地址;
    }else if(标题.indexOf("mx771")!=-1||标题.indexOf("mengxin886")!=-1){
      选集地址="https://vip.mengx.vip/home/api?type=ys&uid=2117076&key=abghklvyDEIJLNT025&url="+选集地址;
    }else if(标题.indexOf("taiyi")!=-1){
      选集地址="https://jx.cyu0.cn/?url="+选集地址;
    }else if(标题.indexOf("x1play")!=-1){
      选集地址="https://www.xing1.vip/player/dp/?url="+选集地址;
    }else if(标题.indexOf("xfyun")!=-1){
      选集地址="https://b.sigu.tv/api/type/?key=b08DPxVf9MCYrAX8fP&url="+选集地址;
    }else if(标题=="rx"){
      选集地址="https://svip.rongxingvr.top/api/?key=B26J6jO5MOnjUv3GqW&url="+选集地址;
    }else if(标题=="renrenmi"){
          //选集地址="http://www.1080kan.cc/jiexi/rrmi.php?url="+选集地址+'@{"Referer":"http://www.1080kan.cc/"}';
          //选集地址="https://kuba.renrenmi.cc:2266/api/?key=2WzAj2s0pgQ1AYQoPT&url="+选集地址;
          //选集地址="https://sudu.renrenmi.cc:2021/ku/?url="+选集地址;
          //选集地址="https://jiexi.astv.vip/home/api?type=ys&uid=1&key=free&url="+选集地址;
          选集地址="https://jx.blbo.cc:4433/?url="+选集地址;
    }else if(baseURL.indexOf('fqzy.cc')!=-1){
          选集地址="https://jx.fqzy.cc/jx.php?url="+选集地址;
    }else if(标题=='dym3'){
          选集地址="https://1.m3u8.shop/m3u8.php?url="+选集地址;
    }else if(baseURL.indexOf('zy.7kjx.com')!=-1){
          选集地址="https://jx.xmflv.vip/?url="+选集地址;
    }else if(标题.indexOf('leduo')!=-1){
          选集地址="https://api.ldjx.cc/wp-api/ifr.php?vid="+选集地址;
    }else if(标题.indexOf("mengxin")!=-1){
          选集地址="https://jx3.bifenvip.com/?url="+选集地址;
    }else if(标题.indexOf("aly")!=-1){
          选集地址="https://aly.178du.com/"+选集地址;
    }else if(标题=='niux'){
          选集地址="https://www.juztv.com/jx.php?id="+选集地址;
    }else if(标题=='u'){
          选集地址="https://jx.dxsdkw.cn/nv/"+选集地址+".m3u8";
    }else if(标题=='youbo'){
          选集地址="http://1090ys2.com/x2.php?id="+选集地址+'@{"Referer":"http://1090ys2.com/"}';
    }else if(baseURL.indexOf('tvyb02.com')!=-1||baseURL.indexOf('zy.vodcdn.top')!=-1){
          if(标题=='hkm3u8'){
          选集地址="https://jxn.dxsdkw.cn/jm/x2.php?id="+选集地址+'@{"referer":"http://www.tvyb02.com/"}';
          }else if(选集地址.indexOf(".m3u8")>15||选集地址.indexOf(".mp4")>15||选集地址.indexOf("/obj/tos")!=-1){
          选集地址="http://ip111.cn/?wd="+选集地址;
          }else if(标题=='banyun'||标题=='yunbo'){
          var playurl="https://www.mayigq.com/vodzip/player.php?vid="+选集地址;
          选集地址="http://ip111.cn/?wd="+playurl;
          }
    }
    //结束判断
            LIST.push({title:选集,url:选集地址});
        }
    var play_={};
    play_.title=标题;
    play_.list=LIST;
    return play_;
    };
    }
    d.push(fn(index));
  }
    var s = _.submit(d, 分类.length); //n 改为你想开启的线程数
    for (let i = 0; i < s.length; i++) {
      for (let z of s[i].get()) {
        items.push(z);
      }
    }
    detail.push({desc:简介});
    res.data=items;
    res.desc=detail;
    return JSON.stringify(res);
}
function 选集列表(){
    var res={};var items=[];var detail=[];
    var d = [];
    for (let index = 0; index < 分类.length; index++) {
            function fn(i) {
              return function () {
        var 分类CODE=分类[i];
        var 列表=e2Arr(分类CODE,列表规则);
        if(线路){
        var 标题=e2Rex(线路[i],标题规则);
        }else{
        var 标题=e2Rex(分类CODE,标题规则);
        }
        if(baseURL.search(/\.php\/.+?\.vod/)!=-1){
           var PARSE=e2Rex(分类CODE,".json(player_info).json(parse)").split(",");
           var PARSE2=e2Rex(分类CODE,".json(player_info).json(parse2)").split(",");
           var 总接口=PARSE.concat(PARSE2).filter(item => item.search(/\/.+?\?.+?=/)!=-1);
           var 过滤规则=[
    /jx\.+huimaojia\.+com\/player/,/py\.+789pan\.+cn\/player\/tm\.php\?url=/,/ztys\.+waruanzy\.+com\/player\/\?url=/,/yingshi\.+waruanzy\.+com\/789pan\/\?url=/,/vip\.+parwix\.+com:4433\/player\/\?url=/,/api\.+cxitco\.+cn/,/\/vip\.+renrenmi.cc/,/yanbing\.+parwix\.+com:4433\/player/,/json\.+cantin\.+cc\/apijson\.php/,/ffdm\.+miaoletv\.+com\/\?url=/,/vip\.+sylwl\.+cn\/api\/\?key=/,/jx\.+dikotv\.+com\/\?url=/,/zly\.+xjqxz\.+top\/player\/\?url=/,/5znn\.+xyz\/m3u8\.+php/,/uid=1735&my=/,/api\.+xkvideo\.+design\/m3u8\.+php\?url=/,/play\.+szbodankyy\.+com\/xxoocnmb/,/vip\.+fj6080\.+xyz\/player\/\?url=/,/a\.+dxzj88\.+com\/jiexi/,/host\.+q-q\.+wang\/api/,/qpsvipr\.+naifeimi\.+com/,/保佑/
    ];
           var 可用接口=总接口.filter(function (text) {return !过滤规则.some(function (regex) {return regex.test(text);});});
           if(JSON.stringify(可用接口).indexOf("=")!=-1){
              if(可用接口[0].indexOf("http")!=-1){
              var 接口=可用接口[0].match(/.+(url|v|vid|php\?id)=/)[0].replace("..",".");
              }else if(可用接口[0].indexOf("//")==0){
              var 接口=baseURL.split(":")[0]+可用接口[0].match(/\/\/.+(url|v|vid|php\?id)=/)[0].replace("..",".");
              }else{
              var 接口=baseURL.match(/https?:\/\/[^\/]*/)[0]+可用接口[0].match(/\/.+(url|v|vid|php\?id)=/)[0].replace("..",".");
              }
           }else{
           var 接口="http://1.117.152.239:39000/?url=";
           }
        }else if(baseURL.indexOf("api.php/app/")!=-1||baseURL.indexOf("xgapp.php/v")!=-1){
          var 接口=e2Rex(分类CODE,".json(parse_api)");
        }else{
        var 接口=baseURL;
        }
        var LIST=[];
        for(var j=0;j<列表.length;j++){
            var 选集=e2Rex(列表[j],选集规则);
            var 选集地址=e2Rex(列表[j],选集地址规则);
            if(baseURL.indexOf("xgapp.php/v")!=-1||baseURL.indexOf("api.php/app/")!=-1||baseURL.search(/\.php\/.+?\.vod/)!=-1){
               if(选集地址.indexOf(".m3u8")>15||选集地址.indexOf(".mp4")>15){
                   if(选集地址.indexOf(".ruifenglb.com")!=-1){
                       var 接口="https://js.jisujiexi.vip/home/api?type=ys&uid=196395&key=aejlnoprsABDNUZ159&url=";
                       var 选集地址="http://ip111.cn/?wd="+接口+选集地址;
                   }else{
                       var 选集地址="http://ip111.cn/?wd="+选集地址;
                   }
               }else{
               var 选集地址="http://ip111.cn/?wd="+接口+选集地址;
               }
            }else if(baseURL.search(/api\.php\/.*?\/vod/)!=-1){
                if(baseURL.indexOf("ppzhu.vip")!=-1||baseURL.indexOf("api.8d8q.com")!=-1){
                    var 选集地址="http://ip111.cn/?wd="+选集地址+"&app=10003&account=272775028&password=qq272775028";
                }else{
                   if(选集地址.indexOf("=")!=-1||选集地址.indexOf(".m3u8")>15||选集地址.indexOf(".mp4")>15){
                        var 选集地址="http://ip111.cn/?wd="+选集地址;
                   }else if(选集地址.indexOf("html")||选集地址.indexOf("www.bilibili.com")){
                        var 选集地址="http://ip111.cn/?wd=https://api.m3u8.tv:5678/home/api?type=ys&uid=233711&key=bgjnopvDHPUY035689&url="+选集地址;
                   }else{
                        var 选集地址=选集地址;
                   }
                }
            }else if(选集地址.indexOf("http")!=-1){
                var 选集地址=选集地址;
            }else{
                if(baseURL.indexOf("gimytv.com")!=-1){
                    var 选集地址=接口+选集地址+'@{"user-agent":"Mozilla/5.0 Windows10","Referer":"'+接口+'"}';
                }else{
                    var 选集地址=接口+选集地址;
                }
            }
            LIST.push({title:选集,url:选集地址});
        }
    var play_={};
    play_.title=标题;
    play_.list=LIST;
    return play_;
    };
    }
    d.push(fn(index));
  }
    var s = _.submit(d, 分类.length); //n 改为你想开启的线程数
    for (let i = 0; i < s.length; i++) {
      for (let z of s[i].get()) {
        items.push(z);
      }
    }



    detail.push({desc:简介});
    res.data=items;
    res.desc=detail;
    return JSON.stringify(res);
}
eval(readStr("QJS"));
var baseURL=getVar("baseURL");
if(typeof(type) == "undefined"){
    var 类型="";
}else{
    var 类型=type;
}
if(类型){
CMS选集列表();
}else{
选集列表();
}
######QJS8
ZXZhbChmdW5jdGlvbihwLGEsYyxrLGUscil7ZT1mdW5jdGlvbihjKXtyZXR1cm4oYzw2Mj8nJzplKHBhcnNlSW50KGMvNjIpKSkrKChjPWMlNjIpPjM1P1N0cmluZy5mcm9tQ2hhckNvZGUoYysyOSk6Yy50b1N0cmluZygzNikpfTtpZignMCcucmVwbGFjZSgwLGUpPT0wKXt3aGlsZShjLS0pcltlKGMpXT1rW2NdO2s9W2Z1bmN0aW9uKGUpe3JldHVybiByW2VdfHxlfV07ZT1mdW5jdGlvbigpe3JldHVybicoWzIzNS05cUMtWl18MVxcdyknfTtjPTF9O3doaWxlKGMtLSlpZihrW2NdKXA9cC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcYicrZShjKSsnXFxiJywnZycpLGtbY10pO3JldHVybiBwfSgnKDMoKXsyIF89e307MiBtPTEuMDsyIHI9MTAub3MuRW52aXJvbm1lbnQuZ2V0RXh0ZXJuYWxTdG9yYWdlRGlyZWN0b3J5KCk7MiBzPTEwLndlYmtpdC5NaW1lVHlwZU1hcC5nZXRTaW5nbGV0b24oKTsyIHQ9TS5pbzsyIHU9TS4xbjsyIHY9dC5OLnNlcGFyYXRvcjsyIHc9MW8oKSt2K1wncW1cJyt2K0MoKS4xMS5PKDAsNCkrXCckJCRcJytDKCkuMTIrdjtEPSgxcCk9PjFxIDFwPT09XCdzdHJpbmdcJzszIDEzKGEpe2NvbnN0IDE0PTFxIGE7NSBhIT1QJiYoMTQ9PVwnb2JqZWN0XCd8fDE0PT1cJzNcJyl9MiB5PU0udXRpbC5jb25jdXJyZW50OzIgej02IHkuRXhlY3V0b3JzLm5ld0NhY2hlZFRocmVhZFBvb2woKTszIFEoYSl7MXI9ezFzOjMoKXs1IGEoKX0sfTsyIGI9NiB5LkZ1dHVyZVRhc2soMXIpO3ouUihiKTs1IGJ9MyBTKGEsYil7RSBGPTA7RSAxNT1bXTtHKEY8YS44KXsxNS4xNihhLnNsaWNlKEYsRitiKSk7Ris9Yn01IDE1LmZpbHRlcigobyk9Pm8uOD4wKX0zIFIobCxuKXtjPVtdO1Q9UyhsLGwuOC9uKTsyIG49MDtHKG48VC44KXszIGwoeCl7NSAzIG8oKXsyIGE9W107MTcoRSBpPTA7aTxUW3hdLjg7aSsrKXthLjE2KFRbeF1baV0oKSl9NSBhfX1jLjE2KFEobChuKSkpO24rK301IGN9MyBVKGYpezIgYT1mLmdldFBhcmVudEZpbGUoKTs3KCFhLjF0KCkpYS5VKCl9MyA5KGEsYil7MiBjPTYgdC5OKHcrXCfmlbDmja5cJyt2K2IpO1UoYyk7MiBkPTYgdC5GaWxlV3JpdGVyKGMsMTgpO2QuOShhKTtkLkgoKX0zIEkoYSl7MiBiPTYgdC5OKHcrXCfmlbDmja5cJyt2K2EpOzIgYz0wOzcoIWIuMXQoKXx8KGM9Yi44KCkpPT0wKTVcJ1wnOzIgZD11LjF1LjF2LjF3KHUuMXguMXksYyk7MiBlPTYgdC5GaWxlSW5wdXRTdHJlYW0oYik7ZS5JKGQpO2UuSCgpOzUgNiB1LlN0cmluZyhkKX0yIEE9MXoub3JnLmpzb3VwOzIgQj1BLkNvbm5lY3Rpb24uTWV0aG9kOzMgVihvKXtFezE5LHEsSiwxYSwxYixXLHJlfT1vOzIgYT1BLkpzb3VwLmNvbm5lY3QoMTkpO2EuaWdub3JlQ29udGVudFR5cGUoWCk7YS5wb3N0RGF0YUNoYXJzZXQoMWIpO2EubWF4Qm9keVNpemUoMTA0ODU3NjAwMCk7cmU9PT0xOD9hLjFBKHJlKTphLjFBKFgpOzcoMTMocSkpMTcoeCBpbiBxKWEucSh4LHFbeF0pOzcoMTMoSikpezcoMWE9PT1YKWEucmVxdWVzdEJvZHkoSik7MUMgMTcocCBpbiBKKWEuZGF0YShwLEpbcF0pfTIgYjs3KDFhPT09WHx8Vz09XCdwb3N0XCcpYj1hLlcoQi5QT1NUKS4xRCgpOzFDIGI9YS5XKEIuR0VUKS4xRCgpOzUgYn0zIDFFKGEsYil7YS4xYihiKTs1IGEuYm9keSgpfTMgMUYoYSxiKXs1IGIrXCc9XCcrYS5jb29raWUoYil9MyAxRyhhKXsyIGI9XCdcJzsyIGM9YS5jb29raWVzKCkuMUgoKS4xSSgpO0coYy4xSigpKXsyIGQ9Yy4xSygpO2IrPWQuMUwoKStcJz1cJytkLjFNKCkrXCc7XCd9NSBifTMgMU4oYSxiKXs1IGEucShiKX0zIDFPKGEpezIgYj1cJ1wnOzIgYz1hLmhlYWRlcnMoKS4xSCgpLjFJKCk7RyhjLjFKKCkpezIgZD1jLjFLKCk7Yis9ZC4xTCgpK1wnPVwnK2QuMU0oKStcJztcJ301IGJ9MyAxZChhKXsyIGI9YS4xZShcJy9cJyk7NyhhLjgoKT09YisxKXthPWEuTygwLGIpOzUgMWQoYSl9NSBhLk8oMCxhLjFlKFwnLlwnKSl9MyAxZihvKXt0cnl7RXsxZywxUH09bzsyIGE9VihvKTsyIGI9MWQoYS4xOSgpLjFoKCkpOzIgYz1zLmdldEV4dGVuc2lvbkZyb21NaW1lVHlwZShhLmNvbnRlbnRUeXBlKCkuc3BsaXQoXCc7XCcpWzBdKTsyIGQ9Yi5PKGIuMWUoXCcvXCcpKzEpK1wnLlwnK2M7Sz1EKDFnKT8xZyt2K2Q6dytcJ+S4i+i9vVwnK3YrZDsyIGY9YS5ib2R5U3RyZWFtKCk7MiBnPTYgdS4xdS4xdi4xdyh1LjF4LjF5LDQwOTYpOzIgaD0wOzIgaT02IHQuQnl0ZUFycmF5T3V0cHV0U3RyZWFtKCk7RygoaD1mLkkoZykpIT0tMSl7aS45KGcsMCxoKX0yIGo9NiB0Lk4oSyk7VShqKTsyIGs9NiB0LkZpbGVPdXRwdXRTdHJlYW0oaik7ay45KGkudG9CeXRlQXJyYXkoKSk7NygxUD09PTE4KTUgSztMKFwn5LiL6L295oiQ5Yqf77yM6Lev5b6EOlwnK0spOzUgS31jYXRjaChlKXtZKGUpO0woXCfkuIvovb3lpLHotKUs6K+35omT5byA6LCD6K+V5Y+w5p+l55yL5YW35L2T5byC5bi45L+h5oGvXCcpfWZpbmFsbHl7NyhpIT1QKWkuSCgpOzcoayE9UClrLkgoKTs3KGYhPVApZi5IKCl9fTMgWShlKXtEKGUpP+aKpemUmShlKTrmiqXplJkoZS4xaCgpKX0zIEwoYSl7YWxlcnQoYSl9MyAxaSgpezYgMXouMTAuYXBwLkluc3RydW1lbnRhdGlvbigpLnNlbmRLZXlEb3duVXBTeW5jKDQpfTMgMW8oKXs1IHIuZ2V0QWJzb2x1dGVQYXRoKCkuMWgoKX0zIFooYSl7TS4xbi5UaHJlYWQuWihhKX0zIEMoKXtvPXt9O28uMTE9MWooMWsoXCcxbFwnKSxcJy4xbSgxMSkudCgpXCcpO28uMVE9MWooMWsoXCcxbFwnKSxcJy4xbSgxUSkudCgpXCcpO28uMTI9MWooMWsoXCcxbFwnKSxcJy4xbSgxMikudCgpXCcpOzUgb31fLlZFUlNJT049bTtfLkk9STtfLjk9OTtfLlo9WjtfLlE9UTtfLlI9UjtfLlM9UztfLjFpPTFpO18uRD1EO18uVj1WO18uYmQ9MUU7Xy5jaz0xRjtfLmNrcz0xRztfLmhkPTFOO18uaGRzPTFPO18uMWY9MWY7Xy5DPUM7Xy5MPUw7Xy5ZPVk7MVIuXz1ffS4xcygxUikpOycsW10sMTE2LCd8fHZhcnxmdW5jdGlvbnx8cmV0dXJufG5ld3xpZnxsZW5ndGh8d3JpdGV8fHx8fHx8fHx8fHx8fHx8fGhlYWRlcnx8fHx8fHx8fHx8fGluZm98aXNTdHJpbmd8bGV0fGluZGV4fHdoaWxlfGNsb3NlfHJlYWR8cGFyYW1zfHNhdmVwYXRofHRvYXN0fGphdmF8RmlsZXxzdWJzdHJpbmd8bnVsbHx0aHJlYWR8c3VibWl0fGNodW5rfGxpc3R8bWtkaXJzfGh0dHB8bWV0aG9kfHRydWV8ZXJyb3J8c2xlZXB8YW5kcm9pZHxzaWdufG5hbWV8aXNPYmplY3R8dHlwZXxyZXN8cHVzaHxmb3J8ZmFsc2V8dXJsfGpzb258Y2hhcnNldHx8dHJpbVV8bGFzdEluZGV4T2Z8ZG93bmxvYWR8c2V0cGF0aHx0b1N0cmluZ3xiYWNrfGUyUmV4fGdldFZhcnxRTUlORk98Z2V0fGxhbmd8cGF0aHx2YWx8dHlwZW9mfG9ianxjYWxsfGV4aXN0c3xyZWZsZWN0fEFycmF5fG5ld0luc3RhbmNlfEJ5dGV8VFlQRXxQYWNrYWdlc3xmb2xsb3dSZWRpcmVjdHN8fGVsc2V8ZXhlY3V0ZXxodHRwQm9keXxodHRwQ29va2llfGh0dHBDb29raWVzfGVudHJ5U2V0fGl0ZXJhdG9yfGhhc05leHR8bmV4dHxnZXRLZXl8Z2V0VmFsdWV8aHR0cEhlYWRlcnxodHRwSGVhZGVyc3x0aXBzfHZlcnNpb258dGhpcycuc3BsaXQoJ3wnKSwwLHt9KSk=