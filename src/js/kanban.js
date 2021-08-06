
import dragula from 'dragula';

let drakeColum = new dragula({
  invalid: function (el) {
    return el.classList.contains('edit-card');
  },
  isContainer: function (el) {
    let guTransit = document.querySelector('.gu-transit');
    let columCards = el.querySelector('.colum-cards');
    let x = window.event.pageX;
    if (
      guTransit != null
      && el.classList.contains('colum-wrapper')
      && !el.classList.contains('mod-add')
      && !el.querySelector('.gu-transit')
      && (columCards.getBoundingClientRect().left < x && columCards.getBoundingClientRect().right > x)
    ) {
      if (window.event.pageY < columCards.offsetTop) {
        columCards.insertBefore(guTransit, columCards.firstChild)
      } else {
        columCards.append(guTransit)
      }

    }
    return el.classList.contains('colum-cards');
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


let dataBoard = {
  data: JSON.parse(localStorage.getItem('dataBoard'))
    ? JSON.parse(localStorage.getItem('dataBoard'))
    : [],
  get: function () {
    return this.data = JSON.parse(localStorage.getItem('dataBoard'))
      ? JSON.parse(localStorage.getItem('dataBoard'))
      : [];
  },
  set: function (newData) {
    localStorage.setItem('dataBoard', JSON.stringify(newData));
    this.data = newData;
  }
}


class BoardCard {
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

    // document.addEventListener("DOMContentLoaded", () => {
    //   cardTextHeight.bind(cardText)();
    // });

    this.colum.querySelector('.colum-cards').append(card);
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

    this.saveCard()
  }

  saveCard() {
    let indexColum = dataBoard.data.findIndex(colum => colum.idColum == this.colum.idColum);
    let indexCard = dataBoard.data[indexColum].cards.findIndex(card => card.idCard == this.idCard);

    if (indexCard != -1) {
      dataBoard.data[indexColum].cards[indexCard].textCard = this.textCard;
    } else {
      dataBoard.data[indexColum].cards.push({
        idCard: this.idCard,
        textCard: this.textCard,
      })
    }
    dataBoard.set(dataBoard.data)
  }

  removeCard() {
    let indexColum = dataBoard.data.findIndex(colum => colum.idColum == this.colum.idColum);
    dataBoard.data[indexColum].cards.splice(dataBoard.data[indexColum].cards.findIndex(card => card.idColum == this.idColum), 1);
    dataBoard.set(dataBoard.data);;
    this.card.remove();
  }

}



class BoardColum {
  constructor(board, idColum, nameColum) {
    this.board = board;
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
            <textarea rows="1" class="colum-header-name" maxlength="512"></textarea>          
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

    colum.querySelector('.colum').idColum = this.idColum;

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

    // document.addEventListener("DOMContentLoaded", () => {
    //   headerNameHeight.bind(headerName)();
    // });

    drakeColum.containers.push(colum.querySelector('.colum-cards'));
    this.board.insertBefore(colum, this.board.lastElementChild);
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

    this.saveColum();
  }

  saveColum() {
    let index = dataBoard.data.findIndex(colum => colum.idColum == this.idColum);
    if (index != -1) {
      dataBoard.data[index].nameColum = this.nameColum;
    } else {
      dataBoard.data.push({
        idColum: this.idColum,
        nameColum: this.nameColum,
        cards: []
      })
    }
    dataBoard.set(dataBoard.data)
  }

  removeColum() {
    dataBoard.data.splice(dataBoard.data.findIndex(colum => colum.idColum == this.idColum), 1);
    dataBoard.set(dataBoard.data);
    this.colum.remove();
  }

  createCard(name) {
    new BoardCard(this.colum.querySelector('.colum'), Date.now(), name).saveCard();
  }

}



class Board {
  constructor(container) {
    this.container = container;
    this.board = this.createBoard();
  }

  createBoard() {
    let board = document.createRange().createContextualFragment(
      `<div class="board">  
        <div class="colum-wrapper mod-add is-idle">
          <form>
            <span class="placeholder">
              <span class="fi-rr-plus placeholder-icon-add"></span>
              Добавьте еще одну колонку
            </span>
            <input class="input input--primary name-input" type="text" name="name" placeholder="Ввести заголовок списка"
              autocomplete="off" dir="auto" maxlength="512">
            <div class="add-controls">
              <input class="button button--primary" type="submit" value="Добавить список">
              <span class="fi-rr-cross icon-close controls-icon-close"></span>
            </div>
          </form>
        </div>
      </div>`
    ).firstChild;

    //const board = document.querySelector('#board');

    const modAdd = board.querySelector('.colum-wrapper.mod-add');
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
        new BoardColum(board, Date.now(), inputValue).saveColum();
        this.reset();
      }
      input.focus();
    })    

    this.container.append(board);

    return board;
  }

  initColumsCards(){
    if (dataBoard.get()) {
      dataBoard.data.forEach((colum) => {
        let newColum = new BoardColum(this.board, colum.idColum, colum.nameColum);
        colum.cards.forEach((card) => {
          new BoardCard(newColum.colum.querySelector('.colum'), card.idCard, card.textCard);
        });
      });
    }
  }
}


new Board(document.querySelector('body')).initColumsCards();