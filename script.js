const itemsExibidos = document.querySelector('.items');
const shoppingCart = document.querySelector('.cart__items');
const removeButton = document.querySelector('.empty-cart');

// função que salva no local storage
const saveStorage = () => {
  localStorage.setItem('saveCart', shoppingCart.innerHTML);
};

// função que soma o valor final do carrinho
const sumAllPrices = () => {
  let sumOfPrices = 0;
  sumOfPrices = 0;
  const listItems = document.querySelectorAll('.cart__item');
  const valuePrice = document.querySelector('.total-price');

  if (listItems.length === 0) {
    valuePrice.innerText = `Carrinho Vazio`;
  }

  for (let index = 0; index < listItems.length; index += 1) {
    const value = Number(listItems[index].innerText.split('$')[1]);
    sumOfPrices += value;
    valuePrice.innerText = `Valor total R$${sumOfPrices.toFixed(2)}`;
  }
};

// função que cria o elemento da imagem do produto
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função que cria qualquer elemento html
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// função que pega o id do elemento.
const getIdFromProduct = (item) => item.querySelector('span.item__sku').innerText;

// função que remove no click do elemento do carrinho
const removeItemFromCart = (event) => {
  event.target.remove();
  saveStorage();
  sumAllPrices();
};

// função que cria o elemento no carrinho
const createCartItem = ({ title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `Produto: ${name} Preço: $${salePrice}`;
  li.addEventListener('click', removeItemFromCart);
  shoppingCart.appendChild(li);
  saveStorage();
  sumAllPrices();
};

// função que adiciona o elemento clicado e faz a requisição a api pelo id
const adicionaCarrinho = (event) => {
  const computer = event.target.parentNode;
  const id = getIdFromProduct(computer);
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((object) => {
    createCartItem(object);
  })
  .catch((error) => {
    alert(error.message);
  });
};

// função que cria o elemento html do elemento
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', adicionaCarrinho);
  
  return section;
}

// função que vai fazer a requisição a API
const getProducts = async (pesquisa) => {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${pesquisa}`)
    .then((response) => response.json())
    .then(({ results }) => results);
}

// funçao que faz a requisição da api
const createProducts = async (pesquisa = 'computador') => {
  const pai = document.getElementsByClassName('items')[0];
  pai.innerHTML = '';
  const son = document.createElement('p');
  son.className = 'loading';
  pai.appendChild(son);
  await getProducts(pesquisa)
    .then((produtos) => {
      for(let index = 0; index < produtos.length; index += 1) {
        const filho = createProductItemElement(produtos[index]);
        pai.appendChild(filho);
      }
    });
  pai.removeChild(son);
}

// função para capturar o produto desejado pela pesquisa
const changeProducts = () => {
  const input = document.getElementById('search-input');
  if (input !== '') {
    createProducts(input.value);
  }
  input.value = '';
}

// função para adicionar o listener no botão de pesquisa
const addListener = () => {
  const button = document.getElementById('search-btn');
  button.addEventListener('click', changeProducts);
}

// função que recupera do local storage coloca na tela novamente
const recoverStorageList = () => {
  shoppingCart.innerHTML = localStorage.getItem('saveCart');
  const cartItems = document.querySelectorAll('.cart__items');
  cartItems.forEach((item) => item.addEventListener('click', removeItemFromCart));
};

// função que cria o event listener do botão de limpar
const addClearListener = () => {
  removeButton.addEventListener('click', () => {
    shoppingCart.innerHTML = '';
    sumAllPrices();
    saveStorage();
  });
}

// função que cria o elemento que exibe preço total
const createTotal = () => {
  const pai = document.getElementsByClassName('cart')[0];
  const filho = document.createElement('p');
  filho.className = 'total-price';
  filho.innerText = 'Carrinho Vazio';
  pai.appendChild(filho);
}

window.onload = () => { 
  createProducts();
  createTotal();
  recoverStorageList();
  addClearListener();
  addListener();
};
