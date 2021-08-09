import BoardCard from './boardCard'

export default class BoardColum {
    constructor(board, drakeCard, dataBoard, idColum, nameColum) {
      this.board = board;    
      this.drakeCard = drakeCard;
      this.dataBoard = dataBoard;
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
      window.addEventListener("load", headerNameHeight.bind(headerName));
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
  
      this.drakeCard.containers.push(colum.querySelector('.colum-cards'));
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
      let index = this.dataBoard.data.findIndex(colum => colum.idColum == this.idColum);
      if (index != -1) {
        this.dataBoard.data[index].nameColum = this.nameColum;
      } else {
        this.dataBoard.data.push({
          idColum: this.idColum,
          nameColum: this.nameColum,
          cards: []
        })
      }
      this.dataBoard.set(this.dataBoard.data)
    }
  
    removeColum() {
      this.dataBoard.data.splice(this.dataBoard.data.findIndex(colum => colum.idColum == this.idColum), 1);
      this.dataBoard.set(this.dataBoard.data);
      this.colum.remove();
    }
  
    createCard(text) {
      new BoardCard(this.colum.querySelector('.colum'), this.dataBoard, Date.now(), text).saveCard();
    }
  
  }