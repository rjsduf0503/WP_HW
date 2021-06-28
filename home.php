<?php 
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="home.css">
    <title>Document</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <!-- join 버튼을 눌렀을 때 띄워지는 모달 창 -->
    <div id="join_modal" class="hide"> 
        <div class="modal_contents">
            <label>
                <span>id</span>
                <input type="text" name="id" id="id">
            </label>
            <label>
                <span>password</span>
                <input type="password" name="pw" id="pw">
            </label>
        </div>
        <div class="btn_div">
            <form action="" method="post">
                <button type="button" id="login_btn">LogIn</button>
                <button type="button" id="signin_btn">SignIn</button>
            </form>
        </div>
    </div>
    <!-- add 버튼과 할 일을 눌렀을 때 띄워지는 모달 창 -->
    <div id="todo_modal" class="hide">
        <div class="modal_contents">
            <label>
                <span>date</span>
                <input type="date" name="date" id="date">
                <input type="time" name="time" id="time">
            </label>
            <label>
                <span>title</span>
                <input type="text" name="title" id="title">
            </label>
            <label>
                <span>description</span>
                <input type="text" name="description" id="description">
            </label>
        </div>
        <div class="btn_div">
            <form action="" method="post">
                <button type="button" id="save_btn">Save</button>
                <button type="button" id="update_btn" disabled="disabled">Update</button>
                <button type="button" id="submit_btn" disabled="disabled">Submit</button>
                <button type="button" id="delete_btn" disabled="disabled">Delete</button>
                <button type="button" id="cancel_btn">Cancel</button>
            </form>
        </div>
    </div>


    <header>
            <input type="button" value="Add" disabled="disabled" id="add_btn">
            <div class="rightDiv">
                <input type="button" value="Join" id="join_btn">
                <input type="button" value="Logout" id="logout_btn">
            </div>
    </header>
    <br><br><br><br>
    <article>  
            <div class="date">
                <span class="span1"></span>년 <span class="span2"></span>월
            </div>
            <div>
                <table>
                    <tr>
                        <th><span id="sun" class="week"></span>(Sun)</th>
                        <th><span id="mon" class="week"></span>(Mon)</th>
                        <th><span id="tue" class="week"></span>(Tue)</th>
                        <th><span id="wed" class="week"></span>(Wed)</th>
                        <th><span id="thu" class="week"></span>(Thu)</th>
                        <th><span id="fri" class="week"></span>(Fri)</th>
                        <th><span id="sat" class="week"></span>(Sat)</th>
                    </tr>
                    <!-- 달력에 할 일 추가 -->
                    <tr class="todo_tr"> 
                        <td>

                        </td>
                        <td>
                            
                        </td>
                        <td>
                            
                        </td>
                        <td>
                            
                        </td>
                        <td>
                            
                        </td>
                        <td>
                            
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                </table>
            </div>
    </article>
    <script src="script.js"></script>
</body>
</html>