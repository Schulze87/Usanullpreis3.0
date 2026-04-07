import Plugin from 'src/plugin-system/plugin.class';

export default class UsaNullpreisObserverPlugin extends Plugin {
    init() {
        this.selectors = [
            '.line-item-total-price-value',
            '.offcanvas-summary',
            '.line-item-tax-price',
            '.line-item-total-price',
            '.line-item-price',
            '.line-item-unit-price-value',
            '.offcanvas-cart-tax',
        ];

        this.timeout = null;

        this.applyToOffcanvas = this.applyToOffcanvas.bind(this);
        this.applyToAllOpenOffcanvas = this.applyToAllOpenOffcanvas.bind(this);
        this.handleMutations = this.handleMutations.bind(this);

        console.debug('[UsaNullpreisObserver] init');

        this.applyToAllOpenOffcanvas();

        this.observer = new MutationObserver(this.handleMutations);
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        console.debug('[UsaNullpreisObserver] observer attached to document.body');
    }

    handleMutations(mutations) {
        console.debug('[UsaNullpreisObserver] mutations received:', mutations.length);

        let shouldApply = false;

        for (const mutation of mutations) {
            const target = mutation.target instanceof Element ? mutation.target : null;

            if (target && target.closest('.offcanvas, .offcanvas-cart')) {
                console.debug('[UsaNullpreisObserver] mutation inside offcanvas detected', target);
                shouldApply = true;
                break;
            }

            for (const node of mutation.addedNodes) {
                if (!(node instanceof Element)) {
                    continue;
                }

                if (
                    node.closest('.offcanvas, .offcanvas-cart') ||
                    node.matches('.offcanvas, .offcanvas-cart') ||
                    node.querySelector('.offcanvas, .offcanvas-cart')
                ) {
                    console.debug('[UsaNullpreisObserver] offcanvas-related node added', node);
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

        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => {
            console.debug('[UsaNullpreisObserver] applyToAllOpenOffcanvas after debounce');
            this.applyToAllOpenOffcanvas();
        }, 80);
    }

    applyToAllOpenOffcanvas() {
        const active = document.documentElement.dataset.usaNullpreisActive === '1';
        const offcanvases = document.querySelectorAll('.offcanvas, .offcanvas-cart');

        console.debug('[UsaNullpreisObserver] applyToAllOpenOffcanvas', {
            active,
            offcanvasCount: offcanvases.length,
        });

        offcanvases.forEach((offcanvas, index) => {
            console.debug('[UsaNullpreisObserver] applying to offcanvas', index, offcanvas);
            this.applyToOffcanvas(offcanvas, active);
        });
    }

    applyToOffcanvas(container, active) {
        console.debug('[UsaNullpreisObserver] applyToOffcanvas', {
            active,
            container,
        });

        this.selectors.forEach((selector) => {
            const elements = container.querySelectorAll(selector);

            if (elements.length) {
                console.debug('[UsaNullpreisObserver] selector hit', {
                    selector,
                    count: elements.length,
                });
            }

            elements.forEach((el) => {
                el.style.display = active ? 'none' : '';
            });
        });
    }

    destroy() {
        console.debug('[UsaNullpreisObserver] destroy');

        if (this.observer) {
            this.observer.disconnect();
            console.debug('[UsaNullpreisObserver] observer disconnected');
        }

        if (this.timeout) {
            window.clearTimeout(this.timeout);
        }

        super.destroy();
    }
}
