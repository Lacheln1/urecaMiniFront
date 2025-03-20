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



// function updatePostImage(postImageUrl){
//     const postImage = document.getElementsByClassName("post-thumbnail");

//     if(!postImageUrl || postImageUrl.trim()===""){
//         console.log("이미지 없음");
//         postImage.src="http://localhost:8080/thumbnail/no-intro.png"; // 기본 이미지
//         return;
//     }

//     let imageUrl = postImageUrl.startsWith("/thumbnail/")
//     ? `http://localhost:8080${profileImageUrl}`
//     : `http://localhost:8080/thumbnail/${profileImageUrl}`;

//     // 캐시 문제 방지 (새로운 이미지 강제 로드)
//     const timestamp = new Date().getTime();
//     profileImage.src = `${imageUrl}?t=${timestamp}`;

//     console.log("프로필 이미지 업데이트됨:", profileImage.src);
// }
    
// document.getElementById("imgBtn").addEventListener("click", function () {
//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.accept = "image/*";

//     fileInput.addEventListener("change", async function () {
//         const file = fileInput.files[0];
//         if (!file) return;

//         const formData = new FormData();
//         formData.append("file", file);

//         const token = localStorage.getItem("jwtToken")?.replace(/\"/g, "").trim();

//         if (!token) {
//             alert("로그인이 필요합니다.");
//             return;
//         }

//         try {
//             const response = await fetch("http://localhost:8080/upload-post-image", {  
//                 method: "POST",
//                 headers: { "Authorization": `Bearer ${token}` },
//                 body: formData
//             });

//             if (!response.ok) throw new Error("이미지 업로드 실패");

//             const { postImageUrl } = await response.json();
//             updateProfileImage(postImageUrl);  //수정된 함수 호출

//             alert("이미지 업로드 완료!");

//         } catch (error) {
//             console.error("이미지 업로드 오류:", error);
//             alert("이미지 업로드 실패!");
//         }
//     });

//     fileInput.click();
// });
