/* =========================================================
   VÉRONA — PREMIUM E-COMMERCE JAVASCRIPT
   Synent Technologies — Task 7
   Vanilla JavaScript / No Backend Required
   ========================================================= */

"use strict";


/* =========================================================
   01. GLOBAL STATE
   ========================================================= */

const STORAGE_KEYS = {
    cart: "verona_cart",
    wishlist: "verona_wishlist"
};

let cart = loadStorage(STORAGE_KEYS.cart, []);
let wishlist = loadStorage(STORAGE_KEYS.wishlist, []);


/* =========================================================
   02. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initMobileMenu();

    initSmoothScroll();

    initCategoryFilters();

    initProductSearch();

    initProductSorting();

    initCartSystem();

    initWishlistSystem();

    initNewsletter();

    initContactForm();

    initFAQ();

    initScrollEffects();

    updateCartUI();

    updateWishlistUI();

    bindProductButtons();

});


/* =========================================================
   03. LOCAL STORAGE
   ========================================================= */

function loadStorage(key, fallback) {

    try {

        const stored = localStorage.getItem(key);

        return stored ? JSON.parse(stored) : fallback;

    } catch (error) {

        console.warn(`Could not load ${key}`, error);

        return fallback;
    }
}


function saveStorage(key, value) {

    try {

        localStorage.setItem(key, JSON.stringify(value));

    } catch (error) {

        console.warn(`Could not save ${key}`, error);
    }
}


/* =========================================================
   04. MOBILE NAVIGATION
   ========================================================= */

function initMobileMenu() {

    const menuButton = document.querySelector(".menu");
    const links = document.querySelector(".links");

    if (!menuButton || !links) return;

    menuButton.addEventListener("click", () => {

        links.classList.toggle("open");

        const isOpen = links.classList.contains("open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.textContent = isOpen ? "✕" : "☰";

    });


    links.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            links.classList.remove("open");

            menuButton.textContent = "☰";

        });

    });
}


/* =========================================================
   05. SMOOTH SCROLL
   ========================================================= */

function initSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });
}


/* =========================================================
   06. CATEGORY FILTERS
   ========================================================= */

function initCategoryFilters() {

    const filters = document.querySelectorAll(".filter");
    const cards = document.querySelectorAll(
        ".shop-card, .product"
    );

    if (!filters.length || !cards.length) return;

    filters.forEach(button => {

        button.addEventListener("click", () => {

            filters.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const category =
                button.dataset.filter ||
                button.textContent.trim().toLowerCase();


            cards.forEach(card => {

                const cardCategory =
                    (
                        card.dataset.category ||
                        card.querySelector("small")?.textContent ||
                        ""
                    ).toLowerCase();

                const show =
                    category === "all" ||
                    category === "all products" ||
                    cardCategory.includes(category);

                card.style.display =
                    show ? "" : "none";

            });

            updateVisibleProductCount();

        });

    });
}


function updateVisibleProductCount() {

    const counter = document.querySelector(".count");

    if (!counter) return;

    const cards = document.querySelectorAll(
        ".shop-card, .product"
    );

    const visible = [...cards].filter(card => {
        return getComputedStyle(card).display !== "none";
    }).length;

    counter.textContent =
        `${visible} ${visible === 1 ? "piece" : "pieces"}`;
}


/* =========================================================
   07. LIVE PRODUCT SEARCH
   ========================================================= */

function initProductSearch() {

    const searchInput =
        document.querySelector(".shop-search");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();

        const cards = document.querySelectorAll(
            ".shop-card, .product"
        );

        cards.forEach(card => {

            const searchableText =
                card.textContent.toLowerCase();

            card.style.display =
                searchableText.includes(query)
                    ? ""
                    : "none";

        });

        updateVisibleProductCount();

    });
}


/* =========================================================
   08. PRODUCT SORTING
   ========================================================= */

