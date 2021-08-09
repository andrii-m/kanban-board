export default class BoardCard {
    constructor(colum, dataBoard, idCard, textCard) {
      this.colum = colum;
      this.dataBoard = dataBoard;
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
      });

      window.addEventListener("load", cardTextHeight.bind(cardText));
  
      cardTrash.onclick = this.removeCard.bind(this);
  
      card.checkPositionCard = this.checkPosition.bind(this)
  
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
  
    checkPosition(){
      let indexColum = this.dataBoard.data.findIndex(colum => colum.idColum == this.colum.idColum);
      let dataCard = this.dataBoard.data[indexColum].cards.find(card => card.idCard == this.idCard);
      this.dataBoard.data[indexColum].cards.splice(this.dataBoard.data[indexColum].cards.findIndex(card => card.idCard == this.idCard), 1);
  
      this.colum = this.card.closest('.colum');
      indexColum = this.dataBoard.data.findIndex(colum => colum.idColum == this.colum.idColum);
  
      this.dataBoard.data[indexColum].cards.splice([].indexOf.call(this.card.parentNode.children, this.card), 0, dataCard);
      this.dataBoard.set(this.dataBoard.data);
    }
  
    saveCard() {
      let indexColum = this.dataBoard.data.findIndex(colum => colum.idColum == this.colum.idColum);
      let indexCard = this.dataBoard.data[indexColum].cards.findIndex(card => card.idCard == this.idCard);
  
      if (indexCard != -1) {
        this.dataBoard.data[indexColum].cards[indexCard].textCard = this.textCard;
      } else {
        this.dataBoard.data[indexColum].cards.push({
          idCard: this.idCard,
          textCard: this.textCard,
        })
      }
      this.dataBoard.set(this.dataBoard.data)
    }
  
    removeCard() {
      let indexColum = this.dataBoard.data.findIndex(colum => colum.idColum == this.colum.idColum);
      this.dataBoard.data[indexColum].cards.splice(this.dataBoard.data[indexColum].cards.findIndex(card => card.idCard == this.idCard), 1);    
      this.dataBoard.set(this.dataBoard.data);
      this.card.remove();
    }
  
  }