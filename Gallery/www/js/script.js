document.addEventListener("submit",(e)=>{
    e.preventDefault();
    const form = e.target;
    const descr = form.querySelector("input[name=description]");
    if (!descr) {
        throw "Data transfer error: input[name=description] not found";
    }
    const place = form.querySelector("input[name=place]");
    if (!place) {
        throw "Data transfer error: input[name=place] not found";
    } 
    const picture = form.querySelector("input[name=picture]");
    if (!picture) {
        throw "Data transfer error: input[name=picture] not found";
    }
    // TODO: data validation

    const formData = new FormData();
    formData.append("description", descr.value);
    // place optional, include if not empty
    if (place.value.length > 0) {
        formData.append("place", place.value);
    }
    formData.append("picture", picture.files[0]);


    // fetch("/api/picture?" + new URLSearchParams(formData).toString(), {
    //     method: "GET"
    // }).then(r=>r.text()).then(console.log);

    fetch("/api/picture?x=10&" + new URLSearchParams(formData).toString(), {
        method: "POST",
        body: formData  // new URLSearchParams(formData).toString()
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        let imgElement = document.createElement("img");
        imgElement.src = res.savedPictureUrl; // res.status;

        let galleryElement = document.querySelector("#gallery");
        galleryElement.append(imgElement);

        // let form = document.querySelector(".add-image-form");
        // form.reset();
        //alert("success");
    });
});

/* 
    В случае удачной загрузки изображения, вывести (добавить на страницу) 
    эту картинку и описание / место (если есть) + очистить форму.
    В случае неудачной - вывести (alert) и не очищать форму.
*/