//각 버튼에 event 추가
document.getElementById('join_btn').addEventListener('click', show_join_modal);
document.getElementById('add_btn').addEventListener('click', show_todo_modal);
document.getElementById('login_btn').addEventListener('click', login);
document.getElementById('signin_btn').addEventListener('click', signin);
document.getElementById('logout_btn').addEventListener('click', logout);

document.getElementById('save_btn').addEventListener('click', save_todo);
document.getElementById('update_btn').addEventListener('click', click_update_btn);
document.getElementById('submit_btn').addEventListener('click', modify_todo);
document.getElementById('delete_btn').addEventListener('click', delete_todo);
document.getElementById('cancel_btn').addEventListener('click', cancel_todo);

//전역 변수
var now_week = new Date(); //달력에 표시할 일주일을 저장하기 위한 변수, 현재 시간으로 설정해 초기화
var min_Date; //달력에 표시할 일주일 중 첫 날짜(일요일)을 저장
var max_Date; //달력에 표시할 일주일 중 마지막 날짜(토요일)을 저장
var todo_arr = {}; //달력에 표시할 일주일 동안 할 일을 저장
var previous_todo; //수정하기 전의 할 일을 저장
var modify_date; //수정한 후의 날짜를 저장
var data; //todo_arr의 i번째 인덱스를 parse한 값을 저장
var after_delete_data; //delete 한 후 data를 저장

//로그인 되어 있는지 체크
$(document).ready(function(){
    isLoginned();
});

//id와 pw를 reset하는 함수
function reset_IdAndPw(){
    //각 value를 ""값으로 초기화한다.
    document.getElementById('id').value = "";
    document.getElementById('pw').value = "";
}
//todo_modal을 reset하는 함수
function reset_todo_modal(){
    //각 value를 ''값으로 초기화한다.
    $('#date').val('');
    $('#time').val('');
    $('#title').val('');
    $('#description').val('');
}
//home.php로 새로고침하는 함수
function page_replace() {
    location.replace("./home.php");
}
//join_modal을 화면에 띄우는 함수
function show_join_modal(){

    document.getElementById('join_modal').className = 'show'
}
//join_modal을 화면에서 없애는 함수
function hide_join_modal(){
    document.getElementById('join_modal').className = 'hide'
}
//todo_modal을 화면에 띄우는 함수
function show_todo_modal(){
    calc_date();
    document.getElementById('todo_modal').className = 'show'
}
//todo_modal을 화면에서 없애는 함수
function hide_todo_modal(){
    document.getElementById('todo_modal').className = 'hide'
}

