$(function () {
    var scqd=[],
        xsz=[],wzsb='',vin='',ifStatus=1,ifScan=0,ifSub=true;
    var confirmClass={"color":"#fff","background":"#36BCA9","width":"40%"},
        cancelClass={"color":"#666","background":"#eee","width":"40%"};
    //车牌号查询
    $(".searchCar-btn").on('click',function () {
        var carNum=$("#searchCar").val();
        ajax_get('/jinding/check/car?carNum='+carNum,function (data) {
            var datas=data.data;
            if(datas){
                if(datas.status==0){
                    Box({
                        type: 'alert',
                        confirmClass,
                        msg: '可以提交审核',
                    });
                }else if(datas.status==1){
                    Box({
                        type: 'alert',
                        confirmClass,
                        msg: '审核中',
                    });
                }else if(datas.status==2){
                    Box({
                        type: 'alert',
                        confirmClass,
                        msg: '审核通过',
                    });
                }else if(datas.status==3){
                    if(datas.checkStatus==1){
                        Box({
                            type: 'alert',
                            confirmClass,
                            msg: '排放阶段不符合禁止注册',
                        });
                    }else if(datas.checkStatus==2){
                        Box({
                            type: 'alert',
                            confirmClass,
                            msg: '格式不通过需补录',
                        });
                    }
                }
            }else{
                Box({
                    type: 'alert',
                    confirmClass,
                    msg: '未注册',
                });
            }
        })
    });
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
                          ifScan=datas.ifScan;
                         if(datas.ifScan==1){
                             $(".sub-btn").addClass('btn-disabled');
                             ifSub=false;
                              Box({
                                  type: 'alert',
                                  msg: '该车排放阶段审核不通过',
                                  confirmClass,
                                  succ: function () {
                                      that[0].value = null;
                                      // window.close();
                                      // WeixinJSBridge.call('closeWindow');
                                  }
                              });
                          }else if(datas.ifScan==2){
                             $(".sub-btn").addClass('btn-disabled');
                             ifSub=false;
                              Box({
                                  type: 'alert',
                                  msg: '该车已经审核通过',
                                  confirmClass,
                                  succ: function () {
                                      that[0].value = null;
                                      // window.close();
                                      // WeixinJSBridge.call('closeWindow');
                                  }
                              });
                          }else if(datas.ifScan==3){
                             Box({
                                 type: 'alert',
                                 msg: '该车格式不通过,需要重新补录',
                                 confirmClass,
                                 succ: function () {
                                     // that[0].value = null;
                                     // window.close();
                                     // WeixinJSBridge.call('closeWindow');
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
       if(ifSub){
           if($("#carNum").val()==''||$("#registTime").val()==''||$("#vehicleNum").val()==''||$("#engineNum").val()==''||$("#fuelType").val()==''|| $("#emissionStand").val()==''||scqd==''||scqd==undefined||wzsb==''||wzsb==undefined){
              console.log($("#fuelType").val());
               console.log(scqd);
               console.log(wzsb)
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
                   "ifScan":ifScan
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
           }
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