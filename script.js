/* ==========================================================================
   [DB 연동 대비 초기 데이터 배열]
   다음 주 데이터베이스(회원 · 상품 · 등급 · 주문) 테이블과 1:1 매핑되도록 구성
   ========================================================================== */

// 1. 회원 등급 데이터 (4단계: 1% · 3% · 5% · 7%)
const MEMBER_GRADES = [
  { gradeId: 1, gradeName: "루키 (ROOKIE)", minSpent: 0, rate: 0.01, rateText: "1%" },
  { gradeId: 2, gradeName: "스타터 (STARTER)", minSpent: 50000, rate: 0.03, rateText: "3%" },
  { gradeId: 3, gradeName: "캡틴 (CAPTAIN)", minSpent: 150000, rate: 0.05, rateText: "5%" },
  { gradeId: 4, gradeName: "레전드 (LEGEND)", minSpent: 300000, rate: 0.07, rateText: "7%" }
];

// 2. 상품 데이터 (분류 4개: 시합구, 훈련구, 풋살공, 유소년볼 / 예시 상품 8개)
const PRODUCTS = [
  {
    id: 1,
    name: "몰텐 유로파리그 공인 매치볼 5호",
    category: "시합구",
    price: 58000,
    stock: 25,
    image: "./img/p1.jpg",
    desc: "UEFA 유로파리그 디자인이 적용된 5호 공인 매치볼입니다. 정교한 패널 접합으로 안정적인 궤적을 제공합니다."
  },
  {
    id: 2,
    name: "몰텐 유로파리그 레플리카 블루 5호",
    category: "훈련구",
    price: 34000,
    stock: 40,
    image: "./img/p2.jpg",
    desc: "내구성이 뛰어난 TPU 외피를 사용해 인조잔디와 맨땅 훈련에 최적화된 5호 트레이닝 볼입니다."
  },
  {
    id: 3,
    name: "스타 KFA 공인 풋살 매치볼 4호",
    category: "풋살공",
    price: 39000,
    stock: 30,
    image: "./img/p3.jpg",
    desc: "대한축구협회(KFA) 인증을 받은 저탄성 풋살 전용 공식구로, 실내외 풋살장에서 정교한 볼 컨트롤을 지원합니다."
  },
  {
    id: 4,
    name: "스타 뉴 마니아 핑크 하이브리드 4호",
    category: "유소년볼",
    price: 29000,
    stock: 22,
    image: "./img/p4.jpg",
    desc: "시인성이 뛰어난 핑크 컬러와 부드러운 터치감의 하이브리드 공법을 적용한 유소년·초등부용 4호 축구공입니다."
  },
  {
    id: 5,
    name: "아디다스 커넥스트21 트레이닝 5호",
    category: "훈련구",
    price: 42000,
    stock: 18,
    image: "./img/p5.jpg",
    desc: "역동적인 스타 그래픽과 기계 박음질 마감으로 팀 훈련 및 동호회 매치에 적합한 5호 축구공입니다."
  },
  {
    id: 6,
    name: "FIFA 베이직 인증 프로 매치볼 5호",
    category: "시합구",
    price: 64000,
    stock: 15,
    image: "./img/p6.jpg",
    desc: "FIFA BASIC 국제 기준 테스트를 통과한 시합용 볼로 균일한 반발력과 수분 흡수 억제 기능을 갖췄습니다."
  },
  {
    id: 7,
    name: "스타 뉴 풋살 하이비즈 옐로우 4호",
    category: "풋살공",
    price: 32000,
    stock: 35,
    image: "./img/p7.jpg",
    desc: "야간 풋살 경기에서도 공의 회전과 위치를 명확히 식별할 수 있는 고시인성 옐로우 풋살공입니다."
  },
  {
    id: 8,
    name: "스타 팅 매치 4 라이트 경량볼",
    category: "유소년볼",
    price: 27000,
    stock: 28,
    image: "./img/p8.jpg",
    desc: "성장기 유소년 선수의 발목 부담을 줄이기 위해 무게를 경량화한 4호 전용 축구공입니다."
  }
];

/* ==========================================================================
   상태 관리 (localStorage 기반 임시 저장소 - 추후 백엔드 API로 대체)
   ========================================================================== */
const STORAGE_KEYS = {
  USERS: "kickoff_users",
  CURRENT_USER: "kickoff_current_user",
  CART: "kickoff_cart",
  ORDERS: "kickoff_orders"
};

let currentCategory = "전체";
let currentKeyword = "";
let slideIndex = 0;
let slideTimer = null;

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || "null");
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

function getCart() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

function getOrders() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

function getUserGrade(totalSpent) {
  let matched = MEMBER_GRADES[0];
  for (const grade of MEMBER_GRADES) {
    if (totalSpent >= grade.minSpent) {
      matched = grade;
    }
  }
  return matched;
}

