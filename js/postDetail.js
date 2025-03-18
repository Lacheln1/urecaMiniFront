
// document.addEventListener("DOMContentLoaded", function () {
//     const postContainer = document.querySelector(".post-container");
//     const likeBtn = document.querySelector(".like-btn");
//     const followBtn = document.querySelector(".follow-btn");

//     const postId = postContainer.dataset.postId;  // 게시글 ID 가져오기
//     const username = postContainer.dataset.username; // 작성자 nick 가져오기



//     //좋아요
//     likeBtn.addEventListener("click", function () {
//         axios.post(`/api/posts/${postId}/like`)
//             .then(response => {
//                 likeBtn.textContent = ` ${response.data.likes}`;  // 서버에서 받은 좋아요 개수 업데이트
//             })
//             .catch(error => console.error("좋아요 요청 오류:", error));
//     });

 
//     //팔로잉
//     followBtn.addEventListener("click", function () {
//         const isFollowing = followBtn.classList.contains("following");

//         axios.post(`/api/users/${username}/follow`, { follow: !isFollowing })
//             .then(response => {
//                 if (response.data.following) {
//                     followBtn.classList.add("following");
//                     followBtn.textContent = "팔로우 취소";
//                 } else {
//                     followBtn.classList.remove("following");
//                     followBtn.textContent = "팔로우";
//                 }
//             })
//             .catch(error => console.error("팔로우 요청 오류:", error));
//     });

//     //본문 innerHTML
//     const contentContainer = document.querySelector(".post-content p");
//     const rawContent = contentContainer.textContent;
//     contentContainer.innerHTML = rawContent;
// });


window.onload = async () => {
    // 현재 URL에서 `id` 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    const username = localStorage.getItem("username");
    if (!postId) {
        alert("잘못된 접근입니다.");
        window.location.href = "/";
        return;
    }

    try {
        //API 호출 (게시글 상세 정보 불러오기)
        let response = await axios.get(`http://localhost:8080/getPostDetail/${postId}`);
        let post = response.data;

        if (username == post.username) {
            const editBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");
            
            // edit-layout과 delete-layout 클래스를 가진 요소들을 가져옴
            const editLayout = document.getElementsByClassName("edit-layout");
            const deleteLayout = document.getElementsByClassName("delete-layout");
        
            editBtn.textContent = "수정";
            deleteBtn.textContent = "삭제";
        
            // editLayout과 deleteLayout이 존재하는지 확인 후 추가
            if (editLayout.length > 0) {
                editLayout[0].appendChild(editBtn);
            }
        
            if (deleteLayout.length > 0) {
                deleteLayout[0].appendChild(deleteBtn);
            }

            deleteBtn.addEventListener("click",async ()=>{
                const checkDelete = confirm("정말로 포스트를 삭제하시겠습니까?");
                if(checkDelete==true){
                    await axios.delete(`http://localhost:8080/deletePost/${postId}`);
                    alert("삭제 되었습니다!");
                    window.location.href = "/";
                }
            })

            editBtn.addEventListener("click",async()=>{
                window.location.href = `../editPost.html?id=${postId}`;
            })
        }

        //HTML 요소에 데이터 넣기
        document.querySelector(".post-title").textContent = post.title;
        document.querySelector(".author").textContent = post.username;
        document.querySelector(".created-date").textContent = new Date(post.createdAt).toLocaleDateString();
        document.querySelector(".like-btn").textContent = `👍 ${post.likes}`;
        document.querySelector(".post-content img").src = post.imageUrl || "/images/default.png";
        document.querySelector(".post-content p").textContent = post.content;
        

        //태그 추가
        let tagContainer = document.querySelector(".tags");
        tagContainer.innerHTML = "";
        if (post.tags) {
            post.tags.split(",").forEach(tag => {
                let span = document.createElement("span");
                span.classList.add("tag");
                span.textContent = `#${tag.trim()}`;
                tagContainer.appendChild(span);
            });
        }

    } catch (error) {
        console.error("게시글을 불러오는 중 오류 발생", error);
        alert("게시글을 불러올 수 없습니다.");
        window.location.href = "/";
    }

    //좋아요 기능
    const likeBtn = document.querySelector(".like-btn");

    likeBtn.addEventListener("click",async ()=>{
        try {
            await axios.post(`http://localhost:8080/${postId}/like`);
            let currentLikes = parseInt(likeBtn.textContent.split(" ")[1]) || 0;
            likeBtn.textContent = `👍 ${currentLikes + 1}`;
        } catch (error) {
            onsole.error("좋아요 요청 오류:", error);
            alert("좋아요 요청 중 오류 발생");
        }
    } )


};