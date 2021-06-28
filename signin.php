<?php
  function test_input($data) { //validation 함수
    $data = trim($data); //처음과 끝 앞뒤의 공백 제거
    $data = stripslashes($data); //백슬래시 제거
    $data = htmlspecialchars($data); //특수 문자를 HTML 엔티티로 변환
    return $data;
  }

  $method = $_SERVER['REQUEST_METHOD'];
  $url = "./data/person.json";
  $data = $_REQUEST['data'];
  $jsoninfo = [];
  $decodedData = json_decode($data);
  $id = test_input($decodedData->id);
  $pw = test_input($decodedData->pw);
  $isIdExist = false;

  if(file_exists($url)){
    if($method == 'POST'){
      $file = explode("\n", file_get_contents($url));
      foreach ($file as $val) {
        $obj = json_decode($val);
        if($obj !== null){
          $jsoninfo[$obj->id] = $obj->pw;
        }
      }

      if($jsoninfo==null){ //jsoninfo에 저장된 값이 없다면 중복 x
      }
      else{
        $jsonIDs = array_keys($jsoninfo); //jsoninfo의 key값(id)만을 가져와서 저장
        foreach($jsonIDs as $val){ //그 id들을 돌며
          if(strcmp($val, $id) == 0){ //사용자가 입력한 id와 같은 값이 있다면(존재)
              $isIdExist = true; //아이디가 존재한다고 변경
              echo("false");
              break;
          }
        }
      }
    }
  }  

  if($isIdExist === false){ //아이디가 존재하지 않는 경우 저장
    if($method == 'POST'){
      $encoded = json_encode(array("id" => $id, "pw" => $pw));
      file_put_contents($url, $encoded."\n", FILE_APPEND);
      echo("true");
    }
  }


?>
