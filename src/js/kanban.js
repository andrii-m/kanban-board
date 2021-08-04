let i = 0;

let data = [];

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
        <span class=""></span>
        <div class="colum-card-details">
          <span class="colum-card-title">
          </span>
        </div>
      </div>`
    ).firstChild;

    card.idCard = this.idCard;
    card.draggable = true;
    card.querySelector('.colum-card-title').innerHTML = this.textCard;

    card.onclick = this.removeCard.bind(this);


    card.addEventListener('dragstart', () => {
      card.classList.add('dragging')
    })

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');

      // this.delDataCard();
      // this.colum = card.closest('.colum');
      // this.saveDataCard([].indexOf.call(card.parentNode.children, card));

    })


    this.colum.insertBefore(card, this.colum.lastElementChild);

    return card;
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
            <textarea rows="1" class="colum-header-name" dir="auto" maxlength="512"></textarea>          
          </div>

          <div class="colum-cards"></div>

          <div class="card-composer-container">
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

    colum.querySelector('.open-card-composer').onclick = this.createCard.bind(this);

    colum.addEventListener('dragover', e => {
      e.preventDefault()
      const afterElement = (() => {
        const draggableElements = [...colum.querySelectorAll('.colum-card:not(.dragging)')]

        return draggableElements.reduce((closest, child) => {
          const box = child.getBoundingClientRect()
          const offset = e.clientY - box.top - box.height / 2
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
          } else {
            return closest
          }
        }, { offset: Number.NEGATIVE_INFINITY }).element
      })()

      const draggable = document.querySelector('.dragging');
      const columCards = colum.querySelector('.colum-cards');

      if (afterElement == null) {
        columCards.appendChild(draggable)
      } else {
        columCards.insertBefore(draggable, afterElement);
      }

    })


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



  createCard() {
    new KanbanCard(this.colum.querySelector('.colum-cards'), Date.now(), 'New card ' + ++i);
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

  window.addEventListener('click', e => {
    const target = e.target
    if (!target.closest('.colum-wrapper.mod-add')) {
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
