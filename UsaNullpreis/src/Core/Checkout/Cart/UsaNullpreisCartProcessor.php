<?php declare(strict_types=1);

namespace UsaNullpreis\Core\Checkout\Cart;

use Psr\Log\LoggerInterface;
use Shopware\Core\Checkout\Cart\Cart;
use Shopware\Core\Checkout\Cart\CartBehavior;
use Shopware\Core\Checkout\Cart\CartProcessorInterface;
use Shopware\Core\Checkout\Cart\LineItem\CartDataCollection;
use Shopware\Core\Checkout\Cart\LineItem\LineItem;
use Shopware\Core\Checkout\Cart\Price\QuantityPriceCalculator;
use Shopware\Core\Checkout\Cart\Price\Struct\QuantityPriceDefinition;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Core\System\SystemConfig\SystemConfigService;

class UsaNullpreisCartProcessor implements CartProcessorInterface
{
    public function __construct(
        private readonly QuantityPriceCalculator $calculator,
        private readonly SystemConfigService $systemConfig,
        private readonly ?LoggerInterface $logger = null
    ) {}

    public function process(
        CartDataCollection $data,
        Cart $original,
        Cart $toCalculate,
        SalesChannelContext $context,
        CartBehavior $behavior
    ): void {
        if (!$this->shouldApplyNullPrice($context)) {
            return;
        }

        foreach ($toCalculate->getLineItems()->filterType(LineItem::PRODUCT_LINE_ITEM_TYPE) as $lineItem) {
            $price = $lineItem->getPrice();
            if ($price === null) {
                continue;
            }

            $definition = new QuantityPriceDefinition(
                0.0,
                $price->getTaxRules(),
                $lineItem->getQuantity()
            );

            try {
                $lineItem->setPrice($this->calculator->calculate($definition, $context));
            } catch (\Throwable $e) {
                $this->logger?->error('Price calculation failed.', ['id' => $lineItem->getId(), 'error' => $e->getMessage()]);
            }
        }
    }

    private function shouldApplyNullPrice(SalesChannelContext $context): bool
    {
        $salesChannelId = $context->getSalesChannelId();

        $customerGroupId = $this->systemConfig->get('UsaNullpreis.config.customerGroupId', $salesChannelId);
        $ruleId = $this->systemConfig->get('UsaNullpreis.config.ruleId', $salesChannelId);

        $group = $context->getCurrentCustomerGroup();
        if ($customerGroupId && $group !== null && $group->getId() === $customerGroupId) {
            return true;
        }

        if ($ruleId && in_array($ruleId, $context->getRuleIds(), true)) {
            return true;
        }

        return false;
    }
}
