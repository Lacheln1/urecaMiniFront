
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
        // 게시글 상세 정보 불러오기
        let response = await axios.get(`http://localhost:8080/getPostDetail/${postId}`);
        let post = response.data;

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
};
