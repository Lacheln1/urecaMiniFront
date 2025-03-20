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
        // 게시글 상세 정보 불러오기
        let response = await axios.get(`http://localhost:8080/getPostDetail/${postId}`);
        let post = response.data;

        if (username == post.username) {
            const editBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");

            editBtn.classList.add("edit-btn");
            deleteBtn.classList.add("delete-btn");
            
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

        // 게시글 내용 반영
        document.querySelector(".post-title").textContent = post.title;
        document.querySelector(".author").textContent = post.username;
        document.querySelector(".created-date").textContent = new Date(post.createdAt).toLocaleDateString();
        document.querySelector(".post-content p").textContent = post.content;
        
        // 좋아요 버튼 업데이트
        const likeBtn = document.querySelector(".like-btn");
        const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
        let isLiked = likedPosts[postId] || false;

        function updateLikeButton() {
            likeBtn.textContent = isLiked ? `👍 ${post.likes} 좋아요 취소` : `👍 ${post.likes} 좋아요`;
        }
        
        updateLikeButton();

        likeBtn.addEventListener("click", async () => {
            try {
                if (!isLiked) {
                    await axios.post(`http://localhost:8080/${postId}/like`);
                    likedPosts[postId] = true;
                    post.likes += 1;
                } else {
                    await axios.post(`http://localhost:8080/${postId}/unlike`);
                    likedPosts[postId] = false;
                    post.likes -= 1;
                }
                localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
                isLiked = !isLiked;
                updateLikeButton();
            } catch (error) {
                console.error("좋아요 처리 중 오류 발생:", error);
                alert("좋아요 처리 중 문제가 발생했습니다.");
            }
        });

        // 태그 추가
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

    document.getElementById("cancelBtn").addEventListener("click",async ()=>{
        const checkCancel = confirm("작성을 그만두고 나가시겠습니까?");
        if(checkCancel==true){
            window.location.href = "/";
            window.history.back();
        }
    })
};
