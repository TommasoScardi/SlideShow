//Path and file were find the images
const URLprefix = 'resources/images/';
const JSONfileName = '_free';
//Navbar
const SlideShow = document.getElementById('slideshow-container');
const SlideEdit = document.getElementById('slideedit-container');
const MenuElement_View = 0;
const MenuElement_Edit = 1;
const SlideshowMenu_View = document.querySelectorAll('.slideshow-menu')[MenuElement_View];
const SlideshowMenu_Edit = document.querySelectorAll('.slideshow-menu')[MenuElement_Edit];

SlideshowMenu_View.addEventListener('click', () => {
    SlideshowMenu_Edit.classList.remove('bg-primary');
    SlideshowMenu_Edit.classList.add('bg-secondary');
    SlideshowMenu_Edit.classList.remove('bg-opacity-75');
    SlideshowMenu_Edit.classList.add('bg-opacity-50');
    SlideshowMenu_View.classList.remove('bg-secondary');
    SlideshowMenu_View.classList.add('bg-primary');
    SlideshowMenu_View.classList.remove('bg-opacity-50');
    SlideshowMenu_View.classList.add('bg-opacity-75');

    SlideShow.classList.remove('visually-hidden');
    SlideEdit.classList.add('visually-hidden');

    LoadJSONImageFile(JSONfileName);
});

SlideshowMenu_Edit.addEventListener('click', () => {
    SlideshowMenu_View.classList.remove('bg-primary');
    SlideshowMenu_View.classList.add('bg-secondary');
    SlideshowMenu_View.classList.remove('bg-opacity-75');
    SlideshowMenu_View.classList.add('bg-opacity-50');
    SlideshowMenu_Edit.classList.remove('bg-secondary');
    SlideshowMenu_Edit.classList.add('bg-primary');
    SlideshowMenu_Edit.classList.remove('bg-opacity-50');
    SlideshowMenu_Edit.classList.add('bg-opacity-75');

    SlideEdit.classList.remove('visually-hidden');
    SlideShow.classList.add('visually-hidden');

    PopulateEditPreview();
});

function download(content, fileName, contentType) { //"application/json"
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

//View Slideshow
var OBJ_JSON_IMAGES;
var OBJ_JSON_IMAGES_EDIT; //Variabile per la sezione edit
var currentImage = 0;
var minImage = 0;
var imageLength;

const SlideShowImage = document.getElementById('slideshow-image');
const SlideShowControlPrev = document.getElementById('slideshow-left');
const SlideShowControlNext = document.getElementById('slideshow-right');

function LoadJSONImageFile(strNameFile)
{
    let client = new XMLHttpRequest();
    client.open('GET', 'resources/images/'+strNameFile+'.json');
    client.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            OBJ_JSON_IMAGES = JSON.parse(this.responseText);
            OBJ_JSON_IMAGES_EDIT = JSON.parse(this.responseText);
            if (OBJ_JSON_IMAGES.images.length > 0)
            {
                imageLength = parseInt(OBJ_JSON_IMAGES.images.length); // il -1 serve per ottenere l'ultimo elemento e nun la grandezza dell array
                LoadImage(currentImage);
                console.log(OBJ_JSON_IMAGES);
                console.log(imageLength);
            }
            else
                console.log('No img in '+strNameFile+'.json');
        }
    }
    client.send();
}

function LoadImage(indexImageLoad)
{
    document.getElementById('slideshow-image-container').src = URLprefix + OBJ_JSON_IMAGES.images[indexImageLoad].path;
    document.getElementById('slideshow-image-container').alt = OBJ_JSON_IMAGES.images[indexImageLoad].caption;
    document.getElementById('slideshow-image-caption').innerText = OBJ_JSON_IMAGES.images[indexImageLoad].caption;
}

function ImagePrev()
{
    if (imageLength != undefined)
    {
        if (currentImage > minImage)
            currentImage--;
        else
            currentImage = imageLength - 1;
    }
    else
        console.log('immagini non caricate, no PREV');
}

function ImageNext()
{
    if (imageLength != undefined)
    {
        if (currentImage < imageLength - 1)
            currentImage++;
        else
            currentImage = minImage;
    }
    else
        console.log('immagini non caricate, no NEXT');
}

window.addEventListener('load', () => {
    LoadJSONImageFile(JSONfileName);
});

SlideShowImage.addEventListener('click', () => {
    SlideShowImage.classList.toggle('active');
});

SlideShowControlPrev.addEventListener('click', () => {
    ImagePrev();
    LoadImage(currentImage);
    console.log(currentImage);
});

SlideShowControlNext.addEventListener('click', () => {
    ImageNext();
    LoadImage(currentImage);
    console.log(currentImage);
});

//Edit Slideshow
//OBJ_JSON_IMAGES_EDIT viene definita vicino a OBJ_JSON_IMAGES
const EditImgPreview = document.getElementById('slideedit-imgpreview');
const EditCodePreview = document.getElementById('slideedit-codepreview');
const EditSelectFile = document.getElementById('slideedit-selectfile');
const EditUploadFile = document.getElementById('slideedit-uploadfile');
const EditApplyChanges = document.getElementById('slideedit-applychanges');
const ExtensionImgOk = ['.jpg', '.jpeg', '.png'];

