<?php declare(strict_types=1);

namespace UsaNullpreis\Twig;

use Twig\Extension\AbstractExtension;
use Twig\Extension\GlobalsInterface;
use Shopware\Core\System\SystemConfig\SystemConfigService;

class UsaNullpreisExtension extends AbstractExtension implements GlobalsInterface
{
    public function __construct(
        private readonly SystemConfigService $systemConfig
    ) {}

    public function getGlobals(): array
    {
        return [
            'usaNullpreisCustomerGroupId' => $this->systemConfig->get('UsaNullpreis.config.customerGroupId') ?? '',
            'usaNullpreisRuleId'          => $this->systemConfig->get('UsaNullpreis.config.ruleId') ?? '',
        ];
    }
}
