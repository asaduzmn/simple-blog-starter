// Modal functions
function openModal(postId) {
    const modal = document.getElementById('postModal');
    if (modal) {
        document.body.classList.add('modal-open'); 
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    // console.log(postId);

    fetch(
        `https://basic-blog.teamrabbil.com/api/post-details/${postId}`
    )
    .then((response) => response.json())
    .then((data) => {
        document.querySelector('#postImage').setAttribute('src', data.postDetails.img);
        document.querySelector('#postContent').textContent = data.postDetails.content;
        const commentList = document.querySelector('#commentList');
        data.postComments.forEach((el) => {
            // Format the date dynamically
            const date = new Date(el.updated_at);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

            commentList.innerHTML +=`
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div class="flex items-center gap-3 mb-3">
                        <div
                            class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                            ${el.author[0].toUpperCase()}
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800">${el.author}</div>
                            <div class="text-sm text-gray-500">${formattedDate}</div>
                        </div>
                    </div>
                    <p class="text-gray-600 leading-relaxed">Great introduction to TailwindCSS! The examples
                        were very helpful.</p>
                </div>
            `;
        });
    });
}

function closeModal() {
    const modal = document.getElementById('postModal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }
}

// Close modal when clicking outside
document.getElementById('postModal')?.addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
})



// Filter posts by category
const filterCategory = (id) => {
    const buttons = document.querySelectorAll("#categoryButtons button");
    console.log(buttons);

    // Reset all buttons to inactive state
    buttons.forEach(button => {
        button.classList.remove(
            "bg-purple-600", "text-white", "shadow-lg", "shadow-purple-200"
        );
        button.classList.add(
            "bg-gray-100", "text-gray-600", "hover:bg-purple-600", "hover:text-white",
            "hover:shadow-lg", "hover:shadow-purple-200"
        );
    });

    // Find and activate the clicked button
    const activeButton = [...buttons].find(button => button.getAttribute('data-id') == id);

    console.log(activeButton);
    
    if (activeButton) {
        activeButton.classList.remove(
            "bg-gray-100", "text-gray-600", "hover:bg-purple-600", "hover:text-white",
            "hover:shadow-lg", "hover:shadow-purple-200"
        );
        activeButton.classList.add(
            "bg-purple-600", "text-white", "shadow-lg", "shadow-purple-200"
        );
    }


    //filter posts when id is 0, show all posts
    if(id>0){
        fetch(
            `https://basic-blog.teamrabbil.com/api/post-list/${id}`
        )
        .then((response) => response.json())
        .then((data)=>{
            const posts = document.getElementById('postCards');
            const createPromises = data.map((el) => getCategoryName(el.category_id)); //make promises for each category
        
            posts.innerHTML = '';
    
            Promise.all(createPromises).then((category) => {
                data.forEach((el, index) => {
                    const date = new Date(el.updated_at);
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

                    posts.innerHTML += 
                    `
                    <article
                        class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                        <div class="relative overflow-hidden">
                            <img src="${el.img}" alt="Post Title"
                                class="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300">
                            <div class="absolute top-4 left-4">
                                <span
                                    class="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-purple-600 text-sm font-semibold">
                                    ${category[index]}
                                </span>
                            </div>
                        </div>
                        <div class="p-6">
                            <h3
                                class="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                                ${el.title}
                            </h3>
                            <p class="text-gray-600 mb-4 line-clamp-2">
                                ${el.short}
                            </p>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">${formattedDate}</span>
                                <button onclick="openModal(${el.id})"
                                    class="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-2 transition-colors">
                                    Read more →
                                </button>
                            </div>
                        </div>
                    </article>
                    `;
                });
            });
        });
    }
};


// Fetch and display categories
fetch(
    "https://basic-blog.teamrabbil.com/api/post-categories"
)
.then((response) => response.json())
.then((data) => {
    const category = document.getElementById('categoryButtons');
    data.forEach((el) => {
        

        // create buttons for each category
        const button = document.createElement('button');
        button.innerText = el.name;
        button.setAttribute('data-id', el.id);

        button.classList.add(
            "px-4", 
            "py-2",
            "rounded-xl",
            "bg-gray-100",
            "text-gray-600",
            "hover:bg-purple-600",
            "hover:text-white",
            "hover:shadow-lg",
            "hover:shadow-purple-200",
            "transition-all",
            "text-sm",
            "sm:text-base",
            "whitespace-nowrap"
        );

        
        button.addEventListener('click', () => {
            filterCategory(el.id);
        });
        category.appendChild(button);
    });
});


// Find the category name by id
const getCategoryName = (id) => {
    return fetch(
        "https://basic-blog.teamrabbil.com/api/post-categories"
    )
    .then((response) => response.json())
    .then((data) => {
        const category = data.find((el) => el.id === id);
        return category ? category.name : null;
    });
};

// Fetch and display newest posts
const newestPosts = () => {
    filterCategory(0);

    fetch(
        "https://basic-blog.teamrabbil.com/api/post-newest"
    )
    .then((response) => response.json())
    .then((data) => {   
        const posts = document.getElementById('postCards');
        const createPromises = data.map((el) => getCategoryName(el.category_id)); //make promises for each category
        
        posts.innerHTML = '';
    
        Promise.all(createPromises).then((category) => {
            data.forEach((el, index) => {
                const date = new Date(el.updated_at);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

                posts.innerHTML += 
                `
                <article
                    class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                    <div class="relative overflow-hidden">
                        <img src="${el.img}" alt="Post Title"
                            class="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300">
                        <div class="absolute top-4 left-4">
                            <span
                                class="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-purple-600 text-sm font-semibold">
                                ${category[index]}
                            </span>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3
                            class="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                            ${el.title}
                        </h3>
                        <p class="text-gray-600 mb-4 line-clamp-2">
                            ${el.short}
                        </p>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">${formattedDate}</span>
                            <button onclick="openModal(${el.id})"
                                class="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-2 transition-colors">
                                Read more →
                            </button>
                        </div>
                    </div>
                </article>
                `;
            });
        });
    });
};   
// Initial call to fetch and display posts
newestPosts();