function formatPrice(num) {
  return Number(num).toLocaleString("ko-KR") + "원";
}

/* ==========================================================================
   1. 메인 슬라이드 (4장, 6초마다 교차)
   ========================================================================== */
function showSlide(index) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  if (!slides.length) return;

  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((s, idx) => s.classList.toggle("active", idx === slideIndex));
  dots.forEach((d, idx) => d.classList.toggle("active", idx === slideIndex));
}

function startSlideAutoPlay() {
  stopSlideAutoPlay();
  slideTimer = setInterval(() => {
    showSlide(slideIndex + 1);
  }, 6000);
}

function stopSlideAutoPlay() {
  if (slideTimer) clearInterval(slideTimer);
}

/* ==========================================================================
   2. 상품 목록 · 검색 · 분류 필터 · 상세 보기
   ========================================================================== */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const titleEl = document.getElementById("currentCategoryTitle");
  const countEl = document.getElementById("productCountText");

  const filtered = PRODUCTS.filter((item) => {
    const matchCategory = currentCategory === "전체" || item.category === currentCategory;
    const matchKeyword =
      item.name.toLowerCase().includes(currentKeyword.toLowerCase()) ||
      item.category.toLowerCase().includes(currentKeyword.toLowerCase());
    return matchCategory && matchKeyword;
  });

  titleEl.textContent = currentKeyword
    ? `'${currentKeyword}' 검색 결과`
    : currentCategory === "전체"
    ? "전체상품"
    : currentCategory;
  countEl.textContent = `총 ${filtered.length}개 상품`;

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; padding:40px 0; color:#6b7280;">조건에 맞는 상품이 없습니다.</p>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (product) => `
      <article class="product-card">
        <div class="product-thumb" onclick="openProductDetail(${product.id})">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="product-info">
          <span class="product-cat">${product.category}</span>
          <h3 class="product-name" onclick="openProductDetail(${product.id})">${product.name}</h3>
          <div class="product-price">${formatPrice(product.price)}</div>
          <div class="product-stock">남은 재고: ${product.stock}개</div>
          <div class="card-actions">
            <button type="button" class="btn-outline" onclick="openProductDetail(${product.id})">상세보기</button>
            <button type="button" class="btn-primary" onclick="addToCart(${product.id})">장바구니</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function openProductDetail(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const content = document.getElementById("productDetailContent");
  content.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="detail-img" />
    <div class="detail-meta">
      <span class="product-cat">${product.category}</span>
      <h3>${product.name}</h3>
      <div class="product-price">${formatPrice(product.price)}</div>
      <p style="font-size:0.9rem; color:#4b5563;">${product.desc}</p>
      <p class="product-stock">현재 재고: ${product.stock}개</p>
      <button type="button" class="btn-primary full-width" onclick="addToCart(${product.id}); closeModal('productDetailModal');">
        장바구니에 담기
      </button>
    </div>
  `;
  openModal("productDetailModal");
}

function renderTierGuide() {
  const tierGrid = document.getElementById("tierGrid");
  tierGrid.innerHTML = MEMBER_GRADES.map(
    (g) => `
    <div class="tier-card">
      <h3>${g.gradeName}</h3>
      <div class="tier-rate">결제액 ${g.rateText} 적립</div>
      <p class="tier-cond">누적 구매 ${formatPrice(g.minSpent)} 이상</p>
    </div>
  `
  ).join("");
}

/* ==========================================================================
   3. 장바구니 & 체험 결제 & 포인트 적립
   ========================================================================== */
function updateCartBadge() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = totalQty;
}

function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    if (existing.qty >= product.stock) {
      alert("재고 수량을 초과하여 담을 수 없습니다.");
      return;
    }
    existing.qty += 1;
  } else {
    cart.push({ productId: product.id, qty: 1 });
  }

  saveCart(cart);
  updateCartBadge();
  alert(`'${product.name}' 상품이 장바구니에 담겼습니다.`);
}

function changeCartQty(productId, delta) {
  const product = PRODUCTS.find((p) => p.id === productId);
  let cart = getCart();
  const target = cart.find((item) => item.productId === productId);
  if (!target || !product) return;

  const nextQty = target.qty + delta;
  if (nextQty <= 0) {
    cart = cart.filter((item) => item.productId !== productId);
  } else if (nextQty > product.stock) {
    alert("남은 재고보다 많이 담을 수 없습니다.");
    return;
  } else {
    target.qty = nextQty;
  }

  saveCart(cart);
  updateCartBadge();
  renderCartModal();
}

function removeCartItem(productId) {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
  updateCartBadge();
  renderCartModal();
}

function renderCartModal() {
  const container = document.getElementById("cartItemsContainer");
  const cart = getCart();
  const user = getCurrentUser();

  if (cart.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding:24px 0; color:#6b7280;">장바구니가 비어 있습니다.</p>`;
  } else {
    container.innerHTML = cart
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return "";
        return `
          <div class="cart-item">
            <div class="cart-item-info">
              <div class="cart-item-title">${product.name}</div>
              <div class="cart-item-price">${formatPrice(product.price)} × ${item.qty}개 = <strong>${formatPrice(product.price * item.qty)}</strong></div>
            </div>
            <div class="qty-controls">
              <button type="button" onclick="changeCartQty(${product.id}, -1)">-</button>
              <span>${item.qty}</span>
              <button type="button" onclick="changeCartQty(${product.id}, 1)">+</button>
              <button type="button" onclick="removeCartItem(${product.id})" style="width:auto; padding:0 8px; color:#d91c24;">삭제</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  const availablePointsEl = document.getElementById("availablePoints");
  const pointInput = document.getElementById("usePointInput");

  if (user) {
    availablePointsEl.textContent = user.points.toLocaleString("ko-KR");
    pointInput.disabled = false;
    pointInput.max = user.points;
  } else {
    availablePointsEl.textContent = "0";
    pointInput.value = 0;
    pointInput.disabled = true;
  }

  recalculateCartTotals();
}

function recalculateCartTotals() {
  const cart = getCart();
  const user = getCurrentUser();
  const pointInput = document.getElementById("usePointInput");

  const subtotal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  let usedPoints = parseInt(pointInput.value || "0", 10);
  if (isNaN(usedPoints) || usedPoints < 0) usedPoints = 0;
  if (user && usedPoints > user.points) usedPoints = user.points;
  if (usedPoints > subtotal) usedPoints = subtotal;
  pointInput.value = usedPoints;

  const finalTotal = Math.max(0, subtotal - usedPoints);

  let earnRate = 0;
  let rateLabel = "비회원 0%";
  if (user) {
    const grade = getUserGrade(user.totalSpent);
    earnRate = grade.rate;
    rateLabel = `${grade.gradeName} ${grade.rateText}`;
  }

  const earnPoints = Math.floor(finalTotal * earnRate);

  document.getElementById("cartSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("cartFinalTotal").textContent = formatPrice(finalTotal);
  document.getElementById("earnRateText").textContent = rateLabel;
  document.getElementById("expectedEarnPoints").textContent = `${earnPoints.toLocaleString("ko-KR")}P`;
}

function handleCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("장바구니에 담긴 상품이 없습니다.");
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    alert("체험 결제 및 포인트 적립을 위해 먼저 로그인해 주세요.");
    closeModal("cartModal");
    openModal("authModal");
    return;
  }

  const subtotal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const usedPoints = parseInt(document.getElementById("usePointInput").value || "0", 10) || 0;
  const finalTotal = Math.max(0, subtotal - usedPoints);
  const currentGrade = getUserGrade(user.totalSpent);
  const earnedPoints = Math.floor(finalTotal * currentGrade.rate);

  user.points = user.points - usedPoints + earnedPoints;
  user.totalSpent += finalTotal;
  const updatedGrade = getUserGrade(user.totalSpent);

  const users = getUsers().map((u) => (u.userId === user.userId ? user : u));
  saveUsers(users);
  setCurrentUser(user);

  const orders = getOrders();
  orders.unshift({
    orderId: "ORD-" + Date.now(),
    userId: user.userId,
    date: new Date().toLocaleString("ko-KR"),
    items: cart.map((c) => {
      const p = PRODUCTS.find((prod) => prod.id === c.productId);
      return { name: p ? p.name : "상품", qty: c.qty, price: p ? p.price : 0 };
    }),
    finalTotal,
    usedPoints,
    earnedPoints
  });
  saveOrders(orders);

  saveCart([]);
  document.getElementById("usePointInput").value = 0;
  updateCartBadge();
  updateAuthUI();
  closeModal("cartModal");

  alert(
    `체험 결제가 완료되었습니다!
` +
    `- 결제 금액: ${formatPrice(finalTotal)}
` +
    `- 적립 포인트: +${earnedPoints.toLocaleString("ko-KR")}P
` +
    `- 현재 등급: ${updatedGrade.gradeName} (보유 ${user.points.toLocaleString("ko-KR")}P)`
  );
}

/* ==========================================================================
   4. 회원가입 · 로그인 · 마이페이지
   ========================================================================== */
function updateAuthUI() {
  const user = getCurrentUser();
  const statusEl = document.getElementById("userStatusText");
  const authBtn = document.getElementById("openAuthModalBtn");
  const myPageBtn = document.getElementById("openMyPageBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    const grade = getUserGrade(user.totalSpent);
    statusEl.textContent = `${user.name}님 · ${grade.gradeName} (${user.points.toLocaleString("ko-KR")}P)`;
    authBtn.classList.add("hidden");
    myPageBtn.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    statusEl.textContent = "비회원";
    authBtn.classList.remove("hidden");
    myPageBtn.classList.add("hidden");
    logoutBtn.classList.add("hidden");
  }
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const userId = document.getElementById("signupId").value.trim();
  const password = document.getElementById("signupPw").value.trim();

  if (!name || !userId || !password) return;

  const users = getUsers();
  if (users.some((u) => u.userId === userId)) {
    alert("이미 사용 중인 아이디입니다.");
    return;
  }

  const newUser = {
    userId,
    password,
    name,
    points: 3000,
    totalSpent: 0
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  updateAuthUI();
  e.target.reset();
  closeModal("authModal");
  alert(`${name}님 회원가입을 환영합니다! 가입 축하 3,000P가 지급되었습니다.`);
}

function handleLogin(e) {
  e.preventDefault();
  const userId = document.getElementById("loginId").value.trim();
  const password = document.getElementById("loginPw").value.trim();

  const matched = getUsers().find((u) => u.userId === userId && u.password === password);
  if (!matched) {
    alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    return;
  }

  setCurrentUser(matched);
  updateAuthUI();
  e.target.reset();
  closeModal("authModal");
  alert(`${matched.name}님 환영합니다!`);
}

function renderMyPage() {
  const user = getCurrentUser();
  if (!user) return;

  const grade = getUserGrade(user.totalSpent);
  document.getElementById("myPageProfile").innerHTML = `
    <div><strong>회원명:</strong> ${user.name} (${user.userId})</div>
    <div><strong>현재 등급:</strong> ${grade.gradeName} (적립률 ${grade.rateText})</div>
    <div><strong>보유 포인트:</strong> ${user.points.toLocaleString("ko-KR")}P</div>
    <div><strong>누적 결제금액:</strong> ${formatPrice(user.totalSpent)}</div>
  `;

  const myOrders = getOrders().filter((o) => o.userId === user.userId);
  const listEl = document.getElementById("orderHistoryList");

  if (myOrders.length === 0) {
    listEl.innerHTML = `<p style="color:#6b7280; font-size:0.9rem;">아직 주문 내역이 없습니다.</p>`;
  } else {
    listEl.innerHTML = myOrders
      .map(
        (order) => `
        <div class="order-card">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <strong>${order.orderId}</strong>
            <span style="color:#6b7280;">${order.date}</span>
          </div>
          <div>${order.items.map((i) => `${i.name} (${i.qty}개)`).join(", ")}</div>
          <div style="margin-top:6px; color:#d91c24; font-weight:700;">
            실결제: ${formatPrice(order.finalTotal)} / 사용: ${order.usedPoints}P / 적립: +${order.earnedPoints}P
          </div>
        </div>
      `
      )
      .join("");
  }
}

/* ==========================================================================
   모달 및 이벤트 바인딩
   ========================================================================== */
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderTierGuide();
  updateAuthUI();
  updateCartBadge();
  startSlideAutoPlay();

  document.getElementById("prevSlideBtn").addEventListener("click", () => {
    showSlide(slideIndex - 1);
    startSlideAutoPlay();
  });
  document.getElementById("nextSlideBtn").addEventListener("click", () => {
    showSlide(slideIndex + 1);
    startSlideAutoPlay();
  });
  document.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.index));
      startSlideAutoPlay();
    });
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderProducts();
    });
  });

  document.getElementById("logoBtn").addEventListener("click", () => {
    currentCategory = "전체";
    currentKeyword = "";
    document.getElementById("searchInput").value = "";
    document.querySelectorAll(".nav-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.category === "전체");
    });
    renderProducts();
  });

  document.getElementById("searchBtn").addEventListener("click", () => {
    currentKeyword = document.getElementById("searchInput").value.trim();
    renderProducts();
  });
  document.getElementById("searchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      currentKeyword = e.target.value.trim();
      renderProducts();
    }
  });

  document.getElementById("openAuthModalBtn").addEventListener("click", () => openModal("authModal"));
  document.getElementById("openCartBtn").addEventListener("click", () => {
    renderCartModal();
    openModal("cartModal");
  });
  document.getElementById("openMyPageBtn").addEventListener("click", () => {
    renderMyPage();
    openModal("myPageModal");
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    setCurrentUser(null);
    updateAuthUI();
    alert("로그아웃 되었습니다.");
  });

  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });

  document.querySelectorAll(".tab-btn").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      document.getElementById("loginForm").classList.toggle("hidden", target !== "loginTab");
      document.getElementById("signupForm").classList.toggle("hidden", target !== "signupTab");
    });
  });

  document.getElementById("signupForm").addEventListener("submit", handleSignup);
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("usePointInput").addEventListener("input", recalculateCartTotals);
  document.getElementById("checkoutBtn").addEventListener("click", handleCheckout);
});
