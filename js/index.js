window.onload = async () => {
  let response = await axios.get("");
  console.log(response);
  let postList = response.data;
  let postListDiv = ``;

  postListDiv.forEach((item) => {
    postListDiv += `
        <style>/* 게시글 카드 스타일 */
.postCardGrid-block {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
}

.postCard-block {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
}

.postCard-block:hover {
    transform: translateY(-5px);
}

.image-block img {
    width: 100%;
    height: auto;
}

.postCard-content {
    padding: 15px;
}

.postCard-title {
    font-size: 18px;
    font-weight: bold;
    color: #000;
    text-decoration: none;
}

.postCard-des {
    color: #555;
    font-size: 14px;
    margin-top: 5px;
}

.postCard-subinfo {
    font-size: 12px;
    color: #777;
    margin-top: 10px;
}

.postCard-footer {
    padding: 10px 15px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
}

.postCard-userInfo img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
}

.modal-signup{
    text-decoration: none;
}

.login-btn{
    border-radius: 30px !important;
    background-color: black !important;
    border-color: black !important;
}</style>
        <li class="postCard-block" style="background: white;border-radius: 8px;overflow: hidden;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);transition: transform 0.2s ease-in-out;">
                    <a href="" class="postCard-style-link">
                        <div class="image-block" style ="width: 100%; height: auto;">
                            <img src="./images/0afaeaf5-ac0c-49c5-b09e-719b72352559_image.png" alt="게시글 썸네일">
                        </div>
                    </a>
                    <div class="postCard-content" style="padding: 15px;">
                        <a href="">
                            <h4 class="postCard-title">글제목</h4>
                            <div class="postCard-descriptionWrapper">
                                <p class="postCard-des">글 요약</p>
                            </div>
                        </a>
                        <div class="postCard-subinfo">
                            <span>작성 시간</span>
                            <span class="postCard-separator">-</span>
                            <span>n개의 댓글</span>
                        </div>
                    </div>
                    <div class="postCard-footer">
                        <a href="" class="postCard-userInfo">
                            <img src="" alt="사용자 프로필 사진">
                            <span>by <b>닉네임</b>
                            </span>
                        </a>
                    </div>

                </li>`;
  });

  document.getElementById("postListDiv").innerHTML = postListDiv;
};
