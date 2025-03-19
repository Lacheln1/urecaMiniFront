document.getElementById("postBtn").addEventListener("click",async()=>{
    console.log("눌렷음");
    const title=document.getElementById("title").value;
    const tags =document.getElementById("tag").value;
    const content = document.getElementById("content").value;
    const username = localStorage.getItem("username");
    console.log(username);

    const data = {title, content, username, tags};
    try{
        const response = await axios.post("http://localhost:8080/insertPost",data);
        console.log(response);
        alert("완료");
        window.location.href = "../index.html";
    } catch(error){
        alert("발간 실패하였습니다",error);
    }
})

document.getElementById("cancelBtn").addEventListener("click",async ()=>{
    const checkCancel = confirm("작성을 그만두고 나가시겠습니까?");
    if(checkCancel==true){
        window.location.href = "/";
    }
})