<?php
  session_start();
  function test_input($data) { //validation 함수
    $data = trim($data); //처음과 끝 앞뒤의 공백 제거
    $data = stripslashes($data); //백슬래시 제거
    $data = htmlspecialchars($data); //특수 문자를 HTML 엔티티로 변환
    return $data;
  }
  
header("Content-type: text/html; charset=utf-8");
  $method = $_SERVER['REQUEST_METHOD']; //method는 POST로 받아왔으므로 POST
  $previous_data = json_decode($_REQUEST['data']); //data 값을 요청하여 얻음
  $previous_year = substr($previous_data->date, 0, 4); //삭제할 할 일의 년도
  $previous_month = substr($previous_data->date, 5, 2); //삭제할 할 일의 월
  $url = "./data/".$_SESSION['id']."_".$previous_year.$previous_month.".json";
  if(file_exists($url)){  //파일이 존재할 때
    if($method == 'POST'){
        $file = explode("\n", file_get_contents($url)); //파일의 값을 가져와 저장하고
        unlink($url); //파일을 삭제해줌
        foreach ($file as $val) {
            $obj = json_decode($val);
            if($obj !== null){
                if($obj->date == $previous_data->date && $obj->time == $previous_data->time){ //삭제해야할 값, 아무것도 쓰지 않음
                }
                else{ //삭제하지 않는 값, 다시 추가해 줌
                    $encoded = json_encode(array("date" => test_input($obj->date), "time" => test_input($obj->time), "title" => test_input($obj->title), "description" => test_input($obj->description)));
                    file_put_contents($url, $encoded."\n", FILE_APPEND);
                    }
                }
            } //삭제 후 파일이 존재한다면 그 파일의 내용을 넘김
            if(file_exists($url)){ 
                echo(file_get_contents($url));
            }
            else{ //존재하지 않는다면 false
                echo false;
            }
    }
  }

  ?>