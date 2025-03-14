window.onload=async()=>{
    let response = await axios.get("")
    console.log(response);
    let postList = response.data;
    let postListDiv=``;

    postListDiv.forEach((item)=>{
        postListDiv+=`<li class="postCard-block" style="background: white;border-radius: 8px;overflow: hidden;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);transition: transform 0.2s ease-in-out;">
                    <a href="" class="postCard-style-link">
                        <div class="image-block">
                            <img src="./images/0afaeaf5-ac0c-49c5-b09e-719b72352559_image.png" alt="게시글 썸네일">
                        </div>
                    </a>
                    <div class="postCard-content">
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

    document.getElementById("postListDiv").innerHTML=postListDiv;
}