function initProductSorting() {

    const sortSelect =
        document.querySelector("#sortProducts");

    const grid =
        document.querySelector(".shop-grid");

    if (!sortSelect || !grid) return;

    sortSelect.addEventListener("change", () => {

        const cards =
            [...grid.querySelectorAll(".shop-card")];

        const getPrice = card => {

            const priceText =
                card.querySelector("b")?.textContent || "0";

            return Number(
                priceText.replace(/[^0-9.]/g, "")
            );

        };

        if (sortSelect.value === "low") {

            cards.sort(
                (a, b) => getPrice(a) - getPrice(b)
            );

        }

        if (sortSelect.value === "high") {

            cards.sort(
                (a, b) => getPrice(b) - getPrice(a)
            );

        }

        if (sortSelect.value === "name") {

            cards.sort((a, b) => {

                const nameA =
                    a.querySelector("h3")?.textContent || "";

                const nameB =
                    b.querySelector("h3")?.textContent || "";

                return nameA.localeCompare(nameB);

            });

        }

        cards.forEach(card => {
            grid.appendChild(card);
        });

    });
}


/* =========================================================
   09. PRODUCT BUTTONS
   ========================================================= */

function bindProductButtons() {

    document.querySelectorAll(
        ".quick-add, .add-to-cart"
    ).forEach(button => {

        if (button.dataset.bound === "true") return;

        button.dataset.bound = "true";

        button.addEventListener("click", () => {

            const card =
                button.closest(
                    ".product, .shop-card"
                );

            if (!card) return;

            const product =
                getProductFromCard(card);

            addToCart(product);

        });

    });


    document.querySelectorAll(
        ".wishlist-btn, .heart-btn, [data-wishlist]"
    ).forEach(button => {

        if (button.dataset.bound === "true") return;

        button.dataset.bound = "true";

        button.addEventListener("click", () => {

            const card =
                button.closest(
                    ".product, .shop-card"
                );

            if (!card) return;

            const product =
                getProductFromCard(card);

            toggleWishlist(product, button);

        });

    });
}


/* =========================================================
   10. GET PRODUCT DATA
   ========================================================= */

function getProductFromCard(card) {

    const image =
        card.querySelector("img")?.src || "";

    const title =
        card.querySelector("h3")?.textContent.trim()
        || "VÉRONA Product";

    const priceText =
        card.querySelector("b")?.textContent || "$0";

    const price =
        Number(
            priceText.replace(/[^0-9.]/g, "")
        ) || 0;

    const category =
        card.dataset.category ||
        card.querySelector("small")?.textContent.trim()
        || "Fashion";

    return {
        id: createProductId(title),
        title,
        price,
        image,
        category
    };
}


function createProductId(title) {

    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}


/* =========================================================
   11. CART — ADD
   ========================================================= */

function addToCart(product) {

    const existing =
        cart.find(item => item.id === product.id);

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveStorage(
        STORAGE_KEYS.cart,
        cart
    );

    updateCartUI();

    showToast(
        `${product.title} added to your bag`
    );
}


/* =========================================================
   12. CART — REMOVE
   ========================================================= */

function removeFromCart(id) {

    cart =
        cart.filter(item => item.id !== id);

    saveStorage(
        STORAGE_KEYS.cart,
        cart
    );

    updateCartUI();

    renderCartPanel();
}


/* =========================================================
   13. CART — QUANTITY
   ========================================================= */

function changeCartQuantity(id, amount) {

    const item =
        cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        removeFromCart(id);

        return;
    }

    saveStorage(
        STORAGE_KEYS.cart,
        cart
    );

    updateCartUI();

    renderCartPanel();
}


/* =========================================================
   14. CART — TOTAL
   ========================================================= */

function getCartTotal() {

    return cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );
}


function getCartCount() {

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );
}


/* =========================================================
   15. CART UI
   ========================================================= */

function updateCartUI() {

    const count =
        getCartCount();

    document.querySelectorAll(
        ".cart-count, #cartCount"
    ).forEach(badge => {

        badge.textContent = count;

        badge.style.display =
            count > 0 ? "inline-flex" : "none";

    });


    document.querySelectorAll(
        ".cart-total, #cartTotal"
    ).forEach(total => {

        total.textContent =
            formatPrice(getCartTotal());

    });
}


