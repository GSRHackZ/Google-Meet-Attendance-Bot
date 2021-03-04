let inps = document.getElementsByClassName("inp");
let classNum = document.getElementById("classNum");
let acr = document.getElementById("acrState")
let sett = document.getElementById("settings");
let secPanel = document.getElementById("secondPanel")
let info = document.getElementById("error");
let loading = document.getElementsByClassName("boxContainer")[0];
let acrState = false;
let on = false;
let opened=[];

sett.addEventListener("click", function () {
    let classes = classNum.value;
    let fine = true;
    for (let i = 0; i < inps.length; i++) {
        if (inps[i].value.trim().length == 0) {
            inps[i].style.borderBottom = "1px solid red";
            fine = false;
        }
        else {
            inps[i].style.borderBottom = "1px solid springgreen";
        }
    }
    if (fine) {
        if (!isNaN(classes) && classes.trim().length > 0) {
            if (acr.checked) { acrState = true; };
            secPanel.innerHTML = "";
            secPanel.style = "opacity:100%;padding:5px;width:30%;height:fit-content;margin-bottom:30px;";
            setTimeout(function () {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            }, 500)
            for (let i = 0; i < classes; i++) {
                let box = document.createElement("div");
                let sep = document.createElement("br");
                box.innerHTML = `<input class="classes" placeholder="Enter link for class #${i + 1}"><br><input class="time" placeholder="Enter beginning time for class #${i + 1}">`;
                box.style = "width:90%;border:1px solid lightgray;border-radius:10px;margin:20px;padding:10px;"
                secPanel.append(box);
                secPanel.append(sep);
                if (classes - 1 == i) {
                    let btn = document.createElement("button");
                    btn.className = "classSet";
                    btn.innerHTML = "Start Bot!";
                    btn.style = "text-decoration: none;width: 80%;padding: 5px;border: none;margin: 20px;cursor: pointer;background: rgb(0, 140, 255);color: white;border-radius: 5px;outline: none;height: 30px;";
                    secPanel.append(btn);
                    let classSet = document.getElementsByClassName("classSet")[0];
                    classSet.addEventListener("click", function () { start() });
                }
            }
        }
    }
})

function check(arr, string, min) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (string.includes(arr[i])) {
            count++;
        }
        if (arr.length - 1 == i) {
            if (count >= min) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}


function start() {
    let classArr = [];
    let types = [];
    let classes = document.getElementsByClassName("classes");
    let time = document.getElementsByClassName("time");
    let phrase = inps[1].value;
    let classNum = inps[0].value;
    let wait = inps[2].value;
    let min = inps[3].value;
    let error = "Bot has started! Do Not Close Or Refresh!";
    for (let i = 0; i < classes.length; i++) {
        if (classes[i].value.trim().length > 0 && time[i].value.trim().length > 0 && check(["-am", "-pm", ":"], time[i].value.toLowerCase(), 2)) {
            classes[i].style.borderBottom = "1px solid springgreen";
            time[i].style.borderBottom = "1px solid springgreen";
            if (classes[i].value.includes("?")) { types.push("param") } else { types.push("none") };
            classArr.push({ "phrase": phrase, "link": classes[i].value, "wait": wait, "classNum": classNum, "min": min, "begin": time[i].value, "acrState": acrState, "type": types[i] });
            if (classes.length - 1 == i) {
                loading.style.display = "flex";
                setTimeout(function () {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    launch(classArr);
                }, 500)
            }

        }
        else {
            error = "Remember to fill in all fields.<br>Please fill in time in correct fromat, and include either am or pm seperated by -. <br>Format example: Meeting is at 8:04 am, so I enter 8:04-am";
        }
        info.innerHTML = error;
    }
}

function launch(arr) {
    setInterval(function () {
        for (let i = 0; i < arr.length; i++) {
            if (!opened.includes(arr[i].link)) {
                if (compare(time("a"), arr[i].begin)) {
                    if(arr[i].type=="param"){
                        window.open(`${arr[i].link}&phrase=${arr[i].phrase}&min=${arr[i].min}&wait=${arr[i].wait}&acr=${arr[i].acrState}&on=true`);
                    }
                    else if(arr[i].type=="none"){
                        window.open(`${arr[i].link}?phrase=${arr[i].phrase}&min=${arr[i].min}&wait=${arr[i].wait}&acr=${arr[i].acrState}&on=true`)
                    }
                    opened.push(arr[i].link);
                }
            }
        }
    }, 1000)
}


function time(mode) {
    let kronos = new Date();
    let a = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    let b = a.slice(0, 4);
    if (mode == "a") {
        return a.toLowerCase();
    }
    else if (mode == "b") {
        return b.toLowerCase();
    }
}


function compare(time, dl) {
    let hour1 = time.split(":")[0],
        hour2 = dl.split(":")[0],
        min1 = time.split(":")[1].split(" ")[0],
        min2 = dl.split(":")[1].split("-")[0],
        end1 = time.split(":")[1].split(" ")[1].toLowerCase(),
        end2 = dl.split(":")[1].split("-")[1].toLowerCase();
    if (end1 == end2) {
        if (hour1 == hour2) {
            if (min1 >= min2) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

