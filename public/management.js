$(function(){
  // プッシュ通知を送るボタンクリック
  $("#send").click(function(){
    // メッセージを登録
    var url = 'https://monosense-hackathon-web-push.herokuapp.com/api/v0/push/message';
    var JSONdata = {title: $("#title").val(), text: $("#text").val()};
    $.ajax({
      type: 'PUT',
      url: url,
      data: JSON.stringify(JSONdata),
      dataType: 'text',
      scriptCharset: 'utf-8',
      success: function (data) {
        alert("ok");
        // プッシュ通知送信
        $.ajax({
          url: url,
          type:'POST',
          dataType: 'text',
          data : JSON.stringify({}),
          success: function(data) {
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.error(XMLHttpRequest);
            console.error(textStatus);
            console.error(errorThrown);
          }
        });
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error(XMLHttpRequest);
        console.error(textStatus);
        console.error(errorThrown);
      }
    });
  });
}); 