const likeBtns = document.querySelectorAll('.heart-icon');
const numberOfLikesElements = document.querySelectorAll('.number-of-likes');



const likeBtnsArray = Array.from(likeBtns);
const numberOfLikesElementsArray = Array.from(numberOfLikesElements);


const likeClick = (index) => {
  const likeBtn = likeBtnsArray[index];
  const numberOfLikesElement = numberOfLikesElementsArray[index];
  let numberOfLikes = Number.parseInt(numberOfLikesElement.textContent, 10);
  const isLiked = likeBtn.classList.contains('isLiked');

  if (!isLiked) {
    likeBtn.classList.add('isLiked');
    likeBtn.style.fill = '#e74c3c'
    numberOfLikes++;
  } else {
    likeBtn.classList.remove('isLiked');
    likeBtn.style.fill = 'white'; 
    numberOfLikes--;
  }

  numberOfLikesElement.textContent = numberOfLikes;


  const postId = likeBtn.dataset.postId;
  const url = `/post/like/${postId}`;

  // AJAX request
  fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
};


likeBtnsArray.forEach((likeBtn, index) => {
  likeBtn.addEventListener('click', () => likeClick(index));
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("/liked-posts")
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(likedPosts => {
      const likedPostIds = new Set(likedPosts);
      likeBtnsArray.forEach((likeBtn, index) => {
        const postId = likeBtn.dataset.postId;
        if (likedPostIds.has(postId)) {
          likeBtn.classList.add('isLiked');
        }
      });
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
});




document.querySelector('.heart-icon').addEventListener('click', function () {
  const heartIcon = document.querySelector('.heart-icon');
  const numberOfLikes = document.querySelector('.number-of-likes');

  if (heartIcon.style.fill === '#e74c3c') {
    heartIcon.style.fill = 'white';
  } else {
    heartIcon.style.fill = '#e74c3c';
  }

});