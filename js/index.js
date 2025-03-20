window.onload = async () => {
    await syncProfileImages();
    let response = await axios.get("http://localhost:8080/getAllPosts");
    
    console.log(response);
    let postList = response.data;
    
    let postListDiv = ``;
  
    postList.forEach((item) => {
      // 프로필 이미지 경로 생성 (profileImage 값이 없을 경우 기본 이미지 설정)
      let profileImgUrl = item.profileImage 
        ? `http://localhost:8080${item.profileImage}` 
        : "./images/default_profile.png"; // 기본 프로필 이미지
        console.log("Profile Image:", item.profileImage);
      postListDiv += `
          <li class="postCard-block" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: transform 0.2s ease-in-out;">
              <a href="/postDetail.html?id=${item.id}" class="postCard-style-link">
                  <div class="image-block" style="width: 100%; height: auto;">
                      <img src="./images/0afaeaf5-ac0c-49c5-b09e-719b72352559_image.png" alt="게시글 썸네일" class="post-thumbnail">
                  </div>
              </a>
              <div class="postCard-content" style="padding: 15px;">
                  <a href="/postDetail.html?id=${item.id}">
                      <h4 class="postCard-title">${item.title.substring(0,22)}</h4>
                      <div class="postCard-descriptionWrapper">
                          <p class="postCard-des">${item.content.substring(0, 50)}</p>
                      </div>
                  </a>
                  
              </div>
              <div class="postCard-subinfo">
                      <span>${item.createdAt.substring(0,10)} ${item.createdAt.substring(11,16)}</span>
                      
                  </div>
              <div class="postCard-footer">
                  <span href="" class="postCard-userInfo">
                      <img src="${profileImgUrl}" alt="사용자 프로필 사진" style="width: 40px; height: 40px; border-radius: 50%;">
                      <span>by <b>${item.username}</b></span>
                  </span>
              </div>
          </li>`;
    });
  
    document.getElementById("postListDiv").innerHTML = postListDiv;
  };
  

  async function syncProfileImages() {
    try {
        let response = await axios.put("http://localhost:8080/syncProfileImages");
        console.log("갱신됐음");
    } catch (error) {
        console.error("Error syncing profile images", error);
    }
}