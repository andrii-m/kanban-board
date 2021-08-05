let i = 0;

let data = [];

import dragula from 'dragula';

let drakeColum = new dragula({
  invalid: function (el) {
    return el.classList.contains('edit-card');
  }
});

drakeColum.on('over', () => {
  document.body.style.cursor = "auto"
})
drakeColum.on('drag', () => {
  document.body.style.cursor = "grabbing"
})
drakeColum.on('drop', (event) => {
  console.log(event);
})

class KanbanCard {
  constructor(colum, idCard, textCard) {
    this.colum = colum;
    this.idCard = idCard;
    this.textCard = textCard;

    this.card = this.createCard();
  }
  createCard() {
    let card = document.createRange().createContextualFragment(
      `<div class="colum-card">
        <span class="fi-rr-trash colum-card-trash"></span>
        <div class="colum-card-text-target"></div>
        <textarea rows="1" class="colum-card-text"></textarea>
      </div>`
    ).firstChild;

    card.idCard = this.idCard;


    let textTarget = card.querySelector('.colum-card-text-target');
    let cardText = card.querySelector('.colum-card-text');
    let cardTrash = card.querySelector('.colum-card-trash');

    cardText.value = this.textCard;

    function cardTextHeight() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight > 32 ? this.scrollHeight : 32) + 'px';
      this.style.overflow = 'hidden';
    }

    cardText.addEventListener('input', cardTextHeight);

    cardText.addEventListener('change', (event) => {
      this.editTextCard.bind(this, event.target.value)()
    });

    textTarget.addEventListener('click', () => {
      card.classList.add('edit-card');
      cardText.focus();
    })

    cardText.addEventListener('keydown', (event) => {
      if (event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault();
        card.classList.remove('edit-card');
        this.editTextCard.bind(this, event.target.value)();
        event.target.blur();
      }
    });

    window.addEventListener('mousedown', (event) => {
      if (event.target.closest('.colum-card-text') != cardText) {
        card.classList.remove('edit-card');
        cardText.blur();
      }
    }) 

    cardTrash.onclick = this.removeCard.bind(this);

    // this.colum = card.closest('.colum');
    // this.saveDataCard([].indexOf.call(card.parentNode.children, card));

    this.colum.append(card);
    cardTextHeight.bind(cardText)();

    return card;
  }

  editTextCard(newText) {
    let cardText = this.card.querySelector('.colum-card-text');
    let value = newText.trim();
    if (newText) {
      this.textCard = value;
      cardText.value = value;
    } else {
      cardText.value = this.textCard;
    }

    cardText.style.height = 'auto';
    cardText.style.height = (cardText.scrollHeight > 32 ? cardText.scrollHeight : 32) + 'px';
    cardText.style.overflow = 'hidden';
  }

  saveDataCard(index = -1) {
    console.log(index);
  }

  delDataCard() {
    console.log(132);
  }

  removeCard() {
    this.card.remove();
    this.delDataCard();
  }

}



class KanbanColum {
  constructor(kanban, idColum, nameColum) {
    this.kanban = kanban;
    this.idColum = idColum;
    this.nameColum = nameColum;

    this.colum = this.createColum();
  }

