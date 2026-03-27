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

        this.applyToAllOpenOffcanvas();

        this.observer = new MutationObserver(this.handleMutations);
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    handleMutations(mutations) {
        let shouldApply = false;

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof Element)) {
                    continue;
                }

                if (
                    node.matches('.offcanvas, .offcanvas-cart') ||
                    node.querySelector('.offcanvas, .offcanvas-cart')
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

        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => {
            this.applyToAllOpenOffcanvas();
        }, 80);
    }

    applyToAllOpenOffcanvas() {
        const active = document.documentElement.dataset.usaNullpreisActive === '1';
        const offcanvases = document.querySelectorAll('.offcanvas, .offcanvas-cart');

        offcanvases.forEach((offcanvas) => {
            this.applyToOffcanvas(offcanvas, active);
        });
    }

    applyToOffcanvas(container, active) {
        this.selectors.forEach((selector) => {
            container.querySelectorAll(selector).forEach((el) => {
                el.style.display = active ? 'none' : '';
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

        super.destroy();
    }
}
