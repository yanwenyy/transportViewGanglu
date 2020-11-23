$(function () {
    var scqd=[],
        xsz=[],wzsb='',vin='',ifStatus=1;
    var confirmClass={"color":"#fff","background":"#36BCA9","width":"40%"},
        cancelClass={"color":"#666","background":"#eee","width":"40%"};
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
               if(list=='wzsb'){
                   $(".img-sb-model").show();
                  ajax('/jinding/sacn/img',{
                      "imgBase":_url
                  },function (data) {
                      $(".img-sb-model").hide();
                      if(data.code==10000){
                          var datas=data.data;
                          $("#carNum").val(datas.carNum);
                          $("#registTime").val(datas.registTime);
                          $("#vehicleNum").val(datas.vehicleNum);
                          $("#engineNum").val(datas.engineNum);
                          $("#owner").val(datas.owner);
                          wzsb=datas.drivinglLicense;
                          if(datas.ifScan==1){
                              Box({
                                  type: 'confirm',
                                  msg: '你已经录入过此车辆信息，是否继续录入',
                                  okText:'是',
                                  cancelText:'否',
                                  confirmClass,
                                  cancelClass,
                                  succ: function () {

                                  },
                                  cancel:function () {
                                      console.log("取消啦")
                                      that[0].value = null;
                                      window.close();
                                      WeixinJSBridge.call('closeWindow');
                                  }
                              });
                          }
                      }else{
                          Box({
                              type: 'alert',
                              confirmClass,
                              msg: data.msg,
                          });
                      }
                  })
               }
               // else if(list=='scqd'){
               //     $(".img-sb-model").show();
               //     ajax('/jinding/sacn/qrcodeimg',{
               //         "imgBase":_url
               //     },function (data) {
               //         $(".img-sb-model").hide();
               //         if(data.code==10000){
               //             var datas=data.data;
               //             vin=datas.vin;
               //             scqd=datas.imgName;
               //             if(vin!=$("#vehicleNum").val()){
               //                 Box({
               //                     type: 'confirm',
               //                     msg: '识别不到随车清单的信息,请重新上传高清的图片或者继续提交,由相关人员审核',
               //                     okText:'去审核',
               //                     cancelText:'重新上传',
               //                     confirmClass,
               //                     cancelClass,
               //                     succ: function () {
               //                         ifStatus=0;
               //                     },
               //                     cancel:function () {
               //                         console.log("取消啦");
               //                         that[0].value = null;
               //                         scqd='';
               //                         that.parent().prev(".img-show").children(".imgshow-box").remove();
               //                         that.parent().show();
               //                     }
               //                 });
               //             }else{
               //
               //             }
               //         }else{
               //             Box({
               //                 type: 'alert',
               //                 confirmClass,
               //                 msg: data.msg,
               //             });
               //         }
               //     })
               // }

               that.parent().parent().next(".img-up-box").show();
               that.parent().remove();


               that[0].value = null;
               that.parent().hide();
               $("."+parent).append(html);
           };
       }
   });
   $("body").on("click",".del-img",function () {
       var that=$(this),
           list=that.attr("data-list"),
           _url=that.attr("data-url");
      //  var file = document.getElementsByClassName(list+'input');
      //  file.value = ''; //file的value值只能设置为空字符串
      // console.log(file);
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
    var regExp = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/;
   $(".sub-btn").click(function () {
        var fuelType=$("#fuelType").val();
       var scqd=$(".scqdimg").attr("data-url"),fuelType=$("#fuelType").val();
        if($("#carNum").val()==''||$("#registTime").val()==''||$("#vehicleNum").val()==''||$("#engineNum").val()==''||$("#fuelType").val()==''|| $("#emissionStand").val()==''||scqd==''||scqd==undefined||wzsb==''||wzsb==undefined){
            Box({
                type: 'alert',
                confirmClass,
                msg: '请完善信息',
            });
        }else if(!regExp.test($("#carNum").val())){
            Box({
                type: 'alert',
                confirmClass,
                msg: '请输入正确的车牌号格式',
            });
        }else{
            // console.log(fuelType=='柴油'&&CompareDate('2017-1-1',$("#registTime").val())||fuelType=='天然气'&&CompareDate('2012-7-1',$("#registTime").val())||fuelType=='纯电动'||fuelType=='油电混动')
            // if(fuelType=='柴油'&&CompareDate('2017-1-1',$("#registTime").val())||fuelType=='天然气'&&CompareDate('2012-7-1',$("#registTime").val())||fuelType=='纯电动'||fuelType=='油电混动'){

                ajax("/jinding/sacn/vehicle",{
                    "carNum":$("#carNum").val(),
                    "registTime":$("#registTime").val(),
                    "vehicleNum":$("#vehicleNum").val(),
                    "engineNum":$("#engineNum").val(),
                    "fuelType":$("#fuelType").val(),
                    "carCheckList":scqd,
                    "drivinglLicense":wzsb,
                    "emissionStand":$("#emissionStand").val(),
                    "owner":$("#owner").val(),
                    "ifStatus":ifStatus
                },function(data){
                    if(data.code==10000){
                        $(".shadow").show();
                    }else{
                        Box({
                            type: 'alert',
                            confirmClass,
                            msg: data.msg,
                        });
                    }
                })

            // }else{
            //     Box({
            //         type: 'alert',
            //         confirmClass,
            //         msg: "只支持国五或国六的车",
            //     });
            // }
        }
   });
   $(".sub-again").click(function () {
       location.reload();
   })
    $(".closs-btn").click(function () {
        window.close();
        WeixinJSBridge.call('closeWindow');
    })
});