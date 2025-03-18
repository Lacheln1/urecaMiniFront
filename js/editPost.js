window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
        alert("잘못된 접근입니다.");
        window.location.href = "/";
        return;
    }

    try {
        // 서버에서 기존 게시글 데이터 가져오기
        let response = await axios.get(`http://localhost:8080/getPostDetail/${postId}`);
        let post = response.data;

        // HTML 요소에 데이터 넣기
        document.getElementById("title").value = post.title;
        document.getElementById("tag").value = post.tags;
        document.getElementById("content").value = post.content;
    } catch (error) {
        console.error("게시글을 불러오는 중 오류 발생", error);
        alert("게시글을 불러올 수 없습니다.");
        window.location.href = "/";
    }

    document.getElementById("postBtn").addEventListener("click",async()=>{
        console.log("눌렷음");
        const title=document.getElementById("title").value;
        const tags =document.getElementById("tag").value;
        const content = document.getElementById("content").value;
    
        const data = {title, content,tags};
        try{
            const response = await axios.put(`http://localhost:8080/updatePost/${postId}`,data);
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
};

