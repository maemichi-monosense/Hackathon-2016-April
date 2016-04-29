$(function(){
  // プッシュ通知を送るボタンクリック
  $("#send").click(function(){
    // メッセージを登録
    var url = 'https://monosense-hackathon-web-push.herokuapp.com/api/v0/push/message';
    $.ajax({
      url: url,
      type:'PUT',
      dataType: 'json',
      data : {title: $("#title").val(), text: $("#text").val()},
      timeout:10000,
      success: function (data) {
        alert("ok");
        // プッシュ通知送信
        $.ajax({
          url: url,
          type:'POST',
          dataType: 'json',
          data : {},
          timeout:10000,
          success: function(data) {
            alert("ok");
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("error");
          }
        });
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert("error");
      }
    });
  });
}); 