function ClickTrashEvent(e)
{
    let idCallerFunction = e.target.id;
    let indexCaller = idCallerFunction.substring(idCallerFunction.indexOf('trash-') + 'trash-'.length, idCallerFunction.indexOf('-id'));
    console.log(e);
    console.log(indexCaller);

    OBJ_JSON_IMAGES_EDIT.images.forEach((item, index, arr) => {
        if (index == indexCaller)
        {
            OBJ_JSON_IMAGES_EDIT.images.splice(index, 1);
            return;
        }
    });

    PopulateEditPreview();
}

function ClickCaptionEvent(e)
{
    let idCallerFunction = e.target.id;
    let indexCaller = idCallerFunction.substring(idCallerFunction.indexOf('caption-') + 'caption-'.length, idCallerFunction.indexOf('-id'));
    console.log(e);
    console.log(indexCaller);

    const captionContainer = document.getElementById('caption-'+indexCaller+'-id');
    const captionContainerCaption = captionContainer.innerText;
    captionContainer.innerHTML = '<input type="text" id="edit-'+indexCaller+'-id" value ="'+captionContainerCaption+'">';
    document.getElementById('edit-'+indexCaller+'-id').addEventListener('blur', BlurCaptionEvent);
    document.getElementById('caption-'+indexCaller+'-id').removeEventListener('click', ClickCaptionEvent);
}

function BlurCaptionEvent(e)
{
    let idCallerFunction = e.target.id;
    let indexCaller = idCallerFunction.substring(idCallerFunction.indexOf('edit-') + 'edit-'.length, idCallerFunction.indexOf('-id'));
    console.log(e);
    console.log(indexCaller);

    const captionContainer = document.getElementById('caption-'+indexCaller+'-id');
    const captionContainerCaption = document.getElementById('edit-'+indexCaller+'-id').value;
    OBJ_JSON_IMAGES_EDIT.images.forEach((item, index, arr) => {
        if (index == indexCaller)
        {
            OBJ_JSON_IMAGES_EDIT.images[index].caption = captionContainerCaption;
            return;
        }
    });
    document.getElementById('edit-'+indexCaller+'-id').removeEventListener('blur', BlurCaptionEvent);
    document.getElementById('caption-'+indexCaller+'-id').addEventListener('click', ClickCaptionEvent);
    captionContainer.innerHTML = '';
    captionContainer.innerText = captionContainerCaption;

    PopulateEditPreview();
}

function PopulateEditPreview()
{
    console.log(OBJ_JSON_IMAGES);
    console.log(OBJ_JSON_IMAGES_EDIT);
    //Image Preview Section
    EditImgPreview.innerHTML = '<span>Image Preview: Image | imageNumber) | caption</span>';
    OBJ_JSON_IMAGES_EDIT.images.forEach((item, index, arr) => {
        let assembler = '<div class="row align-items-center border border-secondary rounded-2 h-auto my-2 py-2"> <div class="col-4 img-preview"> <a href="#top"> <img src="'+ URLprefix + item.path +'" alt="" class="w-100 rounded"> </a> </div> <div class="col-8 border-start border-secondary"> <div id="text-'+index+'-id"> <span>'+index+'</span>) <span id="caption-'+index+'-id" class="text-preview">'+item.caption+'</span> </div> <div class="text-end"> <i id="trash-'+index+'-id" class="fa fa-trash rounded" aria-hidden="true"></i> </div> </div> </div>';
        EditImgPreview.innerHTML += assembler;
    });

    OBJ_JSON_IMAGES_EDIT.images.forEach((item, index, arr) => {
        document.getElementById('trash-'+index+'-id').addEventListener('click', ClickTrashEvent);
        document.getElementById('caption-'+index+'-id').addEventListener('click', ClickCaptionEvent);
    });

    document.querySelectorAll('.img-preview').forEach(popup => popup.addEventListener('click', () => {
        popup.classList.toggle('active');
    }));
    //Code Preview Section
    EditCodePreview.innerText = JSON.stringify(OBJ_JSON_IMAGES_EDIT);
    //Apply Chainges
    EditUploadFile.addEventListener('click', UploadNewPictures);
    EditApplyChanges.addEventListener('click', ApplyChanges);
}

function UploadNewPictures()
{
    if (EditSelectFile.files.length > 0)
    {
        let extOk = true;
        Object.values(EditSelectFile.files).forEach((item, index, arr) => {
            let extPos = item.name.lastIndexOf('.');
            if (extPos > 0)
            {
                let extName = item.name.substring(extPos, item.name.length);
                if (extName == ExtensionImgOk[0] || extName == ExtensionImgOk[1] || extName == ExtensionImgOk[2])
                    return;
                else
                {
                    extOk = false;
                    return;
                }
            }
            else
            {
                extOk = false;
                return;
            }
        });

        if (extOk)
        {
            // console.log(OBJ_JSON_IMAGES);
            Object.values(EditSelectFile.files).forEach((item, index, arr) => {
                let jsonObjImg = {path: item.name, caption: "caption"}
                OBJ_JSON_IMAGES_EDIT.images.push(jsonObjImg);
            });
            // console.log(OBJ_JSON_IMAGES);
            PopulateEditPreview();
        }
        else
            alert('Errore: uno o piu file selezionati presenta un problema sull estensione!');
    }
    else
        alert('Seleziona Prima le immagini!');
}

function ApplyChanges()
{
    if (OBJ_JSON_IMAGES_EDIT != undefined)
    {
        alert('Nuovo file JSON in arrivo!, ATTENZIONE: è necessario sovrascrivere il file con nome -> '+JSONfileName);
        download(JSON.stringify(OBJ_JSON_IMAGES_EDIT), JSONfileName+'.json', 'application/json');
    }
    else
        alert('Nessuna Immagine!');
}