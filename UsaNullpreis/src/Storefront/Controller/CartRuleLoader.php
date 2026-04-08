<?php declare(strict_types=1);

namespace Swag\RuleDebug\Storefront\Controller;

use Shopware\Core\Checkout\Cart\CartRuleLoader;
use Shopware\Core\PlatformRequest;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Storefront\Controller\StorefrontController;
use Shopware\Storefront\Framework\Routing\StorefrontRouteScope;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]
class RuleDebugController extends StorefrontController
{
    public function __construct(
        private readonly CartRuleLoader $cartRuleLoader
    ) {}

    #[Route(
        path: '/rule-debug/cart-rules',
        name: 'frontend.rule-debug.cart-rules',
        methods: ['GET'],
        defaults: ['XmlHttpRequest' => 'true']
    )]
    public function cartRules(SalesChannelContext $context): JsonResponse
    {
        $cart = $this->cartRuleLoader->loadByToken($context, $context->getToken());

        return new JsonResponse([
            'ruleIds' => $cart->getRuleIds(),
        ]);
    }
}
