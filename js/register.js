// 회원가입
document.getElementById("signupBtn").addEventListener("click",async()=>{
    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("pwd").value;
    const checkpwd = document.getElementById("checkpwd").value;
    const data = {username, name,email,password,checkpwd};

    
        const response = await axios.post("http://localhost:8080/register",data);
        alert("회원가입 성공!");
        console.log(response);
   

})