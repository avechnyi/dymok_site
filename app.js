const CART_KEY='dymok_cart_v2';
const cart={load(){return JSON.parse(localStorage.getItem(CART_KEY)||'[]')},save(t){localStorage.setItem(CART_KEY,JSON.stringify(t)),updateCartCount()},add(e,a=1,r){const n=cart.load(),o=n.findIndex(t=>t.id===e);o>-1?n[o].qty+=a:n.push({id:e,qty:a,product:r}),cart.save(n)},remove(e){cart.save(cart.load().filter(t=>t.id!==e))},clear(){cart.save([])},total(){return cart.load().reduce((e,t)=>e+t.product.price*t.qty,0)}};function formatPrice(e){return new Intl.NumberFormat('ru-RU').format(e)+' ₽'}function updateCartCount(){const e=document.getElementById('cartCount');e&&(e.textContent=cart.load().reduce((e,t)=>e+t.qty,0))}
document.addEventListener('DOMContentLoaded',async()=>{updateCartCount(),ageGateInit(),document.getElementById('productsGrid')&&initCatalogPage(),document.getElementById('cartView')&&(renderCheckout(),bindCheckoutForm()),document.getElementById('reviewsList')&&renderReviews()});
async function initCatalogPage(){const e=await(await fetch('products.json')).json(),t=document.getElementById('productsGrid'),n=document.getElementById('searchInput'),a=document.getElementById('sortSelect'),r=[...new Set(e.map(e=>e.category))],o=document.getElementById('catTags');let d=null;r.forEach(e=>{const t=document.createElement('button');t.className='tag',t.textContent=e,t.onclick=()=>{d=d===e?null:e,[...o.children].forEach(e=>e.classList.remove('active')),d&&t.classList.add('active'),s()},o.appendChild(t)});function c(e){const n=document.createElement('article');return n.className='card product',n.innerHTML=`
        <img src="${e.image}" alt="${e.name}">
        <h3>${e.name}</h3>
        <p class="muted">${e.desc}</p>
        <div class="actions">
          <div class="price">${formatPrice(e.price)}</div>
          <button class="btn primary ripple" data-id="${e.id}" data-action="add">В корзину</button>
          <span class="badge">${e.category}</span>
        </div>`,n}function s(){const r=(n.value||'').trim().toLowerCase();let o=e.filter(e=>(!d||e.category===d)&&(e.name.toLowerCase().includes(r)||(e.desc||'').toLowerCase().includes(r)));'priceAsc'===a.value&&o.sort((e,t)=>e.price-t.price),'priceDesc'===a.value&&o.sort((e,t)=>t.price-e.price),t.innerHTML='',o.forEach(e=>t.appendChild(c(e)))}s(),n.addEventListener('input',s),a.addEventListener('change',s),t.addEventListener('click',n=>{const a=n.target.closest('button[data-id]');if(!a)return;const r=a.dataset.id,o=e.find(e=>e.id===r);cart.add(r,1,o),a.classList.add('clicked'),setTimeout(()=>a.classList.remove('clicked'),400);const d=document.querySelector('.cart-link');d&&d.classList.add('cart-bump'),setTimeout(()=>d&&d.classList.remove('cart-bump'),500)})}
function renderCheckout(){const e=document.getElementById('cartView'),t=cart.load();if(0===t.length)return void(e.innerHTML=`<p>Корзина пуста. <a class="btn" href="index.html">Перейти в каталог</a></p>`);const n=t.map(e=>`
    <div class="cart-row" data-id="${e.id}">
      <img src="${e.product.image}" alt="">
      <div><div><strong>${e.product.name}</strong></div><div class="muted">${e.product.desc||''}</div></div>
      <div class="price">${formatPrice(e.product.price)}</div>
      <div class="qty">
        <button class="btn" data-act="dec">−</button>
        <span>${e.qty}</span>
        <button class="btn" data-act="inc">+</button>
      </div>
      <button class="btn" data-act="del">✕</button>
    </div>`).join('');e.innerHTML=`<h2>Ваш заказ</h2>${n}<div class="cart-summary">Итого: ${formatPrice(cart.total())}</div>`,e.addEventListener('click',n=>{const a=n.target.closest('.cart-row');if(!a)return;const r=a.dataset.id,o=n.target.dataset.act,d=cart.load(),c=d.find(e=>e.id===r);c&&('inc'===o?c.qty++:'dec'===o?c.qty=Math.max(1,c.qty-1):'del'===o&&(cart.remove(r),renderCheckout(),updateCartCount(),0)),cart.save(d),renderCheckout()})}
function bindCheckoutForm(){const e=document.getElementById('orderForm'),t=document.getElementById('clearCart');t.addEventListener('click',()=>{cart.clear(),location.href='index.html'}),e.addEventListener('submit',e=>{e.preventDefault();const t=Object.fromEntries(new FormData(e.target).entries()),n=cart.load();if(0===n.length)return void alert('Корзина пуста');const a=n.map(e=>`• ${e.product.name} × ${e.qty} = ${e.product.price*e.qty}₽`),r=`Заказ с сайта «Дымок»
Имя: ${t.name}
Телефон: ${t.phone}
Email: ${t.email||'-'}
Адрес/комментарий: ${t.address||'-'}
Состав:
${a.join('\n')}
ИТОГО: ${cart.total()}₽`;const o="orders@dymok.local",d=`mailto:${encodeURIComponent(o)}?subject=${encodeURIComponent('Заказ с сайта «Дымок»')}&body=${encodeURIComponent(r)}`,c="";c?(window.open(c,'_blank'),location.href='thankyou.html'):(location.href=d,setTimeout(()=>location.href='thankyou.html',500)),cart.clear()})}
function ageGateInit(){const e=document.getElementById('ageGate');if(!e)return;const t=localStorage.getItem('age_ok_v1');"1"===t?e.style.display='none':(document.getElementById('ageYes').onclick=()=>{localStorage.setItem('age_ok_v1','1'),e.style.display='none'},document.getElementById('ageNo').onclick=()=>{location.href='https://www.google.com'})}
async function renderReviews(){const e=await(await fetch('reviews.json')).json(),t=document.getElementById('reviewsList');t.innerHTML=e.map(e=>`<div class="review"><div class="avatar"></div><div><strong>${e.name}</strong><div>{"★".repeat(e.rating)}${"☆".repeat(5-e.rating)}</div><div>${e.text}</div></div></div>`).join('')}
// Проверка возраста 18+
document.addEventListener("DOMContentLoaded", () => {
  const ageModal = document.getElementById('ageModal');
  const ageConfirm = document.getElementById('ageConfirm');
  const ageDeny = document.getElementById('ageDeny');

  // Проверяем сохранённое подтверждение
  if (!localStorage.getItem('ageConfirmed')) {
    ageModal.style.display = 'flex';
  }

  // Нажатие "Да, мне 18+"
  ageConfirm.addEventListener('click', () => {
    localStorage.setItem('ageConfirmed', 'true');
    ageModal.style.display = 'none';
  });

  // Нажатие "Нет"
  ageDeny.addEventListener('click', () => {
    alert('Доступ запрещён. Сайт только для пользователей 18+. ');
    window.location.href = 'https://google.com';
  });
});

