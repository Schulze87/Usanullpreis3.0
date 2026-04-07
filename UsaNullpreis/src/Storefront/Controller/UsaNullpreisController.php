<?php declare(strict_types=1);

namespace UsaNullpreis\Storefront\Controller;

use Shopware\Core\PlatformRequest;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Storefront\Controller\StorefrontController;
use Shopware\Storefront\Framework\Routing\StorefrontRouteScope;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]
class UsaNullpreisController extends StorefrontController
{
    #[Route(
        path: '/usa-nullpreis/status',
        name: 'frontend.usa-nullpreis.status',
        methods: ['GET'],
        defaults: ['XmlHttpRequest' => true]
    )]
    public function status(SalesChannelContext $salesChannelContext): JsonResponse
    {
        $active = false;

        $customer = $salesChannelContext->getCustomer();
        $currentCustomerGroupId = $customer?->getGroupId();
        $ruleIds = $salesChannelContext->getRuleIds();

        $usaNullpreisCustomerGroupId = 'DEINE_CUSTOMER_GROUP_ID';
        $usaNullpreisRuleId = 'DEINE_RULE_ID';

        if (
            $currentCustomerGroupId === $usaNullpreisCustomerGroupId
            || \in_array($usaNullpreisRuleId, $ruleIds, true)
        ) {
            $active = true;
        }

        return new JsonResponse([
            'active' => $active,
        ]);
    }
}
