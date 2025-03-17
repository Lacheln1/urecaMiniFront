document.addEventListener("DOMContentLoaded", function () {
    const postContainer = document.querySelector(".post-container");
    const likeBtn = document.querySelector(".like-btn");
    const followBtn = document.querySelector(".follow-btn");

    const postId = postContainer.dataset.postId;  // 게시글 ID 가져오기
    const username = postContainer.dataset.username; // 작성자 nick 가져오기



    //좋아요
    likeBtn.addEventListener("click", function () {
        axios.post(`/api/posts/${postId}/like`)
            .then(response => {
                likeBtn.textContent = ` ${response.data.likes}`;  // 서버에서 받은 좋아요 개수 업데이트
            })
            .catch(error => console.error("좋아요 요청 오류:", error));
    });

 
    //팔로잉
    followBtn.addEventListener("click", function () {
        const isFollowing = followBtn.classList.contains("following");

        axios.post(`/api/users/${username}/follow`, { follow: !isFollowing })
            .then(response => {
                if (response.data.following) {
                    followBtn.classList.add("following");
                    followBtn.textContent = "팔로우 취소";
                } else {
                    followBtn.classList.remove("following");
                    followBtn.textContent = "팔로우";
                }
            })
            .catch(error => console.error("팔로우 요청 오류:", error));
    });

    //본문 innerHTML
    const contentContainer = document.querySelector(".post-content p");
    const rawContent = contentContainer.textContent;
    contentContainer.innerHTML = rawContent;
});
