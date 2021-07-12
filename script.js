const itemsExibidos = document.querySelector('.items');
const shoppingCart = document.querySelector('.cart__items');
const allPrices = document.getElementById('all__prices');
const removeButton = document.querySelector('.empty-cart');

const saveStorage = () => {
  localStorage.setItem('saveCart', shoppingCart.innerHTML);
};

const sumAllPrices = () => {
  const listItems = document.querySelectorAll('.cart__item');
  let sumOfPrices = 0;

  listItems.forEach((item) => {
    const value = item.innerText;
    const initialPosition = value.indexOf('$') + 1;
    const lastPosition = value.length;
    const subString = value.substr(initialPosition, lastPosition);
    const number = parseFloat(subString);
    sumOfPrices += number;
  });
  allPrices.innerText = sumOfPrices;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const getIdFromProduct = (item) => item.querySelector('span.item__sku').innerText;

const removeItemFromCart = (event) => {
  event.target.remove();
  saveStorage();
  sumAllPrices();
};

const createCartItem = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', removeItemFromCart);
  shoppingCart.appendChild(li);
  saveStorage();
  sumAllPrices();
  return li;
};

const adicionaCarrinho = (event) => {
  const computer = event.target.parentNode;
  const id = getIdFromProduct(computer);
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((object) => {
    const item = {
      sku: object.id,
      name: object.title,
      salePrice: object.price,
    };
    createCartItem(item);
  })
  .catch((error) => {
    alert(error.message);
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', adicionaCarrinho);
  
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
// }
  
// function createCartItemElement({ id: sku, title: name, price: salePrice }) {
//     const carrinhoCompras = document.querySelector('.cart__items');
//     const li = document.createElement('li');
//     li.className = 'cart__item';
//     li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//     // li.addEventListener('click', cartItemClickListener);
//     carrinhoCompras.appendChild(li);
//     return li;
// }

const createObjectParameters = (arrayResult) => {
  arrayResult.forEach((itemArray) => {
    const item = {
      sku: itemArray.id,
      name: itemArray.title,
      image: itemArray.thumbnail,
    };
    
    itemsExibidos.appendChild(createProductItemElement(item));
  });
};

const loading = () => {
  const container = document.querySelector('.container');
  const loadingSpan = document.createElement('span');
  loadingSpan.classList.add('loading');
  loadingSpan.innerHTML = 'Loading...';
  container.appendChild(loadingSpan);
};

const removeLoading = () => {
  const loadSpan = document.querySelector('.loading');
  loadSpan.parentNode.removeChild(loadSpan);
};

const getComputers = async () => {
  loading();
  try {
    await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => response.json())
      .then(({ results }) => {
        createObjectParameters(results);
        removeLoading();
      });
  } catch (error) {
    alert(error.message);
  }
};

const recoverStorageList = () => {
  shoppingCart.innerHTML = localStorage.getItem('saveCart');
  const cartItems = document.querySelectorAll('.cart__items');
  cartItems.forEach((item) => item.addEventListener('click', removeItemFromCart));
};

removeButton.addEventListener('click', () => {
  shoppingCart.innerHTML = '';
});

window.onload = () => { 
  getComputers();
  recoverStorageList();
};
