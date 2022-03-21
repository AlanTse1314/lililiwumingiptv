######备用数据1
{"data":[
    {
       "title":"推荐订阅",
       "rule":{
            "分类":'var a="松鼠TV$https://egwang186.coding.net/p/egwang186/d/iptv/git/raw/master/zby/txt源/松鼠TV.txt$$央卫0$https://cdn.jsdelivr.net/gh/wudongdefeng/za@master/wind/0.txt$$地方iptv$https://cdn.jsdelivr.net/gh/wudongdefeng/za@master/wind/iptv.txt$$六维liuwei$https://cdn.jsdelivr.net/gh/wudongdefeng/za@master/wind/liuwei.txt$$TVFIX综合直播$https://egwang186.coding.net/p/egwang186/d/iptv/git/raw/master/zby/txt源/TVFIX综合直播.txt$$TVMARK综合直播$http://fangsong.live/iptv/tv.txt$$综合直播$http://139.9.166.60/iptv/CR.txt$$晴天直播$https://wds.ecsxs.com/221609.json$$银河综合$https://egwang186.coding.net/p/egwang186/d/iptv/git/raw/master/zby/txt源/银河综合.txt$$六维修改版$https://egwang186.coding.net/p/egwang186/d/iptv/git/raw/master/zby/txt源/六维修改版.txt$$台湾台$https://egwang186.coding.net/p/egwang186/d/iptv/git/raw/master/zby/txt源/台湾台.txt$$rtvline$https://egwang186.coding.net/p/egwang186/d/iptv/git/raw/master/zby/txt源/rtvline.txt$$smartSW$https://egwang186.coding.net/p/egwang186/d/iptv/git/raw/master/zby/txt源/smartSW.txt$$IPTVMEDIA-Adult$https://egwang186.coding.net/p/egwang186/d/iptv/git/raw/master/zby/txt源/IPTVMEDIA-ADULT.txt$$bestAVB$https://egwang186.coding.net/p/egwang186/d/iptv/git/raw/master/zby/txt源/bestAVB.txt$$Royal-Adult$https://egwang186.coding.net/p/egwang186/d/iptv/git/raw/master/zby/txt源/Royal-Adult.txt";var a=a.split("$$");var items=[];for(var i in a){var title=a[i].split("$")[0];var url=a[i].split("$")[1];items.push({title:title,url:"q:自定义播放器?url=远程$$"+url});}JSON.stringify(items);',
            "选集规则":'',
            "免嗅探规则":''
        }
    },
    {
        "title":"六维网页版",
        "rule":{
             "分类":'var a=e2Arr(getHttp(JSON.stringify({url:"http://jiekou.cf/m.php"})),".get(section.module-boxA)");var items=[];for(var i in a){var title=e2Rex(a[i],".get(h3).t()");var ul=a[i];var url="q:播放器?url="+title;items.push({title:title,ul:ul,url:url});}JSON.stringify(items);',
             "选集规则":'var 分类=e2Arr(getVar("CODE"),".json(ul).get(section)");var 列表规则=".get(ul li)";var 线路="";var 标题规则=".get(h3).t()";var 选集规则=".get(a).t()";var 选集地址规则=".c(http://ip111.cn/?wd=http://jiekou.cf/).get(a).a(href)";',
             "免嗅探规则":'var u=e2Rex(getHttp(getVar("url").split("?wd=")[1]),".get(video).a(src)");var uu=u;while(uu.indexOf(".php")!=-1){var resp=JZ(JSON.stringify({url:uu,redirect:false}));var uu=resp.head.Location||resp.head.location;}JSON.stringify({url:uu});'
        }
    },
    {
        "title":"BiubiuTV(xzb.php)",
        "rule":{
            "分类":'var a=e2Arr(getHttp(JSON.stringify({url:"https://wds.ecsxs.com/222006.json"})),".z(#[^,#]+?头#[\\\\s\\\\S]+?#[^,#]+?尾#)");var items=[];for(var i in a){var title=e2Rex(a[i],".z2(#\\\\([^,#]+?\\\\)头#)");var ul=a[i];var url="q:播放器?url="+title;items.push({title:title,ul:ul,url:url});}JSON.stringify(items);',
            "选集规则":'var 分类=e2Arr(getVar("CODE"),".json(ul)");var 列表规则=".z(.+?,.+)";var 线路="";var 标题规则=".ty(#).tz(头)";var 选集规则=".tz(,)";var 选集地址规则=".c(http://ip111.cn/?wd=).ty(,)";',
            "免嗅探规则":'var urls=getVar("url").split("?wd=")[1].split("#").filter(Boolean);var items=[];for(var i in urls){if(urls[i].indexOf(".php?")!=-1){var resp=JZ(JSON.stringify({url:urls[i],redirect:false}));var u=resp.head.Location||resp.head.location;}else{var u=urls[i];}items.push({url:u});}JSON.stringify(items);'
        }
    }
]
}
######选集列表
function 选集列表(){
    var res={};var items=[];
    for(var i=0;i<分类.length;i++){
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
    items.push(play_);
    }
    res.data=items;
    return JSON.stringify(res);
}
eval(getVar("选集规则"));选集列表();
