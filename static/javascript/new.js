$(document).ready(function () {
  var JsonData = null

  var nowChoice = null
  var companys = []

  var nowLoading_path = ""
  $.ajax({
    type: "GET",
    url: "/static/setting/nowloading.json",
    data: {},
    dataType: "json",
    async:false,
    success: function (response) {
      nowLoading_path = response["path"]
      console.log(nowLoading_path)
    }
  });


  $.ajax({
    type: "GET",
    // url: "/static/temp/test.json",
    url: nowLoading_path,
    data: {},
    dataType: "json",
    async: false,
    success: function (response) {
      JsonData = response

      for (let i in response) {
        companys.push(i)
      }
    }
  });

  // 廠商生成
  for (var i of companys) {
    $(".dropdown-menu").append(`
    <a class="dropdown-item" href="#">${i}</a>
  `);
  }

  // 廠商選擇
  $(".dropdown-menu a").click(function (e) {
    e.preventDefault();
    nowChoice = $(this).html();
    $("#company-name").html(nowChoice)
    // console.log(nowChoice)
    // console.log(JsonData[nowChoice]["品項"])
    ItemSpawn(JsonData,nowChoice)
    $("#finish-order").html("") 
  });

  //完成點貨
  $(".finish-btn").click(function (e) {
    e.preventDefault();
    $("#finish-order").html("") ;
    GetResult(JsonData,nowChoice);
  });

  $(".finish-close").click(function (e) {
    e.preventDefault();
    $("#finish-order").html("") 
    })

});

function ItemSpawn(json,nowchoice) {
  $("#contant").html(
    ""
  );
  var itmesList = []
  for (var i in json[nowchoice]["品項"]){
    itmesList.push(i)
  }
  console.log(itmesList)
  for (var i of itmesList) {
    $("#contant").append(`
    <div class="col item">
        <div class="col-md-auto"><span class="title">${i}</span><span class="price"> $${json[nowchoice]["品項"][i]["prize"]}</span></div>
        <div class="col-md-auto operate">
          <div class="btn-group " role="group" aria-label="Basic example">
          <button type="button" class="btn btn-primary minus">-</button>
          <input type="text" value="0" size="5px" class="result"></input>
          <button type="button" class="btn btn-primary add">+</button>
          </div>
          </div>
          </div>
          `);
  }


  // + - 
  $(".add").click(function (e) {
    e.preventDefault();
    $(this).parent().children(".result").val(Number($(this).parent().children(".result").val()) + 1)
  });
  $(".minus").click(function (e) {
    e.preventDefault();
    if ($(this).parent().children(".result").val() > 0) {
      $(this).parent().children(".result").val(Number($(this).parent().children(".result").val()) - 1)
    }

  });
}

function GetResult(json,nowchoice) {
  var result = []
  var prize = 0
  $(".item").each(function (i,v) {

    var ItemName = $(this).children().children(".title").html()
  // var ItemName = $(v).find(".title").html()
    var amount = $(this).children(".operate").children().children(".result").val()
    
    if (amount != 0 ) {
      result.push(ItemName+"*"+amount)
      prize = prize + json[nowchoice]["品項"][ItemName]["prize"]*amount
    }
  })
  console.log(prize)
    var copy = "";
	var result_len = result.length;

	var add_times = 0;
	
  for (var i of result) {
    $("#finish-order").append(i+"<br/>");
	add_times = add_times + 1;
    if (add_times < result_len){
	    copy = copy+i+"\n";
	} else {
		copy = copy+i;
	}
  }
  console.log(prize)
  $(".prize").html(`總價 : ${prize}$`)
    navigator.clipboard.writeText(copy)
            .then(() => {
                
            })
            .catch(err => {
              console.log(err)
            })
}