/* =========================================================
   16. CART PANEL
   ========================================================= */

function initCartSystem() {

    const cartButton =
        document.querySelector(
            ".cart-button, [data-cart-open]"
        );

    const closeButton =
        document.querySelector(
            ".cart-close, [data-cart-close]"
        );

    const panel =
        document.querySelector(
            ".cart-panel, #cartPanel"
        );

    if (cartButton && panel) {

        cartButton.addEventListener(
            "click",
            () => {

                panel.classList.add("open");

                renderCartPanel();

            }
        );

    }

    if (closeButton && panel) {

        closeButton.addEventListener(
            "click",
            () => {

                panel.classList.remove("open");

            }
        );

    }

}


/* =========================================================
   17. RENDER CART
   ========================================================= */

function renderCartPanel() {

    const container =
        document.querySelector(
            ".cart-items, #cartItems"
        );

    if (!container) return;

    if (!cart.length) {

        container.innerHTML = `
            <div class="empty-cart">
                <h3>Your bag is empty</h3>
                <p>
                    Discover something beautiful from
                    the VÉRONA collection.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        cart.map(item => `

            <article class="cart-item">

                <img
                    src="${item.image}"
                    alt="${escapeHTML(item.title)}"
                >

                <div>

                    <h4>
                        ${escapeHTML(item.title)}
                    </h4>

                    <small>
                        ${formatPrice(item.price)}
                    </small>

                    <div class="cart-controls">

                        <button
                            data-cart-minus="${item.id}"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            data-cart-plus="${item.id}"
                        >
                            +
                        </button>

                    </div>

                    <button
                        class="remove-cart"
                        data-cart-remove="${item.id}"
                    >
                        Remove
                    </button>

                </div>

            </article>

        `).join("");


    container
        .querySelectorAll("[data-cart-minus]")
        .forEach(button => {

            button.addEventListener("click", () => {

                changeCartQuantity(
                    button.dataset.cartMinus,
                    -1
                );

            });

        });


    container
        .querySelectorAll("[data-cart-plus]")
        .forEach(button => {

            button.addEventListener("click", () => {

                changeCartQuantity(
                    button.dataset.cartPlus,
                    1
                );

            });

        });


    container
        .querySelectorAll("[data-cart-remove]")
        .forEach(button => {

            button.addEventListener("click", () => {

                removeFromCart(
                    button.dataset.cartRemove
                );

            });

        });

}


/* =========================================================
   18. WISHLIST
   ========================================================= */

function initWishlistSystem() {

    document.querySelectorAll(
        ".wishlist-btn, .heart-btn, [data-wishlist]"
    ).forEach(button => {

        button.addEventListener("click", () => {

            const card =
                button.closest(
                    ".product, .shop-card"
                );

            if (!card) return;

            const product =
                getProductFromCard(card);

            toggleWishlist(product, button);

        });

    });

}


function toggleWishlist(product, button) {

    const exists =
        wishlist.some(
            item => item.id === product.id
        );

    if (exists) {

        wishlist =
            wishlist.filter(
                item => item.id !== product.id
            );

        button.classList.remove("active");

        showToast(
            `${product.title} removed from wishlist`
        );

    } else {

        wishlist.push(product);

        button.classList.add("active");

        showToast(
            `${product.title} saved to wishlist`
        );

    }

    saveStorage(
        STORAGE_KEYS.wishlist,
        wishlist
    );

    updateWishlistUI();
}


function updateWishlistUI() {

    document.querySelectorAll(
        ".wishlist-count, #wishlistCount"
    ).forEach(badge => {

        badge.textContent =
            wishlist.length;

        badge.style.display =
            wishlist.length
                ? "inline-flex"
                : "none";

    });


    document.querySelectorAll(
        ".product, .shop-card"
    ).forEach(card => {

        const product =
            getProductFromCard(card);

        const button =
            card.querySelector(
                ".wishlist-btn, .heart-btn, [data-wishlist]"
            );

        if (!button) return;

        if (
            wishlist.some(
                item => item.id === product.id
            )
        ) {

            button.classList.add("active");

        } else {

            button.classList.remove("active");

        }

    });

}


/* =========================================================
   19. NEWSLETTER
   ========================================================= */

function initNewsletter() {

    const forms =
        document.querySelectorAll(
            ".newsletter form"
        );

    forms.forEach(form => {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const input =
                    form.querySelector(
                        'input[type="email"]'
                    );

                if (!input) return;

                const email =
                    input.value.trim();

                if (!validateEmail(email)) {

                    showToast(
                        "Please enter a valid email"
                    );

                    input.focus();

                    return;
                }

                input.value = "";

                showToast(
                    "Welcome to VÉRONA. You're subscribed."
                );

            }
        );

    });
}


/* =========================================================
   20. CONTACT FORM
   ========================================================= */

function initContactForm() {

    const forms =
        document.querySelectorAll(
            ".contact-form form, #contactForm"
        );

    forms.forEach(form => {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const message =
                    form.querySelector(
                        ".form-msg"
                    );

                if (message) {

                    message.textContent =
                        "Thank you. Your enquiry has been received.";

                }

                form.reset();

                showToast(
                    "Message sent successfully"
                );

            }
        );

    });
}


/* =========================================================
   21. FAQ
   ========================================================= */

function initFAQ() {

    const details =
        document.querySelectorAll(
            ".faq details"
        );

    details.forEach(item => {

        item.addEventListener(
            "toggle",
            () => {

                if (!item.open) return;

                details.forEach(other => {

                    if (
                        other !== item &&
                        other.open
                    ) {

                        other.removeAttribute(
                            "open"
                        );

                    }

                });

            }
        );

    });
}


/* =========================================================
   22. SCROLL EFFECTS
   ========================================================= */

function initScrollEffects() {

    const nav =
        document.querySelector(".nav");

    if (!nav) return;

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 30) {

                nav.classList.add("scrolled");

            } else {

                nav.classList.remove("scrolled");

            }

        },
        { passive: true }
    );
}


/* =========================================================
   23. TOAST
   ========================================================= */

function showToast(message) {

    let toast =
        document.querySelector(
            ".cart-toast"
        );

    if (!toast) {

        toast =
            document.createElement("div");

        toast.className =
            "cart-toast";

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        toast.hideTimer
    );

    toast.hideTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2800);

}


/* =========================================================
   24. PRICE FORMAT
   ========================================================= */

function formatPrice(value) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    ).format(value || 0);

}


/* =========================================================
   25. EMAIL VALIDATION
   ========================================================= */

function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


/* =========================================================
   26. HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   27. GLOBAL ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") return;

        document
            .querySelectorAll(
                ".cart-panel.open, .links.open"
            )
            .forEach(element => {

                element.classList.remove("open");

            });

    }
);


/* =========================================================
   28. PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState === "visible"
        ) {

            cart =
                loadStorage(
                    STORAGE_KEYS.cart,
                    []
                );

            wishlist =
                loadStorage(
                    STORAGE_KEYS.wishlist,
                    []
                );

            updateCartUI();

            updateWishlistUI();

        }

    }
);


/* =========================================================
   29. CROSS-TAB STORAGE SYNC
   ========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (event.key === STORAGE_KEYS.cart) {

            cart =
                loadStorage(
                    STORAGE_KEYS.cart,
                    []
                );

            updateCartUI();

        }

        if (
            event.key === STORAGE_KEYS.wishlist
        ) {

            wishlist =
                loadStorage(
                    STORAGE_KEYS.wishlist,
                    []
                );

            updateWishlistUI();

        }

    }
);


/* =========================================================
   30. INITIAL PRODUCT COUNT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateVisibleProductCount();

    }
);
