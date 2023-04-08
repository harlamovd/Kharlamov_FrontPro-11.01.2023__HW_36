// Задание № 1
// логика такая, что при нажатии на Registration появляеться окно на сером фоне, с соглашением о конфиденцыальности
// если не принимать оно закроеться, если принять то прогрузиться форма для записи на консультацию. кнопка Submit form
// также закрывает окно, но по идеи отправляет форму, я не углублял логику.
// Закрытие окна работает путем удаления его разметки HTML, Лисенер работает по всплытию.

const buttonRegistration = document.querySelector('.offer__button');
buttonRegistration.addEventListener('click', creatingAgreementWindow )

function creatingAgreementWindow () {
    const agreementWindow = `
        <div class="wrapper">
        <div class="background"> </div>
        <div class="agreement">
        <h4 class="agreement__title"> Privacy agreement </h4>
        <p class="agreement__desc"> You undertake not to disclose any information that becomes known to you during 
            the consultation process.</p>
        <div class="agreement__wrapper_button">
            <button class="agreement__button button_disagree"> DISAGREE </button>
            <button class="agreement__button button_agree">AGREE</button>
        </div></div>`
    document.body.insertAdjacentHTML('beforeend', agreementWindow);
    let backgroundBlock = document.querySelector('.wrapper')
    backgroundBlock.addEventListener('click', listenerAgreementWindow)
}
function listenerAgreementWindow (event) {
    const targetClass = Array.from(event.target.classList);
    if (targetClass.includes("background") || targetClass.includes("button_disagree")) {
        document.body.removeChild(document.querySelector('.wrapper'))
    } else if (targetClass.includes('button_agree')){
        const agreementWrapper = document.querySelector('.agreement');
        agreementWrapper.innerHTML = '';
        creatingForm(agreementWrapper);
    }
}

function creatingForm (node){
    const agreementForm = `<label class="form__label"> Name <input  class="form__input" type="text"> </label>
    <label class="form__label">Phone<input  class="form__input" type="tel"></label>
    <label class="form__label">E-mail<input class="form__input" type="email"></label>
    <button class="agreement__button form__button">Submit form</button>`
    node.classList.add('agreement__form')
    node.insertAdjacentHTML('beforeend', agreementForm);
    document.querySelector('.form__button').addEventListener('click', ()=>{
        document.body.removeChild(document.querySelector('.wrapper'));
    })
}

// Задача № 2
// Тут я нгемного помучался, так как addEventListener по 'scroll' задваивает, и пришлось делать костыль в виде стопора brakeScroll
// на повторное сробатывание addEventListener по 'scroll'.
// Если убрать brakeScroll то карточки не будут прогружаться порцыями по 8 штур, а будут крузиться в зависимости от
// рескости прокрутки колеса скрола, так как  Listener с необходимыми условиями будет вызываться несколько раз
// и запускать дополнительную генерацию карточек карточек
//_____________________________
const scrollWrapper = document.querySelector('.scroll_wrapper');
let indexArr = scrollWrapper.dataset.indexArr;
let brakeScroll = scrollWrapper.dataset.typeArr = true;  // вот этот костыль
async function getData() {
    const url = 'https://jsonplaceholder.typicode.com/posts'
    try {
        const request = await fetch(url);
        if (!request.ok) {
            throw new Error('Error:  '+ request.status);
        }
        const data = await request.json();
        return data;
    }
    catch (e) {
        console.log(e);
    }
}
async function creatingScrollBlock () {
    let arr = await getData();
    let res = '';
    if (!indexArr) {
        arr.forEach((el, ind) => {
            if (ind < 12) {
                res += `<div class="scroll_wrapper__card"> <h3> ${el.title} </h3> <p> ${el.body} </p> <p> ${el.id}</p></div>`;
                indexArr = ind;
            }
        })
    } else {
        const step = indexArr;
        arr.forEach((el, ind) => {
            if (ind > step && ind < step + 9) {
                res += `<div class="scroll_wrapper__card"> <h3> ${el.title} </h3> <p> ${el.body} </p> <p> ${el.id}</p></div>`;
                indexArr = ind;
            }
        })
        brakeScroll = true  // тут мы изменяем его статус что бы показать, что загруска закончена, и Listener может опять работать
    }
    document.querySelector('.scroll_wrapper').insertAdjacentHTML('beforeend', res);
}
window.addEventListener('scroll', () => {
    const bottom =document.documentElement.getBoundingClientRect();
    if (bottom.bottom < document.documentElement.clientHeight + 100 &&
        brakeScroll /*тут я проверяю на стопор чтобы Listener не вызыввал функцыю пока не прогрузяться новые карточкуи*/) {
        brakeScroll = false  // тут я изменяю стопор что бы Listener не вызыввал функцыю пока не прогрузяться новые карточкуи*/
        creatingScrollBlock();
    }
})
creatingScrollBlock();