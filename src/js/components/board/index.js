import dragula from 'dragula';
import BoardCard from './boardCard'
import BoardColum from './boardColum'

export default class Board {
    constructor(container) {
      this.container = container;
      this.board = this.createBoard();
    }
  
    dataBoard = {
      data: [],
      get: function () {
        return this.data = localStorage.getItem('dataBoard')
          ? JSON.parse(localStorage.getItem('dataBoard'))
          : [];
      },
      set: function (newData) {
        localStorage.setItem('dataBoard', JSON.stringify(newData));
        this.data = newData;
      }
    }
  
    drakeCard = new dragula({
      invalid: function (el) {
        return el.classList.contains('edit-card');
      },
      isContainer: function (el) {
        let guTransit = document.querySelector('.gu-transit');
        let columCards = el.querySelector('.colum-cards');
        let x = window.event.pageX != undefined 
              ? window.event.pageX 
              : window.event.changedTouches[0].pageX;
              
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
    }).on('over', () => {
      document.body.style.cursor = "auto"
    }).on('drag', () => {
      document.body.style.cursor = "grabbing"
    }).on('drop', (event) => {
      event.checkPositionCard();
    })
  
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
  
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        let inputValue = event.target.querySelector('input.name-input').value;
        if (inputValue.trim()) {
          new BoardColum(board, this.drakeCard, this.dataBoard, Date.now(), inputValue).saveColum();
          event.target.reset();
        }
        input.focus();
      })    
  
      this.container.prepend(board);
  
      return board;
    }
  
    initColumsCards(){
      if (this.dataBoard.get()) {
        this.dataBoard.data.forEach((colum) => {
          let newColum = new BoardColum(this.board, this.drakeCard, this.dataBoard, colum.idColum, colum.nameColum);
          colum.cards.forEach((card) => {
            new BoardCard(newColum.colum.querySelector('.colum'), this.dataBoard, card.idCard, card.textCard);
          });
        });
      }
    }
  }
  