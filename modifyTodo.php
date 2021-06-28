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
  $previous_data = json_decode($_REQUEST['data1']); //data 값을 요청하여 얻음
  $present_data = json_decode($_REQUEST['data2']); //data 값을 요청하여 얻음
  $previous_year = substr($previous_data->date, 0, 4); //수정 전 할 일의 년도
  $previous_month = substr($previous_data->date, 5, 2); //수정 전 할 일의 월
  $present_year = substr($present_data->date, 0, 4); //현재 입력한 할 일의 년도
  $present_month = substr($present_data->date, 5, 2); //현재 입력한 할 일의 월
  $modify_value = $_REQUEST['data2']; //현재 입력한 할 일(수정된 값)

  if($previous_month == $present_month){ //두 월이 같은 경우 파일은 같음
      $url = "./data/".$_SESSION['id']."_".$previous_year.$previous_month.".json";
      if(file_exists($url)){ //파일이 존재할 때
         if($method == 'POST'){
            $file = explode("\n", file_get_contents($url)); //값을 가져오고
            unlink($url); //파일 삭제
            foreach ($file as $val) {
                $obj = json_decode($val);
                if($obj !== null){
                    if($obj->date == $previous_data->date && $obj->time == $previous_data->time){ //수정해야할 값, 수정된 값을 파일에 넣어줌
                        $encoded = json_encode(array("date" => test_input($present_data->date), "time" => test_input($present_data->time), "title" => test_input($present_data->title), "description" => test_input($present_data->description)));
                        file_put_contents($url, $encoded."\n", FILE_APPEND);

                    }
                    else{ //수정하지 않는 값, 그대로 넣어줌
                        $encoded = json_encode(array("date" => test_input($obj->date), "time" => test_input($obj->time), "title" => test_input($obj->title), "description" => test_input($obj->description)));
                        file_put_contents($url, $encoded."\n", FILE_APPEND);

                    }
                }
            }
            echo($modify_value); //수정된 값을 반환
         }
      }
  }
  else{ //두 월이 다른 경우 파일은 다름
    $url_1 = "./data/".$_SESSION['id']."_".$previous_year.$previous_month.".json";
    $url_2 = "./data/".$_SESSION['id']."_".$present_year.$present_month.".json";
    if(file_exists($url_1)){ //첫 파일이 존재할 때
        if($method == 'POST'){
            $file_1 = explode("\n", file_get_contents($url_1)); //값을 가져오고
            unlink($url_1); //파일 삭제
            foreach ($file_1 as $val) {
                $obj = json_decode($val);
                if($obj !== null){
                    if($obj->date == $previous_data->date && $obj->time == $previous_data->time){ //삭제 해야할 값, 아무 값도 넣어주지 않음
                    }
                    else{ //수정하지 않는 값, 그대로 넣어줌
                        $encoded = json_encode(array("date" => test_input($obj->date), "time" => test_input($obj->time), "title" => test_input($obj->title), "description" => test_input($obj->description)));
                        file_put_contents($url_1, $encoded."\n", FILE_APPEND);
                    }
                }
            }
         }
         //두번째 파일에 수정된 할 일을 넣어줌
         file_put_contents($url_2, $modify_value."\n", FILE_APPEND);
        echo($modify_value); //수정된 할 일을 반환
    }
    else { //첫  파일이 존재하지 않는 경우 false 
        echo "false";
    }
  }

  ?>