  createColum() {
    let colum = document.createRange().createContextualFragment(
      `<div class="colum-wrapper">
        <div class="colum">
          <div class="colum-header">
            <span class="fi-rr-cross-small colum-trash"></span>
            <textarea rows="1" class="colum-header-name" dir="auto" maxlength="512"></textarea>          
          </div>

          <div class="colum-cards"></div>

          <div class="card-composer">

          <div class="card-composer-wrapper">
            <div class="card-composer-write">
              <textarea rows="3" class="card-composer-textarea" placeholder="Ввести заголовок для этой карточки"></textarea>
            </div>
            <div class="card-composer-controls">
              <input class="button button--primary submit-composer" type="submit" value="Добавить карточку">
              <span class="fi-rr-cross icon-close composer-close"></span>
            </div>
          </div>

          <div class="open-card-composer">
            <span class="fi-rr-plus composer-icon-add"></span>
            Добавить карточку
          </div>

        </div>

        </div>
      </div>`
    ).firstChild;

    colum.idColum = this.idColum;

    let headerName = colum.querySelector('.colum-header-name');
    let columTrash = colum.querySelector('.colum-trash');

    headerName.value = this.nameColum;

    function headerNameHeight() {
      this.style.height = 'auto';
      if (this.scrollHeight < 250) {
        this.style.height = (this.scrollHeight > 28 ? this.scrollHeight : 28) + 'px';
        this.style.overflow = 'hidden';
      } else {
        this.style.height = '250px';
        this.style.overflowY = 'scroll';
      }
    }

    headerName.addEventListener('input', headerNameHeight);
    headerName.addEventListener('change', (event) => {
      this.renameColum.bind(this, event.target.value)()
    });
    headerName.addEventListener('keydown', (event) => {
      if (event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault();
        this.renameColum.bind(this, event.target.value)()
        event.target.blur();
      }
    });

    columTrash.addEventListener('click', () => {
      this.removeColum();
    });

    let cardComposer = colum.querySelector('.card-composer');
    let openCardComposer = cardComposer.querySelector('.open-card-composer');
    let cardComposerTextarea = cardComposer.querySelector('.card-composer-textarea');
    let submitComposer = cardComposer.querySelector('.submit-composer');
    let composerClose = cardComposer.querySelector('.composer-close');    

    openCardComposer.addEventListener('click', (event) => {
      cardComposer.classList.add('show-composer');
      cardComposerTextarea.focus();
    });
    window.addEventListener('mousedown', event => {
      if (event.target.closest('.card-composer') != cardComposer) {
        cardComposer.classList.remove('show-composer');
      }
    })


    function composerTextareaHeight() {
      cardComposerTextarea.style.height = 'auto';
      if (cardComposerTextarea.scrollHeight < 250) {
        cardComposerTextarea.style.height = (cardComposerTextarea.scrollHeight > 60 ? cardComposerTextarea.scrollHeight : 60) + 'px';
        cardComposerTextarea.style.overflow = 'hidden';
      } else {
        cardComposerTextarea.style.height = '250px';
        cardComposerTextarea.style.overflowY = 'scroll';
      }
    }

    cardComposerTextarea.addEventListener('input', composerTextareaHeight);

    function createNewCard() {
      let textareaValue = cardComposerTextarea.value;
      if (textareaValue.trim()) {
        this.createCard(textareaValue);
        cardComposerTextarea.value = '';
      }
      cardComposerTextarea.focus();
      composerTextareaHeight();
    }

    submitComposer.addEventListener('click', (event) => {
      event.preventDefault();
      createNewCard.bind(this)();
    });

    cardComposerTextarea.addEventListener('keydown', (event) => {
      if (event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault();
        createNewCard.bind(this)();
      }
    });

    composerClose.addEventListener('click', (event) => {
      event.preventDefault();
      cardComposer.classList.remove('show-composer');
    })

    //////////////////////

    drakeColum.containers.push(colum.querySelector('.colum-cards'));
    this.kanban.insertBefore(colum, this.kanban.lastElementChild);
    headerNameHeight.bind(headerName)();

    return colum;
  }

  renameColum(newName) {
    let headerName = this.colum.querySelector('.colum-header-name');
    let value = newName.trim();
    if (value) {
      this.nameColum = value;
      headerName.value = value;
    } else {
      headerName.value = this.nameColum;
    }

    headerName.style.height = 'auto';
    if (headerName.scrollHeight < 250) {
      headerName.style.height = (headerName.scrollHeight > 28 ? headerName.scrollHeight : 28) + 'px';
      headerName.style.overflow = 'hidden';
    } else {
      headerName.style.height = '250px';
      headerName.style.overflowY = 'scroll';
    }
  }

  saveColum() {
    console.log('saveColum');
  }

  removeColum() {
    this.colum.remove();
  }



  createCard(name) {
    new KanbanCard(this.colum.querySelector('.colum-cards'), Date.now(), name);
  }

}


(function () {

  const kanban = document.querySelector('#kanban');

  const modAdd = document.querySelector('.colum-wrapper.mod-add');
  const form = modAdd.querySelector('form');
  const input = modAdd.querySelector('input.name-input');
  const close = modAdd.querySelector('.controls-icon-close');
  const placeholder = modAdd.querySelector('.placeholder');


  placeholder.addEventListener('click', function () {
    modAdd.classList.remove('is-idle');
    input.focus();
  });

  close.addEventListener('click', function () {
    modAdd.classList.add('is-idle');
  });

  window.addEventListener('mousedown', event => {
    if (!event.target.closest('.colum-wrapper.mod-add')) {
      modAdd.classList.add('is-idle')
    }
  })

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let inputValue = this.querySelector('input.name-input').value;
    if (inputValue.trim()) {
      new KanbanColum(kanban, Date.now(), inputValue).saveColum();
      this.reset();
    }
    input.focus();
  })

})()
