import Plugin from 'src/plugin-system/plugin.class';

export default class UsaNullpreisObserverPlugin extends Plugin {
    init() {
        this.selectors = [
            '.order-item-detail-summary',
            '.line-item-total-price-value',
            '.offcanvas-summary',
            '.cart-header-tax-price',
            '.cart-header-total-price',
            '.line-item-tax-price',
            '.line-item-total-price',
            '.line-item-price',
            '.line-item-unit-price-value',
            '.offcanvas-cart-tax',
            '.checkout-aside-summary',
        ];

        this.applyState = this.applyState.bind(this);
        this.handleMutations = this.handleMutations.bind(this);

        this.applyState();

        this.observer = new MutationObserver(this.handleMutations);

        this.observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-usa-nullpreis-active'],
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    handleMutations(mutations) {
        let shouldApply = false;

        for (const mutation of mutations) {
            if (
                mutation.type === 'attributes' &&
                mutation.target === document.documentElement &&
                mutation.attributeName === 'data-usa-nullpreis-active'
            ) {
                shouldApply = true;
                break;
            }

            if (
                mutation.type === 'childList' &&
                (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
            ) {
                shouldApply = true;
            }
        }

        if (shouldApply) {
            this.applyState();
        }
    }

    applyState() {
        const active = document.documentElement.dataset.usaNullpreisActive === '1';

        this.selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((el) => {
                el.style.display = active ? 'none' : '';
            });
        });
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }

        super.destroy();
    }
}