//로그인
function login(){
    //id와 pw값의 validation 
    if(!check_IdAndPw()){ //실패하면 초기화하고 모달창을 숨김
        reset_IdAndPw(); 
        hide_join_modal();
    }
    else{ //성공하면 로그인 가능한지를 ajax를 통해 검사
        var id = $("#id").val();
        var pw = $("#pw").val();
        var jsonData = JSON.stringify({ "id": id, "pw": pw });
        $.ajax({ //ajax로 서버와 통신
          type: "POST", //POST 방식으로 통신
          url: "./login.php", //login.php와 통신
          data: {data : jsonData}, //data는 json화 한 jsonData를 보냄
          async: false, //동기식 처리
          success: function(testedID) { //통신 성공
            if(testedID == false){ //아이디 혹은 비밀번호가 틀렸을 경우
              alert("아이디 혹은 비밀번호가 틀렸습니다.");
            }
            else if(testedID === id){ //아이디와 비밀번호가 일치할 경우
              alert(testedID + "님 환영합니다.");
              sessionStorage.setItem("id", testedID); //세션에 저장
                    //로그인 되어있을 때 조건들을 화면에 띄우는 함수를 불러옴
                    $(document).ready(function(){
                        isLoginned(); 
                    });
            }
            //초기화 후 모달창 숨김
            reset_IdAndPw();
            hide_join_modal();
          },
          error: function(jqXHR, textStatus, errorThrown) { //통신 실패
            alert("error");
            console.log(jqXHR.responseText);
          }
        });

    }
}
//회원가입
function signin(){ 
    //id와 pw값의 validation 
    if(!check_IdAndPw()){ //실패하면 초기화하고 모달창을 숨김
        reset_IdAndPw();
        hide_join_modal();
    }
    else{ //성공하면 회원가입 가능한지를 ajax를 통해 검사 
        var id = $("#id").val();
        var pw = $("#pw").val();
        var jsonData = JSON.stringify({"id":id, "pw":pw});
        $.ajax({//ajax로 서버와 통신
            type: "POST",//POST 방식으로 통신
            url: "./signin.php",//signin.php와 통신
            data: {data : jsonData},//data는 json화 한 jsonData를 보냄
            success: function(isSigninOK) {
                if(isSigninOK == "true"){ //회원 가입이 가능한 경우
                    alert("회원 가입이 완료되었습니다.");
                }
                else{ //아이디가 중복되어 회원가입이 불가능한 경우
                    alert("이미 아이디가 존재합니다.")
                }
                //초기화 후 모달창 숨김
                reset_IdAndPw();
                hide_join_modal();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("error");
                console.log(jqXHR.responseText);
            }
        });
    }
}
//로그아웃
function logout(){ 
    $.ajax({ //ajax로 서버와 통신
        type: "POST", //POST 방식으로 통신
        url: "./logout.php", //logout.php와 통신
        success: function() { //통신 성공
          alert("로그아웃 되었습니다."); 
          now_week = new Date(); //now_week 변수를 초기화
          sessionStorage.clear(); //세션을 지우고
          //add버튼을 비활성화, ID를 숨긴 뒤 로그인되어 있지 않을 때 조건들을 화면에 띄움
          disable_add_btn();
          hide_ID();
          isLoginned();
          todo_arr = []; //todo_arr를 초기화
        },
        error: function(jqXHR, textStatus, errorThrown) { //통신 실패
          alert("error");
          console.log(jqXHR.responseText);
        }
      });
}
//id와 pw validation하는 함수
function check_IdAndPw(){
    var id = document.getElementById('id').value;
    var pw = document.getElementById('pw').value;
    var id_exp = /^([A-Za-z0-9]){6,15}/g;
    var pw_exp = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*/g;
    if(!id_exp.test(id) || !pw_exp.test(pw)){ //조건에 맞지 않는 경우
        alert("아이디 또는 패스워드가 입력 양식에 맞지 않습니다.");
        return false;
    }
    else{ //id,pw 둘 다 조건에 맞는 경우
        return true;
    }
}
//할 일을 저장하는 함수
function save_todo(){
    var date = $('#date').val();
    var time = $('#time').val();
    var title = $('#title').val();
    var description = $('#description').val();
    if(date != "" && time != "" && title != "" && description != ""){ //네개의 값을 모두 입력해야 함
        var jsonData = JSON.stringify({"date":date, "time":time, "title":title, "description":description});
        $.ajax({ //ajax로 서버와 통신
            type: "POST", //POST 방식으로 통신
            url: "./saveInfo.php", //saveInfo.php와 통신
            data: {data : jsonData}, //data는 json화 한 jsonData를 보냄
            success: function(isSaveOK) { //통신 성공
                if(isSaveOK == true){ 
                    //저장 가능하다면 할 일 목록을 화면에서 다 지우고, 방금 저장한 할 일까지 화면에 띄움
                    clean_todo();
                    show_todo();
                    //초기화 후 숨김
                    reset_todo_modal();
                    hide_todo_modal();
                    alert("저장되었습니다.");
                }
                else{ //같은 날 같은 시간에 이미 저장된 할 일이 있다면 저장 불가능
                    alert("이미 할 일이 저장된 시간입니다.")
                    //초기화 후 숨김
                    reset_todo_modal();
                    hide_todo_modal();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) { //통신 실패
                alert("error");
                console.log(jqXHR.responseText);
            }
        });
    }
    else{ //하나라도 입력 안하면 초기화
        alert("모든 항목을 입력해 주세요.");
        reset_todo_modal();
        hide_todo_modal();
    }
}
//오늘을 계산하는 함수
function calc_today(){
    var currentDay = new Date(); //오늘을 받아옴
    var theYear = currentDay.getFullYear(); //오늘의 년도
    var theMonth = currentDay.getMonth(); //오늘의 월
    var theDate  = currentDay.getDate(); //오늘의 일
    var theDayOfWeek = currentDay.getDay(); //오늘이 일주일 중 몇번 째인가
    
    var thisWeek = [];
    
    //thisWeek 배열에 이번주 일주일을 저장
    for(var i=0; i<7; i++) {
        var resultDay = new Date(theYear, theMonth, theDate + (i - theDayOfWeek));
        var yyyy = resultDay.getFullYear();
        var mm = Number(resultDay.getMonth()) + 1;
        var dd = resultDay.getDate();
        
        mm = String(mm).length === 1 ? '0' + mm : mm;
        dd = String(dd).length === 1 ? '0' + dd : dd;
        
        thisWeek[i] = yyyy + '-' + mm + '-' + dd;
    }
    //date를 체크할 때 최소값과 최대값을 지정해줌
    document.getElementById('date').setAttribute("min", thisWeek[0]);
    document.getElementById('date').setAttribute("max", thisWeek[6]);

    return thisWeek;
}
//할 일이 있는 주를 계산
function calc_date(){
    var currentDay = now_week; //(target인 할일이 있는)달력에 표시할 일주일을 currentDay로 가져와 날짜를 계산함
    var theYear = currentDay.getFullYear();
    var theMonth = currentDay.getMonth();
    var theDate  = currentDay.getDate();
    var theDayOfWeek = currentDay.getDay();
    
    var thisWeek = [];
    
    for(var i=0; i<7; i++) {
        var resultDay = new Date(theYear, theMonth, theDate + (i - theDayOfWeek));
        var yyyy = resultDay.getFullYear();
        var mm = Number(resultDay.getMonth()) + 1;
        var dd = resultDay.getDate();
        
        mm = String(mm).length === 1 ? '0' + mm : mm;
        dd = String(dd).length === 1 ? '0' + dd : dd;
        
        thisWeek[i] = yyyy + '-' + mm + '-' + dd;
    }
    document.getElementById('date').setAttribute("min", thisWeek[0]);
    document.getElementById('date').setAttribute("max", thisWeek[6]);
    //나머지는 위 함수와 같고, 일요일과 토요일의 날짜를 각 변수에 저장
    min_Date = thisWeek[0];
    max_Date = thisWeek[6];

    return thisWeek;
}
//달력에 표시할 일주일을 계산해 달력에 표시
function show_week(){
    var thisWeek = calc_date();
    var today = new Date(); //오늘 날짜
    var i = today.getDay(); //오늘이 며칠인지를 저장
    //일요일의 일이 토요일의 일보다 크다면(일주일에 두 달이 겹친 경우)
    if(Number(min_Date.substr(8,2)) > Number(max_Date.substr(8,2))){
        if(modify_date != undefined){ //수정한 후의 날짜가 undefined가 아닌 경우
            $('.date .span1').html(modify_date.substr(0,4)); //수정 후의 날짜의 년도를 달력에 표시
        }
        else{ //수정한 후의 날짜가 undefined면
            $('.date .span1').html(thisWeek[i].substr(0,4));//그 주의 년도를 달력에 표시
        }
        $('.date .span2').html(min_Date.substr(5,2)+","+max_Date.substr(5,2)); //두 달을 모두 표시
    }
    else{ //일요일의 일 < 토요일의 일(일주일이 같은 달)
        $('.date .span1').html(thisWeek[i].substr(0,4)); //그 주의 년도와
        $('.date .span2').html(thisWeek[i].substr(5,2)); //월을 표시
    }
    
    //일요일부터 토요일 까지 일을 적어줌
    $('#sun').html(thisWeek[0].slice(-2));
    $('#mon').html(thisWeek[1].slice(-2));
    $('#tue').html(thisWeek[2].slice(-2));
    $('#wed').html(thisWeek[3].slice(-2));
    $('#thu').html(thisWeek[4].slice(-2));
    $('#fri').html(thisWeek[5].slice(-2));
    $('#sat').html(thisWeek[6].slice(-2));

}
//달력에 표시된 일주일을 없앰
function hide_week(){
    $('.date .span1').empty();
    $('.date .span2').empty();

    $('#sun').empty();
    $('#mon').empty();
    $('#tue').empty();
    $('#wed').empty();
    $('#thu').empty();
    $('#fri').empty();
    $('#sat').empty();
}
//ID를 화면에 표시
function show_ID(){
    $('.rightDiv span').remove(); //초기화
    $('.rightDiv').prepend("<span>"+sessionStorage.getItem("id")+"</span>"); //세션스토리지에서 id값을 가져와 화면에 표시
}
//ID를 화면에서 제거
function hide_ID(){
    $('.rightDiv span').remove(); //초기화
}
//add버튼을 활성화
function able_add_btn(){
    $('#add_btn').attr("disabled", false)
}
//add버튼을 비활성화
function disable_add_btn(){
    $('#add_btn').attr("disabled", true)
}
//각 로그인 되어있을 때와 되어있지 않을 때의 경우를 따져 화면에 표시
function isLoginned(){
    if(sessionStorage.getItem("id") != null){ //로그인 되어 있는 경우
        //할 일과 그 주를 달력에 표시하고, add버튼 활성화 및 ID를 화면에 표시
        var thisWeek = calc_date();
        min_Date = thisWeek[0];
        max_Date = thisWeek[6];
        show_todo();
        show_week();
        able_add_btn();
        show_ID();
    }
    else{ //로그인 되어 있지 않은 경우
        //할 일과 그 주를 달력에서 지우고, add버튼 비활성화 및 ID 화면에서 지움
        hide_week();
        clean_todo();
        disable_add_btn();
        hide_ID();
    }
}
//그 주의 할 일을 가져와 달력에 표시
function show_todo(){
    var thisWeek = calc_date();
    var week_start = thisWeek[0];
    var week_end = thisWeek[6];
    //그 주의 첫 날짜와 마지막 날짜를 보냄
    jsonData = JSON.stringify({ "week_start": week_start, "week_end": week_end });
    $.ajax({ //ajax로 서버와 통신
        type: "POST", //POST 방식으로 통신
        url: "./getTodo.php", //getTodo.php와 통신
        data: {data : jsonData},
        success: function(json_todo) { //통신 성공
                var this_week_arr = calc_today(); //오늘을 계산
                //넘겨진 값이 ""이고 오늘이 속한 이번주의 첫 날짜(일요일)과 min_Date이 같은 경우
                if(json_todo == "" && this_week_arr[0] == min_Date){
                    //삭제되어 달력에 할 일이 없는 경우가 아니라면(로그인 되었을 때만 띄우기 위해)
                    if(after_delete_data != "deleted_case"){
                        alert("등록된 일정이 없습니다.");
                    }
                }
                //넘겨진 값을 append_todo의 인자로 넘김(달력에 띄움)
                append_todo(json_todo);
        },
        error: function(jqXHR, textStatus, errorThrown) { //통신 실패
          alert("error");
          console.log(jqXHR.responseText);
        }
      });
}
//넘겨진 할 일의 목록을 달력에 띄우는 함수
function append_todo(todo){
    clean_todo(); //먼저 달력의 할 일 목록을 초기화
    todo_arr = todo.split("\n"); //넘겨진 할 일의 목록을 개행 기준으로 나눔
    week_arr = [];
    var arr = $('table tr').children();
    for(var i = 0; i<todo_arr.length; i++){
        if(todo_arr[i] != ""){ //할 일이 있는 경우
            data = JSON.parse(todo_arr[i]); //parse 함수로 json화
            //각 정보들을 태그들에 저장하되, title만 띄우고 나머지는 hide로 숨김
            var day = data.date.substring(8);
            var div = document.createElement('div');
            div.setAttribute('class', 'todo_list_div');
            var date_span = document.createElement('span');
            date_span.className = "hide";
            date_span.innerHTML = data.date;
            var time_span = document.createElement('span');
            time_span.className = "hide";
            time_span.innerHTML = data.time;
            var description_span = document.createElement('span');
            description_span.className = "hide";
            description_span.innerHTML = data.description;
            var title_span = document.createElement('span');
            title_span.innerHTML = data.title;

            div.append(date_span);
            div.append(time_span);
            div.append(title_span);
            div.append(description_span);

            for(var j = 0; j<7; j++){
                //각 정보들이 담긴 할 일을 날짜에 맞게 append 후 click event 추가
                if(day == arr[j].firstChild.innerHTML){
                    arr[j+7].append(div);
                    div.addEventListener('click', event => click_todo_div(event));
                    title_span.addEventListener('click', event => click_todo_span(event));
                    break;
                }
            }
        }
    }
}
//달력의 할 일 목록을 초기화
function clean_todo(){
    var arr = $('table tr').children();
    for(var j = 0; j<7; j++){
        arr[j+7].innerHTML = "";
    }
}
//할 일이 저장된 영역을 클릭했을 때 그 할 일의 정보가 담긴 modal창을 띄움
function click_todo_div(event){
    show_todo_modal(); //todo 모달을 띄우고
    var target_td = event.target.parentNode; //타겟의 부모를 가져옴(td)
    var arr = $('table tr').children(); //테이블
    var day = "";

    for(var i = 0; i<arr.length; i++){
        if(arr[i+7] == target_td){ //타겟의 부모와 일치하는 값을 찾아 날짜를 저장
            day = arr[i].firstChild.innerHTML; 
        } 
    }
    if(day != ""){
        for(var i = 0; i<todo_arr.length; i++){
                if(todo_arr[i] != ""){ //할 일이 있는 경우
                    data = JSON.parse(todo_arr[i]); //parse로 json화
                    if(day == data.date.substring(8) && data.time == event.target.firstChild.nextSibling.innerHTML){ //아까 저장한 날짜와 data의 날짜와 같고 시간이 일치하는 값을 찾아 할 일의 정보를 저장하고 각 버튼을 비활성화 및 활성화
                        $('#date').val(data.date);
                        $('#time').val(data.time);
                        $('#title').val(data.title);
                        $('#description').val(data.description);

                        $('#date').attr("disabled", true);
                        $('#time').attr("disabled", true);
                        $('#title').attr("disabled", true);
                        $('#description').attr("disabled", true);

                        $('#save_btn').attr("disabled", true);
                        $('#update_btn').attr("disabled", false);
                        $('#delete_btn').attr("disabled", false);
                    }
                }
        }
    }
}
//할 일이 저장된 영역의 글자를 클릭했을 때 그 할 일의 정보가 담긴 modal창을 띄움
function click_todo_span(event){
    show_todo_modal();
    var target_td = event.target.parentNode.parentNode;
    var arr = $('table tr').children();
    var day = "";

    for(var i = 0; i<arr.length; i++){
        if(arr[i+7] == target_td){
            day = arr[i].firstChild.innerHTML;
        } 
    }
    if(day != ""){
        for(var i = 0; i<todo_arr.length; i++){
                if(todo_arr[i] != ""){
                    data = JSON.parse(todo_arr[i]);
                    if(day == data.date.substring(8) && data.time == event.target.parentNode.firstChild.nextSibling.innerHTML){
                        $('#date').val(data.date);
                        $('#time').val(data.time);
                        $('#title').val(data.title);
                        $('#description').val(data.description);

                        $('#date').attr("disabled", true);
                        $('#time').attr("disabled", true);
                        $('#title').attr("disabled", true);
                        $('#description').attr("disabled", true);

                        $('#save_btn').attr("disabled", true);
                        $('#update_btn').attr("disabled", false);
                        $('#delete_btn').attr("disabled", false);
                    }
                }
        }
    }
}
//update 버튼을 눌렀을 때 각 버튼을 비활성화 및 활성화
function click_update_btn(){
    $('#date').attr("disabled", false);
    $('#time').attr("disabled", false);
    $('#title').attr("disabled", false);
    $('#description').attr("disabled", false);

    $('#update_btn').attr("disabled", true);
    $('#submit_btn').attr("disabled", false);
    $('#delete_btn').attr("disabled", true);

    //수정 전 값을 저장
    previous_todo = to_JSON();
    //min,max attr를 제거해줌
    $("#date").removeAttr("min");
    $("#date").removeAttr("max");
}
//할 일을 수정
function modify_todo(){
    var present_todo = to_JSON(); //현재 입력한 할 일을 저장
    var parse = JSON.parse(present_todo);
    if(parse.date != undefined && parse.time != undefined && parse.title != undefined && parse.description != undefined){ //모든 항목에 입력값이 있다면
        $.ajax({ //ajax로 서버와 통신
            type: "POST", //POST 방식으로 통신
            url: "./modifyTodo.php", //modifyTodo.php와 통신
            async: false, //동기식 처리
            data: {data1 : previous_todo, data2 : present_todo}, //수정 전 할 일과 현재 입력한 할 일을 둘다 넘김
            success: function(data) { //통신 성공, 수정된 할 일을 가져옴
                    var modify_data = JSON.parse(data);
                    modify_date = modify_data.date;
                    if(modify_date < min_Date || modify_date > max_Date) { //수정된 할 일의 날짜가 현재 달력에 표시된 날짜로 표시할 수 없는 날짜라면
                        now_week = new Date(modify_date); //새로 그 주를 변경해줌
                        calc_date();    
                    }
                    //다시 화면에 띄우는 작업 및 초기화
                    isLoginned();
                    reset_todo_modal();
                    hide_todo_modal();
                    $('#save_btn').attr("disabled", false);
                    $('#update_btn').attr("disabled", true);
                    $('#submit_btn').attr("disabled", true);
                    $('#delete_btn').attr("disabled", true);
            },
            error: function(jqXHR, textStatus, errorThrown) { //통신 실패
              alert("error");
              console.log(jqXHR.responseText);
            }
          });
    }
    else{ //하나라도 입력 값이 빠진 경우 초기화
        alert("모든 항목을 입력해 주세요.");
        reset_todo_modal();
        hide_todo_modal();
    }
}
//현재 date, time, title, description의 값을 json형식으로 스트링화 하기 위한 함수
function to_JSON(){
    var date = $('#date').val();
    var time = $('#time').val();
    var title = $('#title').val();
    var description = $('#description').val();
    var json_Data = JSON.stringify({"date":date, "time":time, "title":title, "description":description});

    return json_Data;
}
//취소 버튼을 클릭했을 때
function cancel_todo(){
    //todo_modal을 초기화하고, 각 값들을 비활성화하고, 각 버튼을 활성화 및 비활성화함
    reset_todo_modal();
    $('#date').attr("disabled", false);
    $('#time').attr("disabled", false);
    $('#title').attr("disabled", false);
    $('#description').attr("disabled", false);


    $('#save_btn').attr("disabled", false);
    $('#update_btn').attr("disabled", true);
    $('#submit_btn').attr("disabled", true);
    $('#delete_btn').attr("disabled", true);
    calc_date();
    //todo_modal을 숨김
    hide_todo_modal();
}
//할 일을 삭제하는 함수
function delete_todo(){
    var prev_todo = to_JSON(); //삭제 전 할 일을 저장
    $.ajax({ //ajax로 서버와 통신
        type: "POST", //POST 방식으로 통신
        url: "./deleteTodo.php", //deleteTodo.php와 통신
        data: {data : prev_todo},
        success: function(data) { //통신 성공
            if(data != false){ //파일이 있는 경우
                after_delete_data = data; //파일의 값
            }
            else{ //파일이 없는 경우(false) undefined
                after_delete_data = "deleted_case";
            } 
                //todo_modal을 숨기고 초기화
                alert("삭제되었습니다.");
                cancel_todo();
                isLoginned();
        },
        error: function(jqXHR, textStatus, errorThrown) { //통신 실패
          alert("error");
          console.log(jqXHR.responseText);
        }
      });

}