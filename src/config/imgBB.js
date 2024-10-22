async function uploadImgBB(files) {
  const apiKey = "a393ae4d99828767ecd403ef4539e170";
  
  // Chuyển đổi FileList hoặc bất kỳ đối tượng tương tự mảng nào thành mảng thực sự
  const filesArray = Array.isArray(files) ? files : Array.from(files);
  
  const uploadPromises = filesArray.map((file) => {
    const formData = new FormData();
    formData.append("image", file);

    return fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json()) 
      .then((data) => data.data.url)
      .catch((error) => {
        console.log("Upload error:", error);
        return null;
      });
  });

  return Promise.all(uploadPromises);
}

export default uploadImgBB;
