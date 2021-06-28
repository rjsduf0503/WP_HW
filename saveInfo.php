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
  $decodedData = json_decode($data); //입력한 할 일을 decode
  $year = substr(test_input($decodedData->date), 0, 4); //date의 년도
  $month = substr(test_input($decodedData->date), 5, 2); //date의 월
  $YM = $year.$month; 
  $fileName = $_SESSION['id']."_".$YM;
  $url = "./data/".$fileName.".json"; //파일 명 설정
  $isOverlapped = false; //중복되었는지

  if(file_exists($url)){ //중복 되어 있는 경우를 찾기 위함
    if($method == 'POST'){
        $file = explode("\n", file_get_contents($url));
        foreach ($file as $val) {
            $obj = json_decode($val);
            if($obj !== null){
                if(strcmp(test_input($obj->time), test_input($decodedData->time)) == 0 && strcmp(test_input($obj->date), test_input($decodedData->date)) == 0){
                    $isOverlapped = true;
                    echo false;
                }
            }
        }
    }
  }

  if(!$isOverlapped){ //중복되어 있지 않다면 파일에 저장
    if($method == 'POST'){
        $encoded = json_encode(array("date" => test_input($decodedData->date), "time" => test_input($decodedData->time), "title" => test_input($decodedData->title), "description" => test_input($decodedData->description)));
        file_put_contents($url, $encoded."\n", FILE_APPEND);
        echo true;
    }
  }
?>