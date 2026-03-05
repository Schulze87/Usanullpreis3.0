import template from './template.html.twig';

const { Component } = Shopware;

Component.register('usa-nullpreis-customer-group-select', {
    template,

    props: {
        value: { required: false, default: null },
        disabled: { type: Boolean, required: false, default: false },
        label: { type: String, required: false, default: null },
        helpText: { type: String, required: false, default: null },
    },

    computed: {
        currentValue: {
            get() {
                return this.value || null;
            },
            set(val) {
                this.$emit('input', val || null);
                this.$emit('change', val || null);
            },
        },
    },
});
