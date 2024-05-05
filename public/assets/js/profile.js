function showUpload(type) {
    const form = document.getElementById(`${type}-form`);
    if (!form.querySelector('.file-input').files.length) {
        form.style.opacity = "1";
    }
}

function hideUpload(type) {
    const form = document.getElementById(`${type}-form`);
    if (!form.querySelector('.file-input').files.length) {
        form.style.opacity = "0";
        form.reset();
    }
}

function toggleHover(type) {
    const form = document.getElementById(`${type}-form`);
    const uploadBtn = form.querySelector('.upload-btn');
    const isFileSelected = form.querySelector('.file-input').files.length > 0;
    if (isFileSelected) {
        uploadBtn.classList.add('disabled');
    } else {
        uploadBtn.classList.remove('disabled');
    }
}
















document.querySelectorAll('.delete-post-btn').forEach(button => {
    button.addEventListener('click', async () => {
        const postId = button.getAttribute('data-post-id');
        try {
            const response = await fetch(`/profile/post/delete/${postId}`, {
                method: 'GET'
            });
            if (response.ok) {
                location.reload();
            } else {
                console.error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});






















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


document.querySelectorAll(".comment-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        const postId = this.getAttribute("data-post-id");
        const modal = document.getElementById(`myModal-${postId}`);
        modal.style.display = "block";
    });
});

document.querySelectorAll(".close").forEach(closeBtn => {
    closeBtn.addEventListener("click", function() {
        const modal = this.closest(".modal");
        modal.style.display = "none";
    });
});

window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
};