
// Переменные
const slider = document.querySelector('.slider__container');
const sliderImages = document.querySelectorAll('.slider__img');
const sliderblock = document.querySelector('.slider__block');

        
let sliderCount = 0;
let sliderWidth = slider.offsetWidth;

// Автоматическое перелистывание слайдов
setInterval(() => {
    nextSlide()
}, 5000);

function nextSlide() {
    sliderCount++;
    
    if (sliderCount >= sliderImages.length) {
        sliderCount = 0;
    }
    rollSlider();
}

function prevSlide() {
    sliderCount--;
    
    if (sliderCount < 0) {
        sliderCount = sliderImages.length -1;
    }
    rollSlider();
}

function rollSlider() {
    sliderblock.style.transform = `translateX(${-sliderCount * sliderWidth}px)`;
}