<?php
  function test_input($data) { //validation 함수
    $data = trim($data); //처음과 끝 앞뒤의 공백 제거
    $data = stripslashes($data); //백슬래시 제거
    $data = htmlspecialchars($data); //특수 문자를 HTML 엔티티로 변환
    return $data;
  }
  
header("Content-type: text/html; charset=utf-8");
  $method = $_SERVER['REQUEST_METHOD']; //method는 POST로 받아왔으므로 POST
  $url = "./data/person.json"; //json 파일의 주소
  $data = $_REQUEST['data']; //data 값을 요청하여 얻음
  $jsoninfo = [];
  $decodedData = json_decode($data); //얻어온 data값은 json화 되어있으므로 decode
  $isLoginOK = false; //로그인 가능한지의 초기값은 false
  if(file_exists($url)){ //json 파일이 존재한다면
      if($method == 'POST'){
        $file = explode("\n", file_get_contents($url)); 
        //파일을 개행을 기준으로 나누고 파일에 존재하는 id, pw값을 jsoninfo에 저장
        foreach ($file as $val) {
            $obj = json_decode($val);
            if($obj !== null){
              $jsoninfo[$obj->id] = $obj->pw;
            }
        }
        foreach($jsoninfo as $jsonID => $jsonPW){ //jsoninfo를 foreach문으로 돌며
            if(strcmp(test_input($jsonID), test_input($decodedData->id)) == 0 && strcmp(test_input($jsonPW), test_input($decodedData->pw)) == 0){
              //사용자가 입력한 id,pw와 json파일에서 가져온 id,pw중 동시에 일치하는 값이 있다면
                session_start(); //세션을 시작하고
                $_SESSION['id'] = test_input($jsonID);
                $_SESSION['pw'] = test_input($jsonPW);
                //세션에 id, pw을 저장
                $isLoginOK = true; //로그인 가능하다고 변경
                break;
            }
          }
        }
  }
  if($isLoginOK){ //로그인이 가능할 때 id값을 return
    echo($_SESSION['id']);
  }
  else{ //불가능 하다면 false를 return
    echo(false);
  }




  ?>