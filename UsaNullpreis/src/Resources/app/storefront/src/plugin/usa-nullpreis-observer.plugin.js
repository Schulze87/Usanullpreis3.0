import Plugin from 'src/plugin-system/plugin.class';

export default class UsaNullpreisObserverPlugin extends Plugin {
    init() {
        this.selectors = [
            '.offcanvas .line-item-total-price-value',
            '.offcanvas .offcanvas-summary',
            '.offcanvas .line-item-tax-price',
            '.offcanvas .line-item-total-price',
            '.offcanvas .line-item-price',
            '.offcanvas .line-item-unit-price-value',
            '.offcanvas .offcanvas-cart-tax',
        ];

        this.timeout = null;
        this.followUpTimeouts = [];

        this.applyToAllOpenOffcanvas = this.applyToAllOpenOffcanvas.bind(this);
        this.handleMutations = this.handleMutations.bind(this);
        this.scheduleApply = this.scheduleApply.bind(this);

        console.log('[UsaNullpreisObserver] init');

        this.scheduleApply();

        this.observer = new MutationObserver(this.handleMutations);
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        console.log('[UsaNullpreisObserver] observer attached to document.body');
    }

    handleMutations(mutations) {
        let shouldApply = false;

        for (const mutation of mutations) {
            const target = mutation.target instanceof Element ? mutation.target : null;

            if (target && target.closest('.offcanvas, .offcanvas-cart, .cart-offcanvas')) {
                shouldApply = true;
                break;
            }

            for (const node of mutation.addedNodes) {
                if (!(node instanceof Element)) {
                    continue;
                }

                if (
                    node.matches('.offcanvas, .offcanvas-cart, .cart-offcanvas') ||
                    node.closest('.offcanvas, .offcanvas-cart, .cart-offcanvas') ||
                    node.querySelector('.offcanvas, .offcanvas-cart, .cart-offcanvas')
                ) {
                    shouldApply = true;
                    break;
                }
            }

            if (shouldApply) {
                break;
            }
        }

        if (!shouldApply) {
            return;
        }

        console.log('[UsaNullpreisObserver] mutation erkannt');
        this.scheduleApply();
    }

    scheduleApply() {
        window.clearTimeout(this.timeout);
        this.followUpTimeouts.forEach((id) => window.clearTimeout(id));
        this.followUpTimeouts = [];

        this.timeout = window.setTimeout(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    console.log('[UsaNullpreisObserver] apply pass 1');
                    this.applyToAllOpenOffcanvas();

                    this.followUpTimeouts.push(window.setTimeout(() => {
                        console.log('[UsaNullpreisObserver] apply pass 2');
                        this.applyToAllOpenOffcanvas();
                    }, 120));

                    this.followUpTimeouts.push(window.setTimeout(() => {
                        console.log('[UsaNullpreisObserver] apply pass 3');
                        this.applyToAllOpenOffcanvas();
                    }, 250));

                    this.followUpTimeouts.push(window.setTimeout(() => {
                        console.log('[UsaNullpreisObserver] apply pass 4');
                        this.applyToAllOpenOffcanvas();
                    }, 500));
                });
            });
        }, 80);
    }

    applyToAllOpenOffcanvas() {
        const active = document.documentElement.dataset.usaNullpreisActive === '1';

        console.log('[UsaNullpreisObserver] applyToAllOpenOffcanvas', { active });

        if (!active) {
            this.selectors.forEach((selector) => {
                document.querySelectorAll(selector).forEach((el) => {
                    el.style.display = '';
                });
            });
            return;
        }

        this.selectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);

            if (elements.length) {
                console.log('[UsaNullpreisObserver] selector hit', {
                    selector,
                    count: elements.length,
                });
            }

            elements.forEach((el) => {
                el.style.display = 'none';
            });
        });
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }

        if (this.timeout) {
            window.clearTimeout(this.timeout);
        }

        this.followUpTimeouts.forEach((id) => window.clearTimeout(id));
        this.followUpTimeouts = [];

        super.destroy();
    }
}
