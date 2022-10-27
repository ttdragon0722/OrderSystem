from flask import Flask,render_template,request
from datetime import date

from os import walk

app = Flask(__name__,template_folder="templates")


def import_folder(path:str):
    path_list = []
    temp_path =  path.split("/")
    output_path = "/"
    for i in temp_path[1:]:
        output_path +=  i + "/"

    for _,__,json_file in walk(path):
        for json in json_file:
            full_path = output_path +json
            path_list.append(full_path)
    return path_list


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/admin")
def admin():
    result = ""
    data_list:list = import_folder("點貨系統/static/json")
    for index,i in enumerate(data_list):
        result += i
        if index != len(data_list) -1 :
            result += ","
    return render_template("admin.html",values=result)

@app.route("/admin/save",methods =["GET","POST"])
def save():
    if request.method == "POST":
        data = request.form.get("data")
        file_path = request.form.get("file_path")

        file = open("點貨系統"+file_path,mode="w",encoding="utf-8")
        file.write(data)
        file.close()
    return ""



@app.route("/admin/upload",methods=["GET","POST"])
def upload():
    if request.method == "POST":
        data = request.form.get("data")
        file =  open(f"點貨系統/static/json/{date.today().strftime('%Y%m%d')}.json",mode="w",encoding="utf-8")
        file.write(data)
    return ""

@app.route("/admin/changeNowLoading",methods=["GET","POST"])
def changeNowLoading():
    if request.method == "POST":
        data = request.form.get("data")
        file = open("點貨系統/static/setting/nowloading.json",mode="w",encoding="utf-8")
        file.write(
            '{"path":"'+data+'"}'
            )
    return ""


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=81,debug=True)