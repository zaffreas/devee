/* ---------- Settings ---------- */
var PRICE = 2500;            /* price of one combo */
var MAX_QTY = 20;
var ORDER_URL = 'order.html'; /* your order page */

function $(id){ return document.getElementById(id); }
function pad(n){ return (n < 10 ? '0' : '') + n; }
function naira(n){ return '\u20A6' + n.toLocaleString('en-NG'); }

/* ---------- 1. Amount = 2500 x total ---------- */
var qty = 1;

function renderAmount(){
  var amount = PRICE * qty;
  $('qty-count').textContent = qty;
  $('qty-total').textContent = qty;
  $('amount-value').textContent = naira(amount);
  /* send the same numbers to the order page */
  $('order-link').href = ORDER_URL + '?qty=' + qty + '&amount=' + amount;
  try { localStorage.setItem('deveeOrder', JSON.stringify({ qty: qty, amount: amount })); } catch (e) {}
}
$('minus').onclick = function(){ if (qty > 1) { qty--; renderAmount(); } };
$('plus').onclick  = function(){ if (qty < MAX_QTY) { qty++; renderAmount(); } };
renderAmount();

/* ---------- 2. Order period + countdown ---------- */
/* 6pm - 10am  -> Afternoon order, expires 10am
   10am - 3pm  -> Evening order,   expires 3pm
   3pm  - 6pm  -> Morning order,   expires 6pm   */
function currentPeriod(now){
  var h = now.getHours(), expiry = new Date(now), name;
  if (h >= 10 && h < 15)      { name = 'Evening';   expiry.setHours(15, 0, 0, 0); }
  else if (h >= 15 && h < 18) { name = 'Morning';   expiry.setHours(18, 0, 0, 0); }
  else {
    name = 'Afternoon';
    if (h >= 18) expiry.setDate(expiry.getDate() + 1);  /* after 6pm: expires 10am tomorrow */
    expiry.setHours(10, 0, 0, 0);
  }
  return { name: name, expiry: expiry };
}

function tick(){
  var now = new Date();
  var p = currentPeriod(now);
  var left = Math.max(0, Math.floor((p.expiry - now) / 1000));   /* expiry time - current time */
  $('timer-label').textContent = p.name + ' order expires in';
  $('timer-time').textContent =
    pad(Math.floor(left / 3600)) + ':' + pad(Math.floor(left % 3600 / 60)) + ':' + pad(left % 60);
}
tick();
setInterval(tick, 1000);
