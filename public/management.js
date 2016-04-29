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
      dataType: 'JSON',
      scriptCharset: 'utf-8',
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
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
          }
        });
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert("error");
        console.log(XMLHttpRequest);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  });
}); 