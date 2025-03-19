window.onload = async () => {
  let response = await axios.get("http://localhost:8080/getAllPosts");
  console.log(response);
  let postList = response.data;
  console.log(postList.title);
  let postListDiv = ``;

  postList.forEach((item) => {
    postListDiv += `
       
        <li class="postCard-block" style="background: white;border-radius: 8px;overflow: hidden;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);transition: transform 0.2s ease-in-out;" >
                    <a href="/postDetail.html?id=${item.id}" class="postCard-style-link">
                        <div class="image-block" style ="width: 100%; height: auto;">
                            <img src="./images/0afaeaf5-ac0c-49c5-b09e-719b72352559_image.png" alt="게시글 썸네일">
                        </div>
                    </a>
                    <div class="postCard-content" style="padding: 15px;">
                        <a href="/postDetail.html?id=${item.id}">
                            <h4 class="postCard-title">${item.title}</h4>
                            <div class="postCard-descriptionWrapper">
                                <p class="postCard-des">${item.content.substring(0, 50)}</p>
                            </div>
                        </a>
                        <div class="postCard-subinfo">
                            <span>${item.createdAt.substring(0,10)} ${item.createdAt.substring(11,16)}</span>
                            <span class="postCard-separator">-</span>
                            <span>n개의 댓글</span>
                        </div>
                    </div>
                    <div class="postCard-footer">
                        <a href="" class="postCard-userInfo">
                            <img src="../images/${item.profileImage}" alt="사용자 프로필 사진">
                            <span>by <b>${item.username}</b>
                            </span>
                        </a>
                    </div>

                </li>`;
  });

  document.getElementById("postListDiv").innerHTML = postListDiv;
};
