const text = [
    [
        'Do You Love Coffee?',
        'Well, you\'re in the right place!',
    ],
    [
        'Do You Want to Learn How to Make',
        'Cappuchino?',
    ],
    [
        'Mocha? And More?',
        'We got you covered!',
    ],
]

function imgScale(translateY) {
    // console.log('translateY', translateY);
    let selected_index = 0; // first section default
    if (translateY === -33.34) {
        // second section
        selected_index = 1;
    } else if (translateY === -66.68) {
        // third section
        selected_index = 2;
    }

    // console.log('selected_index', selected_index);

    const images = document.getElementsByClassName('img-scale');
    for (let i = 0; i < images.length; i++) {
        if (i === selected_index) {
            images[i].style.transform = 'scale(1)';
        } else {
            images[i].style.transform = 'scale(1.3)';
        }
    }
}

function pallaxEffectOnText(translateY) {
    let selected_index = 0; // first section default
    if (translateY === -33.34) {
        // second section
        selected_index = 1;
    } else if (translateY === -66.68) {
        // third section
        selected_index = 2;
    }

    const text_div = document.getElementsByClassName('text-div');
    if (text_div) {
        for (let i = 0; i < text_div.length; i++) {
            if (i === selected_index) {
                text_div[i].style.top = '50%';

                // after the top is set to 50%, do type writer effect
                typeWriterEffect(text_div[i], i);
            } else if (i === selected_index - 1)
                text_div[i].style.top = '30%';
            else if (i === selected_index + 1)
                text_div[i].style.top = '70%';
        }
    }
}

function typeWriterEffect(selected_element, index) {
    const texts = text[index];
    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        const delay = 1000 * (i + 1);
        const speed = 50;
        
        const childElement = selected_element.children[i];
        
        function typeWriter(element) {
            element.innerHTML = '';
            let j = 0;
            for (let i = 0; i < text.length; i++) {
                setTimeout(function() {
                    element.innerHTML += text.charAt(j);
                    j++;
                }, delay + speed * i);
            }
        }
        typeWriter(childElement);
    }
}

function getBackToTop() {
    const sections = document.getElementsByTagName('section');
    let sectionOnScreen = 0;
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
            sectionOnScreen = i;
        }
    }

    if (sectionOnScreen !== 0) {
        window.location.href = '/';
        return;
    }

    const main = document.getElementById('main');
    if (main) {
        main.style.transform = `translateY(0%)`;
    }

    imgScale(0);
    pallaxEffectOnText(0);
    scrollDownLottieOpacity(0);
}

function lottiefiles() {
    lottie.loadAnimation({
        container: document.querySelector('#lottie-container'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/static/lottiefiles/scroll-down-lottie-2.json',
    });
}

function scrollDownLottieOpacity(translateY) {
    let selected_index = 0; // first section default
    if (translateY === -33.34) {
        // second section
        selected_index = 1;
    } else if (translateY === -66.68) {
        // third section
        selected_index = 2;
    }

    const scrollDownLottie = document.getElementById('lottie-container');
    if (scrollDownLottie) {
        scrollDownLottie.style.display = 'block';
        scrollDownLottie.style.opacity = 0;
        if (selected_index !== 2) {
            setTimeout(function() {
                scrollDownLottie.style.opacity = 1;
            }, 3000);
        } else {
            scrollDownLottie.style.display = 'none';
            getStartedOpacity();
        }
    }
}

function getStartedOpacity() {
    const getStarted = document.getElementById('get-started');
    if (getStarted) {
        getStarted.style.opacity = 0;
        setTimeout(function() {
            getStarted.style.opacity = 1;
        }, 3000);
    }
}

$(document).ready(function () {

    getBackToTop();
    lottiefiles();

    let wheeling;
    let deltaY = 0;
    let translateY = 0;
    let prevTranslateY = 0;
    const MAX_TRANSLATE_Y = 0;
    const MIN_TRANSLATE_Y = -66.68;

    window.addEventListener("wheel", function(event) {

        if (event.deltaY < 0) {
            deltaY += event.deltaY;
        } else if (event.deltaY > 0) {
            deltaY += event.deltaY;
        }

        if (!wheeling) {
            // console.log('start wheeling!');

            // can make some transition here
            const main = document.getElementById('main');
            if (main) {
                if (deltaY > 0) {
                    // console.log('scrolling up');
                    translateY = Math.max(translateY - 33.34, MIN_TRANSLATE_Y);
                    main.style.transform = `translateY(${translateY}%)`
                } else if (deltaY < 0) {
                    // console.log('scrolling down');
                    translateY = Math.min(translateY + 33.34, MAX_TRANSLATE_Y);
                    main.style.transform = `translateY(${translateY}%)`
                }

                if (prevTranslateY !== translateY) {
                    pallaxEffectOnText(translateY);
                    scrollDownLottieOpacity(translateY);
                }
                prevTranslateY = translateY;
            }
        }

        this.clearTimeout(wheeling);
        wheeling = this.setTimeout(function() {
            // console.log('stop wheeling!');
            wheeling = undefined;
        
            deltaY = 0;

            imgScale(translateY);
        }, 100);
               
     }, false);
});