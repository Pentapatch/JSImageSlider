// #######################
// ## Private functions ##
// #######################

var getVariable = function (variable) {
	let element = document.querySelector('.slide');
    let style = getComputedStyle(element);
    return style.getPropertyValue('--' + variable);
};

var setVariable = function (variable, value) {
	let element = document.querySelector('.slide');
    let style = getComputedStyle(element);
    style.setPropertyValue('--' + variable) = value;
};

var addElement = function (parent, type, className, index) {
	let child = document.createElement(type);
    child.className = className;
    if (index != null) child.setAttribute('index', index);;
    parent.appendChild(child);
    return child;
};

// ############
// ## Fields ##
// ############

const slides = document.getElementsByClassName('slide');
const slideArrowsMinOpacity = Number(getVariable("arrow-idle-opacity"));
const slideArrowsSize = getVariable("arrow-size");

// ###############
// ## Main code ##
// ###############

// Initial setup for each slide added to the document
Array.prototype.forEach.call(slides, function(slide) {
    // Inject a list and place the images inside li elements
    let images = slide.querySelectorAll('img');
    let list = document.createElement("ul");

    slide.appendChild(document.createComment("Code generated by Dennis Hankvist's image slide javascript"));

    for (let i = 0; i < images.length; i++) {
        let listItem = document.createElement("li");

        listItem.appendChild(images[i]);
        // let image = document.createElement("div");
        // image.className = "slide-image";
        // image.style.backgroundImage = "url(" + images[i].src + ")";

        // listItem.appendChild(image);
        list.appendChild(listItem);
        // images[i].remove();
    }

    slide.appendChild(list);

    // Add event listeners to the slide
    slide.addEventListener('click', function(event) {onSlideClick(slide, event)}, false);
    slide.addEventListener('mousemove', function(event) {onSlideHover(slide, event)}, false);
    slide.addEventListener('mouseleave', function(event) {onSlideMouseLeave(slide, event)}, false);
    slide.addEventListener('mouseenter', function(event) {onSlideMouseEnter(slide, event)}, false);
    
    // Add event listener to window
    window.addEventListener('resize', function(event) {onResize(slide, event)}, false);

    // Inject navigation arrow divs
    addElement(slide, "div", "slide-arrow");
    addElement(slide, "div", "slide-arrow slide-arrow-right");

    // Inject navigation expand/collapse div
    addElement(slide, "div", "slide-toggle-symbol");

    // Inject slide indicators
    let bar = addElement(slide, "div", "slide-nav-bar");
    for (let i = 0; i < images.length; i++) {
        let current = addElement(bar, "div", "slide-nav-indicator", i);
        if (images[i].classList.contains("slide-active")) current.classList.add("slide-nav-active");

        // Add event listener for click to the current navigation indicator
        current.addEventListener('click', function(event) {onNavClick(current, event)}, false);
    }

    // Inject overlay-logotype div
    addElement(slide, "div", "overlay-logotype");

    // Preload the images of that slide
    // preloadImages(slide);
});

// ######################
// ## Public functions ##
// ######################

function preloadImages(slide){
    let images = slide.querySelectorAll('img');

    // Not working as expected
    for (let i = 0; i < images.length; i++) {
        let img = new Image();
        img.src = images[i].src;
        images[i] = img;
        console.log(img);
    }
}

//TODO: [ ] Solve preloading
//TODO: [ ] display:none on images that are out of view?
//TODO: [X] Navigation arrows
//TODO: [X] Navigation display
//TODO: [X] Realign when resized
//TODO: [X] Auto-conversation to UL list via script
//          and auto-injection of other supporting elements
//TODO: [ ] Custom image offsets to be set in the html

function onNavClick(sender, e){
    let track = sender.parentElement.parentElement.querySelector('ul');

    // Set the slide position to the index of the clicked indicator
    setSlidePosition(track, false, sender.getAttribute("index"));

    // Stop the event from propagating to the slider
    e.stopPropagation();
}

function onResize(sender, e){
    Array.prototype.forEach.call(slides, function(slide) {
        let images = slide.querySelectorAll('img');
        let track = slide.querySelector('ul');
        var position = 0;

        // track.classList.add("slide-no-transition");
    
        // Find the next or previous image
        for (let i = 0; i < images.length; i++) {
            // Check if the current image is the active one
            if (images[i].className == 'slide-active') {            
                track.style.left = '-' + position + 'px';
                break;
            }
            else{
                // Increment the width of the image
                position += images[i].width;
            }
        }

        // track.classList.remove("slide-no-transition");
    });
}

function onSlideHover(sender, e){
    let x = e.clientX;
    let width = sender.offsetWidth;
    let f = x / width;

    let leftArrow = sender.querySelector(".slide-arrow");
    let rightArrow = sender.querySelector(".slide-arrow.slide-arrow-right");
    let expand = sender.querySelector(".slide-toggle-symbol");
    let expanded = sender.classList.contains("slide-expanded");

    let maxAddOpacity = 1 - slideArrowsMinOpacity;

    let opacity = 0;
    if (x < width / 2){
        opacity = slideArrowsMinOpacity + (maxAddOpacity * ((0.5 - f) * 2));
        leftArrow.style.opacity = opacity;
        rightArrow.style.opacity = 0.1;
        leftArrow.style.transition = "";
        if (!expanded) expand.style.opacity = (1 - (0.5 - f) * 2);
    }
    else{
        opacity = slideArrowsMinOpacity + (maxAddOpacity * (1 - (1 - f) * 2));
        rightArrow.style.opacity = opacity;
        leftArrow.style.opacity = 0.1;
        if (!expanded) expand.style.opacity = ((1 - f) * 2);
    }
}

