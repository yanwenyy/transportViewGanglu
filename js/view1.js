$(function () {
    var noImgPage=10,
        imgPage=5;
    //图片预览
    $("body").on("click",".table-img",function () {
        var src=$(this).attr("src");
        $(".img-pre>img").attr("src",src);
        $(".img-pre").removeClass("out");
    });
    $("body").on("mousewheel",".img-pre>img",function (e) {
        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
        if (delta > 0) {
            // 向上滚
            $(this).css("max-width",'100%');
            $(this).width($(this).width()*1.1);
        } else if (delta < 0) {
            // 向下滚
            $(this).width($(this).width()*0.8);
        }
    });
    $(".img-pre").click(function () {
        $(this).addClass("out");
        $(".img-pre>img").css("max-width",'60%');
    });




    var num="_"+randomString();
    var ws1=new PxSocket({
        url:http_url.Socket_url,
        name:'getData',
        data:'jinding'+num,
        succ:timeCar
    });
    ws1.connect();
    window.onbeforeunload = function () {
        ws1.close();
    };

    //车辆运输
    timeCar();
    function timeCar() {
        ajax_get("jinding/tran/list?pageNum=1&pageSize="+imgPage+"&enterTime=&outFactoryTime=&carNum=&materialsName=&doorPostName=&poundRoom=&containerNum&=tranType=&emissionStand=&fuelType=", function (data) {
            $("#tranPage").paging({
                    total: data.total,
                    numberPage: imgPage
                },
                function(msg) {
                    //回调函数 msg为选中页码
                    ajax_get("jinding/tran/list?pageNum="+msg+"&pageSize="+imgPage+"&enterTime=&outFactoryTime=&carNum=&materialsName=&doorPostName=&poundRoom=&containerNum&=tranType=&emissionStand=&fuelType=", function (data) {
                        tran(data)
                    });
                });
            tran(data)
        });
        function tran(data) {
            var list=data.data,i=0,len=list.length,html='';
            for(;i<len;i++){
                var v=list[i];
                var enterImg=v.enterImg?v.enterImg.split(','):[],eterImgHtml=``;
                for(var j=0;j<enterImg.length;j++){
                    eterImgHtml+=`<img title="点击查看大图" class="table-img" src="${enterImg[j]&&enterImg[j].indexOf('http')!=-1?enterImg[j]:enterImg[j]?http_url.url+'/jinding/showImg/'+enterImg[j]:''}" alt="">`
                }
                var outImg=v.outImg?v.outImg.split(','):[],outImgHtml=``;
                for(var k=0;k<outImg.length;k++){
                    outImgHtml+=`<img title="点击查看大图" class="table-img" src="${outImg[k]&&outImg[k].indexOf('http')!=-1?outImg[k]:outImg[k]?http_url.url+'/jinding/showImg/'+outImg[k]:''}" alt="">`
                }
                html+=' <tr>\n' +
                    '<td>'+(v.enterTime||'')+'</td>\n' +
                    '<td>'+(v.weighTime||'')+'</td>\n' +
                    '<td>'+(v.checkOutTime||'')+'</td>\n' +
                    '<td>'+(v.outFactoryTime||'')+'</td>\n' +
                    '<td>'+eterImgHtml+'</td>\n' +
                    '<td>'+outImgHtml+'</td>\n' +
                    '<td>'+(v.doorPostName||'')+'</td>\n' +
                    '<td>'+(v.poundRoom||'')+'</td>\n' +
                    '<td>'+(v.carNum||'')+'</td>\n' +
                    '<td>'+(v.registTime&&v.registTime.split(" ")[0]||'')+'</td>\n' +
                    '<td>'+(v.vehicleNum||'')+'</td>\n' +
                    '<td>'+(v.engineNum||'')+'</td>\n' +
                    '<td>'+(v.fuelType||'')+'</td>\n' +
                    '<td><img title="点击查看大图" class="table-img" src="'+(v.carCheckList&&v.carCheckList.indexOf('http')!=-1?v.carCheckList:v.carCheckList?http_url.url+'/jinding/showImg/'+v.carCheckList:'')+'" alt=""></td>\n' +
                    '<td><img title="点击查看大图" class="table-img" src="'+(v.drivinglLicense&&v.drivinglLicense.indexOf('http')!=-1?v.drivinglLicense:v.drivinglLicense?http_url.url+'/jinding/showImg/'+v.drivinglLicense:'')+'" alt=""></td>\n' +
                    '<td>'+(v.doorEmissionStand||'')+'</td>\n' +
                    '<td>'+(v.clientName||'')+'</td>\n' +
                    '<td>'+(v.materialsNum||'')+'</td>\n' +
                    '<td>'+(v.materialsName||'')+'</td>\n' +
                    '<td>'+(v.measureNum||'')+'</td>\n' +
                    '<td>'+(v.crossWeigh||'')+'</td>\n' +
                    '<td>'+(v.tareWeigh||'')+'</td>\n' +
                    '<td>'+(v.netWeigh||'')+'</td>\n' +
                    '<td>'+(v.containerNum||'')+'</td>\n' +
                    '<td>'+(v.tranType==1?'公路':'铁路')+'</td>\n' +
                    '<td>'+(v.transportUnit||'')+'</td>\n' +
                    '</tr>'
            }
            $(".tranData").html(html)
        }
    }


    //场内运输
    ajax_get("jinding/factory/car/list?pageNum=1&pageSize="+noImgPage+"&evnCarNum=&registTime=", function (data) {
        $("#factoryPage").paging({
                total: data.total,
                numberPage: noImgPage
            },
            function(msg) {
                //回调函数 msg为选中页码
                ajax_get("jinding/factory/car/list?pageNum="+msg+"&pageSize="+noImgPage+"&evnCarNum=&registTime=", function (data) {
                    factory(data)
                });
            });
        factory(data)
    });
    function factory(data) {
        var list=data.data,i=0,len=list.length,html='';
        for(;i<len;i++){
            var v=list[i];
            html+=' <tr>\n' +
                '<td>'+v.evnCarNum+'</td>\n' +
                '<td>'+v.registTime+'</td>\n' +
                '<td>'+v.vehicleNum+'</td>\n' +
                '<td>'+v.engineNum+'</td>\n' +
                '<td>'+v.emissionStand+'</td>\n' +
                '<td><img title="点击查看大图" class="table-img" src="'+(v.carCheckList&&v.carCheckList.indexOf('http')!=-1?v.carCheckList:v.carCheckList?http_url.url+'/jinding/showImg/'+v.carCheckList:'')+'" alt=""></td>\n' +
                '<td><img title="点击查看大图" class="table-img" src="'+(v.drivinglLicense&&v.drivinglLicense.indexOf('http')!=-1?v.drivinglLicense:v.drivinglLicense?http_url.url+'/jinding/showImg/'+v.drivinglLicense:'')+'" alt=""></td>\n' +
                '</tr>'
        }
        $(".factoryData").html(html)
    }

    //非道路移动机械电子台账
    ajax_get("/jinding/offroad/list?pageNum=1&pageSize="+noImgPage+"&produceTime=&evnProNum=", function (data) {
        $("#offroadPage").paging({
                total: data.total,
                numberPage: noImgPage
            },
            function(msg) {
                //回调函数 msg为选中页码
                ajax_get("/jinding/offroad/list?pageNum="+msg+"&pageSize="+noImgPage+"&produceTime=&evnProNum=", function (data) {
                    offroad(data)
                });
            });
        offroad(data)
    });
    function offroad(data) {
        var list=data.data,i=0,len=list.length,html='';
        for(;i<len;i++){
            var v=list[i];
            html+=' <tr>\n' +
                '<td>'+v.evnProNum+'</td>\n' +
                '<td>'+v.produceTime+'</td>\n' +
                '<td>'+v.emission+'</td>\n' +
                '<td>'+v.emissionNum+'</td>\n' +
                '<td>'+v.engineNum+'</td>\n' +
                '</tr>'
        }
        $(".offroadData").html(html)
    }

    //汇总表
    ajax_get("/jinding/sum/list?pageNum=1&pageSize="+noImgPage+"&monthTime=&dayTime=&materialsName=", function (data) {
        $("#totalPage").paging({
                total: 10,
                numberPage: noImgPage
            },
            function(msg) {
                ajax_get("/jinding/sum/list?pageNum="+msg+"&pageSize="+noImgPage+"&monthTime=&dayTime=&materialsName=", function (data) {
                    total(data)
                });
            });
        total(data)
    });
    function total(data){
        var list=data.data,i=0,len=list.length,html='';
        for(;i<len;i++){
            var v=list[i];
            html+=' <tr>\n' +
                '<td>'+(v.materialsName||'')+'</td>\n' +
                '<td>'+v.carWeigh+'</td>\n' +
                '<td>'+(v.sumWeigh-v.carWeigh)+'</td>\n' +
                '<td>'+(v.sumWeigh||0)+'</td>\n' +
                '<td>'+((v.sumWeigh-v.carWeigh)/ v.sumWeigh).toFixed(2)*100+'%'+'</td>\n' +
                '</tr>'
        }
        $(".totalData").html(html)
    }
});