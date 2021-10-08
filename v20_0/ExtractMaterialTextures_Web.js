if (typeof ExtractMaterialTextures == 'undefined')
{
    ExtractMaterialTextures = {};
}

// define all image types that can be associated with a Material
var imgTypesArray = ["Texture","Bump","Cutout"];

ExtractMaterialTextures.createPlaceholderImages = function()
{
    // create a placeholder image and label for each type
    //console.log("Creating placeholder images and labels");

    function createPlaceholderHTMLElements(type) {
        var label = document.createElement('p');
        label.id = type + "Label";
        label.className = "textureLabel";
        var textNode = document.createTextNode(type + ":");
        label.appendChild(textNode);
        window.document.body.appendChild(label);

        var img = document.createElement('img');
        img.id = type + "Image";
        window.document.body.appendChild(img);
        img.src = 'img/placeholder.png';
    }

    imgTypesArray.forEach(createPlaceholderHTMLElements);
};

// Submit runs from the HTML page.  This script gets loaded up in both FormIt's
// JS engine and also in the embedded web JS engine inside the panel.
ExtractMaterialTextures.submit = function()
{
    // args, even empty, required for the callMethod invocation
    var args = {};

    var updateImage = function(bitmapDataArray)
    {
        // this array turned into a string, so parse it back into an array
        bitmapDataArray = JSON.parse(bitmapDataArray);
        
        // for each of the items in the array, update the associated HTML image
        for (var i = 0; i < imgTypesArray.length; i++) {

            console.log("Checking image for " + imgTypesArray[i]);
            var img = document.getElementById(imgTypesArray[i] + "Image");
            if ((bitmapDataArray[i] === "undefined") || bitmapDataArray === "undefined")
            {
                console.log("No image found for " + imgTypesArray[i]);
                img.src = 'img/noImage.png';
            } else {
                console.log("Drawing new bitmap data for " + imgTypesArray[i]);
                var evalBitmapData = eval(bitmapDataArray[i]);
                var data = new Uint8Array(evalBitmapData);
                var blob = new Blob([data], {type: 'image/bmp'});
                var imgURL = URL.createObjectURL(blob);
                img.src = imgURL;
            }
        }
    }

    // NOTE: window.FormItInterface.CallMethod will call the function
    // defined above with the given args. This is needed to communicate
    // between the web JS engine process and the FormIt process.
    FormItInterface.CallMethod("ExtractMaterialTextures.execute", args, updateImage);
}
