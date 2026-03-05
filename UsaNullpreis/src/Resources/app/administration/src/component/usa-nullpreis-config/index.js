import template from './template.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('usa-nullpreis-config', {
    template,

    mixins: [
        Mixin.getByName('notification'),
    ],

    inject: [
        'repositoryFactory',
        'systemConfigApiService',
    ],

    data() {
        return {
            customerGroups: [],
            rules: [],
            selectedCustomerGroupId: null,
            selectedRuleId: null,
            isLoading: true,
        };
    },

    computed: {
        customerGroupRepository() {
            return this.repositoryFactory.create('customer_group');
        },
        ruleRepository() {
            return this.repositoryFactory.create('rule');
        },
    },

    created() {
        this.loadData();
    },

    methods: {
        async loadData() {
            this.isLoading = true;

            const criteria = new Criteria();
            criteria.setLimit(500);

            const [customerGroups, rules, config] = await Promise.all([
                this.customerGroupRepository.search(criteria, Shopware.Context.api),
                this.ruleRepository.search(criteria, Shopware.Context.api),
                this.systemConfigApiService.getValues('UsaNullpreis.config'),
            ]);

            this.customerGroups = customerGroups;
            this.rules = rules;
            this.selectedCustomerGroupId = config['UsaNullpreis.config.customerGroupId'] ?? null;
            this.selectedRuleId = config['UsaNullpreis.config.ruleId'] ?? null;

            this.isLoading = false;
        },

        async onSave() {
            await this.systemConfigApiService.saveValues({
                'UsaNullpreis.config.customerGroupId': this.selectedCustomerGroupId,
                'UsaNullpreis.config.ruleId': this.selectedRuleId,
            });

            this.createNotificationSuccess({
                message: this.$tc('usa-nullpreis.config.saveSuccess'),
            });
        },
    },
});
