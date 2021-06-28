<?php
  session_start();
  function test_input($data) { //validation 함수
    $data = trim($data); //처음과 끝 앞뒤의 공백 제거
    $data = stripslashes($data); //백슬래시 제거
    $data = htmlspecialchars($data); //특수 문자를 HTML 엔티티로 변환
    return $data;
  }


  header("Content-type: text/html; charset=utf-8");
  $method = $_SERVER['REQUEST_METHOD'];
  $data = $_REQUEST['data'];
  $decodedData = json_decode($data);
  $start_date = test_input($decodedData->week_start); //그 주의 첫 날짜
  $end_date = test_input($decodedData->week_end); //그 주의 마지막 날짜

  $start_year = substr($start_date, 0, 4); //첫 날짜의 년도
  $start_month = substr($start_date, 5, 2); //첫 날짜의 월
  $end_year = substr($end_date, 0, 4); //마지막 날짜의 년도
  $end_month = substr($end_date, 5, 2); //마지막 날짜의 월
  if(strcmp($start_month, $end_month) == 0){ //두 날짜의 월이 같다면
    $url = "./data/".$_SESSION['id']."_".$start_year.$start_month.".json"; //파일은 하나
    if(file_exists($url)){ //그 파일이 존재할 때
        if($method == 'POST'){
            $file = explode("\n", file_get_contents($url)); //담긴 값들을 가져와서
            foreach ($file as $val) {
                $obj = json_decode($val);
                if($obj !== null){
                    if($start_date<=$obj->date && $obj->date<=$end_date){ //그 주에 있는 할 일을 넘김
                        echo(json_encode(array("date" => test_input($obj->date), "time" => test_input($obj->time), "title" => test_input($obj->title), "description" => test_input($obj->description)))."\n");
                    }
                }
            }
        }
    }
  }
  else{ //두 날짜의 월이 다른 경우
    //두개의 파일로 나누고
    $url_1 = "./data/".$_SESSION['id']."_".$start_year.$start_month.".json";
    $url_2 = "./data/".$_SESSION['id']."_".$end_year.$end_month.".json";
    if(file_exists($url_1)){ //첫 파일이 존재할 경우
        if($method == 'POST'){
            $file = explode("\n", file_get_contents($url_1));
            foreach ($file as $val) {
                $obj = json_decode($val);
                if($obj !== null){
                    if($start_date<=$obj->date && $obj->date<=$end_date){ //그 주에 있는 할 일을 넘김
                        echo(json_encode(array("date" => test_input($obj->date), "time" => test_input($obj->time), "title" => test_input($obj->title), "description" => test_input($obj->description)))."\n");
                    }
                }
            }
        }
    }
    if(file_exists($url_2)){ //두번째 파일이 존재할 경우
        if($method == 'POST'){
            $file = explode("\n", file_get_contents($url_2));
            foreach ($file as $val) {
                $obj = json_decode($val);
                if($obj !== null){
                    if($start_date<=$obj->date && $obj->date<=$end_date){ //그 주에 있는 할일을 넘김
                        echo(json_encode(array("date" => test_input($obj->date), "time" => test_input($obj->time), "title" => test_input($obj->title), "description" => test_input($obj->description)))."\n");
                    }
                }
            }
        }
    }
  }
?>