function onSlideMouseLeave(sender, e){
    let leftArrow = sender.querySelector(".slide-arrow");
    let rightArrow = sender.querySelector(".slide-arrow.slide-arrow-right");
    let expand = sender.querySelector(".slide-toggle-symbol");

    // Reset arrow opacity
    leftArrow.style.opacity = slideArrowsMinOpacity;
    rightArrow.style.opacity = slideArrowsMinOpacity;
    expand.style.opacity = 0;

    // Remove the no-transition rule
    leftArrow.classList.remove("slide-no-transition");
    rightArrow.classList.remove("slide-no-transition");
    sender.querySelector(".slide-toggle-symbol").classList.remove("slide-no-transition");

    // Deactivate the navigation bar
    sender.querySelector(".slide-nav-bar").classList.remove("slide-nav-bar-active");
}

function onSlideMouseEnter(sender, e){
    // Prevent the opacity transition from occuring since we are controlling it manually
    sender.querySelector(".slide-arrow").classList.add("slide-no-transition");
    sender.querySelector(".slide-arrow.slide-arrow-right").classList.add("slide-no-transition");
    sender.querySelector(".slide-toggle-symbol").classList.add("slide-no-transition");

    // Activate the navigation bar
    sender.querySelector(".slide-nav-bar").classList.add("slide-nav-bar-active");
}

function onSlideClick(sender, e){
    let width = sender.offsetWidth;
    let track = sender.querySelector('ul');

    if (e.clientX < width / 5){
        setSlidePosition(track, false);
    }
    else if (e.clientX >= width - (width / 5)){
        setSlidePosition(track, true);
    }
    else{
        toggleExpand(sender, e);
    }

}

function setSlidePosition(track, next, index){
    let images = track.parentElement.querySelectorAll('img');

    var position = 0;
    
    // Remove the active navigation indicator class
    let indicators = track.parentElement.querySelectorAll(".slide-nav-indicator");
    track.parentElement.querySelector(".slide-nav-active").classList.remove("slide-nav-active");

    // Find the next or previous image
    for (let i = 0; i < images.length; i++) {
        // Increment the width of the image
        position += images[i].width;

        // Check if the current image is the active one
        if (index != null){
            if (i == index){
                track.querySelector(".slide-active").classList.remove("slide-active");
                images[i].classList.add('slide-active');
                indicators[i].classList.add("slide-nav-active");
                position -= images[i].width;
                track.style.left = '-' + position + 'px';
                return;
            }
        }    
        else if (images[i].className == 'slide-active') {        
            if (next){
                if (i + 1 < images.length){
                    images[i + 1].classList.add('slide-active');
                    indicators[i + 1].classList.add("slide-nav-active");
                }
                else{
                    return;
                }
            }
            else{
                if (i - 1 >= 0) {
                    images[i - 1].classList.add('slide-active');
                    indicators[i - 1].classList.add("slide-nav-active");
                    position -= images[i].width;
                    position -= images[i - 1].width;
                }
                else{
                    return;
                }
            }

            images[i].classList.remove('slide-active');
            
            track.style.left = '-' + position + 'px';
            break;
        }
    }
}

function toggleExpand(sender, e){
    if (!sender.classList.contains("slide-expanded")){
        // Expand
        sender.classList.add('slide-expanded');
        sender.querySelector(".overlay-logotype").classList.add("overlay-logotype-show");
        sender.querySelector(".slide-toggle-symbol").classList.add("slide-toggle-close");
        sender.querySelector(".slide-toggle-symbol").classList.remove("slide-no-transition");
        sender.querySelector(".slide-toggle-symbol").style.opacity = 0;
        sender.querySelector(".slide-nav-bar").classList.add("slide-nav-bar-hide");
    }
    else{
        // Collapse
        sender.classList.remove('slide-expanded'); 
        sender.querySelector(".overlay-logotype").classList.remove("overlay-logotype-show");
        sender.querySelector(".slide-toggle-symbol").classList.remove("slide-toggle-close");
        sender.querySelector(".slide-toggle-symbol").classList.add("slide-no-transition");
        sender.querySelector(".slide-nav-bar").classList.remove("slide-nav-bar-hide");
        onSlideHover(sender, e); // Set the opacity of expand button
    }
}

function wiggle(element, amount){
    let track = element.querySelector('ul');
    let position = track.getBoundingClientRect().left;
    
    track.style.left = position - amount + 'px';

    setTimeout(function() {
        track.style.left = position + amount + 'px';

        setTimeout(function() {
            track.style.left = position + 'px';
        }, 200);

    }, 200);
}