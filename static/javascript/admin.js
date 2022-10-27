$(document).ready(function () {
    var path = null
    init()

    NowLoading()
    
    ChooseJsonInit()
    ChangeJsonLoading()
    
    jsonListClick()
    SavePack()
});

function init() {
    $(".table-save").hide();
}

//* 主畫面 ===============================
function jsonListClick() {
    $(".json-data").click(function (e) {
        e.preventDefault();
        $(".table-save").show();
        $(".output-table").html(`<thead>
        <th class="table-title" align="center">廠商名稱</th>
        <th class="table-title" align="center">品項</th>
        <th class="table-title" align="center">價錢</th>
    </thead>
    `);
        path = $(this).html();
        $.ajax({
            type: "GET",
            url: path,
            data: {},
            dataType: "json",
            async: false,
            success: function (response) {
                for (var company in response) {
                    
                    $(".output-table").append(
                        `<tr><td  class="company-name table-item" align="center" rowspan="${1+Object.keys(response[company]["品項"]).length}"><div  contentEditable=true>${company}</div></td></tr>`
                        );
                    for (var goods in response[company]["品項"]) {
                        $(".output-table").append(
                            `<tr>
                            <td class="goods table-item"><div contentEditable=true>${goods}</div></td>
                            <td class="price table-item"><div contentEditable=true>${response[company]["品項"][goods]["prize"]}</td>
                        </tr>`
                            );
                    }   
                }
            }
        });
    });
}



// * 變更存檔 / 存檔相關 =======================================
// 儲存Table資料
function table_style(table_id, func) {
    var row_obj = $("." + table_id).children("tr")
    $.each(row_obj, function (row_i, row_v) {
        var column_obj = $(row_v).children("td")
        $.each(column_obj, function (col_i, col_v) {
            func(row_i, row_v, col_i, col_v)
            // console.log($(col_v).html())
        });
    });
}

function SavePack() {  
    $(".table-save").click(function (e) { 
        e.preventDefault();
        var result = {}
        let now_company_name = ""
        let now_item_name = ""
        table_style("output-table",(row_i, row_v, col_i, col_v)=>{
            if ($(col_v).hasClass("company-name")) {
                result[$(col_v).children("div").html()] = {"品項":{}}
                now_company_name=$(col_v).children("div").html()
            }else if ($(col_v).hasClass("goods")){
                result[now_company_name]["品項"][$(col_v).children("div").html()] = {"prize":null}
                now_item_name=$(col_v).children("div").html()
            }else{
                result[now_company_name]["品項"][now_item_name].prize = parseInt($(col_v).children("div").html())
            }
        })
        $.ajax({
            type: "POST",
            url: "/admin/save",
            data: {data:JSON.stringify(result),file_path:path},
            dataType: "text",
            success: function (response) {
                
            }
        });
    });
}


// 選取json檔案點擊
function ChooseJsonInit() {
    $(".choose-json-btn").click(function (e) { 
        e.preventDefault();
        $(".choose-output").html(``);
        $(".save-btn").hide();
        $(".finish").hide();
    });
}

// 選擇新的讀取json檔案
function ChangeJsonLoading() {
    $(".dropdown-item").click(function (e) { 
        e.preventDefault();

        // output
        $(".choose-output").html($(this).html());
        $(".save-btn").show();

        $(".save-btn").click(function (e) { 
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: "/admin/changeNowLoading",
                data: { data:$(".choose-output").html()},
                async:false,
                success: function (response) {
                    NowLoading();
                    $(".save-btn").hide();
                    $(".finish").show();
                }
            });
        });

    });
}

// * 讀取json ==========================

// 讀取現在使用的json檔
function NowLoading() {
    var nowLoading_path = ""
    $.ajax({
        type: "GET",
        url: "/static/setting/nowloading.json",
        data: {},
        dataType: "json",
        async: false,
        success: function (response) {
            nowLoading_path = response["path"]
            $(".nowloading").html(nowLoading_path);
        }
    });
}
//* 上傳檔案 ====================================
async function loadFile(file) {
    let text = await file.text();
    document.getElementById('output').textContent = text;
    $.ajax({
        type: "POST",
        url: "/admin/upload",
        file: file,
        data: { data: text },
        success: function (response) {
            window.location.reload();
        }
    });
}

