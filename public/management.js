$(function(){
  // プッシュ通知を送るボタンクリック
  $("#send").click(function(){
    // メッセージを登録
    var url = 'https://monosense-hackathon-web-push.herokuapp.com/api/v0/push/message';
    $.ajax({
      url: url,
      type:'PUT',
      headers: {
        'X-HTTP-Method-Override': 'PUT',
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      data : {title: $("#title").val(), text: $("#text").val()},
      success: function (data) {
        alert("ok");
        // プッシュ通知送信
        $.ajax({
          url: url,
          type:'POST',
          dataType: 'json',
          data : {},
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