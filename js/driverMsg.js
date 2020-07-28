$(function () {
    var scqd=[],
        xsz=[];
    //随车清单,行驶证图片上传
   $(".img-up-input").on("change",function () {
       var that=$(this),
           parent=that.attr("data-parent"),
           list=that.attr("data-list"),
           file = that[0].files[0];
       if(file.type.indexOf("image")==0){
           var reader = new FileReader(); //创建FileReader对象实例reader
           reader.readAsDataURL(file); //将图片url转换为base64码
           reader.onload = function(e){
               var _url=this.result.split(',')[1];
               var html=`
               <div class="imgshow-box inline-block">
                    <img src="data:image/png;base64,${_url}" alt="">
                    <b class="del-img ${list}img" data-parent="${parent}" data-list="${list}" data-url="${_url}">x</b>
                </div>
               `;
               // if(list=='scqd'){
               //     scqd.push(_url);
               //     if(scqd.length>1){
               //         that.parent().hide();
               //     }
               //
               // }else if(list=='xsz'){
               //     xsz.push(_url);
               //     if(scqd.length>2){
               //         that.parent().hide();
               //     }
               // }else{
               //     $(".word-img").hide();
               // }
               that.parent().hide();
               $("."+parent).append(html);
           };
       }
   });
   $("body").on("click",".del-img",function () {
       var that=$(this),
           list=that.attr("data-list"),
           _url=that.attr("data-url");
       // if(list=='scqd'){
       //     scqd.remove(_url);
       //     that.parent().parent().next(".img-up-box").show();
       // }else if(list=='xsz'){
       //     xsz.remove(_url);
       // }else{
       //     $(".word-img").show();
       // }
       that.parent().parent().next(".img-up-box").show();
       that.parent().remove();
   });
   $(".sub-btn").click(function () {
        var wzsb=$(".wzsbimg").attr("data-url"),
            scqd=$(".scqdimg").attr("data-url"),
            xsz=$(".xszimg").attr("data-url");
        ajax("/biz/tran/tran/save",{
            "carNum":$("#carNum").val(),
            "registTime":$("#registTime").val(),
            "vehicleNum":$("#vehicleNum").val(),
            "engineNum":$("#engineNum").val(),
            "fuelType":$("#fuelType").val(),
            "carCheckList":scqd,
            "drivinglLicense":xsz,
            "emissionStand":$("#emissionStand").val(),
        },function(data){
            console.log(data);
        })
   })
});